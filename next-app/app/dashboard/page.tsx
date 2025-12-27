"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  CloudCog,
  Cpu,
  Database,
  Sparkles
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const usageData = [
  { name: "Mon", usage: 62 },
  { name: "Tue", usage: 70 },
  { name: "Wed", usage: 68 },
  { name: "Thu", usage: 74 },
  { name: "Fri", usage: 81 },
  { name: "Sat", usage: 77 },
  { name: "Sun", usage: 69 }
];

const insights = [
  {
    title: "Right-size your analytics cluster",
    detail: "Potential monthly savings: $320",
    icon: Sparkles
  },
  {
    title: "Enable cache warm-up",
    detail: "Estimated latency drop: 18%",
    icon: Activity
  },
  {
    title: "Add standby in Frankfurt",
    detail: "Resilience score: +12 points",
    icon: CloudCog
  }
];

const quickActions = [
  { label: "Launch new server", icon: Cpu },
  { label: "Create snapshot", icon: Database },
  { label: "Review alerts", icon: Bell }
];

const checklist = [
  "Invite teammates",
  "Connect CI/CD pipeline",
  "Configure anomaly alerts",
  "Complete compliance profile"
];

const anomalyAlerts = [
  {
    title: "CPU surge detected",
    detail: "api-eu-2 spiked to 92% for 7 minutes.",
    severity: "High"
  },
  {
    title: "Unexpected data egress",
    detail: "Storage cluster west-1 exceeded baseline by 18%.",
    severity: "Medium"
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening across your Turin infrastructure.
          </p>
        </div>
        <Button>
          View live status <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active servers", value: "48", change: "+6%", icon: Cpu },
          { label: "Monthly spend", value: "$12.4k", change: "-4%", icon: Database },
          { label: "Uptime", value: "99.98%", change: "+0.2%", icon: Activity },
          { label: "Open alerts", value: "3", change: "-2", icon: AlertTriangle }
        ].map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{card.value}</div>
              <p className="text-xs text-muted-foreground">Change: {card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly compute utilization</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ left: 0, right: 0 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#2563eb"
                  fill="#93c5fd"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smart insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.title} className="flex items-start gap-3 rounded-lg border p-3">
                <insight.icon className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">{insight.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Button key={action.label} variant="outline" className="h-auto flex-col gap-2 py-6">
                <action.icon className="h-5 w-5" />
                <span className="text-xs text-muted-foreground">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {checklist.map((item, index) => (
                <div key={item} className="flex items-center justify-between text-sm">
                  <span>{item}</span>
                  {index < 2 ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>50%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-1/2 rounded-full bg-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Anomaly alerts</CardTitle>
          <Badge variant="secondary">2 active</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {anomalyAlerts.map((alert) => (
            <div key={alert.title} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{alert.title}</p>
                <Badge variant={alert.severity === "High" ? "default" : "secondary"}>
                  {alert.severity}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{alert.detail}</p>
              <Button variant="ghost" size="sm" className="mt-3 px-0">
                Investigate <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
