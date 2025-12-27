import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bolt,
  Cpu,
  Globe,
  LifeBuoy,
  Shield,
  Sparkles
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialSlider } from "@/components/testimonial-slider";
import { PricingToggle } from "@/components/landing/pricing-toggle";
import { CostEstimator } from "@/components/landing/cost-estimator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Smart workload placement",
    description: "Predictive routing balances latency, spend, and sustainability.",
    icon: Sparkles
  },
  {
    title: "Always-on security",
    description: "Managed DDoS, WAF, and compliance dashboards in one place.",
    icon: Shield
  },
  {
    title: "Global automation",
    description: "Deploy to 18 regions in minutes with prebuilt runbooks.",
    icon: Globe
  },
  {
    title: "Transparent billing",
    description: "Real-time spend alerts and forecasting without hidden line items.",
    icon: BarChart3
  }
];

const steps = [
  {
    title: "Design your fleet",
    description: "Use the plan quiz to map workloads to ready-made blueprints.",
    icon: Cpu
  },
  {
    title: "Automate migrations",
    description: "Our onboarding team handles DNS, security, and data replication.",
    icon: Bolt
  },
  {
    title: "Optimize continuously",
    description: "Anomaly alerts and weekly insights keep performance on track.",
    icon: BadgeCheck
  }
];

const faqs = [
  {
    question: "Can I bring existing IPs or reserved instances?",
    answer: "Yes. Turin supports BYOIP and reserved capacity transfers for supported providers."
  },
  {
    question: "What compliance frameworks do you support?",
    answer: "SOC 2 Type II, ISO 27001, HIPAA-ready, and custom audits for enterprise plans."
  },
  {
    question: "Do you offer hands-on migration support?",
    answer: "Every scale plan includes a migration squad and 24/7 war room support."
  }
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-background via-background to-muted/40">
          <div className="container grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <Badge className="w-fit" variant="secondary">
                New: AI-powered capacity planning
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Turbinate your infrastructure with clarity, control, and care.
              </h1>
              <p className="text-base text-muted-foreground">
                Turin Hosting brings together reliable compute, predictive analytics, and a
                concierge onboarding experience. Launch faster, optimize smarter, and keep every
                team in sync.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/dashboard">
                    Launch dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
              <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-primary" /> 99.99% uptime SLA
                </div>
                <div className="flex items-center gap-2">
                  <LifeBuoy className="h-4 w-4 text-primary" /> 24/7 migration squad
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Plan quiz snapshot</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Answer three quick prompts and we build your recommended architecture.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/40 p-4">
                  <p className="text-xs font-semibold text-muted-foreground">Workload type</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "SaaS platform",
                      "Media streaming",
                      "Enterprise data",
                      "IoT workloads"
                    ].map((item) => (
                      <span key={item} className="rounded-full border px-3 py-1 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <p className="text-xs font-semibold text-muted-foreground">Team priorities</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Speed to deploy",
                      "Compliance ready",
                      "Cost controls",
                      "Global performance"
                    ].map((item) => (
                      <span key={item} className="rounded-full border px-3 py-1 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/pricing">Start the full quiz</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container space-y-10 py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground">Feature grid</p>
            <h2 className="text-3xl font-semibold tracking-tight">Everything you need to run global apps</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardHeader>
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-4 text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/40">
          <div className="container grid gap-10 py-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">How it works</p>
              <h2 className="text-3xl font-semibold tracking-tight">From quiz to production in days</h2>
              <p className="text-sm text-muted-foreground">
                We streamline migrations and keep optimizing long after launch.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.title}>
                  <CardHeader>
                    <step.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="mt-3 text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {step.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container space-y-8 py-16">
          <PricingToggle />
        </section>

        <section className="container grid gap-6 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">See the value before you commit</h2>
            <p className="text-sm text-muted-foreground">
              Use the estimator to align stakeholders and predict budget impact with confidence.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {["Dedicated onboarding", "Capacity forecasting", "Compliance exports", "Slack alerting"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border bg-muted/30 p-4">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <CostEstimator />
        </section>

        <section className="container space-y-10 py-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Testimonials</p>
              <h2 className="text-3xl font-semibold tracking-tight">Teams ship with confidence</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/about">Meet our customers</Link>
            </Button>
          </div>
          <TestimonialSlider />
        </section>

        <section className="border-y bg-muted/40">
          <div className="container grid gap-10 py-16 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">About Turin</p>
              <h2 className="text-3xl font-semibold tracking-tight">A hosting partner with heart</h2>
              <p className="text-sm text-muted-foreground">
                We&apos;re a distributed team of engineers and support specialists dedicated to
                sustainable infrastructure. Our mission is to make hosting feel human again.
              </p>
              <Button variant="secondary" asChild>
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Trust &amp; security highlights</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-primary" />
                  24/7 SOC monitoring with quarterly penetration tests.
                </div>
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  Dedicated compliance partner and audit-ready reporting.
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-primary" />
                  Carbon-aware routing and renewable energy commitments.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container space-y-8 py-16">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">FAQ</p>
            <h2 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-lg border bg-background p-5">
                <summary className="cursor-pointer text-sm font-semibold">{faq.question}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
