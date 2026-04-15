"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { templateSchema } from "@/lib/validators";
import { assertCanCustomizeTemplates, PlanLimitError } from "@/lib/plan-limits";
import { DEFAULT_TEMPLATES } from "@/emails/defaults";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function upsertTemplate(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = templateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const existing = await prisma.messageTemplate.findUnique({
    where: { userId_type: { userId: user.id, type: data.type } },
  });

  // Count how many templates will be customized (non-default) after this upsert.
  const defaultBody = DEFAULT_TEMPLATES.find((d) => d.type === data.type);
  const willBeCustom =
    !defaultBody ||
    defaultBody.subject !== data.subject ||
    defaultBody.body.trim() !== data.body.trim() ||
    defaultBody.name !== data.name;

  if (willBeCustom) {
    const otherCustom = await prisma.messageTemplate.count({
      where: { userId: user.id, isDefault: false, type: { not: data.type } },
    });
    try {
      await assertCanCustomizeTemplates(user.id, otherCustom + 1);
    } catch (err) {
      if (err instanceof PlanLimitError) return { ok: false, error: err.message };
      throw err;
    }
  }

  if (existing) {
    await prisma.messageTemplate.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        subject: data.subject,
        body: data.body,
        isDefault: !willBeCustom,
      },
    });
  } else {
    await prisma.messageTemplate.create({
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

  revalidatePath("/templates");
  return { ok: true };
}

export async function resetTemplate(type: string): Promise<ActionResult> {
  const user = await requireUser();
  const def = DEFAULT_TEMPLATES.find((d) => d.type === type);
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
