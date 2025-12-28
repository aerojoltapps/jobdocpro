
export enum JobRole {
  IT = 'IT / Software',
  SALES = 'Sales & Marketing',
  SUPPORT = 'Customer Support / BPO',
  FRESHER = 'Fresher (Any Graduate)',
  FINANCE = 'Finance & Accounting'
}

export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  jobRole: JobRole;
  education: {
    degree: string;
    college: string;
    year: string;
    percentage: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  skills: string[];
  summary?: string;
}

export interface DocumentResult {
  resumeSummary: string;
  experienceBullets: string[][];
  coverLetter: string;
  linkedinSummary: string;
  linkedinHeadline: string;
}

export enum PackageType {
  RESUME_ONLY = 'RESUME_ONLY',
  RESUME_COVER = 'RESUME_COVER',
  JOB_READY_PACK = 'JOB_READY_PACK'
}
