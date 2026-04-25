import "server-only";
import { Resend } from "resend";
import { log } from "@/lib/logger";

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
    log("email", "no_api_key_dev_mode", { to: params.to, subject: params.subject });
    console.log(params.text);
    return { ok: true, id: "dev-no-op" };
  }

  log("email", "sending", { to: params.to, subject: params.subject });

  try {
    const res = await client.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });
    if (res.error) {
      log("email", "send_error", { to: params.to, error: res.error.message });
      return { ok: false, error: res.error.message };
    }
    log("email", "sent", { to: params.to, id: res.data?.id });
    return { ok: true, id: res.data?.id ?? "unknown" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    log("email", "send_exception", { to: params.to, error: message });
    return { ok: false, error: message };
  }
}
