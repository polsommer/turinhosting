import { Globe2, HeartHandshake, Leaf, ShieldCheck, Users } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const values = [
  {
    title: "Human-first hosting",
    description: "We measure success by customer outcomes, not ticket counts.",
    icon: HeartHandshake
  },
  {
    title: "Security by design",
    description: "Every deployment includes built-in encryption and access reviews.",
    icon: ShieldCheck
  },
  {
    title: "Sustainable footprint",
    description: "Carbon-aware routing reduces emissions without sacrificing speed.",
    icon: Leaf
  },
  {
    title: "Global perspective",
    description: "Teams across 12 countries support customers around the clock.",
    icon: Globe2
  }
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/30">
          <div className="container space-y-6 py-16">
            <p className="text-sm font-semibold text-muted-foreground">About Turin</p>
            <h1 className="text-4xl font-semibold tracking-tight">We&apos;re building the most human hosting platform.</h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Turin Hosting was founded by platform engineers who wanted a better way to run
              critical applications. Today, we partner with global teams to deliver fast,
              compliant, and sustainable infrastructure.
            </p>
          </div>
        </section>

        <section className="container space-y-10 py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title}>
                <CardHeader>
                  <value.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-4">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {value.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="careers" className="border-y bg-muted/40">
          <div className="container grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">Careers</p>
              <h2 className="text-3xl font-semibold tracking-tight">Join a remote-first team</h2>
              <p className="text-sm text-muted-foreground">
                We&apos;re hiring across engineering, support, and customer success. Our teams are
                empowered to ship, iterate, and collaborate globally.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Current openings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Staff Platform Engineer — Remote, Americas</p>
                <p>Customer Reliability Lead — Remote, EMEA</p>
                <p>Product Marketing Manager — Remote, APAC</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="press" className="container space-y-6 py-16">
          <p className="text-sm font-semibold text-muted-foreground">Press kit</p>
          <h2 className="text-3xl font-semibold tracking-tight">Trusted by teams building the future</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "TechNova: Turin raises Series B",
              "Infra Weekly: A new era of hosting",
              "Cloudline: Why Turin leads in sustainability"
            ].map((headline) => (
              <div key={headline} className="rounded-lg border bg-background p-4 text-sm">
                {headline}
              </div>
            ))}
          </div>
        </section>

        <section id="privacy" className="border-t bg-muted/30">
          <div className="container grid gap-6 py-16 lg:grid-cols-3">
            {[
              {
                title: "Privacy",
                description: "We never sell customer data and always encrypt at rest and in transit."
              },
              {
                title: "Terms",
                description: "Transparent contracts with flexible cancellation and clear SLAs."
              },
              {
                title: "Security",
                description: "Dedicated security partners and regular incident response drills."
              }
            ].map((item) => (
              <Card key={item.title} id={item.title === "Terms" ? "terms" : undefined}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.description}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
