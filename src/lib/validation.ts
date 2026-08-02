import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("E-mail invalide"),
  password: z.string().min(6, "6 caractères minimum"),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
  companyName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const jobSchema = z.object({
  title: z.string().min(3, "Titre trop court"),
  description: z.string().min(20, "Description trop courte (20 caractères min)"),
  categoryId: z.string().min(1, "Catégorie requise"),
  location: z.string().min(2, "Ville requise"),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  currency: z
    .enum(["XOF", "XAF", "NGN", "GHS", "KES", "MAD", "MRU", "RWF", "USD", "EUR"])
    .optional(),
  responsibilities: z.string().max(5000).optional(),
  requirements: z.string().max(5000).optional(),
  experience: z.string().max(500).optional(),
  education: z.string().max(500).optional(),
  skills: z.string().max(2000).optional(),
  benefits: z.string().max(2000).optional(),
  positions: z.number().int().positive().max(999).optional(),
});

export const applicationSchema = z.object({
  coverLetter: z.string().max(3000).optional(),
  phone: z.string().max(40).optional(),
});

export const alertSchema = z.object({
  email: z.string().email("E-mail invalide"),
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(), // slug de catégorie
  location: z.string().trim().max(80).optional(),
});
