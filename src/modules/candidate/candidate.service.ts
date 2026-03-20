import { prisma } from "../../lib/prisma";
import { ICandidate } from "../user/candidate.schema";

const updateCandidate = async (userId: string, payload: ICandidate) => {
  console.log("candidate service", payload);
  const {
    fullName,
    email,
    avatar,
    skills,
    educationList,
    experienceList,
    ...rest
  } = payload;

  // 1. Update User (name and email)
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: fullName,
      email,
    },
  });

  const commonData = {
    ...rest,
    profileImage: avatar,
    dob: rest.dob ? new Date(rest.dob) : null,
  };

  const candidateUpdateData = {
    ...commonData,
    skills: {
      deleteMany: {},
      create: skills.map((s) => ({ skill: s })),
    },
    eductions: {
      deleteMany: {},
      create: educationList.map((e) => ({
        ...e,
        gap: Number(e.gap),
        startData: new Date(e.startData),
        endData: e.endData ? new Date(e.endData) : null,
      })),
    },
    workExperiences: {
      deleteMany: {},
      create: experienceList.map((ex) => ({
        ...ex,
        startData: new Date(ex.startData),
        endData: ex.endData ? new Date(ex.endData) : null,
      })),
    },
  };

  const candidateCreateData = {
    userId,
    ...commonData,
    skills: {
      create: skills.map((s) => ({ skill: s })),
    },
    eductions: {
      create: educationList.map((e) => ({
        ...e,
        gap: Number(e.gap),
        startData: new Date(e.startData),
        endData: e.endData ? new Date(e.endData) : null,
      })),
    },
    workExperiences: {
      create: experienceList.map((ex) => ({
        ...ex,
        startData: new Date(ex.startData),
        endData: ex.endData ? new Date(ex.endData) : null,
      })),
    },
  };

  // 3. Upsert Candidate
  const result = await prisma.candidate.upsert({
    where: { userId },
    update: candidateUpdateData,
    create: candidateCreateData,
  });
  return result;
};

export const candidateService = {
  updateCandidate,
};
