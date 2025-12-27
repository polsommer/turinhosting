"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CostEstimator() {
  const [nodes, setNodes] = useState(4);
  const [storage, setStorage] = useState(250);

  const estimate = useMemo(() => {
    const nodeCost = nodes * 35;
    const storageCost = storage * 0.12;
    return Math.round((nodeCost + storageCost) * 100) / 100;
  }, [nodes, storage]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Cost estimator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Adjust your footprint to preview monthly spend.
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">${estimate}/mo</span>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Compute nodes</span>
            <span className="font-medium">{nodes} nodes</span>
          </div>
          <input
            type="range"
            min={2}
            max={20}
            value={nodes}
            onChange={(event) => setNodes(Number(event.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Managed storage</span>
            <span className="font-medium">{storage} GB</span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={storage}
            onChange={(event) => setStorage(Number(event.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Estimates include redundancy, snapshots, and baseline monitoring. Contact sales for
          reserved pricing.
        </p>
      </CardContent>
    </Card>
  );
}
