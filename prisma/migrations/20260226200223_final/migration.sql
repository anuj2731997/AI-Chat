-- DropIndex
DROP INDEX "public"."account_userId_idx";

-- DropIndex
DROP INDEX "public"."session_userId_idx";

-- DropIndex
DROP INDEX "public"."verification_identifier_idx";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
