-- CreateEnum (idempotent — type may already exist from a partial run)
DO $$ BEGIN
  CREATE TYPE "ContactStatus" AS ENUM ('LEAD', 'ACTIVE', 'WON', 'COMPLETED', 'INACTIVE', 'LOST');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable Contact
ALTER TABLE "Contact"
  ADD COLUMN IF NOT EXISTS "lastContactedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "nextActionAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "status" "ContactStatus" NOT NULL DEFAULT 'LEAD';

-- AlterTable User
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "firstContactCreatedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "firstJobCreatedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "firstQuotedJobAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "firstTaskCompletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "onboardingCompletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "quoteFollowUpDays" INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS "reviewRequestDays" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Contact_userId_status_idx" ON "Contact"("userId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "FollowUpTask_userId_status_dueDate_idx" ON "FollowUpTask"("userId", "status", "dueDate");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Job_userId_status_createdAt_idx" ON "Job"("userId", "status", "createdAt");
