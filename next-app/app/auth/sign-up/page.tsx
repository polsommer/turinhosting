import Link from "next/link";
import { Building2, Mail, Sparkles, User } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
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
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" placeholder="Jane Smith" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="company" placeholder="AtlasForge" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-9" />
              </div>
            </div>
            <Button className="w-full">Create account</Button>
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
