import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((request) => {
  if (request.auth) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/auth/sign-in", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: ["/dashboard/:path*"]
};
