import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

import { ensureJexpanelLink } from "@/lib/jexpanel";
import { getRequestIp } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";
import { signInSchema } from "@/lib/validators";
import { prisma } from "@/server/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database"
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      authorize: async (credentials, request) => {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const ip = getRequestIp(request);
        const rate = await rateLimit({
          key: `auth:login:${ip}`,
          limit: 10,
          windowSec: 60
        });

        if (!rate.ok) {
          throw new Error("Rate limit exceeded");
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await compare(parsed.data.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return user;
      }
    })
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.jexpanelUserId = user.jexpanelUserId ?? null;
      }
      return session;
    }
  },
  events: {
    signIn: async ({ user }) => {
      if (!user?.id) {
        return;
      }

      await ensureJexpanelLink(user.id);
    }
  }
});
