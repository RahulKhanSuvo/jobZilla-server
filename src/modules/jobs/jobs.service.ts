import { ApiError } from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";
import { IJob } from "./job.schema";

const createJob = async (userId: string, payload: IJob) => {
  const company = await prisma.company.findUnique({
    where: {
      userId,
    },
  });

  if (!company) {
    throw new ApiError("Company profile not found for this user", 404);
  }

  const result = await prisma.job.create({
    data: {
      ...payload,
      companyId: company.id,
    },
  });
  return result;
};

const getAllJobs = async () => {
  const result = await prisma.job.findMany();
  return result;
};

export const jobsService = {
  createJob,
  getAllJobs,
};
