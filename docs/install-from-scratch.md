# Install TurinHosting from Scratch (Clean & Correct)

This guide installs the **TurinHosting (Jexactyl-based) panel** directly from this repository on a fresh Linux server.

> ✅ This guide is written to **work on first install**  
> ❌ No Docker runtime  
> ❌ No Node.js web server  
> ✅ PHP-FPM + NGINX (Laravel stack)

---

## 1. Stack Overview (IMPORTANT)

TurinHosting is a **Laravel (PHP) application**, similar to **Jexactyl**.

### Required stack
- **OS:** Ubuntu 20.04+ / Debian 11+ / Rocky 9+
- **Web server:** NGINX
- **PHP:** 8.1–8.2 (PHP-FPM required)
- **Database:** MySQL 8.0+ or MariaDB 10.6+
- **Composer:** required
- **Node.js:** *only for building frontend assets*

⚠️ TurinHosting **does NOT**:
- run as a Node.js HTTP server
- listen on port 3000
- use Docker for serving HTTP traffic

---

## 2. Install system packages (Ubuntu example)

```bash
sudo apt update
sudo apt install -y   nginx   mysql-server   php8.1 php8.1-fpm php8.1-cli php8.1-mbstring php8.1-xml   php8.1-curl php8.1-zip php8.1-mysql php8.1-gd   unzip git curl
```

Enable PHP-FPM:
```bash
sudo systemctl enable --now php8.1-fpm
```

Verify socket exists:
```bash
ls /run/php/
```

---

## 3. Create the database

```sql
CREATE DATABASE turinhosting;
CREATE USER 'turinhosting'@'127.0.0.1' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON turinhosting.* TO 'turinhosting'@'127.0.0.1';
FLUSH PRIVILEGES;
```

---

## 4. Download the panel

```bash
sudo mkdir -p /var/www
sudo git clone https://github.com/polsommer/turinhosting.git /var/www/turinhosting
cd /var/www/turinhosting
```

---

## 5. Install PHP dependencies

```bash
curl -sS https://getcomposer.org/installer | php --   --install-dir=/usr/local/bin   --filename=composer

composer install --no-dev --optimize-autoloader
```

---

## 6. Configure environment (.env)

```bash
cp .env.example .env
nano .env
```

```dotenv
APP_NAME=TurinHosting
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=http://your-domain-or-ip

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=turinhosting
DB_USERNAME=turinhosting
DB_PASSWORD=strong-password

SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

---

## 7. Generate app key & clear caches

```bash
php artisan key:generate --force
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
```

---

## 8. Set permissions

```bash
sudo chown -R www-data:www-data /var/www/turinhosting
sudo chmod -R 755 /var/www/turinhosting
sudo chmod -R 775 /var/www/turinhosting/storage /var/www/turinhosting/bootstrap/cache
```

---

## 9. Run migrations & seed data

```bash
php artisan migrate --seed --force
```

---

## 10. Create the first admin user

```bash
php artisan p:user:make --admin=1
```

---

## 11. Configure NGINX

Create `/etc/nginx/sites-available/turinhosting.conf`:

```nginx
server {
    listen 80;
    server_name your-domain-or-ip;

    root /var/www/turinhosting/public;
    index index.php index.html index.htm;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log /var/log/nginx/turinhosting.app-error.log error;

    client_max_body_size 100m;
    client_body_timeout 120s;
    sendfile off;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;

        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_param HTTP_PROXY "";
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Enable and reload:
```bash
sudo ln -sf /etc/nginx/sites-available/turinhosting.conf /etc/nginx/sites-enabled/turinhosting.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 12. Cron

```bash
* * * * * php /var/www/turinhosting/artisan schedule:run >> /dev/null 2>&1
```

---

## 13. Access the panel

Open:
```
http://your-domain-or-ip
```

Admin panel:
```
/admin
```
