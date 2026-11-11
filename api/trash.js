import { getCloudData, saveCloudData } from './_kv.js';
import { setApiHeaders, requireAdmin } from './_auth.js';

const TRASH_KEY = 'kumite_trash_items';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function pruneExpired(items) {
  const now = Date.now();
  return (Array.isArray(items) ? items : []).filter((item) => {
    if (!item?.expiresAt) return true;
    const exp = new Date(item.expiresAt).getTime();
    return Number.isFinite(exp) && exp > now;
  });
}

export default async function handler(req, res) {
  setApiHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Every trash endpoint is strictly Admin-only
  const session = await requireAdmin(req, res);
  if (!session) return;

  try {
    // GET: Fetch trash items (auto-prunes items older than 30 days)
    if (req.method === 'GET') {
      const raw = await getCloudData(TRASH_KEY, []);
      const pruned = pruneExpired(raw);
      if (pruned.length !== (Array.isArray(raw) ? raw.length : 0)) {
        await saveCloudData(TRASH_KEY, pruned);
      }
      return res.status(200).json({ success: true, items: pruned });
    }

    // POST: Move item to trash
    if (req.method === 'POST') {
      const item = req.body;
      if (!item || !item.id || !['gallery', 'review', 'submission'].includes(item.type)) {
        return res.status(400).json({ success: false, message: 'Nederīgs atkritnes vienuma formāts.' });
      }

      const now = new Date();
      const expires = new Date(now.getTime() + THIRTY_DAYS_MS);

      const trashRecord = {
        ...item,
        deletedAt: item.deletedAt || now.toISOString(),
        expiresAt: item.expiresAt || expires.toISOString(),
      };

      const raw = await getCloudData(TRASH_KEY, []);
      const pruned = pruneExpired(raw);
      const filtered = pruned.filter((i) => String(i.id) !== String(trashRecord.id));
      const updated = [trashRecord, ...filtered];

      await saveCloudData(TRASH_KEY, updated);
      return res.status(200).json({ success: true, item: trashRecord, items: updated });
    }

    // DELETE: Permanently delete one item or clear entire trash
    if (req.method === 'DELETE') {
      const clearAll = req.query?.clearAll ?? req.body?.clearAll;
      const id = req.query?.id ?? req.body?.id;

      if (clearAll === 'true' || clearAll === true) {
        await saveCloudData(TRASH_KEY, []);
        return res.status(200).json({ success: true, items: [] });
      }

      if (!id) {
        return res.status(400).json({ success: false, message: 'ID ir obligāts.' });
      }

      const raw = await getCloudData(TRASH_KEY, []);
      const updated = (Array.isArray(raw) ? raw : []).filter((item) => String(item.id) !== String(id));
      await saveCloudData(TRASH_KEY, updated);

      return res.status(200).json({ success: true, items: updated });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Trash API error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
