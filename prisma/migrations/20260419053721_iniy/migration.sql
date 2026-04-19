-- AlterTable
ALTER TABLE "User" ADD COLUMN     "views" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "CandidateViews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateViews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CandidateViews" ADD CONSTRAINT "CandidateViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateViews" ADD CONSTRAINT "CandidateViews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
