import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/contacts",
  "/jobs",
  "/followups",
  "/templates",
  "/billing",
  "/settings",
  "/onboarding",
];

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const hasSession = SESSION_COOKIE_NAMES.some((name) =>
    req.cookies.has(name)
  );
  if (!hasSession) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/jobs/:path*",
    "/followups/:path*",
    "/templates/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/onboarding",
    "/onboarding/:path*",
  ],
};
