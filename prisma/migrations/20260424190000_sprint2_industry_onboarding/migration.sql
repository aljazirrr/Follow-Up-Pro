-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('INSTALLER', 'DETAILER', 'SALON', 'REPAIR', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "industry" "Industry",
ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: mark all existing users as onboarded so they skip the picker
UPDATE "User" SET "onboardingCompleted" = true;
