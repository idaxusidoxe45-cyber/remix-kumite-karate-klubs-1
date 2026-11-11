import { getCloudData, saveCloudData, checkRateLimit } from './_kv.js';
import { setApiHeaders, requireAdmin, verifySession, getClientIp } from './_auth.js';

const REVIEWS_KEY = 'kumite_reviews';
const REVIEWS_OVERRIDES_KEY = 'kumite_reviews_overrides';

export default async function handler(req, res) {
  setApiHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Public returns published cloud reviews & visibility overrides; Admin gets all
    if (req.method === 'GET') {
      const session = await verifySession(req);
      const [reviews, overrides] = await Promise.all([
        getCloudData(REVIEWS_KEY, []),
        getCloudData(REVIEWS_OVERRIDES_KEY, {}),
      ]);

      if (session) {
        return res.status(200).json({ success: true, reviews, overrides });
      }

      const published = (Array.isArray(reviews) ? reviews : []).filter(
        (r) => r.status === 'published' && !overrides?.[String(r.id)]?.deleted
      );
      const safeOverrides = {};
      if (overrides && typeof overrides === 'object') {
        for (const [k, v] of Object.entries(overrides)) {
          if (v && (v.deleted || v.status === 'draft' || v.status === 'rejected' || v.status === 'published')) {
            safeOverrides[k] = {
              status: v.status,
              deleted: Boolean(v.deleted),
              ...(v.author ? { author: v.author } : {}),
              ...(v.text ? { text: v.text } : {}),
              ...(v.role !== undefined ? { role: v.role } : {}),
              ...(v.rating ? { rating: v.rating } : {}),
            };
          }
        }
      }
      return res.status(200).json({ success: true, reviews: published, overrides: safeOverrides });
    }

    // POST: Public submits draft (rate-limited + honeypot) OR Admin adds/restores
    if (req.method === 'POST') {
      const session = await verifySession(req);
      const body = req.body || {};

      if (!session) {
        if (body.website || body.websiteHoneypot) {
          return res.status(200).json({ success: true, ignored: true });
        }
        const ip = getClientIp(req);
        const rl = await checkRateLimit(`rev:${ip}`, 5, 3600);
        if (!rl.allowed) {
          return res.status(429).json({
            success: false,
            message: 'Pārāk daudz atsauksmju īsā laikā. Lūdzu, mēģiniet vēlāk.',
          });
        }
      }

      const author = String(body.author || '').trim().slice(0, 80);
      const text = String(body.text || '').trim().slice(0, 1500);
      if (!author || !text) {
        return res.status(400).json({ success: false, message: 'Vārds un atsauksme ir obligāti.' });
      }

      const ratingNum = Math.min(5, Math.max(1, Number(body.rating) || 5));
      const desiredStatus =
        session && ['published', 'draft', 'rejected'].includes(body.status) ? body.status : 'draft';

      const id = session && body.id !== undefined ? body.id : Date.now();
      const newReview = {
        id,
        author,
        role: body.role ? String(body.role).trim().slice(0, 60) : undefined,
        text,
        rating: ratingNum,
        status: desiredStatus,
        createdAt: session && body.createdAt ? String(body.createdAt) : new Date().toISOString(),
      };

      const [reviews, overrides] = await Promise.all([
        getCloudData(REVIEWS_KEY, []),
        getCloudData(REVIEWS_OVERRIDES_KEY, {}),
      ]);

      const nextOverrides = { ...(overrides || {}) };
      const idStr = String(id);
      if (nextOverrides[idStr]) {
        delete nextOverrides[idStr].deleted;
        nextOverrides[idStr].status = desiredStatus;
        await saveCloudData(REVIEWS_OVERRIDES_KEY, nextOverrides);
      }

      // Built-in IDs (< 30000) don't need duplicating into kumite_reviews unless newly restored/custom
      const isBuiltInId = typeof id === 'number' && id > 0 && id < 30000;
      let updated = Array.isArray(reviews) ? reviews : [];
      if (!isBuiltInId || body.isCustom) {
        const deduped = updated.filter((r) => String(r.id) !== idStr);
        updated = [newReview, ...deduped];
        await saveCloudData(REVIEWS_KEY, updated);
      }

      return res.status(200).json({ success: true, review: newReview });
    }

    // PUT: Admin updates/moderates any review (cloud or built-in)
    if (req.method === 'PUT') {
      const session = await requireAdmin(req, res);
      if (!session) return;

      const { id, status, text, author, role, rating } = req.body || {};
      if (id === undefined || id === null || id === '') {
        return res.status(400).json({ success: false, message: 'ID required' });
      }

      const idStr = String(id);
      const [reviews, overrides] = await Promise.all([
        getCloudData(REVIEWS_KEY, []),
        getCloudData(REVIEWS_OVERRIDES_KEY, {}),
      ]);

      const updatedReviews = (Array.isArray(reviews) ? reviews : []).map((item) => {
        if (String(item.id) === idStr) {
          return {
            ...item,
            ...(status && { status }),
            ...(text && { text: String(text).trim().slice(0, 1500) }),
            ...(author && { author: String(author).trim().slice(0, 80) }),
            ...(role !== undefined && { role: String(role).trim().slice(0, 60) }),
            ...(rating && { rating: Math.min(5, Math.max(1, Number(rating))) }),
          };
        }
        return item;
      });

      const nextOverrides = { ...(overrides || {}) };
      nextOverrides[idStr] = {
        ...(nextOverrides[idStr] || {}),
        ...(status && { status }),
        ...(text && { text: String(text).trim().slice(0, 1500) }),
        ...(author && { author: String(author).trim().slice(0, 80) }),
        ...(role !== undefined && { role: String(role).trim().slice(0, 60) }),
        ...(rating && { rating: Math.min(5, Math.max(1, Number(rating))) }),
        deleted: false,
      };

      await Promise.all([
        saveCloudData(REVIEWS_KEY, updatedReviews),
        saveCloudData(REVIEWS_OVERRIDES_KEY, nextOverrides),
      ]);

      return res.status(200).json({ success: true, reviews: updatedReviews, overrides: nextOverrides });
    }

    // DELETE: Admin deletes review (or marks built-in review as deleted globally)
    if (req.method === 'DELETE') {
      const session = await requireAdmin(req, res);
      if (!session) return;

      const id = req.query?.id ?? req.body?.id;
      if (id === undefined || id === null || id === '') {
        return res.status(400).json({ success: false, message: 'ID is required' });
      }

      const idStr = String(id);
      const [reviews, overrides] = await Promise.all([
        getCloudData(REVIEWS_KEY, []),
        getCloudData(REVIEWS_OVERRIDES_KEY, {}),
      ]);

      const updatedReviews = (Array.isArray(reviews) ? reviews : []).filter((item) => String(item.id) !== idStr);
      const nextOverrides = {
        ...(overrides || {}),
        [idStr]: {
          ...(overrides?.[idStr] || {}),
          deleted: true,
        },
      };

      await Promise.all([
        saveCloudData(REVIEWS_KEY, updatedReviews),
        saveCloudData(REVIEWS_OVERRIDES_KEY, nextOverrides),
      ]);

      return res.status(200).json({ success: true, reviews: updatedReviews, overrides: nextOverrides });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Reviews API error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
