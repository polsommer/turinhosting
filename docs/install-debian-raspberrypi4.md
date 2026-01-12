# Install TurinHosting on Debian (Raspberry Pi 4)

This guide installs the **TurinHosting (Jexactyl-based) panel** on a Raspberry Pi 4 running **Debian 11/12 (64-bit)** or **Raspberry Pi OS 64-bit**.

> ✅ Uses PHP-FPM + NGINX (Laravel stack)
> ❌ No Docker runtime
> ❌ No Node.js web server

---

## 1. Requirements & notes

- **Hardware:** Raspberry Pi 4 (4GB+ recommended)
- **OS:** Debian 11/12 (arm64) or Raspberry Pi OS 64-bit
- **Web server:** NGINX
- **PHP:** 8.1–8.2 (PHP-FPM required)
- **Database:** MariaDB 10.6+ (recommended for Pi)
- **Composer:** required
- **Node.js:** only needed if you build frontend assets locally

> Tip: Raspberry Pi is resource-limited. Use `swap` if you plan to build assets on-device.

---

## 2. Update the system

```bash
sudo apt update
sudo apt upgrade -y
```

---

## 3. Install system packages (Debian 11/12)

```bash
sudo apt install -y \
  nginx \
  mariadb-server \
  php8.2 php8.2-fpm php8.2-cli php8.2-mbstring php8.2-xml \
  php8.2-curl php8.2-zip php8.2-mysql php8.2-gd \
  unzip git curl
```

> If you are on Debian 11 and only have PHP 8.1, replace `8.2` with `8.1` in the command above.

Enable PHP-FPM:
```bash
sudo systemctl enable --now php8.2-fpm
```

Verify socket exists:
```bash
ls /run/php/
```

---

## 4. Create the database

```bash
sudo mysql
```

```sql
CREATE DATABASE turinhosting;
CREATE USER 'turinhosting'@'127.0.0.1' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON turinhosting.* TO 'turinhosting'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

---

## 5. Download the panel

```bash
sudo mkdir -p /var/www
sudo git clone https://github.com/polsommer/turinhosting.git /var/www/turinhosting
cd /var/www/turinhosting
```

---

## 6. Install PHP dependencies

```bash
curl -sS https://getcomposer.org/installer | php -- \
  --install-dir=/usr/local/bin \
  --filename=composer

composer install --no-dev --optimize-autoloader
```

---

## 7. Configure environment (.env)

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

## 8. Generate app key & clear caches

```bash
php artisan key:generate --force
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
```

---

## 9. Set permissions

```bash
sudo chown -R www-data:www-data /var/www/turinhosting
sudo chmod -R 755 /var/www/turinhosting
sudo chmod -R 775 /var/www/turinhosting/storage /var/www/turinhosting/bootstrap/cache
```

---

## 10. Run migrations & seed data

```bash
php artisan migrate --seed --force
```

---

## 11. Create the first admin user

```bash
php artisan p:user:make --admin=1
```

---

## 12. Configure NGINX

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
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
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

## 13. Optional: build frontend assets on-device

If you want to build assets on the Raspberry Pi (not required for runtime), install Node.js and run:

```bash
sudo apt install -y nodejs npm
npm install
npm run build
```

---

## 14. Finish

Open your domain or IP in a browser to access the panel.

If you run into performance issues, consider:
- Using a lighter database workload
- Increasing swap space temporarily
- Moving the database to another host
