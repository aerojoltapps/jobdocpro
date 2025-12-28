import { GoogleGenAI, Type } from "@google/genai";
import { UserData, DocumentResult } from "../types";

export const generateJobDocuments = async (userData: UserData): Promise<DocumentResult> => {
  // Initialize AI client inside the function to ensure the latest API key is used
  // Note: process.env.API_KEY is injected by Vite at build time or handled by the environment
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please set it in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Act as an expert Indian recruiter. Transform the following user details into professional, ATS-friendly job documents.
    
    User Details:
    Name: ${userData.fullName}
    Target Role: ${userData.jobRole}
    Location: ${userData.location}
    Education: ${JSON.stringify(userData.education)}
    Experience: ${JSON.stringify(userData.experience)}
    Skills: ${userData.skills.join(', ')}

    Please generate:
    1. A high-impact 3-sentence professional summary for the resume.
    2. Professional bullet points for each work experience provided (3-4 points each).
    3. A formal cover letter addressed to "Hiring Manager".
    4. A LinkedIn Profile Summary (About section).
    5. A catchy LinkedIn Headline.
    
    Language should be professional but simple (clear English for Indian context).
    Return strictly JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt, // Simplified contents format
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumeSummary: { type: Type.STRING },
            experienceBullets: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              } 
            },
            coverLetter: { type: Type.STRING },
            linkedinSummary: { type: Type.STRING },
            linkedinHeadline: { type: Type.STRING }
          },
          required: ["resumeSummary", "experienceBullets", "coverLetter", "linkedinSummary", "linkedinHeadline"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI model returned an empty response.");
    }
    
    return JSON.parse(text) as DocumentResult;
  } catch (e: any) {
    console.error("Gemini Service Detailed Error:", e);
    // Throw a more descriptive error message
    const errorMessage = e.message || "Unknown API Error";
    throw new Error(`Generation Failed: ${errorMessage}`);
  }
};