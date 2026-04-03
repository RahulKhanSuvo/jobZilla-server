import { ApiError } from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";
import { IJob } from "./job.schema";
import { Prisma } from "../../generated/prisma/client";

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

const getAllJobs = async (userId: string) => {
  const result = await prisma.job.findMany({
    include: {
      company: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          location: true,
          logo: true,
        },
      },
      savedJobs: {
        where: {
          userId: userId,
        },
      },
    },
  });

  return result.map((job) => {
    const { savedJobs, ...jobData } = job;
    return {
      ...jobData,
      isSaved: savedJobs.length > 0,
    };
  });
};

export interface IJobOptions {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  [key: string]: string | number | boolean | undefined | string[];
}

const getMyJobs = async (userId: string, options: IJobOptions) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    searchTerm,
    ...filters
  } = options;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const andConditions: Prisma.JobWhereInput[] = [{ companyId: userId }];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (Object.keys(filters).length > 0) {
    andConditions.push({
      AND: Object.keys(filters).map((key) => ({
        [key]: { equals: filters[key] },
      })),
    });
  }

  const whereConditions: Prisma.JobWhereInput = { AND: andConditions };

  const result = await prisma.job.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.job.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: result,
  };
};
// save job

const saveJob = async (userId: string, jobId: string) => {
  const existing = await prisma.savedJob.findFirst({
    where: {
      userId,
      jobId,
    },
  });
  if (existing) {
    const result = await prisma.savedJob.delete({
      where: {
        id: existing.id,
      },
    });
    return result;
  }
  const result = await prisma.savedJob.create({
    data: {
      userId,
      jobId,
    },
  });
  return result;
};

// get job by id
const getJobById = async (userId: string, jobId: string) => {
  let isSaved = false;
  if (userId) {
    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: userId,
          jobId: jobId,
        },
      },
    });
    isSaved = !!savedJob;
  }
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });
  return {
    ...job,
    isSaved,
  };
};

export const jobsService = {
  createJob,
  getAllJobs,
  getMyJobs,
  saveJob,
  getJobById,
};
