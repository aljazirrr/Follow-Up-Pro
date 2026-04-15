"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import { DEFAULT_TEMPLATES } from "@/emails/defaults";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function registerUser(formData: FormData): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }
  const { email, password, ownerName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Email is already registered" };

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      hashedPassword,
      ownerName,
      name: ownerName,
      subscription: { create: { plan: "FREE" } },
      templates: {
        create: DEFAULT_TEMPLATES.map((t) => ({
          type: t.type,
          name: t.name,
          subject: t.subject,
          body: t.body,
          isDefault: true,
        })),
      },
    },
  });

  return { ok: true };
}
