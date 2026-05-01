"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { automationSettingsSchema } from "@/lib/validators";
import { log } from "@/lib/logger";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateAutomationSettings(input: {
  quoteFollowUpDays: number;
  reviewRequestDays: number;
}): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = automationSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      quoteFollowUpDays: parsed.data.quoteFollowUpDays,
      reviewRequestDays: parsed.data.reviewRequestDays,
    },
  });

  log("settings", "automation_updated", {
    userId: user.id,
    quoteFollowUpDays: parsed.data.quoteFollowUpDays,
    reviewRequestDays: parsed.data.reviewRequestDays,
  });

  revalidatePath("/settings");
  return { ok: true };
}
