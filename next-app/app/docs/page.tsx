"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, FileText, Search } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const docs = [
  {
    title: "Getting started",
    category: "Foundations",
    summary: "Spin up your first cluster and configure access roles.",
    href: "/docs/getting-started"
  },
  {
    title: "Plan quiz overview",
    category: "Foundations",
    summary: "How the quiz maps workloads to recommended architectures.",
    href: "/docs/plan-quiz"
  },
  {
    title: "Cost estimator API",
    category: "Billing",
    summary: "Integrate real-time cost forecasting into your dashboards.",
    href: "/docs/cost-estimator"
  },
  {
    title: "Observability suite",
    category: "Operations",
    summary: "Connect logs, traces, and the insights engine.",
    href: "/docs/observability"
  },
  {
    title: "Runbook automation",
    category: "Operations",
    summary: "Automate responses to CPU spikes and deployment drift.",
    href: "/docs/runbooks"
  },
  {
    title: "Security & compliance",
    category: "Security",
    summary: "Configure audit trails and access reviews.",
    href: "/docs/security"
  },
  {
    title: "Status webhooks",
    category: "Integrations",
    summary: "Receive incident updates in Slack or PagerDuty.",
    href: "/docs/status-webhooks"
  }
];

export default function DocsPage() {
  const [query, setQuery] = useState("");

  const filteredDocs = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return docs;
    return docs.filter((doc) =>
      [doc.title, doc.summary, doc.category].some((field) =>
        field.toLowerCase().includes(search)
      )
    );
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/30">
          <div className="container space-y-6 py-16">
            <p className="text-sm font-semibold text-muted-foreground">Documentation</p>
            <h1 className="text-4xl font-semibold tracking-tight">Find answers fast</h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Search guides, runbooks, and API references to support your Turin deployment.
            </p>
            <div className="relative max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search docs, guides, and runbooks"
                className="pl-9"
              />
            </div>
          </div>
        </section>

        <section className="container space-y-8 py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Browse topics</h2>
            <Button variant="outline" asChild>
              <Link href="/status">View platform status</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <Card key={doc.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-primary" /> {doc.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{doc.category}</p>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>{doc.summary}</p>
                  <Button variant="ghost" size="sm" className="px-0" asChild>
                    <Link href={doc.href}>
                      Read guide <FileText className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
