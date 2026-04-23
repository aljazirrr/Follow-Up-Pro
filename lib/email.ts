import "server-only";
import { Resend } from "resend";

let resend: Resend | null = null;

const log = (msg: string, meta?: Record<string, unknown>) =>
  console.log(JSON.stringify({ ts: new Date().toISOString(), src: "email", msg, ...meta }));

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
    log("no_api_key_dev_mode", { to: params.to, subject: params.subject });
    console.log(params.text);
    return { ok: true, id: "dev-no-op" };
  }

  log("sending", { to: params.to, subject: params.subject });

  try {
    const res = await client.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });
    if (res.error) {
      log("send_error", { to: params.to, error: res.error.message });
      return { ok: false, error: res.error.message };
    }
    log("sent", { to: params.to, id: res.data?.id });
    return { ok: true, id: res.data?.id ?? "unknown" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    log("send_exception", { to: params.to, error: message });
    return { ok: false, error: message };
  }
}
