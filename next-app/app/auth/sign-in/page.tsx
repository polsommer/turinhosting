"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState, useTransition, type FormEvent } from "react";
import { Github, Lock, Mail, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setError("Unable to sign in with those credentials.");
        return;
      }

      router.push(result?.url ?? callbackUrl);
    });
  };

  const handleGithub = () => {
    setError(null);
    void signIn("github", { callbackUrl });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in to Turin</CardTitle>
            <p className="text-sm text-muted-foreground">
              Access your dashboard, alerts, and infrastructure insights.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <Button variant="outline" className="w-full gap-2" onClick={handleGithub}>
              <Github className="h-4 w-4" />
              Continue with GitHub
            </Button>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Link href="/auth/reset" className="hover:text-foreground">
                Forgot password?
              </Link>
              <Link href="/auth/sign-up" className="hover:text-foreground">
                Create account
              </Link>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                We support SSO, MFA, and hardware key enforcement on Scale plans.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
