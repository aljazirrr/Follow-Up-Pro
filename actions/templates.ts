"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { templateSchema } from "@/lib/validators";
import { assertCanCustomizeTemplates, PlanLimitError } from "@/lib/plan-limits";
import { DEFAULT_TEMPLATES } from "@/emails/defaults";
import { INDUSTRY_DEFAULTS } from "@/lib/industry-defaults";
import { getDictionary, getLocale } from "@/lib/i18n";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function getDefaultTemplates(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { industry: true },
  });
  if (user?.industry && INDUSTRY_DEFAULTS[user.industry]) {
    return INDUSTRY_DEFAULTS[user.industry].templates;
  }
  return DEFAULT_TEMPLATES;
}

export async function upsertTemplate(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = templateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;

  // Determine whether the save will produce a custom template (outside the
  // transaction — reads static defaults and user.industry, no race risk).
  const defaults = await getDefaultTemplates(user.id);
  const defaultBody = defaults.find((d) => d.type === data.type);
  const willBeCustom =
    !defaultBody ||
    defaultBody.subject !== data.subject ||
    defaultBody.body.trim() !== data.body.trim() ||
    defaultBody.name !== data.name;

  try {
    await prisma.$transaction(async (tx) => {
      if (willBeCustom) {
        const otherCustom = await tx.messageTemplate.count({
          where: { userId: user.id, isDefault: false, type: { not: data.type } },
        });
        await assertCanCustomizeTemplates(user.id, otherCustom + 1, tx);
      }

      const existing = await tx.messageTemplate.findUnique({
        where: { userId_type: { userId: user.id, type: data.type } },
      });

      if (existing) {
        await tx.messageTemplate.update({
          where: { id: existing.id },
          data: {
            name: data.name,
            subject: data.subject,
            body: data.body,
            isDefault: !willBeCustom,
          },
        });
      } else {
        await tx.messageTemplate.create({
          data: {
            userId: user.id,
            type: data.type,
            name: data.name,
            subject: data.subject,
            body: data.body,
            isDefault: !willBeCustom,
          },
        });
      }
    });
  } catch (err) {
    if (err instanceof PlanLimitError) {
      const t = getDictionary(getLocale());
      return { ok: false, error: t.planLimits[err.code] };
    }
    throw err;
  }

  revalidatePath("/templates");
  return { ok: true };
}

export async function resetTemplate(type: string): Promise<ActionResult> {
  const user = await requireUser();
  const defaults = await getDefaultTemplates(user.id);
  const def = defaults.find((d) => d.type === type);
  if (!def) return { ok: false, error: "Unknown template type" };

  await prisma.messageTemplate.upsert({
    where: { userId_type: { userId: user.id, type: def.type } },
    create: {
      userId: user.id,
      type: def.type,
      name: def.name,
      subject: def.subject,
      body: def.body,
      isDefault: true,
    },
    update: {
      name: def.name,
      subject: def.subject,
      body: def.body,
      isDefault: true,
    },
  });

  revalidatePath("/templates");
  return { ok: true };
}
