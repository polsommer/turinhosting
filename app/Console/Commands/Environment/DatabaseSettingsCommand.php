<?php

namespace Everest\Console\Commands\Environment;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\DatabaseManager;
use Everest\Traits\Commands\EnvironmentWriterTrait;

class DatabaseSettingsCommand extends Command
{
    use EnvironmentWriterTrait;

    protected $description = 'Configure database settings for the Panel.';

    protected $signature = 'p:environment:database
                            {--host= : The connection address for the MySQL server.}
                            {--port= : The connection port for the MySQL server.}
                            {--database= : The database to use.}
                            {--username= : Username to use when connecting.}
                            {--password= : Password to use for this database.}
                            {--create : Automatically create the database and user if they do not exist.}
                            {--admin-username= : Admin username for MySQL user/database creation.}
                            {--admin-password= : Admin password for MySQL user/database creation.}';

    protected array $variables = [];

    /**
     * DatabaseSettingsCommand constructor.
     */
    public function __construct(private DatabaseManager $database, private Kernel $console)
    {
        parent::__construct();
    }

    /**
     * Handle command execution.
     *
     * @throws \Everest\Exceptions\PterodactylException
     */
    public function handle(): int
    {
        $this->output->note('It is highly recommended to not use "localhost" as your database host as we have seen frequent socket connection issues. If you want to use a local connection you should be using "127.0.0.1".');
        $this->variables['DB_HOST'] = $this->option('host') ?? $this->ask(
            'Database Host',
            config('database.connections.mysql.host', '127.0.0.1')
        );

        $this->variables['DB_PORT'] = $this->option('port') ?? $this->ask(
            'Database Port',
            config('database.connections.mysql.port', 3306)
        );

        $this->variables['DB_DATABASE'] = $this->option('database') ?? $this->ask(
            'Database Name',
            config('database.connections.mysql.database', 'panel')
        );

        $this->output->note('Using the "root" account for MySQL connections is not only highly frowned upon, it is also not allowed by this application. You\'ll need to have created a MySQL user for this software.');
        $this->variables['DB_USERNAME'] = $this->option('username') ?? $this->ask(
            'Database Username',
            config('database.connections.mysql.username', 'Everest')
        );

        $askForMySQLPassword = true;
        if (!empty(config('database.connections.mysql.password')) && $this->input->isInteractive()) {
            $this->variables['DB_PASSWORD'] = config('database.connections.mysql.password');
            $askForMySQLPassword = $this->confirm('It appears you already have a MySQL connection password defined, would you like to change it?');
        }

        if ($askForMySQLPassword) {
            $this->variables['DB_PASSWORD'] = $this->option('password') ?? $this->secret('Database Password');
        }

        if ($this->option('create')) {
            if (!$this->attemptAutoCreate()) {
                return 1;
            }
        }

        try {
            $this->testMySQLConnection();
        } catch (\PDOException $exception) {
            $this->output->error(sprintf('Unable to connect to the MySQL server using the provided credentials. The error returned was "%s".', $exception->getMessage()));

            if ($this->input->isInteractive() && $this->confirm('Would you like the Panel to create the database and user automatically?')) {
                if (!$this->attemptAutoCreate()) {
                    return 1;
                }

                try {
                    $this->testMySQLConnection();
                } catch (\PDOException $exception) {
                    $this->output->error(sprintf('Unable to connect to the MySQL server using the provided credentials. The error returned was "%s".', $exception->getMessage()));
                    $this->output->error('Your connection credentials have NOT been saved. You will need to provide valid connection information before proceeding.');

                    return 1;
                }
            } else {
                $this->output->error('Your connection credentials have NOT been saved. You will need to provide valid connection information before proceeding.');

                if ($this->confirm('Go back and try again?')) {
                    $this->database->disconnect('_pterodactyl_command_test');

                    return $this->handle();
                }

                return 1;
            }
        }

        $this->writeToEnvironment($this->variables);

        $this->info($this->console->output());

        return 0;
    }

    /**
     * Test that we can connect to the provided MySQL instance and perform a selection.
     */
    private function testMySQLConnection()
    {
        config()->set('database.connections._pterodactyl_command_test', [
            'driver' => 'mysql',
            'host' => $this->variables['DB_HOST'],
            'port' => $this->variables['DB_PORT'],
            'database' => $this->variables['DB_DATABASE'],
            'username' => $this->variables['DB_USERNAME'],
            'password' => $this->variables['DB_PASSWORD'],
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'strict' => true,
        ]);

        $this->database->connection('_pterodactyl_command_test')->getPdo();
    }

    /**
     * Attempt to create the database and user with admin credentials.
     */
    private function attemptAutoCreate(): bool
    {
        try {
            $adminCredentials = $this->getAdminCredentials();
            $this->createDatabaseAndUser($adminCredentials['username'], $adminCredentials['password']);
        } catch (\RuntimeException $exception) {
            $this->output->error($exception->getMessage());

            return false;
        } catch (\PDOException $exception) {
            $this->output->error(sprintf('Unable to create the database and user. The error returned was "%s".', $exception->getMessage()));

            return false;
        }

        $this->output->info('Database and user created successfully.');

        return true;
    }

    /**
     * @return array{username: string, password: string}
     */
    private function getAdminCredentials(): array
    {
        $username = $this->option('admin-username') ?? $this->ask('Admin Username', 'root');
        $password = $this->option('admin-password');

        if (is_null($password)) {
            if (!$this->input->isInteractive()) {
                throw new \RuntimeException('The admin password is required when running non-interactively.');
            }

            $password = $this->secret('Admin Password (leave blank for none)');
        }

        if (is_null($password)) {
            $password = '';
        }

        return [
            'username' => $username,
            'password' => $password,
        ];
    }

    private function createDatabaseAndUser(string $adminUsername, string $adminPassword): void
    {
        $connection = new \PDO(
            sprintf('mysql:host=%s;port=%s', $this->variables['DB_HOST'], $this->variables['DB_PORT']),
            $adminUsername,
            $adminPassword,
            [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            ]
        );

        $database = $this->escapeIdentifier($this->variables['DB_DATABASE']);
        $username = $connection->quote($this->variables['DB_USERNAME']);
        $password = $connection->quote($this->variables['DB_PASSWORD'] ?? '');
        $host = $connection->quote($this->resolveUserHost());

        $connection->exec(sprintf('CREATE DATABASE IF NOT EXISTS `%s`', $database));
        $connection->exec(sprintf('CREATE USER IF NOT EXISTS %s@%s IDENTIFIED BY %s', $username, $host, $password));
        $connection->exec(sprintf('GRANT ALL PRIVILEGES ON `%s`.* TO %s@%s', $database, $username, $host));
        $connection->exec('FLUSH PRIVILEGES');
    }

    private function resolveUserHost(): string
    {
        $host = $this->variables['DB_HOST'];

        if (in_array($host, ['localhost', '127.0.0.1'], true)) {
            return $host;
        }

        return '%';
    }

    private function escapeIdentifier(string $identifier): string
    {
        return str_replace('`', '``', $identifier);
    }
}
