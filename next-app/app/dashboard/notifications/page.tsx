import { Bell, CheckCircle2, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notifications = [
  {
    title: "Incident resolved",
    detail: "Latency in us-east-1 returned to baseline.",
    time: "5 minutes ago",
    status: "Resolved"
  },
  {
    title: "Maintenance scheduled",
    detail: "Database failover test scheduled for Oct 18, 02:00 UTC.",
    time: "2 hours ago",
    status: "Planned"
  },
  {
    title: "New insight",
    detail: "Enable burst credits for 11% savings.",
    time: "Yesterday",
    status: "Insight"
  }
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">Stay on top of incidents and insights.</p>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-primary" /> {notification.title}
              </CardTitle>
              <Badge variant={notification.status === "Resolved" ? "secondary" : "default"}>
                {notification.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{notification.detail}</p>
              <div className="flex items-center gap-2 text-xs">
                {notification.status === "Resolved" ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                {notification.time}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
