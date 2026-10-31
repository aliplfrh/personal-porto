import { createHmac, timingSafeEqual } from 'node:crypto';

// Constant-time string compare so a wrong-length guess can't be timed to learn anything.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validUser = Netlify.env.get('ADMIN_USERNAME');
  const validPass = Netlify.env.get('ADMIN_PASSWORD');
  const secret = Netlify.env.get('SESSION_SECRET');

  if (!validUser || !validPass || !secret) {
    return new Response(JSON.stringify({ error: 'Admin login is not configured on the server.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const username = body.username || '';
  const password = body.password || '';

  const ok = safeEqual(username, validUser) && safeEqual(password, validPass);

  if (!ok) {
    return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const expiresAt = Date.now() + SESSION_TTL_MS;
  const signature = createHmac('sha256', secret).update(String(expiresAt)).digest('hex');
  const token = `${expiresAt}.${signature}`;

  return new Response(JSON.stringify({ token, expiresAt }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
