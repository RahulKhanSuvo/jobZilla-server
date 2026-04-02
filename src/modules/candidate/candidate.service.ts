import { prisma } from "../../lib/prisma";
import { ICandidate } from "./candidate.schema";

const updateCandidate = async (userId: string, payload: ICandidate) => {
  const reuslt = await prisma.candidate.upsert({
    where: { userId: userId },
    update: {
      phone: payload.phone,
      location: payload.location,
      dob: payload.dob ? new Date(payload.dob) : null,
      gender: payload.gender,
      maritalStatus: payload.maritalStatus,
      language: payload.language,
      aboutMe: payload.aboutMe,
      profileImage: payload.avatar,
      facebook: payload.facebook,
      linkedin: payload.linkedin,
      twitter: payload.twitter,
      skills: {
        deleteMany: {},
        create: payload.skills.map((skill) => ({
          skill: skill,
        })),
      },
      eductions: {
        deleteMany: {},
        create: payload.educationList.map((education) => ({
          institution: education.institution,
          major: education.major,
          field: education.field,
          gap: education.gap,
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

    create: {
      userId,
      phone: payload.phone,
      location: payload.location,
      dob: payload.dob ? new Date(payload.dob) : null,
      gender: payload.gender,
      maritalStatus: payload.maritalStatus,
      language: payload.language,
      aboutMe: payload.aboutMe,
      profileImage: payload.avatar,
      facebook: payload.facebook,
      linkedin: payload.linkedin,
      twitter: payload.twitter,
      skills: {
        create: payload.skills.map((skill) => ({
          skill: skill,
        })),
      },
      eductions: {
        create: payload.educationList.map((education) => ({
          institution: education.institution,
          major: education.major,
          field: education.field,
          gap: education.gap,
          startData: new Date(education.startData),
          endData: education.endData ? new Date(education.endData) : null,
          isStudying: education.isStudying,
        })),
      },
      workExperiences: {
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
  return reuslt;
};

export const candidateService = {
  updateCandidate,
};
