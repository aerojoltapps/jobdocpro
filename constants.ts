import { JobRole, PackageType } from './types';

// REPLACE THIS with your actual Key ID from Razorpay Dashboard > Settings > API Keys
export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_HERE';

export const PRICING = {
  [PackageType.RESUME_ONLY]: { 
    price: 199, 
    label: 'Resume Only',
    features: ['ATS-Friendly Resume', 'Professional Summary', 'PDF Format']
  },
  [PackageType.RESUME_COVER]: { 
    price: 299, 
    label: 'Resume + Cover Letter',
    features: ['Everything in Resume Only', 'Role-Specific Cover Letter', 'Formal Language Sync']
  },
  [PackageType.JOB_READY_PACK]: { 
    price: 499, 
    label: 'Job Ready Pack (All-in-One)',
    features: [
      'Everything in Resume + Cover',
      'LinkedIn Optimization',
      'Job-Specific Keyword Mapping',
      'Recruiter-Style Bullet Rewriting',
      'ATS Score Explanation',
      'Resume Review Upsell'
    ]
  },
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