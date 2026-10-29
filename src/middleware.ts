import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const sessionToken =
    cookies.get("authjs.session-token")?.value ||
    cookies.get("__Secure-authjs.session-token")?.value ||
    cookies.get("next-auth.session-token")?.value;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isPartnerRoute = nextUrl.pathname.startsWith("/partner");

  // In production, guard admin & partner routes
  if (isAdminRoute || isPartnerRoute) {
    // If not authenticated, redirect to login with return path
    if (!sessionToken && process.env.NODE_ENV === "production") {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*"],
};
