# Jexpanel (formerly Jexactyl)

Jexpanel is a modern game server management panel with integrated billing. This repository includes:

- **Laravel panel** (root of the repo).
- **Next.js starter** (`next-app/`) for onboarding, Auth.js, Prisma, and Stripe integrations.

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
