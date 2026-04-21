/*
  Warnings:

  - You are about to drop the column `preferredLocation` on the `Candidate` table. All the data in the column will be lost.
  - The `availabilityStatus` column on the `Candidate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `preferredCategory` column on the `Candidate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `preferredJobType` column on the `Candidate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "preferredCategory" AS ENUM ('TECHNOLOGY', 'DESIGN', 'MARKETING', 'SALES', 'FINANCE', 'HR', 'OPERATIONS', 'CUSTOMER_SUPPORT', 'EDUCATION', 'HEALTHCARE', 'LEGAL', 'OTHER');

-- CreateEnum
CREATE TYPE "preferredJobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "preferredCareerLevel" AS ENUM ('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXECUTIVE_LEVEL');

-- AlterEnum
ALTER TYPE "JobType" ADD VALUE 'FREELANCE';

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "preferredLocation",
ADD COLUMN     "preferredCareerLevel" "preferredCareerLevel",
DROP COLUMN "availabilityStatus",
ADD COLUMN     "availabilityStatus" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "preferredCategory",
ADD COLUMN     "preferredCategory" "preferredCategory",
DROP COLUMN "preferredJobType",
ADD COLUMN     "preferredJobType" "preferredJobType";
