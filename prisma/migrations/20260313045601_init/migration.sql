/*
  Warnings:

  - The values [USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "JobType" ADD VALUE 'FREELANCE';

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CANDIDATE', 'EMPLOYER', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CANDIDATE';
COMMIT;

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "twitter" TEXT;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "name",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "applyEmail" TEXT,
ADD COLUMN     "applyType" TEXT,
ADD COLUMN     "careerLevel" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "featuredImage" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "qualification" TEXT,
ADD COLUMN     "salaryType" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "jobType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CANDIDATE';

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_key" ON "Candidate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
