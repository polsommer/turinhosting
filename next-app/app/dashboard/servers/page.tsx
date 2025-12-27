"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const servers = [
  { id: "srv-1021", name: "api-eu-2", region: "Frankfurt", status: "Healthy", tier: "Scale" },
  { id: "srv-1044", name: "stream-us-1", region: "Virginia", status: "Healthy", tier: "Launch" },
  { id: "srv-1080", name: "batch-ap-3", region: "Singapore", status: "Degraded", tier: "Scale" },
  { id: "srv-1122", name: "core-eu-1", region: "London", status: "Healthy", tier: "Enterprise" },
  { id: "srv-1177", name: "cache-us-2", region: "Oregon", status: "Healthy", tier: "Launch" }
];

const filters = ["All", "Healthy", "Degraded"] as const;

export default function ServersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filteredServers = useMemo(() => {
    const search = query.trim().toLowerCase();
    return servers.filter((server) => {
      const matchesFilter = filter === "All" || server.status === filter;
      const matchesQuery =
        !search ||
        [server.name, server.region, server.id].some((value) =>
          value.toLowerCase().includes(search)
        );
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My servers</h1>
          <p className="text-sm text-muted-foreground">Monitor your fleet across regions.</p>
        </div>
        <Button>Provision new server</Button>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, region, or ID"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filters.map((value) => (
              <Button
                key={value}
                variant={filter === value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredServers.map((server) => (
          <Card key={server.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="h-4 w-4 text-primary" /> {server.name}
              </CardTitle>
              <Badge variant={server.status === "Healthy" ? "secondary" : "default"}>
                {server.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Region: {server.region}</p>
              <p>Server ID: {server.id}</p>
              <p>Plan tier: {server.tier}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/servers/${server.id}`}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
