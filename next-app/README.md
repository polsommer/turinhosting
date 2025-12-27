# Turin Hosting Next.js Starter

This folder contains a Next.js 14 (App Router) starter configured with TailwindCSS, shadcn/ui, Prisma, Auth.js (NextAuth), Zod, React Hook Form, Stripe, and optional Redis.

## Getting Started

```bash
cd next-app
cp .env.example .env
pnpm install
pnpm prisma:generate
pnpm dev
```

## Docker Compose

```bash
docker-compose up -d
```

Postgres is required for Prisma and Auth.js. Redis is optional; remove the service if you do not plan to use it.
