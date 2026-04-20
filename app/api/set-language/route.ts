import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { locale } = await req.json();
  const valid = locale === "en" || locale === "nl";
  if (!valid) return NextResponse.json({ error: "Invalid locale" }, { status: 400 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
