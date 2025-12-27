import { headers } from "next/headers";

export function getClientIp() {
  const forwarded = headers().get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return headers().get("x-real-ip") ?? "unknown";
}
