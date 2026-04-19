import { prisma } from "../../lib/prisma";

const getJobStats = async (userId: string) => {
  // 1. Job status stats
  const jobStats = await prisma.job.groupBy({
    by: ["status"],
    where: {
      companyId: userId,
    },
    _count: {
      id: true,
    },
  });

  let totalJobs = 0;
  let openJobs = 0;
  let closedJobs = 0;

  jobStats.forEach((item) => {
    const count = item._count.id;
    totalJobs += count;

    if (item.status === "OPEN") openJobs = count;
    if (item.status === "CLOSED") closedJobs = count;
  });

  // 2. Total views
  const viewsAgg = await prisma.job.aggregate({
    where: {
      companyId: userId,
    },
    _sum: {
      views: true,
    },
  });

  const totalViews = viewsAgg._sum.views || 0;

  // 3. Total applicants
  const totalApplicants = await prisma.application.count({
    where: {
      job: {
        companyId: userId,
      },
    },
  });

  return {
    totalJobs,
    openJobs,
    closedJobs,
    totalViews,
    totalApplicants,
  };
};

const getCandidateDashboardStats = async (userId: string) => {
  // 1. Total applications
  const totalApplications = await prisma.application.count({
    where: {
      userId,
    },
  });

  // 2. Total saved jobs
  const totalSavedJobs = await prisma.savedJob.count({
    where: {
      userId,
    },
  });

  // 3. Total views
  const viewsAgg = await prisma.user.aggregate({
    where: {
      id: userId,
    },
    _sum: {
      views: true,
    },
  });
  // short list of jobs
  const totlaShortListedJobs = await prisma.application.count({
    where: {
      userId,
      status: "SHORTLISTED",
    },
  });

  const totalViews = viewsAgg._sum.views || 0;

  return {
    totalApplications,
    totalSavedJobs,
    totalViews,
    totlaShortListedJobs,
  };
};

export const statsService = {
  getJobStats,
  getCandidateDashboardStats,
};
