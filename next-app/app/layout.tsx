import "./globals.css";

import type { Metadata } from "next";
import { AuthSessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Turin Hosting Next",
  description: "Next.js 14 app router starter with Auth.js, Prisma, and Stripe"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
