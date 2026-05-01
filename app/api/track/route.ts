import { type NextRequest, NextResponse } from "next/server";
import { log } from "@/lib/logger";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { event, ...meta } = body as Record<string, string>;
    if (typeof event !== "string" || !event) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    log("analytics", event, meta);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
