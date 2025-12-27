"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Launch",
    description: "For early stage teams shipping fast.",
    monthly: 49,
    annual: 39,
    features: ["3 regions", "Basic monitoring", "Community support"]
  },
  {
    name: "Scale",
    description: "For teams that need automation and guardrails.",
    monthly: 129,
    annual: 109,
    features: ["8 regions", "Smart insights", "24/7 chat support"]
  },
  {
    name: "Enterprise",
    description: "For regulated workloads and global scale.",
    monthly: 399,
    annual: 329,
    features: ["Unlimited regions", "Dedicated SRE", "Custom compliance"]
  }
];

export function PricingToggle() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Pricing</p>
          <h2 className="text-3xl font-semibold tracking-tight">Transparent pricing that scales with you</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Toggle between monthly and annual billing. Annual plans include priority migrations and dedicated onboarding.
          </p>
        </div>
        <div className="inline-flex rounded-full border bg-muted p-1">
          <Button
            variant={billing === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billing === "annual" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBilling("annual")}
          >
            Annual
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.name === "Scale" && <Badge>Most popular</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <div>
                <p className="text-4xl font-semibold">
                  ${billing === "monthly" ? plan.monthly : plan.annual}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-xs text-muted-foreground">Billed {billing}.</p>
              </div>
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-auto" variant={plan.name === "Scale" ? "default" : "outline"}>
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
