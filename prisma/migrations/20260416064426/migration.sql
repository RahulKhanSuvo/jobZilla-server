/*
  Warnings:

  - The values [FREELANCE] on the enum `JobType` will be removed. If these variants are still used in the database, this will fail.
  - The `careerLevel` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CareerLevel" AS ENUM ('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXECUTIVE_LEVEL');

-- AlterEnum
BEGIN;
CREATE TYPE "JobType_new" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'REMOTE', 'ON_SITE', 'HYBRID');
ALTER TABLE "Job" ALTER COLUMN "jobType" TYPE "JobType_new" USING ("jobType"::text::"JobType_new");
ALTER TYPE "JobType" RENAME TO "JobType_old";
ALTER TYPE "JobType_new" RENAME TO "JobType";
DROP TYPE "public"."JobType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "careerLevel",
ADD COLUMN     "careerLevel" "CareerLevel";
