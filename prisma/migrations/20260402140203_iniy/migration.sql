/*
  Warnings:

  - You are about to drop the column `companyType` on the `Company` table. All the data in the column will be lost.
  - The `foundedDate` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "companyType",
DROP COLUMN "foundedDate",
ADD COLUMN     "foundedDate" TIMESTAMP(3);
