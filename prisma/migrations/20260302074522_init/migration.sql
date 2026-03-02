/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
DROP COLUMN "resumeUrl",
ADD COLUMN     "name" VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workExperience" (
    "id" TEXT NOT NULL,
    "candideId" TEXT NOT NULL,
    "jobTitle" VARCHAR(150) NOT NULL,
    "companyName" VARCHAR(150) NOT NULL,
    "industry" TEXT NOT NULL,
    "startData" TIMESTAMP(3) NOT NULL,
    "endData" TIMESTAMP(3),
    "Description" TEXT NOT NULL,
    "isWorking" BOOLEAN NOT NULL DEFAULT true,
    "createdId" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "candideId" TEXT NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduction" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "gap" DECIMAL(65,30) NOT NULL,
    "startData" TIMESTAMP(3) NOT NULL,
    "endData" TIMESTAMP(3),
    "isStudying" BOOLEAN NOT NULL DEFAULT false,
    "createdId" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candideId" TEXT NOT NULL,

    CONSTRAINT "eduction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workExperience" ADD CONSTRAINT "workExperience_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduction" ADD CONSTRAINT "eduction_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
