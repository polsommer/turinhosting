# Jexpanel

Modern, developer-friendly game server management with integrated billing. This monorepo ships:

- **Laravel panel** (root): the core app, API, and admin experience.
- **Next.js starter** (`next-app/`): onboarding, Auth.js, Prisma, and Stripe integrations.

> Formerly known as **Jexactyl**.

## Highlights

- ✅ **Laravel 10** panel with queue, cache, and scheduler support.
- ✅ **Next.js 14** starter for auth, billing, and onboarding flows.
- ✅ **Stripe** billing integrations (webhooks + CLI support).
- ✅ **Docker Compose** for local infrastructure (DB/Redis).

## Quick start (local)

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
pnpm install
pnpm dev
```

## Prerequisites

- PHP 8.1/8.2, Composer, and required PHP extensions (see `composer.json`).
- Node.js 16.13+ (root app) and Node.js 18+ recommended for `next-app/`.
- pnpm 9.x.
- Docker + Docker Compose (for local Postgres/Redis or the panel stack).
- Stripe CLI (for local webhook testing).

## Environment setup

### Laravel panel

Copy the example file and set secrets as needed:

```bash
cp .env.example .env
```

Key environment variables:

| Variable | Description |
| --- | --- |
| `APP_URL` | Public URL for the panel. |
| `APP_KEY` | Laravel application key (`php artisan key:generate`). |
| `DB_*` | Database connection details for the panel. |
| `REDIS_*` | Redis connection settings for cache/session/queue. |

### Next.js starter

```bash
cd next-app
cp .env.example .env
```

Key environment variables:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string for Prisma. |
| `NEXTAUTH_SECRET` | Auth.js secret. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | OAuth app credentials. |
| `STRIPE_SECRET_KEY` | Stripe secret key. |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key. |
| `REDIS_URL` | Optional Redis URL for caching. |

## Docker Compose usage

### Panel services

Use the example file to run MariaDB + Redis + the panel container:

```bash
cp docker-compose.example.yml docker-compose.yml
docker compose up -d
```

### Next.js dependencies

From `next-app/`, start Postgres + Redis:

```bash
cd next-app
docker compose up -d
```

## Laravel panel development

```bash
composer install
php artisan key:generate
php artisan migrate --seed
pnpm install
pnpm dev
```

## Prisma migrations (Next.js starter)

```bash
cd next-app
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
```

## Stripe webhook local testing

Use the Stripe CLI to forward events to your local webhook handler (adjust the path to match your handler):

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Then set the generated webhook secret in `next-app/.env` as `STRIPE_WEBHOOK_SECRET`.

## Seed data

### Laravel panel

```bash
php artisan db:seed
```

### Next.js starter

Sample seed data lives in `next-app/prisma/seed-data.json`. Run:

```bash
cd next-app
pnpm prisma:seed
```

## Project structure

```
.
├── app/               # Laravel app
├── routes/            # Laravel routes
├── resources/         # Blade views, assets
├── config/            # Laravel config
├── next-app/          # Next.js starter
├── public/            # Public assets
└── database/          # Migrations/seeders/factories
```

## Troubleshooting

- **Composer memory issues**: `COMPOSER_MEMORY_LIMIT=-1 composer install`
- **Queue workers**: `php artisan queue:work`
- **Cache clear**: `php artisan cache:clear && php artisan config:clear`
