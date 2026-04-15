import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge-safe middleware: redirects unauthenticated users to /login based on
 * cookie presence. The actual session verification runs in the app layout
 * via `requireUser()` in a node runtime, which is the real source of truth.
 */

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/contacts",
  "/jobs",
  "/followups",
  "/templates",
  "/billing",
  "/settings",
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
  return NextResponse.next();
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
  ],
};
