# Install from Scratch

Use this guide to install the TurinHosting (Jexactyl) panel directly from this repository. The steps below target a
Linux server and assume you are installing to `/var/www/turinhosting`.

## 1. System Requirements

- **OS:** modern Linux distribution (Ubuntu 20.04+/Debian 11+/Rocky 9+).
- **PHP:** 8.0.2–8.2
- **Database:** MySQL 8.0+ or MariaDB 10.6+
- **Web server:** Nginx or Apache
- **Recommended:** Redis for cache/queues

### Required PHP extensions
From `composer.json`, ensure the following PHP extensions are installed:

- `mbstring`
- `pdo`
- `pdo_mysql`
- `posix`
- `zip`
- `json`

## 2. Install system packages (example: Ubuntu)

```bash
sudo apt update
sudo apt install -y \
  nginx \
  mysql-server \
  php8.1 php8.1-cli php8.1-fpm php8.1-mysql php8.1-mbstring php8.1-zip php8.1-xml php8.1-curl \
  unzip git curl
```

> Adjust PHP versions to match your OS packages (PHP 8.0–8.2).

## 3. Create the database

```sql
CREATE DATABASE turinhosting;
CREATE USER 'turinhosting'@'127.0.0.1' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON turinhosting.* TO 'turinhosting'@'127.0.0.1';
FLUSH PRIVILEGES;
```

## 4. Download the panel

```bash
sudo mkdir -p /var/www
sudo git clone https://github.com/polsommer/turinhosting.git /var/www/turinhosting
cd /var/www/turinhosting
```

## 5. Install PHP dependencies

```bash
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
composer install --no-dev --optimize-autoloader
```

## 6. Configure environment

```bash
cp .env.example .env
php artisan key:generate --force
```

Edit `.env` and set at minimum:

```dotenv
APP_URL=https://panel.example.com
APP_TIMEZONE=UTC
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=turinhosting
DB_USERNAME=turinhosting
DB_PASSWORD=strong-password
```

## 7. Set file permissions

```bash
sudo chown -R www-data:www-data /var/www/turinhosting
sudo chmod -R 755 /var/www/turinhosting
sudo chmod -R 775 /var/www/turinhosting/storage /var/www/turinhosting/bootstrap/cache
```

## 8. Run migrations and seed default data

```bash
php artisan migrate --seed --force
```

This will seed the default nests/eggs required by the panel.

## 9. Create your first admin user

```bash
php artisan p:user:make --admin=1
```

Follow the prompts to create the initial administrator account.

## 10. Configure the web server

Point your web server document root to `/var/www/turinhosting/public` and ensure PHP-FPM is enabled.

### Nginx example

```nginx
server {
    # Replace the example domain with your domain name or IP address.
    listen 80;
    server_name panel.example.com;

    root /var/www/turinhosting/public;
    index index.html index.htm index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/turinhosting.app-error.log error;

    # Allow larger uploads and longer script runtimes.
    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param PHP_VALUE "upload_max_filesize = 100M \n post_max_size=100M";
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTP_PROXY "";
        fastcgi_intercept_errors off;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Reload Nginx after updating the configuration:

```bash
sudo systemctl reload nginx
```

## 11. Configure cron + queues

Laravel’s scheduler should run every minute:

```bash
* * * * * php /var/www/turinhosting/artisan schedule:run >> /dev/null 2>&1
```

If you use queues, start a worker (example systemd service is recommended):

```bash
php /var/www/turinhosting/artisan queue:work --sleep=3 --tries=3
```

## 12. Optional: build frontend assets

Release builds include compiled assets. If you modify frontend code, build assets locally:

```bash
yarn install
yarn run build:production
```

## 13. Next steps

- Log in to the admin panel at `https://panel.example.com/admin`.
- Configure mail, billing, and branding in the admin settings.
- When ready to attach nodes, follow your node/Wings setup process.
