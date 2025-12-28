
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, DocumentResult } from "../types";

// Correctly use process.env.API_KEY directly as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDocuments = async (userData: UserData): Promise<DocumentResult> => {
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
          linkedinHeadline: { type: Type.STRING }
        },
        required: ["resumeSummary", "experienceBullets", "coverLetter", "linkedinSummary", "linkedinHeadline"]
      }
    }
  });

  const text = response.text || '{}';
  
  // Clean potential Markdown code block artifacts
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
    return JSON.parse(cleanJson) as DocumentResult;
  } catch (e) {
    console.error("Failed to parse AI response as JSON", e);
    throw new Error("Invalid response format from AI. Please try again.");
  }
};
