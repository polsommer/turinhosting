import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Docs", href: "/docs" },
      { label: "Status", href: "/status" },
      { label: "Dashboard", href: "/dashboard" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/about#careers" },
      { label: "Press", href: "/about#press" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/about#privacy" },
      { label: "Terms", href: "/about#terms" },
      { label: "Security", href: "/about#security" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container space-y-8 py-12">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Turin Hosting</h3>
            <p className="text-sm text-muted-foreground">
              Reliable infrastructure with proactive insights, fast deployments, and clear
              budgeting.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title} className="space-y-3 text-sm">
              <p className="font-semibold">{column.title}</p>
              <div className="flex flex-col gap-2 text-muted-foreground">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="transition hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© 2024 Turin Hosting. All rights reserved.</span>
          <span>Built with shadcn/ui, Tailwind, and Next.js.</span>
        </div>
      </div>
    </footer>
  );
}
