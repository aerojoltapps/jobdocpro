import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

// Standardized hashing for consistent KV keys across all API routes
async function hashIdentifier(id: string): Promise<string> {
  const normalized = id.toLowerCase().trim();
  const msgBuffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const text = orderId + "|" + paymentId;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureData = encoder.encode(text);
  const hmac = await crypto.subtle.sign("HMAC", key, signatureData);
  const digest = Array.from(new Uint8Array(hmac))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return digest === signature;
}

export default async function handler(req: Request) {
  const securityHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return new Response(JSON.stringify({ error: 'Server configuration error: Key Secret missing.' }), { 
      status: 500, 
      headers: securityHeaders 
    });
  }

  try {
    const { identifier, paymentId, orderId, signature } = await req.json();
    
    if (!identifier || !paymentId || !orderId || !signature) {
      return new Response(JSON.stringify({ error: 'Missing required payment verification fields.' }), { 
        status: 400, 
        headers: securityHeaders 
      });
    }

    const isValid = await verifyRazorpaySignature(orderId, paymentId, signature, keySecret);
    if (!isValid) {
      console.warn(`Payment signature mismatch for identifier: ${identifier}`);
      return new Response(JSON.stringify({ error: 'Payment signature could not be verified.' }), { 
        status: 403, 
        headers: securityHeaders 
      });
    }

    const secureId = await hashIdentifier(identifier);
    // Default to 3 credits for initial purchase
    await kv.set(`paid_v2_${secureId}`, {
      verifiedAt: new Date().toISOString(),
      credits: 3,
      lastPaymentId: paymentId
    });

    return new Response(JSON.stringify({ success: true, identifier: secureId }), { 
      status: 200, 
      headers: securityHeaders
    });
  } catch (error: any) {
    console.error("Verify API Error:", error);
    return new Response(JSON.stringify({ error: "Internal verification failure." }), { 
      status: 500,
      headers: securityHeaders
    });
  }
}