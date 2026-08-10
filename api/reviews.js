// Serverless endpoint for managing and moderating reviews across devices

let memoryReviewsStore = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const KV_URL = process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  async function getCloudReviews() {
    if (KV_URL && KV_TOKEN) {
      try {
        const response = await fetch(`${KV_URL}/get/kumite_reviews`, {
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
    return memoryReviewsStore;
  }

  async function saveCloudReviews(reviews) {
    memoryReviewsStore = reviews;
    if (KV_URL && KV_TOKEN) {
      try {
        await fetch(`${KV_URL}/set/kumite_reviews`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${KV_TOKEN}` },
          body: JSON.stringify(JSON.stringify(reviews))
        });
      } catch (err) {
        console.error('KV Write Error:', err);
      }
    }
  }

  try {
    // GET: Fetch reviews
    if (req.method === 'GET') {
      const reviews = await getCloudReviews();
      return res.status(200).json({ success: true, reviews });
    }

    // POST: Create a new review (by visitor or admin)
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

      const reviews = await getCloudReviews();
      const updated = [newReview, ...reviews];
      await saveCloudReviews(updated);

      return res.status(200).json({ success: true, review: newReview });
    }

    // PUT: Update review status (e.g. 'draft' -> 'published')
    if (req.method === 'PUT') {
      const { id, status, text, author, role, rating } = req.body || {};
      if (!id) {
        return res.status(400).json({ message: 'ID required' });
      }

      const reviews = await getCloudReviews();
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
      await saveCloudReviews(updated);

      return res.status(200).json({ success: true, reviews: updated });
    }

    // DELETE: Delete a review
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ message: 'ID is required' });
      }

      const reviews = await getCloudReviews();
      const updated = reviews.filter(item => item.id !== Number(id) && item.id !== id);
      await saveCloudReviews(updated);

      return res.status(200).json({ success: true, reviews: updated });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
}
