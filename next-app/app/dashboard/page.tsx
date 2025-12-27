import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logoutAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.jexpanelUserId) {
    redirect("/link-jexpanel");
  }

  return (
    <main className="container flex min-h-screen flex-col gap-6 py-16">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name ?? session.user.email}.
        </p>
      </div>
      <div className="rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">Linked Jexpanel user ID</p>
        <p className="text-lg font-medium">{session.user.jexpanelUserId}</p>
      </div>
      <form action={logoutAction}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </main>
  );
}
