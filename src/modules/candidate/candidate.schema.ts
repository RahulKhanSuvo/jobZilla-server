import z from "zod";

export const candidateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email(),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  language: z.string().min(1, "Language is required"),
  skills: z.array(z.string()),
  aboutMe: z.string().min(1, "About me is required"),
  careerFinding: z.string().min(1, "Career finding is required"),
  facebook: z.string().min(1, "Facebook is required"),
  linkedin: z.string().min(1, "Linkedin is required"),
  twitter: z.string().min(1, "Twitter is required"),
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
