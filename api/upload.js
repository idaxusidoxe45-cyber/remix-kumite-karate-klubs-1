import crypto from 'node:crypto';
import { setApiHeaders, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  setApiHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

  if (cloudName && apiKey && apiSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'kumite-gallery';
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    return res.status(200).json({
      success: true,
      mode: 'cloudinary',
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    });
  }

  return res.status(200).json({
    success: true,
    mode: 'client-webp',
  });
}
