import z from "zod";

export const candidateSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  dob: z.string(),
  gender: z.string(),
  maritalStatus: z.string(),
  language: z.string(),
  skills: z.array(z.string()),
  aboutMe: z.string(),
  facebook: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  avatar: z.string().optional(),
  educationList: z.array(
    z.object({
      institution: z.string(),
      major: z.string(),
      field: z.string(),
      gap: z.number(),
      startData: z.string(),
      endData: z.string(),
      isStudying: z.boolean(),
    }),
  ),
  experienceList: z.array(
    z.object({
      jobTitle: z.string(),
      companyName: z.string(),
      industry: z.string(),
      startData: z.string(),
      endData: z.string(),
      isWorking: z.boolean(),
      Description: z.string(),
    }),
  ),
});
export type ICandidate = z.infer<typeof candidateSchema>;
