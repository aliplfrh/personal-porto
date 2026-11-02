import { getStore } from '@netlify/blobs';

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(req.url);
  const key = url.searchParams.get('key');

  if (!key) {
    return new Response('Missing key', { status: 400 });
  }

  const store = getStore('site-assets');
  const entry = await store.getWithMetadata(key, { type: 'arrayBuffer' });

  if (!entry) {
    return new Response('Not found', { status: 404 });
  }

  const contentType = (entry.metadata?.contentType as string) || 'application/octet-stream';

  return new Response(entry.data, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
