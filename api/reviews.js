import { getCloudData, saveCloudData } from './_kv.js';

const REVIEWS_KEY = 'kumite_reviews';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Fetch reviews
    if (req.method === 'GET') {
      const reviews = await getCloudData(REVIEWS_KEY, []);
      return res.status(200).json({ success: true, reviews });
    }

    // POST: Create a new review
    if (req.method === 'POST') {
      const { author, role, text, rating, status } = req.body || {};
      if (!author || !text) {
        return res.status(400).json({ message: 'Author and text required' });
      }

      const newReview = {
        id: Date.now(),
        author: String(author).trim(),
        role: role ? String(role).trim() : undefined,
        text: String(text).trim(),
        rating: Number(rating) || 5,
        status: status || 'draft',
        createdAt: new Date().toISOString()
      };

      const reviews = await getCloudData(REVIEWS_KEY, []);
      const updated = [newReview, ...reviews];
      await saveCloudData(REVIEWS_KEY, updated);

      return res.status(200).json({ success: true, review: newReview });
    }

    // PUT: Update review status
    if (req.method === 'PUT') {
      const { id, status, text, author, role, rating } = req.body || {};
      if (!id) {
        return res.status(400).json({ message: 'ID required' });
      }

      const reviews = await getCloudData(REVIEWS_KEY, []);
      const updated = reviews.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...(status && { status }),
            ...(text && { text }),
            ...(author && { author }),
            ...(role !== undefined && { role }),
            ...(rating && { rating })
          };
        }
        return item;
      });
      await saveCloudData(REVIEWS_KEY, updated);

      return res.status(200).json({ success: true, reviews: updated });
    }

    // DELETE: Delete a review
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ message: 'ID is required' });
      }

      const reviews = await getCloudData(REVIEWS_KEY, []);
      const updated = reviews.filter(item => item.id !== Number(id) && item.id !== id);
      await saveCloudData(REVIEWS_KEY, updated);

      return res.status(200).json({ success: true, reviews: updated });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
}
