import { prisma } from "../../lib/prisma";
import { ICandidate } from "../user/candidate.schema";

const updateCandidate = async (userId: string, payload: ICandidate) => {
  console.log("candidate service", payload);
  const { skills, educationList, experienceList, ...rest } = payload;

  const updateData = {
    ...rest,
    dob: rest.dob ? new Date(rest.dob) : null,
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

  const result = await prisma.candidate.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      ...updateData,
    },
  });
  return result;
};

export const candidateService = {
  updateCandidate,
};
