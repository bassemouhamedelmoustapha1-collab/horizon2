export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "REMOTE";

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWED"
  | "ACCEPTED"
  | "REJECTED";

export type Category = {
  id: string;
  name: string;
  slug: string;
  _count?: { jobs: number };
};

export type Job = {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  type: JobType;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  responsibilities: string | null;
  requirements: string | null;
  experience: string | null;
  education: string | null;
  skills: string | null;
  benefits: string | null;
  positions: number | null;
  createdAt: string;
  category: Category;
  recruiter?: {
    name: string;
    companyName: string | null;
    location: string | null;
    logoUrl?: string | null;
  };
  _count?: { applications: number };
};

export type Application = {
  id: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  candidate?: {
    id: string;
    name: string;
    email: string;
    title: string | null;
    location: string | null;
    bio: string | null;
    phone: string | null;
    cvUrl?: string | null;
    cvFileName?: string | null;
  };
};
