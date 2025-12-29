import { GoogleGenAI, Type } from "@google/genai";
import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

const MAX_FIELD_LENGTH = 1000;
const MAX_ARRAY_SIZE = 10;

async function hashIdentifier(id: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(id.toLowerCase().trim());
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

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  if (!hasKV) {
    return new Response(JSON.stringify({ error: 'Storage configuration missing.' }), { 
      status: 500, 
      headers: securityHeaders
    });
  }

  try {
    const { userData, feedback, identifier } = await req.json();

    if (!identifier || !userData || !userData.email || !userData.phone) {
      return new Response(JSON.stringify({ error: 'Invalid request parameters' }), { 
        status: 400, 
        headers: securityHeaders 
      });
    }

    if (userData.fullName.length > 200 || 
        (feedback && feedback.length > 500) ||
        userData.experience.length > MAX_ARRAY_SIZE ||
        userData.education.length > MAX_ARRAY_SIZE) {
      return new Response(JSON.stringify({ error: 'Payload size limit exceeded' }), { 
        status: 400, 
        headers: securityHeaders 
      });
    }

    const secureId = await hashIdentifier(identifier);
    let paidData: any = await kv.get(`paid_v2_${secureId}`);
    
    if (!paidData) {
      return new Response(JSON.stringify({ error: 'Payment required: Please complete your purchase.' }), { 
        status: 402,
        headers: securityHeaders
      });
    }

    if (paidData.credits <= 0) {
      return new Response(JSON.stringify({ error: 'No credits remaining.' }), { 
        status: 402,
        headers: securityHeaders
      });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Service configuration error' }), { 
        status: 500, 
        headers: securityHeaders 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are an expert Indian Recruiter. Generate high-impact, professional documents using Indian English. Ensure JSON format output.`;

    const userPrompt = `
      CONTEXT:
      Full Name: ${userData.fullName}
      Target Role: ${userData.jobRole}
      Location: ${userData.location}
      Skills: ${userData.skills.join(', ')}
      EDUCATION: ${JSON.stringify(userData.education)}
      EXPERIENCE: ${JSON.stringify(userData.experience)}
      ${feedback ? `MODIFICATION: ${feedback}` : ""}
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

    const finalResult = JSON.parse(response.text || '{}');
    paidData.credits -= 1;
    await kv.set(`paid_v2_${secureId}`, paidData);
    finalResult.remainingCredits = paidData.credits;

    return new Response(JSON.stringify(finalResult), {
      status: 200,
      headers: securityHeaders
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Processing failed" }), { 
      status: 500,
      headers: securityHeaders
    });
  }
}