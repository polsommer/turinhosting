import Link from "next/link";
import { AlertCircle, Cpu, Database, Shield, Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "CPU", value: "68%", icon: Cpu },
  { label: "Memory", value: "71%", icon: Activity },
  { label: "Storage", value: "1.4 TB", icon: Database },
  { label: "Security", value: "Compliant", icon: Shield }
];

export default function ServerDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Server detail</p>
          <h1 className="text-2xl font-semibold tracking-tight">{params.id}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Healthy</Badge>
          <Button variant="outline" asChild>
            <Link href="/dashboard/servers">Back to servers</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">Updated 5 minutes ago</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Autoscaling event completed</p>
              <p>Scaled from 6 to 8 nodes after traffic spike.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Security patch applied</p>
              <p>Kernel hotfix installed with zero downtime.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
