/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Company` table. All the data in the column will be lost.
  - Added the required column `employeeSize` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'REMOTE');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED');

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_ownerId_fkey";

-- DropIndex
DROP INDEX "Company_ownerId_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "ownerId",
ADD COLUMN     "companyType" TEXT,
ADD COLUMN     "employeeSize" TEXT NOT NULL,
ADD COLUMN     "industry" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "location" VARCHAR(150) NOT NULL,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "jobType" "JobType" NOT NULL,
    "experience" VARCHAR(100),
    "deadline" TIMESTAMP(3),
    "skills" VARCHAR(200),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" "AppStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
