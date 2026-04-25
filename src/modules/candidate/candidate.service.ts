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
      ...(payload.language && {
        languages: {
          deleteMany: {},
          create: payload.language.map((lang) => ({
            language: lang,
          })),
        },
      }),
      ...(payload.skills && {
        skills: {
          deleteMany: {},
          create: payload.skills.map((skill) => ({
            skill: skill,
          })),
        },
      }),
      ...(payload.educationList && {
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
      }),
      ...(payload.experienceList && {
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
      }),
    },
  });
  const result = await prisma.candidate.upsert({
    where: { userId: userId },
    update: {
      preferredCareerLevel: payload.preferredCareerLevel,
      preferredCategory: payload.preferredCategory,
      preferredJobType: payload.preferredJobType,
      phone: payload.phone,
      location: payload.location,
      dob: payload.dob ? new Date(payload.dob) : null,
      gender: payload.gender,
      maritalStatus: payload.maritalStatus,
      aboutMe: payload.aboutMe,
      avatar: payload.avatar,
      facebook: payload.facebook,
      linkedin: payload.linkedin,
      github: payload.github,
    },

    create: {
      userId,
      phone: payload.phone,
      location: payload.location,
      dob: payload.dob ? new Date(payload.dob) : null,
      gender: payload.gender,
      maritalStatus: payload.maritalStatus,
      preferredCareerLevel: payload.preferredCareerLevel,
      preferredCategory: payload.preferredCategory,
      preferredJobType: payload.preferredJobType,
      aboutMe: payload.aboutMe,
      avatar: payload.avatar,
      facebook: payload.facebook,
      linkedin: payload.linkedin,
      github: payload.github,
    },
  });
  return { ...user, candidate: result };
};

const getCandidateById = async (id: string) => {
  return await prisma.candidate.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          languages: true,
          skills: true,
          eductions: true,
          workExperiences: true,
        },
      },
    },
  });
};

export const candidateService = {
  updateCandidate,
  getCandidateById,
};
