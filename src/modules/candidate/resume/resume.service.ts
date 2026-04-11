import { prisma } from "../../../lib/prisma";
import { uploadToCloudinary } from "../../../utils/cloudinary";

const createResume = async (userId: string, file: Express.Multer.File) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
  });

  if (!candidate) throw new Error("Candidate not found");

  // 1. Upload to Cloudinary from the server
  const uploadResult = await uploadToCloudinary(file.buffer, file.originalname);

  // 2. Check if this is the first resume
  const resumeCount = await prisma.resume.count({
    where: { candidateId: candidate.id },
  });

  // 3. Save metadata to DB
  const result = await prisma.resume.create({
    data: {
      title: file.originalname.replace(/\.pdf$/i, ""),
      fileUrl: uploadResult.secure_url,
      candidateId: candidate.id,
      isPrimary: resumeCount === 0,
    },
  });

  return result;
};

const getResumes = async (userId: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
  });

  if (!candidate) return [];

  return await prisma.resume.findMany({
    where: { candidateId: candidate.id },
    orderBy: { createdAt: "desc" },
  });
};

const deleteResume = async (userId: string, id: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
  });

  if (!candidate) throw new Error("Candidate not found");

  return await prisma.resume.delete({
    where: { id, candidateId: candidate.id },
  });
};

const setPrimaryResume = async (userId: string, id: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
  });

  if (!candidate) throw new Error("Candidate not found");

  // Unset current primary
  await prisma.resume.updateMany({
    where: { candidateId: candidate.id, isPrimary: true },
    data: { isPrimary: false },
  });

  // Set new primary
  return await prisma.resume.update({
    where: { id, candidateId: candidate.id },
    data: { isPrimary: true },
  });
};

export const resumeService = {
  createResume,
  getResumes,
  deleteResume,
  setPrimaryResume,
};
