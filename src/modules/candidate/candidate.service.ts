import { prisma } from "../../lib/prisma";
import { ICandidate } from "./candidate.schema";

const updateCandidate = async (userId: string, payload: ICandidate) => {
  console.log("payload", payload);
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.fullName,
      languages: {
        deleteMany: {},
        create: payload.language?.map((lang) => ({
          language: lang,
        })),
      },
      skills: {
        deleteMany: {},
        create: payload.skills?.map((skill) => ({
          skill: skill,
        })),
      },
      eductions: {
        deleteMany: {},
        create: payload.educationList.map((education) => ({
          institution: education.institution,
          major: education.major,
          field: education.field,
          startData: new Date(education.startData),
          endData: education.endData ? new Date(education.endData) : null,
          isStudying: education.isStudying,
        })),
      },
      workExperiences: {
        deleteMany: {},
        create: payload.experienceList.map((experience) => ({
          jobTitle: experience.jobTitle,
          companyName: experience.companyName,
          industry: experience.industry,
          startData: new Date(experience.startData),
          endData: experience.endData ? new Date(experience.endData) : null,
          isWorking: experience.isWorking,
          Description: experience.Description,
        })),
      },
    },
  });
  const result = await prisma.candidate.upsert({
    where: { userId: userId },
    update: {
      phone: payload.phone,
      location: payload.location,
      dob: payload.dob ? new Date(payload.dob) : null,
      gender: payload.gender,
      maritalStatus: payload.maritalStatus,
      aboutMe: payload.aboutMe,
      avatar: payload.avatar,
      facebook: payload.facebook,
      linkedin: payload.linkedin,
      twitter: payload.twitter,
    },

    create: {
      userId,
      phone: payload.phone,
      location: payload.location,
      dob: payload.dob ? new Date(payload.dob) : null,
      gender: payload.gender,
      maritalStatus: payload.maritalStatus,

      aboutMe: payload.aboutMe,
      avatar: payload.avatar,
      facebook: payload.facebook,
      linkedin: payload.linkedin,
      twitter: payload.twitter,
    },
  });
  return { ...user, candidate: result };
};

export const candidateService = {
  updateCandidate,
};
