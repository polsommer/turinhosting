# Ubuntu 22.04 Installation Guide

This guide walks you through installing the TurinHosting (Jexactyl) panel on Ubuntu 22.04 with Nginx, PHP-FPM 8.1/8.2, MySQL/MariaDB, Redis, Supervisor, and SSL via Certbot.

> Assumptions:
> - You are installing to `/var/www/turinhosting`.
> - You have a domain pointing to the server IP.

## 1. OS preparation

Update packages and install common tools:

```bash
sudo apt update
sudo apt -y upgrade
sudo apt install -y curl unzip git software-properties-common
```

Set the server timezone (optional):

```bash
sudo timedatectl set-timezone UTC
```

## 2. Firewall (UFW)

Enable UFW and allow SSH, HTTP, and HTTPS:

```bash
sudo ufw allow OpenSSH
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status verbose
```

## 3. Nginx + PHP-FPM 8.1/8.2

Ubuntu 22.04 ships with PHP 8.1 by default. If you want PHP 8.2, add the `ondrej` PPA first.

### Option A: PHP 8.1 (default)

```bash
sudo apt install -y nginx
sudo apt install -y \
  php8.1 php8.1-cli php8.1-fpm php8.1-mysql php8.1-mbstring php8.1-zip php8.1-xml php8.1-curl
```

### Option B: PHP 8.2 (PPA)

```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y nginx
sudo apt install -y \
  php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-zip php8.2-xml php8.2-curl
```

Enable Nginx at boot:

```bash
sudo systemctl enable --now nginx
```

## 4. Database (MySQL or MariaDB)

Choose **one** of the following options.

### Option A: MySQL 8.0

```bash
sudo apt install -y mysql-server
sudo systemctl enable --now mysql
sudo mysql_secure_installation
```

### Option B: MariaDB 10.6+

```bash
sudo apt install -y mariadb-server
sudo systemctl enable --now mariadb
sudo mariadb-secure-installation
```

Create the panel database and user (for either MySQL or MariaDB):

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE turinhosting;
CREATE USER 'turinhosting'@'127.0.0.1' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON turinhosting.* TO 'turinhosting'@'127.0.0.1';
FLUSH PRIVILEGES;
```

## 5. Redis

Redis is recommended for cache and queues:

```bash
sudo apt install -y redis-server
sudo systemctl enable --now redis-server
```

## 6. Download the panel

```bash
sudo mkdir -p /var/www
sudo git clone https://github.com/polsommer/turinhosting.git /var/www/turinhosting
cd /var/www/turinhosting
```

Install Composer and dependencies:

```bash
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
composer install --no-dev --optimize-autoloader
```

## 7. Configure environment

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

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
```

## 8. File permissions

```bash
sudo chown -R www-data:www-data /var/www/turinhosting
sudo chmod -R 755 /var/www/turinhosting
sudo chmod -R 775 /var/www/turinhosting/storage /var/www/turinhosting/bootstrap/cache
```

## 9. Migrations and admin user

```bash
php artisan migrate --seed --force
php artisan p:user:make --admin=1
```

## 10. Nginx site configuration

Create `/etc/nginx/sites-available/turinhosting.conf`:

```nginx
server {
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

    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock; # or /run/php/php8.2-fpm.sock
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

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/turinhosting.conf /etc/nginx/sites-enabled/turinhosting.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 11. Supervisor for queues

Install Supervisor and create a worker:

```bash
sudo apt install -y supervisor
```

Create `/etc/supervisor/conf.d/turinhosting-worker.conf`:

```ini
[program:turinhosting-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/turinhosting/artisan queue:work --sleep=3 --tries=3 --timeout=90
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/turinhosting/storage/logs/worker.log
stopwaitsecs=3600
```

Reload Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status
```

## 12. SSL with Certbot

Install Certbot and obtain a certificate (Nginx plugin):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d panel.example.com
```

Test automatic renewal:

```bash
sudo certbot renew --dry-run
```

## 13. Post-install verification

Confirm service status and health checks:

```bash
sudo systemctl status nginx
sudo systemctl status php8.1-fpm   # or php8.2-fpm
sudo systemctl status mysql        # or mariadb
sudo systemctl status redis-server
sudo systemctl status supervisor
```

```bash
nginx -t
php -v
mysqladmin ping -u root -p
redis-cli ping
sudo supervisorctl status
```

Check HTTP response and panel homepage (replace domain):

```bash
curl -I https://panel.example.com
```

## 14. Common troubleshooting

### 502 Bad Gateway from Nginx
- Verify PHP-FPM is running and the socket matches the Nginx config.
  - `sudo systemctl status php8.1-fpm` (or `php8.2-fpm`)
  - Confirm `/run/php/php8.1-fpm.sock` exists.

### Permission errors / storage not writable
- Re-apply permissions:
  ```bash
  sudo chown -R www-data:www-data /var/www/turinhosting
  sudo chmod -R 775 /var/www/turinhosting/storage /var/www/turinhosting/bootstrap/cache
  ```

### Database connection errors
- Re-check `.env` settings and database user grants.
- Confirm the database service is running:
  ```bash
  sudo systemctl status mysql
  ```

### Queues not processing
- Ensure Supervisor is running and the worker is active:
  ```bash
  sudo supervisorctl status
  ```
- Check worker logs in `storage/logs/worker.log`.

### SSL issues
- Confirm DNS records point to the server.
- Re-run `sudo certbot --nginx -d panel.example.com`.
- Check Nginx logs at `/var/log/nginx/turinhosting.app-error.log`.
