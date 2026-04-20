import { ApiError } from "../../errors/ApiError";
import { AppStatus, NotificationType } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { notificationService } from "../notification/notification.service";

const createApplication = async (
  userId: string,
  jobId: string,
  resumeId: string | undefined,
  file: Express.Multer.File | undefined,
) => {
  if (!file && (!resumeId || resumeId === "")) {
    throw new ApiError(
      "Please provide either a resume ID or upload a new file",
      400,
    );
  }
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true },
  });
  if (!job) throw new ApiError("Job not found", 404);

  const candidateUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  let result;

  if (file) {
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
    });

    if (!candidate) throw new Error("Candidate not found");

    // 1. Upload to Cloudinary from the server
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      file.originalname,
    );

    // 2. Check if this is the first resume
    const resumeCount = await prisma.resume.count({
      where: { candidateId: candidate.id },
    });

    // 3. Save metadata to DB
    const resume = await prisma.resume.create({
      data: {
        title: file.originalname.replace(/\.pdf$/i, ""),
        fileUrl: uploadResult.secure_url,
        candidateId: candidate.id,
        isPrimary: resumeCount === 0,
      },
    });

    result = await prisma.application.create({
      data: {
        userId,
        jobId,
        companyId: job.company.id,
        resumeId: resume.id,
      },
    });
  } else {
    result = await prisma.application.create({
      data: {
        userId,
        jobId,
        companyId: job.company.id,
        resumeId: resumeId!,
      },
    });
  }

  if (result.id) {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        totalApplications: { increment: 1 },
      },
    });

    // Send notification to recruiter
    await notificationService.createNotification({
      userId: job.company.userId,
      type: NotificationType.APPLICATION,
      title: "New Job Application",
      message: `${candidateUser?.name || "A candidate"} has applied for "${job.title}"`,
      link: `/recruiter/applicants`,
    });

    // Send confirmation notification to candidate
    await notificationService.createNotification({
      userId: userId,
      type: NotificationType.APPLICATION,
      title: "Application Submitted",
      message: `You have successfully applied for "${job.title}"`,
      link: `/dashboard/candidate/applied-jobs`,
    });
  }

  return result;
};

const getAllApplications = async (
  userId: string,
  filters: {
    searchTerm?: string;
    status?: string;
    jobFilter?: string;
    sortBy?: string;
  },
  skip: number,
  limit: number,
) => {
  const company = await prisma.company.findUnique({
    where: { userId },
  });
  if (!company) throw new ApiError("Company not found", 404);

  const { searchTerm, status, jobFilter, sortBy } = filters;

  const where: Prisma.ApplicationWhereInput = {
    companyId: company.id,
  };

  if (searchTerm) {
    where.OR = [
      { user: { name: { contains: searchTerm, mode: "insensitive" } } },
      { job: { title: { contains: searchTerm, mode: "insensitive" } } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status as AppStatus;
  }

  if (jobFilter && jobFilter !== "ALL") {
    where.job = { title: jobFilter };
  }

  let orderBy: Prisma.ApplicationOrderByWithRelationInput = {
    createdAt: "desc",
  };

  if (sortBy === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sortBy === "name") {
    orderBy = { user: { name: "asc" } };
  }

  const applications = await prisma.application.findMany({
    where,
    include: {
      job: {
        select: {
          title: true,
          company: {
            include: { user: true },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          candidate: {
            select: {
              location: true,
              avatar: true,
            },
          },
        },
      },
      resume: {
        select: {
          id: true,
          title: true,
          fileUrl: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy,
  });

  const total = await prisma.application.count({ where });

  // Stats (counts for each status for this company)
  const stats = await prisma.application.groupBy({
    by: ["status"],
    where: { companyId: company.id },
    _count: { _all: true },
  });

  const statsFormatted = {
    ALL: await prisma.application.count({ where: { companyId: company.id } }),
    PENDING: stats.find((s) => s.status === "PENDING")?._count._all || 0,
    SHORTLISTED:
      stats.find((s) => s.status === "SHORTLISTED")?._count._all || 0,
    HIRED: stats.find((s) => s.status === "HIRED")?._count._all || 0,
    REJECTED: stats.find((s) => s.status === "REJECTED")?._count._all || 0,
  };

  // Unique job titles for filtering
  const jobs = await prisma.job.findMany({
    where: {
      companyId: userId,
      applications: { some: {} },
    },
    select: { title: true },
    distinct: ["title"],
  });

  const uniqueJobs = jobs.map((j) => j.title).sort();

  return {
    applications,
    meta: {
      total,
      skip,
      limit,
      stats: statsFormatted,
      uniqueJobs,
    },
  };
};

const getApplicationById = async (userId: string, applicationId: string) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) throw new ApiError("Company not found", 404);

  const application = await prisma.application.findUnique({
    where: { id: applicationId, companyId: company.id },
    include: {
      job: {
        select: {
          title: true,
          company: { include: { user: true } },
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          candidate: {
            select: {
              location: true,
              avatar: true,
              skills: true,
              eductions: true,
              workExperiences: true,
              aboutMe: true,
            },
          },
        },
      },
      resume: {
        select: { title: true, fileUrl: true },
      },
    },
  });
  if (!application) throw new ApiError("Application not found", 404);
  return application;
};

const updateApplicationStatus = async (
  userId: string,
  applicationId: string,
  status: AppStatus,
) => {
  const company = await prisma.company.findUnique({
    where: { userId },
  });
  if (!company) throw new ApiError("Company not found", 404);

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });
  if (!application) throw new ApiError("Application not found", 404);

  const result = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });
  let title: string;
  let message: string;

  switch (status) {
    case "SHORTLISTED":
      title = "Congratulations!";
      message = `Good news! You’ve been shortlisted for "${application.job.title}".`;
      break;

    case "HIRED":
      title = "Congratulations!";
      message = `Congrats! You’ve been hired for "${application.job.title}".`;
      break;

    case "REJECTED":
      title = "Application Rejected";
      message = `We’re sorry. Your application for "${application.job.title}" was not selected.`;
      break;

    default:
      title = "Application Status Updated";
      message = `Your application for "${application.job.title}" has been updated to ${status}.`;
  }

  // Send notification to candidate
  await notificationService.createNotification({
    userId: application.userId,
    type: NotificationType.APPLICATION,
    title,
    message,
    link: `/candidate/my-applied-jobs`,
  });

  return result;
};

const getCandidateAppliedJobs = async (userId: string) => {
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      job: {
        select: {
          title: true,
          company: {
            include: { user: true },
          },
        },
      },
      user: {
        select: {
          name: true,
          candidate: {
            select: {
              location: true,
              avatar: true,
            },
          },
        },
      },
      resume: {
        select: {
          title: true,
          fileUrl: true,
        },
      },
    },
  });
  return applications;
};

export const applicationService = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getCandidateAppliedJobs,
};
