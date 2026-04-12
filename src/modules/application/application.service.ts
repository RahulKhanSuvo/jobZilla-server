import { ApiError } from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";
import { uploadToCloudinary } from "../../utils/cloudinary";

const createApplication = async (
  userId: string,
  jobId: string,
  resumeId: string,
  file: Express.Multer.File,
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true },
  });
  if (!job) throw new ApiError("Job not found", 404);
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
        companyId: job.company.id,
        resumeId: resume.id,
      },
    });
    if (result.id) {
      await prisma.job.update({
        where: { id: jobId },
        data: {
          totalApplications: { increment: 1 },
        },
      });
    }
    return result;
  }
  const result = await prisma.application.create({
    data: {
      userId,
      jobId,
      companyId: job.company.id,
      resumeId,
    },
  });
  if (result.id) {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        totalApplications: { increment: 1 },
      },
    });
  }
  return result;
};

const getAllApplications = async (userId: string) => {
  const company = await prisma.company.findUnique({
    where: { userId },
  });
  if (!company) throw new ApiError("Company not found", 404);
  const applications = await prisma.application.findMany({
    where: { companyId: company.id },
    include: {
      job: {
        select: {
          title: true,
          company: {
            include: { user: true },
          },
        },
      },
      resume: {
        select: {
          title: true,
          fileUrl: true,
        },
      },
    },
  });
  return applications;
};

export const applicationService = {
  createApplication,
  getAllApplications,
};
