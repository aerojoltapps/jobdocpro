import { GoogleGenAI, Type } from "@google/genai";
import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

const KV_PREFIX = 'jdp_verified_v5_';

async function hashIdentifier(id: string): Promise<string> {
  // Normalize strictly: lowercase and remove all whitespace
  const normalized = id.toLowerCase().replace(/\s+/g, '');
  const msgBuffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req: Request) {
  const securityHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { userData, feedback, identifier } = await req.json();

    if (!identifier) {
      return new Response(JSON.stringify({ error: 'Missing user identifier. Please refresh.' }), { 
        status: 400, headers: securityHeaders 
      });
    }

    const secureId = await hashIdentifier(identifier);
    const kvKey = `${KV_PREFIX}${secureId}`;
    
    // Retry logic to handle KV eventual consistency
    let paidData: any = await kv.get(kvKey);
    
    if (!paidData) {
      // Small wait and retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      paidData = await kv.get(kvKey);
    }
    
    if (!paidData) {
      console.warn(`Access denied for hash: ${secureId}`);
      return new Response(JSON.stringify({ error: 'Payment required: Please complete your purchase.' }), { 
        status: 402, headers: securityHeaders
      });
    }

    if (typeof paidData.credits !== 'number' || paidData.credits <= 0) {
      return new Response(JSON.stringify({ error: 'No credits remaining.' }), { 
        status: 402, headers: securityHeaders
      });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("Configuration error");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate professional resume summary, 3-4 experience bullets per role, cover letter, and LinkedIn summary for ${userData.fullName}, role ${userData.jobRole}. Skills: ${userData.skills.join(', ')}. Details: ${JSON.stringify(userData.experience)}. ${feedback ? `Feedback: ${feedback}` : ''}`,
      config: {
        systemInstruction: "You are an expert Indian Recruiter. Return strictly valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumeSummary: { type: Type.STRING },
            experienceBullets: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } },
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

    const result = JSON.parse(response.text || '{}');
    paidData.credits -= 1;
    await kv.set(kvKey, paidData);
    result.remainingCredits = paidData.credits;

    return new Response(JSON.stringify(result), { status: 200, headers: securityHeaders });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Service unavailable" }), { status: 500, headers: securityHeaders });
  }
}