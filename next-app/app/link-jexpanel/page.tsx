import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LinkJexpanelForm } from "@/components/auth/link-jexpanel-form";

export default async function LinkJexpanelPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.jexpanelUserId) {
    redirect("/dashboard");
  }

  return (
    <main className="container flex min-h-screen flex-col justify-center gap-6 py-16">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold">Link your Jexpanel account</h1>
        <p className="text-muted-foreground">
          Enter the Jexpanel user ID associated with your hosting account to continue.
        </p>
      </div>
      <LinkJexpanelForm />
    </main>
  );
}
