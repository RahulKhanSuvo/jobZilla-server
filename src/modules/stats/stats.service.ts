import { ApiError } from "../../errors/ApiError";
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

  // 3. Application stats (Total and Status breakdown)
  const applications = await prisma.application.groupBy({
    by: ["status"],
    where: {
      companyId: userId,
    },
    _count: {
      id: true,
    },
  });

  let totalApplicants = 0;
  let pendingApplicants = 0;
  let shortlistedApplicants = 0;
  let hiredApplicants = 0;
  let rejectedApplicants = 0;

  applications.forEach((item) => {
    const count = item._count.id;
    totalApplicants += count;

    if (item.status === "PENDING") pendingApplicants = count;
    if (item.status === "SHORTLISTED") shortlistedApplicants = count;
    if (item.status === "HIRED") hiredApplicants = count;
    if (item.status === "REJECTED") rejectedApplicants = count;
  });

  // 4. Application Trend (Last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const trendDataRaw = await prisma.application.groupBy({
    by: ["createdAt"],
    where: {
      companyId: userId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    _count: {
      id: true,
    },
  });

  // Format trend data for the chart (grouped by day)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trendMap: Record<string, number> = {};

  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    trendMap[days[d.getDay()]] = 0;
  }

  trendDataRaw.forEach((item) => {
    const day = days[new Date(item.createdAt).getDay()];
    if (trendMap[day] !== undefined) {
      trendMap[day] += item._count.id;
    }
  });

  const applicationTrend = Object.entries(trendMap).map(([day, value]) => ({
    day,
    value,
  }));

  // 5. Recent Applicants
  const recentApplicants = await prisma.application.findMany({
    where: {
      companyId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          candidate: {
            select: {
              avatar: true,
            },
          },
        },
      },
      job: {
        select: {
          title: true,
        },
      },
    },
  });

  return {
    totalJobs,
    openJobs,
    closedJobs,
    totalViews,
    totalApplicants,
    pendingApplicants,
    shortlistedApplicants,
    hiredApplicants,
    rejectedApplicants,
    applicationTrend,
    recentApplicants,
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

const getEmployerDashboardStats = async (userId: string) => {
  const company = await prisma.company.findUnique({
    where: {
      userId,
    },
  });
  if (!company?.id) new ApiError("user not found", 404);
  const companyId = company?.id;
  // 1. Total jobs
  const totalJobs = await prisma.job.count({
    where: {
      companyId: userId,
    },
  });
  console.log("count", totalJobs);

  // 2. Total views
  const viewsAgg = await prisma.job.aggregate({
    where: {
      companyId,
    },
    _sum: {
      views: true,
    },
  });

  const totalViews = viewsAgg._sum.views || 0;

  // 3. Total applicants
  const totalApplicants = await prisma.application.count({
    where: {
      companyId,
    },
  });

  // 4. Application stats (Total and Status breakdown)
  const applications = await prisma.application.groupBy({
    by: ["status"],
    where: {
      companyId,
    },
    _count: {
      id: true,
    },
  });

  let pendingApplicants = 0;
  let shortlistedApplicants = 0;
  let hiredApplicants = 0;
  let rejectedApplicants = 0;

  applications.forEach((item) => {
    const count = item._count.id;

    if (item.status === "PENDING") pendingApplicants = count;
    if (item.status === "SHORTLISTED") shortlistedApplicants = count;
    if (item.status === "HIRED") hiredApplicants = count;
    if (item.status === "REJECTED") rejectedApplicants = count;
  });

  // 4b. Job status stats (Active vs Closed)
  const jobStatusStats = await prisma.job.groupBy({
    by: ["status"],
    where: {
      companyId: userId,
    },
    _count: {
      id: true,
    },
  });

  let openJobs = 0;
  let closedJobs = 0;

  jobStatusStats.forEach((item) => {
    const count = item._count.id;
    if (item.status === "OPEN") openJobs = count;
    if (item.status === "CLOSED") closedJobs = count;
  });

  // 5. Application Trend (Last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const trendDataRaw = await prisma.application.groupBy({
    by: ["createdAt"],
    where: {
      companyId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    _count: {
      id: true,
    },
  });

  // Format trend data for the chart (grouped by day)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trendMap: Record<string, number> = {};

  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    trendMap[days[d.getDay()]] = 0;
  }

  trendDataRaw.forEach((item) => {
    const day = days[new Date(item.createdAt).getDay()];
    if (trendMap[day] !== undefined) {
      trendMap[day] += item._count.id;
    }
  });

  const applicationTrend = Object.entries(trendMap).map(([day, value]) => ({
    day,
    value,
  }));

  // 6. Top Jobs (by applicants)
  const topJobs = await prisma.job.findMany({
    where: {
      companyId: userId,
    },
    orderBy: {
      applications: {
        _count: "desc",
      },
    },
    take: 5,
    include: {
      applications: {
        select: {
          id: true,
        },
      },
    },
  });

  const topJobsData = topJobs.map((job) => ({
    title: job.title,
    applicants: job.applications.length,
  }));

  // 7. Recent Applicants
  const recentApplicants = await prisma.application.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          candidate: {
            select: {
              avatar: true,
            },
          },
        },
      },
      job: {
        select: {
          title: true,
        },
      },
    },
  });

  return {
    totalJobs,
    openJobs,
    closedJobs,
    totalViews,
    totalApplicants,
    pendingApplicants,
    shortlistedApplicants,
    hiredApplicants,
    rejectedApplicants,
    applicationTrend,
    topJobs: topJobsData,
    recentApplicants,
  };
};

export const statsService = {
  getJobStats,
  getCandidateDashboardStats,
  getEmployerDashboardStats,
};
