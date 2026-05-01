-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('LEAD', 'ACTIVE', 'WON', 'COMPLETED', 'INACTIVE', 'LOST');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "lastContactedAt" TIMESTAMP(3),
ADD COLUMN     "nextActionAt" TIMESTAMP(3),
ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'LEAD';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstContactCreatedAt" TIMESTAMP(3),
ADD COLUMN     "firstJobCreatedAt" TIMESTAMP(3),
ADD COLUMN     "firstQuotedJobAt" TIMESTAMP(3),
ADD COLUMN     "firstTaskCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "quoteFollowUpDays" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "reviewRequestDays" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Contact_userId_status_idx" ON "Contact"("userId", "status");

-- CreateIndex
CREATE INDEX "FollowUpTask_userId_status_dueDate_idx" ON "FollowUpTask"("userId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "Job_userId_status_createdAt_idx" ON "Job"("userId", "status", "createdAt");
