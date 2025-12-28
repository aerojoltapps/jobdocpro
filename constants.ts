
import { JobRole } from './types';

export const PRICING = {
  RESUME_ONLY: { price: 199, label: 'Resume Only' },
  RESUME_COVER: { price: 299, label: 'Resume + Cover Letter' },
  JOB_READY_PACK: { price: 499, label: 'Job Ready Pack (All-in-One)' },
};

export const ROLE_TEMPLATES = {
  [JobRole.IT]: "Focus on technical stack, projects, and certifications.",
  [JobRole.SALES]: "Focus on targets achieved, communication, and networking.",
  [JobRole.SUPPORT]: "Focus on problem solving, empathy, and shift flexibility.",
  [JobRole.FRESHER]: "Focus on internships, academic projects, and extracurriculars.",
  [JobRole.FINANCE]: "Focus on accuracy, accounting standards, and tools like Tally.",
};

export const SAMPLE_SKILLS = [
  "Communication", "Teamwork", "MS Office", "Time Management", "Problem Solving"
];
