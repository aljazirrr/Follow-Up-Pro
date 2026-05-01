"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { INDUSTRY_DEFAULTS } from "@/lib/industry-defaults";
import { setMilestoneOnce } from "@/lib/activation";
import type { Industry } from "@prisma/client";

type ActionResult = { ok: true } | { ok: false; error: string };

const VALID_INDUSTRIES = new Set(["INSTALLER", "DETAILER", "SALON", "REPAIR", "OTHER"]);

export async function completeOnboarding(industry: string): Promise<ActionResult> {
  if (!VALID_INDUSTRIES.has(industry)) {
    return { ok: false, error: "Invalid industry" };
  }

  const user = await requireUser();
  const config = INDUSTRY_DEFAULTS[industry];
  if (!config) return { ok: false, error: "Unknown industry" };

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        industry: industry as Industry,
        onboardingCompleted: true,
        quoteFollowUpDays: config.quoteFollowUpDays,
        reviewRequestDays: config.reviewRequestDays,
      },
    });

    await tx.messageTemplate.deleteMany({ where: { userId: user.id } });

    await tx.messageTemplate.createMany({
      data: config.templates.map((t) => ({
        userId: user.id,
        type: t.type,
        name: t.name,
        subject: t.subject,
        body: t.body,
        isDefault: true,
      })),
    });
  });

  await setMilestoneOnce(user.id, "onboardingCompletedAt", new Date()).catch(() => {});

  revalidatePath("/dashboard");
  revalidatePath("/templates");
  revalidatePath("/settings");
  return { ok: true };
}
