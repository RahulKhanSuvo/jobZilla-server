/*
  Warnings:

  - You are about to drop the column `candideId` on the `Eduction` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `candideId` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `candidateId` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `candideId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `candideId` on the `WorkExperience` table. All the data in the column will be lost.
  - You are about to drop the column `createdId` on the `WorkExperience` table. All the data in the column will be lost.
  - You are about to drop the `FollowCompany` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Eduction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkExperience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WorkExperience` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Eduction" DROP CONSTRAINT "Eduction_candideId_fkey";

-- DropForeignKey
ALTER TABLE "FollowCompany" DROP CONSTRAINT "FollowCompany_candideId_fkey";

-- DropForeignKey
ALTER TABLE "FollowCompany" DROP CONSTRAINT "FollowCompany_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_candideId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_candideId_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_candideId_fkey";

-- AlterTable
ALTER TABLE "Eduction" DROP COLUMN "candideId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "companyId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "candideId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "candidateId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "candideId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkExperience" DROP COLUMN "candideId",
DROP COLUMN "createdId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "FollowCompany";

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eduction" ADD CONSTRAINT "Eduction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
