import { getCloudData, saveCloudData } from './_kv.js';

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
    status: 'new'
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Fetch all form submissions
    if (req.method === 'GET') {
      const submissions = await getCloudData(SUBMISSIONS_KEY, DEMO_SUBMISSIONS);
      return res.status(200).json({ success: true, submissions });
    }

    // POST: Create a new submission
    if (req.method === 'POST') {
      const { type, name, phone, email, message } = req.body || {};
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      const newSubmission = {
        id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        type: type || 'trial',
        name: String(name).trim(),
        phone: phone ? String(phone).trim() : undefined,
        email: email ? String(email).trim() : undefined,
        message: message ? String(message).trim() : undefined,
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      const submissions = await getCloudData(SUBMISSIONS_KEY, DEMO_SUBMISSIONS);
      const updated = [newSubmission, ...submissions];
      await saveCloudData(SUBMISSIONS_KEY, updated);

      return res.status(200).json({ success: true, submission: newSubmission });
    }

    // PUT: Update status
    if (req.method === 'PUT') {
      const { id, status } = req.body || {};
      if (!id || !status) {
        return res.status(400).json({ message: 'ID and status required' });
      }

      const submissions = await getCloudData(SUBMISSIONS_KEY, DEMO_SUBMISSIONS);
      const updated = submissions.map(item => item.id === id ? { ...item, status } : item);
      await saveCloudData(SUBMISSIONS_KEY, updated);

      return res.status(200).json({ success: true, submissions: updated });
    }

    // DELETE: Delete a submission
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ message: 'ID is required' });
      }

      const submissions = await getCloudData(SUBMISSIONS_KEY, DEMO_SUBMISSIONS);
      const updated = submissions.filter(item => item.id !== id);
      await saveCloudData(SUBMISSIONS_KEY, updated);

      return res.status(200).json({ success: true, submissions: updated });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
}
