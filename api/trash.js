import { getCloudData, saveCloudData } from './_kv.js';

const TRASH_KEY = 'kumite_trash_items';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function pruneExpired(items) {
  const now = Date.now();
  return (Array.isArray(items) ? items : []).filter(item => {
    if (!item.expiresAt) return true;
    const exp = new Date(item.expiresAt).getTime();
    return exp > now;
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Fetch trash items (auto-prunes items older than 30 days)
    if (req.method === 'GET') {
      const raw = await getCloudData(TRASH_KEY, []);
      const pruned = pruneExpired(raw);
      if (pruned.length !== raw.length) {
        await saveCloudData(TRASH_KEY, pruned);
      }
      return res.status(200).json({ success: true, items: pruned });
    }

    // POST: Move item to trash
    if (req.method === 'POST') {
      const item = req.body;
      if (!item || !item.id || !item.type) {
        return res.status(400).json({ message: 'Invalid trash item format' });
      }

      const now = new Date();
      const expires = new Date(now.getTime() + THIRTY_DAYS_MS);

      const trashRecord = {
        ...item,
        deletedAt: item.deletedAt || now.toISOString(),
        expiresAt: item.expiresAt || expires.toISOString()
      };

      const raw = await getCloudData(TRASH_KEY, []);
      const pruned = pruneExpired(raw);
      const filtered = pruned.filter(i => i.id !== trashRecord.id);
      const updated = [trashRecord, ...filtered];

      await saveCloudData(TRASH_KEY, updated);
      return res.status(200).json({ success: true, item: trashRecord, items: updated });
    }

    // DELETE: Permanently delete one item or clear entire trash
    if (req.method === 'DELETE') {
      const { id, clearAll } = req.query || req.body || {};

      if (clearAll === 'true' || clearAll === true) {
        await saveCloudData(TRASH_KEY, []);
        return res.status(200).json({ success: true, items: [] });
      }

      if (!id) {
        return res.status(400).json({ message: 'ID is required to delete item' });
      }

      const raw = await getCloudData(TRASH_KEY, []);
      const updated = raw.filter(item => String(item.id) !== String(id));
      await saveCloudData(TRASH_KEY, updated);

      return res.status(200).json({ success: true, items: updated });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
}
