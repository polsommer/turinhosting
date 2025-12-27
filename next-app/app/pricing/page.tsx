import Link from "next/link";
import { CheckCircle2, Lightbulb, Rocket } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PricingToggle } from "@/components/landing/pricing-toggle";
import { CostEstimator } from "@/components/landing/cost-estimator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quizSteps = [
  {
    title: "Workload profile",
    description: "Share your peak traffic windows and compliance needs.",
    icon: Lightbulb
  },
  {
    title: "Migration depth",
    description: "Tell us what data stores, CI/CD, and observability tools you use.",
    icon: Rocket
  },
  {
    title: "Optimization goals",
    description: "Select your top three goals to tailor capacity planning.",
    icon: CheckCircle2
  }
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/30">
          <div className="container space-y-6 py-16 text-center">
            <p className="text-sm font-semibold text-muted-foreground">Pricing</p>
            <h1 className="text-4xl font-semibold tracking-tight">Find the plan built for your team</h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Turin&apos;s pricing is built to remove surprise invoices while still letting you scale
              globally. All plans include 99.99% uptime SLA and proactive security monitoring.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild>
                <Link href="/auth/sign-up">Start free assessment</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs">Compare features</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-10 py-16">
          <PricingToggle />
        </section>

        <section className="border-y bg-muted/40">
          <div className="container grid gap-8 py-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-sm font-semibold text-muted-foreground">Plan quiz</p>
              <h2 className="text-3xl font-semibold tracking-tight">Get your tailored plan in minutes</h2>
              <p className="text-sm text-muted-foreground">
                Answer a few questions and receive a migration blueprint, recommended plan, and
                timeline.
              </p>
              <div className="grid gap-4">
                {quizSteps.map((step) => (
                  <Card key={step.title}>
                    <CardHeader className="flex flex-row items-center gap-3">
                      <step.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm text-muted-foreground">
                      {step.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button asChild>
                <Link href="/auth/sign-up">Start the plan quiz</Link>
              </Button>
            </div>
            <CostEstimator />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
