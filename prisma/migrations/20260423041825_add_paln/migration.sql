/*
  Warnings:

  - The `industry` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('IT', 'HR', 'MARKETING', 'FINANCE', 'EDUCATION', 'HEALTHCARE', 'HOSPITALITY', 'CONSTRUCTION', 'MANUFACTURING', 'TRANSPORTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "currency" AS ENUM ('USD', 'EUR', 'BDT');

-- CreateEnum
CREATE TYPE "interval" AS ENUM ('monthly', 'yearly');

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "industry",
ADD COLUMN     "industry" "Industry" DEFAULT 'IT';

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" "currency" NOT NULL DEFAULT 'USD',
    "interval" "interval" NOT NULL DEFAULT 'monthly',
    "status" "PlanStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
