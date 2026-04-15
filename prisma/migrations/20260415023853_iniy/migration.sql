/*
  Warnings:

  - A unique constraint covering the columns `[candideId,companyId]` on the table `FollowCompany` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `FollowCompany` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FollowCompany" DROP CONSTRAINT "FollowCompany_candideId_fkey";

-- DropForeignKey
ALTER TABLE "FollowCompany" DROP CONSTRAINT "FollowCompany_companyId_fkey";

-- AlterTable
ALTER TABLE "FollowCompany" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FollowCompany_candideId_companyId_key" ON "FollowCompany"("candideId", "companyId");

-- AddForeignKey
ALTER TABLE "FollowCompany" ADD CONSTRAINT "FollowCompany_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowCompany" ADD CONSTRAINT "FollowCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
