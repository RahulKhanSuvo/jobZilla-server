/*
  Warnings:

  - You are about to drop the column `twitter` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "twitter",
ADD COLUMN     "availabilityStatus" TEXT,
ADD COLUMN     "expectedSalaryMax" INTEGER,
ADD COLUMN     "expectedSalaryMin" INTEGER,
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "preferredCategory" TEXT,
ADD COLUMN     "preferredJobType" TEXT,
ADD COLUMN     "preferredLocation" TEXT;
