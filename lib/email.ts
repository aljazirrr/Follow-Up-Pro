import "server-only";
import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resend) resend = new Resend(key);
  return resend;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const client = getResend();
  const from = process.env.RESEND_FROM_EMAIL || "Rebooker <onboarding@resend.dev>";

  if (!client) {
    // In dev without a Resend key, log instead of sending.
    console.warn("[email] RESEND_API_KEY not set — skipping send and logging instead.");
    console.warn(`[email] to=${params.to} subject=${params.subject}`);
    console.warn(params.text);
    return { ok: true, id: "dev-no-op" };
  }

  try {
    const res = await client.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true, id: res.data?.id ?? "unknown" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}
