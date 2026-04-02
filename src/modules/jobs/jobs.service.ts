import { prisma } from "../../lib/prisma";
import { IJob } from "./job.schema";

const createJob = async (payload: IJob) => {
  const result = await prisma.job.create({
    data: {
      ...payload,
    },
  });
  return result;
};

export const jobsService = {
  createJob,
};
