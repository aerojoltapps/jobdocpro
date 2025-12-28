import { JobRole, PackageType } from './types';

// REPLACE THIS with your actual Key ID from Razorpay Dashboard > Settings > API Keys
export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_HERE';

export const PRICING = {
  [PackageType.RESUME_ONLY]: { 
    price: 99, 
    label: 'Starter Pack',
    features: ['1 Professional Resume', 'ATS-Friendly Layout', 'Instant PDF Download', 'Indian Market Optimized']
  },
  [PackageType.RESUME_COVER]: { 
    price: 199, 
    label: 'Pro Pack',
    features: ['3 Generation Credits', 'Resume + Cover Letter', 'Clean Layouts', 'Priority PDF Export']
  },
  [PackageType.JOB_READY_PACK]: { 
    price: 299, 
    label: 'Job Ready Pack',
    features: [
      'Unlimited Edits (24hrs)',
      'Job-Specific Optimization',
      'LinkedIn About Section',
      'Recruiter Keyword Mapping',
      'ATS Score Explanation',
      'No Watermark'
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