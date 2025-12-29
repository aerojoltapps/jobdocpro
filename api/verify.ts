import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

const KV_PREFIX = 'jdp_verified_v5_';

async function hashIdentifier(id: string): Promise<string> {
  const normalized = id.toLowerCase().replace(/\s+/g, '');
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
    "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signatureData = encoder.encode(text);
  const hmac = await crypto.subtle.sign("HMAC", key, signatureData);
  const digest = Array.from(new Uint8Array(hmac)).map(b => b.toString(16).padStart(2, "0")).join("");
  return digest === signature;
}

export default async function handler(req: Request) {
  const headers = { 'Content-Type': 'application/json', 'X-Frame-Options': 'DENY' };
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return new Response(JSON.stringify({ error: 'Config error' }), { status: 500, headers });

  try {
    const { identifier, paymentId, orderId, signature } = await req.json();
    if (!identifier || !paymentId || !orderId || !signature) return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400, headers });

    const isValid = await verifyRazorpaySignature(orderId, paymentId, signature, keySecret);
    if (!isValid) return new Response(JSON.stringify({ error: 'Auth failed' }), { status: 403, headers });

    const secureId = await hashIdentifier(identifier);
    await kv.set(`${KV_PREFIX}${secureId}`, {
      verifiedAt: new Date().toISOString(),
      credits: 3,
      paymentId
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Verification error" }), { status: 500, headers });
  }
}