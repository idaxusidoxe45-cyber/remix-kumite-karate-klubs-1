import { getCloudData, saveCloudData } from './_kv.js';
import { setApiHeaders, requireAdmin } from './_auth.js';

const GALLERY_KEY = 'kumite_custom_gallery';
const DELETED_IDS_KEY = 'kumite_gallery_deleted_ids';
const ALLOWED_CATEGORIES = new Set(['trenini', 'eksameni', 'sacensibas', 'nometnes', 'pasakumi', 'zale']);
const MAX_IMAGE_STR_LEN = 2_000_000; // ~1.5 MB binary after base64 overhead (well within 4.5 MB Vercel limit)

function isValidImageUrlOrData(val) {
  if (typeof val !== 'string' || !val || val.length > MAX_IMAGE_STR_LEN) return false;
  return (
    val.startsWith('https://') ||
    val.startsWith('/assets_') ||
    /^data:image\/(webp|jpeg|jpg|png);base64,/i.test(val)
  );
}

export default async function handler(req, res) {
  setApiHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Public list of custom gallery items & deleted built-in IDs
    if (req.method === 'GET') {
      const [items, deletedIds] = await Promise.all([
        getCloudData(GALLERY_KEY, []),
        getCloudData(DELETED_IDS_KEY, []),
      ]);
      return res.status(200).json({
        success: true,
        items: Array.isArray(items) ? items : [],
        deletedIds: Array.isArray(deletedIds) ? deletedIds : [],
      });
    }

    // POST: Admin adds or restores a gallery item
    if (req.method === 'POST') {
      const session = await requireAdmin(req, res);
      if (!session) return;

      const { id, title, category, caption, image, fullImage } = req.body || {};
      const cleanTitle = String(title || '').trim().slice(0, 120);
      const cleanImage = String(image || '').trim();
      const cleanFull = fullImage ? String(fullImage).trim() : cleanImage;

      if (!cleanTitle || !isValidImageUrlOrData(cleanImage) || !isValidImageUrlOrData(cleanFull)) {
        return res.status(400).json({
          success: false,
          message: 'Nederīgs nosaukums vai attēla formāts/izmērs (maks. ~1.5 MB pēc saspiešanas).',
        });
      }

      const [items, deletedIds] = await Promise.all([
        getCloudData(GALLERY_KEY, []),
        getCloudData(DELETED_IDS_KEY, []),
      ]);

      const idStr = id ? String(id) : 'gal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      // Remove from deleted blacklist (supports Trash restore for built-in photos too)
      const nextDeletedIds = (Array.isArray(deletedIds) ? deletedIds : []).filter((d) => String(d) !== idStr);
      await saveCloudData(DELETED_IDS_KEY, nextDeletedIds);

      const isBuiltInStatic = /^\d+$/.test(idStr) && cleanImage.startsWith('/assets_');
      let updatedItems = Array.isArray(items) ? items : [];

      if (!isBuiltInStatic) {
        const newItem = {
          id: idStr,
          title: cleanTitle,
          category: ALLOWED_CATEGORIES.has(category) ? category : 'trenini',
          caption: caption ? String(caption).trim().slice(0, 200) : cleanTitle,
          image: cleanImage,
          fullImage: cleanFull,
          createdAt: new Date().toISOString(),
        };
        const deduped = updatedItems.filter((item) => String(item.id) !== idStr);
        updatedItems = [newItem, ...deduped];
        await saveCloudData(GALLERY_KEY, updatedItems);
        return res.status(200).json({ success: true, item: newItem, items: updatedItems, deletedIds: nextDeletedIds });
      }

      return res.status(200).json({ success: true, restoredBuiltInId: idStr, items: updatedItems, deletedIds: nextDeletedIds });
    }

    // DELETE: Admin deletes custom item OR hides built-in photo globally
    if (req.method === 'DELETE') {
      const session = await requireAdmin(req, res);
      if (!session) return;

      const id = req.query?.id ?? req.body?.id;
      if (id === undefined || id === null || id === '') {
        return res.status(400).json({ success: false, message: 'ID is required' });
      }

      const idStr = String(id);
      const [items, deletedIds] = await Promise.all([
        getCloudData(GALLERY_KEY, []),
        getCloudData(DELETED_IDS_KEY, []),
      ]);

      const updatedItems = (Array.isArray(items) ? items : []).filter((item) => String(item.id) !== idStr);
      const isCustomId = idStr.startsWith('gal-') || idStr.startsWith('custom-');
      let nextDeletedIds = Array.isArray(deletedIds) ? deletedIds : [];
      if (!isCustomId && !nextDeletedIds.includes(idStr)) {
        nextDeletedIds = [...nextDeletedIds, idStr];
      }

      await Promise.all([
        saveCloudData(GALLERY_KEY, updatedItems),
        saveCloudData(DELETED_IDS_KEY, nextDeletedIds),
      ]);

      return res.status(200).json({ success: true, items: updatedItems, deletedIds: nextDeletedIds });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Gallery API error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
