/*
  Warnings:

  - You are about to drop the column `employeeSize` on the `Company` table. All the data in the column will be lost.
  - Added the required column `companySize` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "employeeSize",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "companySize" TEXT NOT NULL,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "foundedDate" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "showProfile" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "twitter" TEXT;
