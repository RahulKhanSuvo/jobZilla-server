/*
  Warnings:

  - You are about to drop the column `language` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the `eduction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workExperience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "eduction" DROP CONSTRAINT "eduction_candideId_fkey";

-- DropForeignKey
ALTER TABLE "skill" DROP CONSTRAINT "skill_candideId_fkey";

-- DropForeignKey
ALTER TABLE "workExperience" DROP CONSTRAINT "workExperience_candideId_fkey";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "language";

-- DropTable
DROP TABLE "eduction";

-- DropTable
DROP TABLE "skill";

-- DropTable
DROP TABLE "workExperience";

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "candideId" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eduction" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "startData" TIMESTAMP(3) NOT NULL,
    "endData" TIMESTAMP(3),
    "isStudying" BOOLEAN NOT NULL DEFAULT false,
    "createdId" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candideId" TEXT NOT NULL,

    CONSTRAINT "Eduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "candideId" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
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

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eduction" ADD CONSTRAINT "Eduction_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
