/*
  Warnings:

  - A unique constraint covering the columns `[userId,companyId]` on the table `CandidateViews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CandidateViews" DROP CONSTRAINT "CandidateViews_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedJob" DROP CONSTRAINT "SavedJob_jobId_fkey";

-- DropForeignKey
ALTER TABLE "SavedJob" DROP CONSTRAINT "SavedJob_userId_fkey";

-- CreateIndex
CREATE INDEX "CandidateViews_companyId_idx" ON "CandidateViews"("companyId");

-- CreateIndex
CREATE INDEX "CandidateViews_userId_idx" ON "CandidateViews"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateViews_userId_companyId_key" ON "CandidateViews"("userId", "companyId");

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateViews" ADD CONSTRAINT "CandidateViews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
