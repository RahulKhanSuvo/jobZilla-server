/*
  Warnings:

  - A unique constraint covering the columns `[jobId,anonymousId]` on the table `JobView` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId,userId]` on the table `JobView` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobView_jobId_anonymousId_key" ON "JobView"("jobId", "anonymousId");

-- CreateIndex
CREATE UNIQUE INDEX "JobView_jobId_userId_key" ON "JobView"("jobId", "userId");
