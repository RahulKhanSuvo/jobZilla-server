/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";
import { IJob } from "./job.schema";
import {
  CareerLevel,
  JobStatus,
  JobType,
  Prisma,
} from "../../generated/prisma/client";

const createJob = async (userId: string, payload: IJob) => {
  const company = await prisma.company.findUnique({
    where: {
      userId,
    },
  });

  if (!company) {
    throw new ApiError("Company profile not found for this user", 404);
  }

  // Profile completeness check
  if (!company.description || company.description.length < 10) {
    throw new ApiError(
      "Your company description must be at least 10 characters long to post a job",
      400,
    );
  }

  if (!company.industry) {
    throw new ApiError("Your company industry is required to post a job", 400);
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
  salaryMin: string,
  salaryMax: string,
  postedAnytime: string,
  seniorityLevel: string,
  category: string = "",
  locationType: string = "",
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
      user: {
        company: {
          location: {
            contains: location,
            mode: "insensitive",
          },
        },
      },
    });
  }

  // Job Type filter
  if (jobType && jobType !== "all") {
    andConditions.push({ jobType: jobType as JobType });
  }

  // Category filter
  if (category && category !== "all") {
    andConditions.push({ category: category as any });
  }

  // Location Type filter (REMOTE, ON_SITE, HYBRID)
  if (locationType && locationType !== "all") {
    andConditions.push({ locationType: locationType as any });
  }

  // Seniority Level filter
  if (seniorityLevel && seniorityLevel !== "all") {
    andConditions.push({
      careerLevel: {
        equals: seniorityLevel.toUpperCase() as CareerLevel,
      },
    });
  }
  // Salary Range filter
  if (salaryMin || salaryMax) {
    const min = Number(salaryMin) || 0;
    const max = Number(salaryMax) || 1000000;

    andConditions.push({
      AND: [{ salaryMin: { lte: max } }, { salaryMax: { gte: min } }],
    });
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
      user: {
        select: {
          name: true,
          email: true,
          company: {
            select: {
              location: true,
              logo: true,
            },
          },
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
      totalPages: Math.ceil(total / Number(limit)),
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
  let isFollowed = false;
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
  const jobView = await prisma.jobView.findFirst({
    where: {
      jobId,
      userId,
    },
  });
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          company: {
            select: {
              location: true,
              logo: true,
            },
          },
        },
      },
      ...(userId
        ? {
            applications: {
              where: {
                userId: userId,
              },
            },
          }
        : {}),
    },
  });
  if (!jobView && job?.user.id !== userId) {
    await prisma.jobView.create({
      data: {
        userId,
        jobId: jobId,
      },
    });
    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  if (!job) {
    throw new ApiError("Job not found", 404);
  }
  if (userId) {
    const followedCompany = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: job.user.id,
        },
      },
    });
    isFollowed = !!followedCompany;
  }

  return {
    ...job,
    isSaved,
    isFollowed,

    isApplied: (job as any).applications?.length > 0,
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
          user: {
            select: {
              name: true,
              email: true,
              company: {
                select: {
                  logo: true,
                  location: true,
                },
              },
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

// get company jobs
const getCompanyJobs = async (companyId: string) => {
  const result = await prisma.job.findMany({
    where: {
      companyId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          company: {
            select: {
              logo: true,
              location: true,
            },
          },
        },
      },
    },
  });
  return result;
};

// update job
const updateJob = async (userId: string, jobId: string, payload: IJob) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });
  if (!job) {
    throw new ApiError("Job not found", 404);
  }
  if (job.companyId !== userId) {
    throw new ApiError("You are not authorized to update this job", 403);
  }
  const result = await prisma.job.update({
    where: {
      id: jobId,
    },
    data: payload,
  });
  return result;
};

// update job status
const updateJobStatus = async (
  userId: string,
  jobId: string,
  status: JobStatus,
) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });
  if (!job) {
    throw new ApiError("Job not found", 404);
  }
  if (job.companyId !== userId) {
    throw new ApiError("You are not authorized to update this job", 403);
  }
  const result = await prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      status: status,
    },
  });
  return result;
};

// delete job
const deleteJob = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });
  if (!job) {
    throw new ApiError("Job not found", 404);
  }
  if (job.companyId !== userId) {
    throw new ApiError("You are not authorized to delete this job", 403);
  }
  const result = await prisma.job.delete({
    where: {
      id: jobId,
    },
  });
  return result;
};
const getRecommendedJobs = async (userId: string) => {
  // 1. Get candidate skills
  const candidate = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: true,
    },
  });

  const skills = candidate?.skills.map((s) => s.skill) || [];

  let whereCondition: Prisma.JobWhereInput = {
    status: JobStatus.OPEN,
  };

  // 2. If skills exist, create a matching condition
  if (skills.length > 0) {
    whereCondition = {
      ...whereCondition,
      OR: [
        {
          title: {
            contains: skills[0], // Start with first skill for basic matching
            mode: "insensitive",
          },
        },
        ...skills.map((skill) => ({
          description: {
            contains: skill,
            mode: "insensitive" as const,
          },
        })),
        {
          category: {
            in: skills, // Also match by category if it matches any skill name
          },
        },
      ],
    };
  }

  // 3. Fetch matches
  let jobs = await prisma.job.findMany({
    where: whereCondition,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          company: {
            select: {
              logo: true,
              location: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  // 4. Fallback if no specific matches found
  if (jobs.length === 0) {
    jobs = await prisma.job.findMany({
      where: { status: JobStatus.OPEN },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            company: {
              select: {
                logo: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });
  }

  return jobs;
};

export const jobsService = {
  createJob,
  getAllJobs,
  getMyJobs,
  saveJob,
  getJobById,
  getSaveJob,
  unSaveJob,
  getCompanyJobs,
  updateJob,
  updateJobStatus,
  deleteJob,
  getRecommendedJobs,
};
