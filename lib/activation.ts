import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export type MilestoneField =
  | "onboardingCompletedAt"
  | "firstContactCreatedAt"
  | "firstJobCreatedAt"
  | "firstQuotedJobAt"
  | "firstTaskCompletedAt";

export async function setMilestoneOnce(
  userId: string,
  field: MilestoneField,
  value: Date
): Promise<void> {
  await prisma.user.updateMany({
    where: { id: userId, [field]: null } as Prisma.UserWhereInput,
    data: { [field]: value } as Prisma.UserUpdateManyMutationInput,
  });
}
