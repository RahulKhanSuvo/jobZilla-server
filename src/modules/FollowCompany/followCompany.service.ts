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
  const candidate = await prisma.candidate.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!candidate) {
    throw new ApiError("Candidate not found", 404);
  }
  const [data, total] = await Promise.all([
    prisma.followCompany.findMany({
      where: {
        candideId: candidate.id,
      },
    }),
    prisma.followCompany.count({
      where: {
        candideId: candidate.id,
      },
      skip,
      take: limit,
    }),
    prisma.followCompany.count({
      where: {
        candideId: candidate.id,
      },
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
const followACompany = async () => {};
export const followACompanyService = {
  getAllFollwedCompany,
  followACompany,
};
