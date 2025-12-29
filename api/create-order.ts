import { PRICING } from "../constants";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const securityHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return new Response(JSON.stringify({ error: 'Gateway configuration error' }), { 
      status: 500, 
      headers: securityHeaders 
    });
  }

  try {
    const { packageType } = await req.json();
    const pkg = PRICING[packageType as keyof typeof PRICING];

    if (!pkg) {
      return new Response(JSON.stringify({ error: 'Invalid package' }), { 
        status: 400, 
        headers: securityHeaders 
      });
    }

    const auth = btoa(`${keyId}:${keySecret}`);
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: pkg.price * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      })
    });

    const order = await response.json();
    return new Response(JSON.stringify(order), { 
      status: 200, 
      headers: securityHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Order creation failed' }), { 
      status: 500, 
      headers: securityHeaders 
    });
  }
}