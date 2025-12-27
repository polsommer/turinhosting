"use client";

import { MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AssistantWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden w-72 xl:block">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-4 w-4 text-primary" /> Turin assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Ask about cost optimizations, performance tuning, or upcoming maintenance.</p>
          <div className="flex items-center gap-2">
            <Input placeholder="Ask a question" className="h-9" />
            <Button size="icon" aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
