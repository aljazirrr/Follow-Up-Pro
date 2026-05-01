"use server";

import { requireUser } from "@/lib/auth";
import { feedbackSchema } from "@/lib/validators";
import { log } from "@/lib/logger";
import { sendEmail } from "@/lib/email";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function submitFeedback(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = feedbackSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const { type, message, pathname } = parsed.data;
  log("feedback", "submitted", { userId: user.id, type, pathname, message });

  const notifyEmail = process.env.FEEDBACK_EMAIL;
  if (notifyEmail) {
    await sendEmail({
      to: notifyEmail,
      subject: `[Rebooker Feedback] ${type} — ${user.email ?? user.id}`,
      text: `Type: ${type}\nFrom: ${user.email ?? user.id}\nPath: ${pathname ?? "unknown"}\n\n${message}`,
    }).catch(() => {});
  }

  return { ok: true };
}
