/*
  Warnings:

  - You are about to drop the column `applyType` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImage` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "applyType",
DROP COLUMN "featuredImage",
DROP COLUMN "location",
DROP COLUMN "videoUrl";
