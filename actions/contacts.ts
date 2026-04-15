"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { contactSchema } from "@/lib/validators";
import { assertCanCreateContact, PlanLimitError } from "@/lib/plan-limits";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function clean<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v === "" ? null : v;
  }
  return out as T;
}

export async function createContact(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  try {
    await assertCanCreateContact(user.id);
  } catch (err) {
    if (err instanceof PlanLimitError) return { ok: false, error: err.message };
    throw err;
  }

  const data = clean(parsed.data);
  const contact = await prisma.contact.create({
    data: { ...data, userId: user.id },
  });

  revalidatePath("/contacts");
  revalidatePath("/dashboard");
  return { ok: true, id: contact.id };
}

export async function updateContact(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const existing = await prisma.contact.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Contact not found" };

  await prisma.contact.update({
    where: { id },
    data: clean(parsed.data),
  });

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
  revalidatePath("/dashboard");
  return { ok: true, id };
}

export async function deleteContact(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const existing = await prisma.contact.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Contact not found" };

  await prisma.contact.delete({ where: { id } });
  revalidatePath("/contacts");
  revalidatePath("/dashboard");
  return { ok: true };
}
