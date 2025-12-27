import { Activity, CheckCircle2, Cloud, Server } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  { name: "API Gateway", status: "Operational" },
  { name: "Managed Databases", status: "Operational" },
  { name: "Edge CDN", status: "Operational" },
  { name: "Auth & SSO", status: "Operational" },
  { name: "Billing", status: "Operational" },
  { name: "Support Portal", status: "Operational" }
];

const incidents = [
  {
    title: "Scheduled maintenance: Tokyo region",
    time: "Oct 12, 02:00 UTC",
    detail: "Rolling upgrade to improve network latency. No downtime expected."
  },
  {
    title: "Resolved: Metrics ingestion delays",
    time: "Oct 9, 18:40 UTC",
    detail: "Telemetry buffers cleared and latency returned to baseline."
  }
];

export default function StatusPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/30">
          <div className="container space-y-4 py-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Status</p>
                <h1 className="text-4xl font-semibold tracking-tight">All systems operational</h1>
              </div>
              <Badge className="text-sm" variant="secondary">
                <CheckCircle2 className="mr-2 h-4 w-4" /> 99.99% uptime (last 90 days)
              </Badge>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Live updates on Turin Hosting services, maintenance windows, and incident history.
            </p>
          </div>
        </section>

        <section className="container space-y-8 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[Activity, Server, Cloud].map((Icon, index) => (
              <Card key={String(index)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-5 w-5 text-primary" />
                    {index === 0 ? "Latency" : index === 1 ? "Compute" : "Storage"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Healthy across all regions with zero active incidents.</p>
                  <p>Average response: {index === 0 ? "142ms" : index === 1 ? "98% capacity" : "47% used"}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>Service status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm">
                {services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <span>{service.name}</span>
                    <span className="flex items-center gap-2 text-primary">
                      <CheckCircle2 className="h-4 w-4" /> {service.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                {incidents.map((incident) => (
                  <div key={incident.title}>
                    <p className="font-semibold text-foreground">{incident.title}</p>
                    <p>{incident.time}</p>
                    <p>{incident.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
