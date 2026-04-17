import z from "zod";

export const candidateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email(),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  language: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  aboutMe: z.string().optional(),
  careerFinding: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  avatar: z.string().optional(),
  educationList: z.array(
    z.object({
      institution: z.string(),
      major: z.string(),
      field: z.string(),
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
