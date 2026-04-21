import { ApiError } from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";
import { Pagination } from "../../types";

const getAllFollwedCompany = async (userId: string, pagination: Pagination) => {
  const { page, limit, skip } = pagination;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const [data, total] = await Promise.all([
    prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        id: true,
        following: {
          select: {
            id: true,
            _count: {
              select: {
                jobs: true,
              },
            },
            name: true,
            company: {
              select: {
                id: true,
                location: true,
                logo: true,
                industry: true,
              },
            },
          },
        },
      },
    }),
    prisma.follow.count({
      where: {
        followerId: userId,
      },
      skip,
      take: limit,
    }),
  ]);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const followACompany = async (userId: string, companyId: string) => {
  if (!userId) throw new ApiError("not Found", 400);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  const candidate = await prisma.candidate.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!candidate) {
    throw new ApiError("Candidate not found", 404);
  }
  const company = await prisma.company.findUnique({
    where: {
      userId: companyId,
    },
  });
  if (!company) {
    throw new ApiError("Company not found", 404);
  }
  const followCompany = await prisma.follow.create({
    data: {
      followerId: userId,
      followingId: companyId,
    },
  });
  return followCompany;
};
const unFollowACompany = async (userId: string, companyId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  const company = await prisma.user.findUnique({
    where: {
      id: companyId,
    },
  });
  if (!company) {
    throw new ApiError("Company not found", 404);
  }
  const followCompany = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: company.id,
      },
    },
  });
  return followCompany;
};
export const followACompanyService = {
  getAllFollwedCompany,
  followACompany,
  unFollowACompany,
};
