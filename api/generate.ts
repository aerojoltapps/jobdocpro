import { GoogleGenAI, Type } from "@google/genai";
import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

const MAX_ARRAY_SIZE = 10;

// Standardized hashing for consistent KV keys across all API routes
async function hashIdentifier(id: string): Promise<string> {
  const normalized = id.toLowerCase().trim();
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

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  if (!hasKV) {
    return new Response(JSON.stringify({ error: 'System configuration error: Storage missing.' }), { 
      status: 500, 
      headers: securityHeaders
    });
  }

  try {
    const { userData, feedback, identifier } = await req.json();

    if (!identifier) {
      return new Response(JSON.stringify({ error: 'Missing user identifier. Please refresh and try again.' }), { 
        status: 400, 
        headers: securityHeaders 
      });
    }

    if (!userData || !userData.email || !userData.phone) {
      return new Response(JSON.stringify({ error: 'Incomplete user profile.' }), { 
        status: 400, 
        headers: securityHeaders 
      });
    }

    // Safety checks for payload size
    if (userData.fullName.length > 200 || (feedback && feedback.length > 500)) {
      return new Response(JSON.stringify({ error: 'Input exceeds safety limits.' }), { 
        status: 400, 
        headers: securityHeaders 
      });
    }

    const secureId = await hashIdentifier(identifier);
    // Retrieve paid status from KV using the standardized hashed key
    let paidData: any = await kv.get(`paid_v2_${secureId}`);
    
    // Detailed payment check
    if (!paidData) {
      return new Response(JSON.stringify({ error: 'Payment required: Please complete your purchase.' }), { 
        status: 402,
        headers: securityHeaders
      });
    }

    if (typeof paidData.credits !== 'number' || paidData.credits <= 0) {
      return new Response(JSON.stringify({ error: 'No generation credits remaining. Please upgrade your pack.' }), { 
        status: 402,
        headers: securityHeaders
      });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI Service configuration missing.' }), { 
        status: 500, 
        headers: securityHeaders 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are an expert Indian Recruiter. Generate high-impact, professional documents using Indian English. Ensure JSON format output matches the requested schema exactly.`;

    const userPrompt = `
      USER DATA:
      Full Name: ${userData.fullName}
      Target Role: ${userData.jobRole}
      Location: ${userData.location}
      Skills: ${userData.skills.join(', ')}
      EDUCATION: ${JSON.stringify(userData.education)}
      EXPERIENCE: ${JSON.stringify(userData.experience)}
      
      MODIFICATION REQUEST: ${feedback || "None"}
      
      TASK: Generate high-impact Resume Summary, Experience Bullets (3-4 impactful points per role), Cover Letter, and LinkedIn profile sections.
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
    
    // Deduct credit only on successful generation
    paidData.credits -= 1;
    await kv.set(`paid_v2_${secureId}`, paidData);
    
    finalResult.remainingCredits = paidData.credits;

    return new Response(JSON.stringify(finalResult), {
      status: 200,
      headers: securityHeaders
    });

  } catch (error: any) {
    console.error("Generate API Error:", error);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), { 
      status: 500,
      headers: securityHeaders
    });
  }
}