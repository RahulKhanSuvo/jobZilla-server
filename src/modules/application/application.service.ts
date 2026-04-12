import { prisma } from "../../lib/prisma";

const createApplication = async (
  userId: string,
  jobId: string,
  resumeId: string,
) => {
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
