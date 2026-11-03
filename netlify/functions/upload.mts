import { getStore } from '@netlify/blobs';
import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function verifyToken(token: string | null): boolean {
  const secret = Netlify.env.get('SESSION_SECRET');
  if (!token || !secret) return false;

  const [expiresAtStr, signature] = token.split('.');
  if (!expiresAtStr || !signature) return false;

  const expectedSignature = createHmac('sha256', secret).update(expiresAtStr).digest('hex');
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  const expiresAt = Number(expiresAtStr);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const fromType = file.type.split('/').pop();
  return fromType || 'bin';
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!verifyToken(token)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'Expected multipart form data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  if (!isImage && !isPdf) {
    return new Response(JSON.stringify({ error: 'Only image or PDF files are allowed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (file.size > MAX_SIZE) {
    return new Response(JSON.stringify({ error: 'File must be under 5MB' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // A fixed key (e.g. "resume") overwrites in place, so its public URL never changes.
  // Without one, each upload gets a unique key so files never collide.
  const requestedKey = form.get('key');
  const key =
    typeof requestedKey === 'string' && requestedKey.trim()
      ? requestedKey.trim()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file)}`;

  const store = getStore('site-assets');
  await store.set(key, file, { metadata: { contentType: file.type } });

  return new Response(JSON.stringify({ url: `/.netlify/functions/asset?key=${encodeURIComponent(key)}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
