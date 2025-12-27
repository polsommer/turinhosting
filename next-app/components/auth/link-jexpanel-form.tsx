"use client";

import { useFormState, useFormStatus } from "react-dom";

import { linkJexpanelAction, type LinkJexpanelState } from "@/app/link-jexpanel/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LinkJexpanelState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Linking..." : "Link account"}
    </Button>
  );
}

export function LinkJexpanelForm() {
  const [state, formAction] = useFormState(linkJexpanelAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-border p-6">
      <div className="grid gap-2">
        <Label htmlFor="jexpanelUserId">Jexpanel user ID</Label>
        <Input id="jexpanelUserId" name="jexpanelUserId" required />
      </div>
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
