import { ApiError } from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";
import { IJob } from "./job.schema";
import { JobType, Prisma } from "../../generated/prisma/client";

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
type SortOrder = "asc" | "desc";
const getAllJobs = async (
  userId: string,
  page: string,
  limit: string,
  searchTerm: string,
  sortBy: SortOrder = "desc",
  location: string,
  jobType: string = "",
  salary: string,
  postedAnytime: string,
  seniorityLevel: string,
) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const andConditions: Prisma.JobWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // Location filter - search in company location
  if (location && location !== "all") {
    andConditions.push({
      company: {
        location: {
          contains: location,
          mode: "insensitive",
        },
      },
    });
  }

  // Job Type filter
  if (jobType && jobType !== "all") {
    andConditions.push({ jobType: jobType as JobType });
  }

  // Seniority Level filter
  if (seniorityLevel && seniorityLevel !== "all") {
    andConditions.push({
      careerLevel: {
        contains: seniorityLevel,
        mode: "insensitive",
      },
    });
  }

  // Salary Range filter (s1, s2, s3, s4, s5)
  if (salary) {
    const salaryRanges: Record<string, { min: number; max: number }> = {
      s1: { min: 0, max: 5000 },
      s2: { min: 5000, max: 10000 },
      s3: { min: 10000, max: 15000 },
      s4: { min: 15000, max: 20000 },
      s5: { min: 20000, max: 1000000 },
    };

    // Handle multiple salaries if passed as string "s1,s2"
    const ids = salary.split(",");
    const salaryConditions = ids
      .map((id) => {
        const range = salaryRanges[id];
        if (range) {
          return {
            AND: [
              { salaryMin: { lte: range.max } },
              { salaryMax: { gte: range.min } },
            ],
          };
        }
        return null;
      })
      .filter(Boolean) as Prisma.JobWhereInput[];

    if (salaryConditions.length > 0) {
      andConditions.push({ OR: salaryConditions });
    }
  }

  // Posted Anytime (today, week, month)
  if (postedAnytime && postedAnytime !== "anytime") {
    const daysMap: Record<string, number> = {
      today: 1,
      week: 7,
      month: 30,
    };
    const days = daysMap[postedAnytime.toLowerCase()];
    if (days) {
      const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      andConditions.push({
        createdAt: {
          gte: date,
        },
      });
    }
  }

  const whereCondition: Prisma.JobWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.job.findMany({
    where: whereCondition,
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
      ...(userId
        ? {
            savedJobs: {
              where: {
                userId: userId,
              },
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: sortBy,
    },
    skip,
    take,
  });

  const total = await prisma.job.count({
    where: whereCondition,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: result.map((job) => {
      const { savedJobs, ...jobData } = job;
      return {
        ...jobData,
        isSaved: savedJobs ? savedJobs.length > 0 : false,
      };
    }),
  };
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
    },
  });
  return {
    ...job,
    isSaved,
  };
};

// get save job
const getSaveJob = async (userId: string, options: IJobOptions) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    searchTerm,
  } = options;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const result = await prisma.savedJob.findMany({
    where: {
      userId,
      ...(searchTerm && {
        job: {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      }),
    },
    include: {
      job: {
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
        },
      },
    },
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  return result;
};

// unsave job
const unSaveJob = async (userId: string, jobId: string) => {
  const result = await prisma.savedJob.delete({
    where: {
      userId_jobId: {
        userId: userId,
        jobId: jobId,
      },
    },
  });
  return result;
};

export const jobsService = {
  createJob,
  getAllJobs,
  getMyJobs,
  saveJob,
  getJobById,
  getSaveJob,
  unSaveJob,
};
