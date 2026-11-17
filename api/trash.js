import { getCloudData, saveCloudData } from './_kv.js';
import { setApiHeaders, requireAdmin } from './_auth.js';

const TRASH_KEY = 'kumite_trash_items';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_TRASH_ITEMS = 100;
const MAX_DATA_JSON_LEN = 2_500_000;

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

      const serializedData = JSON.stringify(item.data ?? {});
      if (serializedData.length > MAX_DATA_JSON_LEN) {
        return res.status(413).json({ success: false, message: 'Vienuma dati ir pārāk lieli.' });
      }

      const now = new Date();
      const expires = new Date(now.getTime() + THIRTY_DAYS_MS);

      const trashRecord = {
        id: String(item.id).slice(0, 80),
        originalId: item.originalId !== undefined ? String(item.originalId).slice(0, 80) : String(item.id).slice(0, 80),
        type: item.type,
        title: String(item.title || 'Nenosaukts elements').trim().slice(0, 160),
        subtitle: item.subtitle ? String(item.subtitle).trim().slice(0, 200) : undefined,
        previewImage:
          typeof item.previewImage === 'string' && item.previewImage.length <= MAX_DATA_JSON_LEN
            ? item.previewImage
            : undefined,
        data: item.data ?? {},
        deletedAt: typeof item.deletedAt === 'string' ? item.deletedAt.slice(0, 40) : now.toISOString(),
        expiresAt: typeof item.expiresAt === 'string' ? item.expiresAt.slice(0, 40) : expires.toISOString(),
      };

      const raw = await getCloudData(TRASH_KEY, []);
      const pruned = pruneExpired(raw);
      const filtered = pruned.filter((i) => String(i.id) !== String(trashRecord.id));
      const updated = [trashRecord, ...filtered].slice(0, MAX_TRASH_ITEMS);

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
