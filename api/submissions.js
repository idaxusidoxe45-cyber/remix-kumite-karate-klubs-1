// Serverless endpoint for fetching, updating, and deleting form submissions
// Works with Cloud DB / Upstash / KV / In-Memory & File persistence

let memorySubmissionsStore = [
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

  // Use Upstash / KV / Firebase if environment key configured
  const KV_URL = process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  async function getCloudSubmissions() {
    if (KV_URL && KV_TOKEN) {
      try {
        const response = await fetch(`${KV_URL}/get/kumite_submissions`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        const json = await response.json();
        if (json.result) {
          return JSON.parse(json.result);
        }
      } catch (err) {
        console.error('KV Read Error:', err);
      }
    }
    return memorySubmissionsStore;
  }

  async function saveCloudSubmissions(submissions) {
    memorySubmissionsStore = submissions;
    if (KV_URL && KV_TOKEN) {
      try {
        await fetch(`${KV_URL}/set/kumite_submissions`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${KV_TOKEN}` },
          body: JSON.stringify(JSON.stringify(submissions))
        });
      } catch (err) {
        console.error('KV Write Error:', err);
      }
    }
  }

  try {
    // GET: Fetch all form submissions
    if (req.method === 'GET') {
      const submissions = await getCloudSubmissions();
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

      const submissions = await getCloudSubmissions();
      const updated = [newSubmission, ...submissions];
      await saveCloudSubmissions(updated);

      return res.status(200).json({ success: true, submission: newSubmission });
    }

    // PUT: Update status (e.g. 'new' -> 'contacted')
    if (req.method === 'PUT') {
      const { id, status } = req.body || {};
      if (!id || !status) {
        return res.status(400).json({ message: 'ID and status required' });
      }

      const submissions = await getCloudSubmissions();
      const updated = submissions.map(item => item.id === id ? { ...item, status } : item);
      await saveCloudSubmissions(updated);

      return res.status(200).json({ success: true, submissions: updated });
    }

    // DELETE: Delete a submission
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ message: 'ID is required' });
      }

      const submissions = await getCloudSubmissions();
      const updated = submissions.filter(item => item.id !== id);
      await saveCloudSubmissions(updated);

      return res.status(200).json({ success: true, submissions: updated });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
}
