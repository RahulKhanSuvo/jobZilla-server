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
export const statsService = {
  getJobStats,
};
