import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="container flex min-h-screen flex-col justify-center gap-6 py-16">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="text-muted-foreground">Sign up to start managing hosting plans.</p>
      </div>
      <SignupForm />
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="text-primary underline-offset-4 hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </main>
  );
}
