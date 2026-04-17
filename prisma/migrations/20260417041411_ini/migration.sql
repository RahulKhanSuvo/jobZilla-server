/*
  Warnings:

  - You are about to drop the column `profileImage` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "profileImage",
ADD COLUMN     "avatar" TEXT;
