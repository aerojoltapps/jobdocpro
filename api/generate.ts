
import { GoogleGenAI, Type } from "@google/genai";
import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { userData, feedback, identifier } = await req.json();

    if (!identifier || !userData) {
      return new Response(JSON.stringify({ error: 'Missing required data' }), { status: 400 });
    }

    // 1. Security Check: Verify payment status in Vercel KV
    // This ensures that even if the client-side UI is bypassed, the AI will not generate content.
    const paidData = await kv.get(`paid_${identifier}`);
    if (!paidData) {
      return new Response(JSON.stringify({ error: 'Payment required' }), { 
        status: 402,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Secret Key: Pulled from Vercel Environment Variables (never sent to client)
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is not configured in Vercel environment variables.");
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // 3. Structured Prompt: Reduces risk of prompt injection
    const systemInstruction = `You are an expert Indian Recruiter and Resume Writer. 
    Your task is to convert raw user data into high-impact, professional, ATS-friendly job application documents.
    Always use Indian English and industry-standard terminology for the Indian market (e.g., Lakhs, CGPA, etc.).`;

    const userPrompt = `
      CONTEXT:
      Full Name: ${userData.fullName}
      Target Role: ${userData.jobRole}
      Location: ${userData.location}
      Skills: ${userData.skills.join(', ')}
      
      EDUCATION:
      ${JSON.stringify(userData.education)}
      
      EXPERIENCE:
      ${JSON.stringify(userData.experience)}
      
      ${feedback ? `MODIFICATION REQUEST: ${feedback}` : ""}
      
      INSTRUCTION: Generate the Resume Summary, Experience Bullets, Cover Letter, and LinkedIn profile sections.
      Return strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumeSummary: { type: Type.STRING },
            experienceBullets: { 
              type: Type.ARRAY, 
              items: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: "A 2D array where each sub-array contains 3-4 bullet points for each work experience entry."
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

    return new Response(response.text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
