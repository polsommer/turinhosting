import Link from "next/link";
import { KeyRound } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <p className="text-sm text-muted-foreground">
              We&apos;ll send a secure reset link to your inbox.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email address</Label>
              <Input id="reset-email" type="email" placeholder="you@company.com" />
            </div>
            <Button className="w-full">
              <KeyRound className="mr-2 h-4 w-4" /> Send reset link
            </Button>
            <Link href="/auth/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
              Back to sign in
            </Link>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
