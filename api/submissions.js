import { getCloudData, saveCloudData, checkRateLimit } from './_kv.js';
import { setApiHeaders, requireAdmin, verifySession, getClientIp } from './_auth.js';

const SUBMISSIONS_KEY = 'kumite_submissions';

const DEMO_SUBMISSIONS = [
  {
    id: 'sub-demo-1',
    type: 'trial',
    name: 'Jānis Bērziņš (Demo)',
    phone: '+371 29000000',
    email: 'janis@demo.lv',
    message: 'Bērnam 7 gadi, vēlamies izmēģināt karatē treniņu.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'new',
  },
];

export default async function handler(req, res) {
  setApiHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Private PII — requires authenticated Admin session
    if (req.method === 'GET') {
      const session = await requireAdmin(req, res);
      if (!session) return;

      const submissions = await getCloudData(SUBMISSIONS_KEY, DEMO_SUBMISSIONS);
      return res.status(200).json({ success: true, submissions });
    }

    // POST: Public form submission (with honeypot & rate limit) OR Admin restore
    if (req.method === 'POST') {
      const body = req.body || {};
      const session = await verifySession(req);

      if (!session) {
        if (body.website || body.websiteHoneypot) {
          return res.status(200).json({ success: true, ignored: true });
        }
        const ip = getClientIp(req);
        const rl = await checkRateLimit(`sub:${ip}`, 12, 3600);
        if (!rl.allowed) {
          return res.status(429).json({
            success: false,
            message: 'Pārāk daudz pieteikumu. Lūdzu, mēģiniet vēlāk vai zvaniet mums.',
          });
        }
      }

      const name = String(body.name || '').trim().slice(0, 120);
      if (!name) {
        return res.status(400).json({ success: false, message: 'Vārds ir obligāts.' });
      }

      const newSubmission = {
        id:
          session && body.id
            ? String(body.id)
            : 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        type: body.type === 'contact' ? 'contact' : 'trial',
        name,
        phone: body.phone ? String(body.phone).trim().slice(0, 40) : undefined,
        email: body.email ? String(body.email).trim().slice(0, 160) : undefined,
        message: body.message ? String(body.message).trim().slice(0, 2000) : undefined,
        createdAt: session && body.createdAt ? String(body.createdAt) : new Date().toISOString(),
        status: session && body.status ? String(body.status) : 'new',
      };

      const submissions = await getCloudData(SUBMISSIONS_KEY, []);
      const baseList = Array.isArray(submissions) ? submissions : [];
      const deduped = baseList.filter((s) => String(s.id) !== String(newSubmission.id));
      const updated = [newSubmission, ...deduped];
      await saveCloudData(SUBMISSIONS_KEY, updated);

      return res.status(200).json({ success: true, submission: newSubmission });
    }

    // PUT: Admin status change
    if (req.method === 'PUT') {
      const session = await requireAdmin(req, res);
      if (!session) return;

      const { id, status } = req.body || {};
      if (!id || !['new', 'contacted', 'archived'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Nederīgs ID vai statuss.' });
      }

      const submissions = await getCloudData(SUBMISSIONS_KEY, DEMO_SUBMISSIONS);
      const updated = submissions.map((item) => (String(item.id) === String(id) ? { ...item, status } : item));
      await saveCloudData(SUBMISSIONS_KEY, updated);

      return res.status(200).json({ success: true, submissions: updated });
    }

    // DELETE: Admin deletion
    if (req.method === 'DELETE') {
      const session = await requireAdmin(req, res);
      if (!session) return;

      const id = req.query?.id ?? req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID ir obligāts.' });
      }

      const submissions = await getCloudData(SUBMISSIONS_KEY, DEMO_SUBMISSIONS);
      const updated = submissions.filter((item) => String(item.id) !== String(id));
      await saveCloudData(SUBMISSIONS_KEY, updated);

      return res.status(200).json({ success: true, submissions: updated });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Submissions API error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
