/*
  Warnings:

  - You are about to drop the column `skills` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "skills",
DROP COLUMN "tags";
