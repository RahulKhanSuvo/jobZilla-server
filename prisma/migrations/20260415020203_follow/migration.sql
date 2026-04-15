/*
  Warnings:

  - You are about to drop the column `careerFinding` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "careerFinding";

-- CreateTable
CREATE TABLE "FollowCompany" (
    "id" TEXT NOT NULL,
    "candideId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "FollowCompany_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FollowCompany" ADD CONSTRAINT "FollowCompany_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowCompany" ADD CONSTRAINT "FollowCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
