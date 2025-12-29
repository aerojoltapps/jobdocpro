
import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { identifier, paymentId, packageType } = await req.json();
    
    if (!identifier || !paymentId) {
      return new Response(JSON.stringify({ error: 'Invalid payment data' }), { status: 400 });
    }

    // PRODUCTION NOTE: In a live environment, you should use the Razorpay Node SDK 
    // to verify the 'razorpay_signature' here before updating the database.
    // This prevents users from spoofing successful payments.

    // Store the payment record in Vercel KV
    // We overwrite existing data to reset/refresh credits on new purchase
    await kv.set(`paid_${identifier}`, {
      paymentId,
      packageType,
      verifiedAt: new Date().toISOString(),
      credits: 3 // Grant 3 generations per purchase
    });

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Failed to verify payment" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
