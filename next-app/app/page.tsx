import Link from "next/link";

import { ExampleForm } from "@/components/example-form";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="container flex min-h-screen flex-col gap-10 py-16">
      <section className="grid gap-4">
        <span className="text-sm font-medium text-muted-foreground">Turin Hosting</span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Next.js 14 starter with Auth.js, Prisma, and Stripe
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          This starter includes App Router layouts, shadcn/ui building blocks, Zod-powered
          forms, and server-side integrations for Postgres, Redis, Stripe, and NextAuth.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/api/auth/signin">Sign in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/api/auth/signout">Sign out</Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-6">
        <h2 className="text-xl font-semibold">Example onboarding form</h2>
        <ExampleForm />
      </section>
    </main>
  );
}
