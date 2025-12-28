
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, DocumentResult } from "../types";

export const generateJobDocuments = async (userData: UserData): Promise<DocumentResult> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY is missing.");
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
    6. (Premium) A list of 10-12 Job-Specific Keywords to include.
    7. (Premium) A 2-sentence ATS Score Explanation (why this format works for ATS).
    8. (Premium) 2 short Recruiter Insights on how to pitch this profile.
    
    Language should be professional but simple. Return strictly JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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
            linkedinHeadline: { type: Type.STRING },
            keywordMapping: { type: Type.ARRAY, items: { type: Type.STRING } },
            atsExplanation: { type: Type.STRING },
            recruiterInsights: { type: Type.STRING }
          },
          required: ["resumeSummary", "experienceBullets", "coverLetter", "linkedinSummary", "linkedinHeadline", "keywordMapping", "atsExplanation", "recruiterInsights"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty AI response.");
    }
    
    return JSON.parse(text) as DocumentResult;
  } catch (e: any) {
    console.error("Gemini Service Error:", e);
    throw new Error(`Generation Failed: ${e.message}`);
  }
};
