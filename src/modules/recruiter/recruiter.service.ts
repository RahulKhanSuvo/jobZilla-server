import { prisma } from "../../lib/prisma";
import { IRecruiter } from "./recruiter.schema";

const updateRecruiter = async (userId: string, payload: IRecruiter) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
    },
  });
  const recruiter = await prisma.company.upsert({
    where: {
      userId: userId,
    },
    update: {
      description: payload.description,
      logo: payload.logo,
      coverImage: payload.coverImage,
      website: payload.website ?? "",
      industry: payload.industry,
      location: payload.location ?? "",
      companySize: payload.companySize ?? "",
      phone: payload.phone,
      foundedDate: payload.foundedDate,
      facebook: payload.facebook,
      linkedin: payload.linkedin,
      twitter: payload.twitter,
      address: payload.address,
      showProfile: payload.showProfile,
    },
    create: {
      userId: userId,
      description: payload.description,
      logo: payload.logo,
      coverImage: payload.coverImage,
      website: payload.website ?? "",
      industry: payload.industry,
      location: payload.location ?? "",
      companySize: payload.companySize ?? "",
      phone: payload.phone,
      foundedDate: payload.foundedDate,
      facebook: payload.facebook,
      linkedin: payload.linkedin,
      twitter: payload.twitter,
      address: payload.address,
      showProfile: payload.showProfile,
    },
  });

  return { ...result, company: recruiter };
};

export const recruiterService = {
  updateRecruiter,
};
