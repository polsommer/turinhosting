import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="container flex min-h-screen flex-col justify-center gap-6 py-16">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to access your dashboard.</p>
      </div>
      <LoginForm />
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>Need an account?</span>
        <Link className="text-primary underline-offset-4 hover:underline" href="/signup">
          Create one
        </Link>
        <span>or</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/api/auth/signin/github">Continue with GitHub</Link>
        </Button>
      </div>
    </main>
  );
}
