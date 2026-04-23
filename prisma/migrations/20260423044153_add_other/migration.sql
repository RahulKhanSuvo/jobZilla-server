/*
  Warnings:

  - Added the required column `maxPostings` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isHighlight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxPostings" INTEGER NOT NULL,
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeProductId" TEXT;
