"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition, type FormEvent } from "react";
import { Building2, Lock, Mail, Sparkles, User } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Unable to create your account.");
        return;
      }

      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (result?.error) {
        setError("Account created, but sign in failed.");
        return;
      }

      router.push(result?.url ?? "/dashboard");
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create your Turin account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Start the plan quiz and unlock migration concierge support.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Smith"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company"
                    name="company"
                    placeholder="AtlasForge"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
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
                {isPending ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Link href="/auth/sign-in" className="hover:text-foreground">
                Already have an account?
              </Link>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Your first onboarding session is scheduled after you submit the plan quiz.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
