import { prisma } from "../../lib/prisma";
import { uploadToCloudinary } from "../../utils/cloudinary";

const createApplication = async (
  userId: string,
  jobId: string,
  resumeId: string,
  file: Express.Multer.File,
) => {
  if (file) {
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
    });

    if (!candidate) throw new Error("Candidate not found");

    // 1. Upload to Cloudinary from the server
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      file.originalname,
    );

    // 2. Check if this is the first resume
    const resumeCount = await prisma.resume.count({
      where: { candidateId: candidate.id },
    });

    // 3. Save metadata to DB
    const resume = await prisma.resume.create({
      data: {
        title: file.originalname.replace(/\.pdf$/i, ""),
        fileUrl: uploadResult.secure_url,
        candidateId: candidate.id,
        isPrimary: resumeCount === 0,
      },
    });
    const result = await prisma.application.create({
      data: {
        userId,
        jobId,
        resumeId: resume.id,
      },
    });
    return result;
  }
  const result = await prisma.application.create({
    data: {
      userId,
      jobId,
      resumeId,
    },
  });
  return result;
};

export const applicationService = {
  createApplication,
};
