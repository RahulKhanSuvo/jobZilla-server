/*
  Warnings:

  - You are about to drop the column `applyEmail` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `applyType` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `externalUrl` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "applyEmail",
DROP COLUMN "applyType",
DROP COLUMN "externalUrl";
