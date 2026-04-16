import { prisma } from "../../lib/prisma";

const saveJob = async (userId: string, jobId: string) => {
  const result = await prisma.savedJob.create({
    data: {
      jobId,
      userId,
    },
  });
  return result;
};
export const saveJobService = {
  saveJob,
};
