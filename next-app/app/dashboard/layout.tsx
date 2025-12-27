import Link from "next/link";
import { Bell, LayoutGrid, Server, Settings, ShieldCheck } from "lucide-react";

import { AssistantWidget } from "@/components/dashboard/assistant-widget";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/servers", label: "My servers", icon: Server },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: Settings }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-sm font-semibold">
            Turin Hosting
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Client Dashboard (gated preview)
          </div>
        </div>
      </div>
      <div className="container grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-2 rounded-lg border bg-background p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </aside>
        <div className="space-y-8">{children}</div>
      </div>
      <AssistantWidget />
    </div>
  );
}
