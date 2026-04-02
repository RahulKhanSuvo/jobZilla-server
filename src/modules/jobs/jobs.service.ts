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
      companyId: userId,
    },
  });
  return result;
};

const getAllJobs = async () => {
  const result = await prisma.job.findMany();
  return result;
};

const getMyJobs = async (userId: string) => {
  const result = await prisma.job.findMany({
    where: {
      companyId: userId,
    },
  });
  return result;
};

export const jobsService = {
  createJob,
  getAllJobs,
  getMyJobs,
};
