import { getCloudData, saveCloudData } from './_kv.js';

const GALLERY_KEY = 'kumite_custom_gallery';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Fetch custom gallery items
    if (req.method === 'GET') {
      const items = await getCloudData(GALLERY_KEY, []);
      return res.status(200).json({ success: true, items });
    }

    // POST: Create a new gallery item (supports base64 data URLs or image URLs)
    if (req.method === 'POST') {
      const { title, category, caption, image, fullImage } = req.body || {};
      if (!title || !image) {
        return res.status(400).json({ message: 'Title and image are required' });
      }

      const newItem = {
        id: 'gal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        title: String(title).trim(),
        category: category || 'trenini',
        caption: caption ? String(caption).trim() : String(title).trim(),
        image: String(image).trim(),
        fullImage: fullImage ? String(fullImage).trim() : String(image).trim(),
        createdAt: new Date().toISOString()
      };

      const items = await getCloudData(GALLERY_KEY, []);
      const updated = [newItem, ...items];
      await saveCloudData(GALLERY_KEY, updated);

      return res.status(200).json({ success: true, item: newItem, items: updated });
    }

    // DELETE: Delete a gallery item
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ message: 'ID is required' });
      }

      const items = await getCloudData(GALLERY_KEY, []);
      const updated = items.filter(item => String(item.id) !== String(id));
      await saveCloudData(GALLERY_KEY, updated);

      return res.status(200).json({ success: true, items: updated });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
}
