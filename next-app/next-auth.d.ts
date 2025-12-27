import type { DefaultSession } from "next-auth";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      jexpanelUserId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    jexpanelUserId?: string | null;
  }
}
