import Link from "next/link";
import { Lock, Mail, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
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
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9" />
              </div>
            </div>
            <Button className="w-full">Sign in</Button>
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
