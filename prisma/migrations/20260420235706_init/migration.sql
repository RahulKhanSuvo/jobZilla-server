-- DropForeignKey
ALTER TABLE "CandidateViews" DROP CONSTRAINT "CandidateViews_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Eduction" DROP CONSTRAINT "Eduction_candideId_fkey";

-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_candideId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_candideId_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_candideId_fkey";

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eduction" ADD CONSTRAINT "Eduction_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateViews" ADD CONSTRAINT "CandidateViews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_candideId_fkey" FOREIGN KEY ("candideId") REFERENCES "Candidate"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
