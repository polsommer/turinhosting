import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((request) => {
  const { nextUrl } = request;
  const isAuthenticated = Boolean(request.auth?.user);

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    nextUrl.pathname.startsWith("/dashboard") &&
    !request.auth?.user?.jexpanelUserId
  ) {
    return NextResponse.redirect(new URL("/link-jexpanel", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"]
};
