import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      jexpanelUserId: string | null;
    };
  }

  interface User {
    jexpanelUserId?: string | null;
  }
}
