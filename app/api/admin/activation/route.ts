import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const email = (session?.user as { email?: string } | undefined)?.email;

  if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      onboardingCompletedAt: true,
      firstContactCreatedAt: true,
      firstJobCreatedAt: true,
      firstQuotedJobAt: true,
      firstTaskCompletedAt: true,
      subscription: { select: { plan: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = users.map((u) => ({
    id: u.id,
    email: u.email,
    plan: u.subscription?.plan ?? "FREE",
    createdAt: u.createdAt,
    onboardingCompletedAt: u.onboardingCompletedAt,
    firstContactCreatedAt: u.firstContactCreatedAt,
    firstJobCreatedAt: u.firstJobCreatedAt,
    firstQuotedJobAt: u.firstQuotedJobAt,
    firstTaskCompletedAt: u.firstTaskCompletedAt,
    hasCompletedOnboarding: u.onboardingCompletedAt !== null,
    hasCreatedFirstContact: u.firstContactCreatedAt !== null,
    hasCreatedFirstJob: u.firstJobCreatedAt !== null,
    hasQuotedFirstJob: u.firstQuotedJobAt !== null,
    hasCompletedFirstTask: u.firstTaskCompletedAt !== null,
  }));

  return NextResponse.json(rows);
}
