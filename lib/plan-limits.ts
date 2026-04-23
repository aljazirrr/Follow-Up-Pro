import { prisma } from "./db";
import { startOfMonth } from "date-fns";
import type { PrismaClient } from "@prisma/client";

type DbClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export const PLAN_LIMITS = {
  FREE: {
    contacts: 20,
    tasksPerMonth: 20,
    customTemplates: 1,
  },
  PRO: {
    contacts: Infinity,
    tasksPerMonth: Infinity,
    customTemplates: Infinity,
  },
} as const;

export class PlanLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanLimitError";
  }
}

async function getPlan(userId: string, db: DbClient = prisma): Promise<"FREE" | "PRO"> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  return sub?.plan === "PRO" ? "PRO" : "FREE";
}

export async function assertCanCreateContact(userId: string, db: DbClient = prisma): Promise<void> {
  const plan = await getPlan(userId, db);
  const limit = PLAN_LIMITS[plan].contacts;
  if (limit === Infinity) return;
  const count = await db.contact.count({ where: { userId } });
  if (count >= limit) {
    throw new PlanLimitError(
      `Free plan is limited to ${limit} contacts. Upgrade to Pro for unlimited contacts.`
    );
  }
}

export async function assertCanCreateTask(userId: string, db: DbClient = prisma): Promise<void> {
  const plan = await getPlan(userId, db);
  const limit = PLAN_LIMITS[plan].tasksPerMonth;
  if (limit === Infinity) return;
  const count = await db.followUpTask.count({
    where: { userId, createdAt: { gte: startOfMonth(new Date()) } },
  });
  if (count >= limit) {
    throw new PlanLimitError(
      `Free plan is limited to ${limit} tasks per month. Upgrade to Pro for unlimited tasks.`
    );
  }
}

export async function assertCanCustomizeTemplates(userId: string, newCustomCount: number): Promise<void> {
  const plan = await getPlan(userId);
  const limit = PLAN_LIMITS[plan].customTemplates;
  if (limit === Infinity) return;
  if (newCustomCount > limit) {
    throw new PlanLimitError(
      `Free plan allows ${limit} custom template. Upgrade to Pro to edit all templates.`
    );
  }
}

export async function getUserPlan(userId: string): Promise<"FREE" | "PRO"> {
  return getPlan(userId);
}
