export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { author, role, rating, text } = req.body || {};

    if (!author || !text) {
      return res.status(400).json({ message: 'Author and text are required' });
    }

    const reviewData = {
      author,
      role: role || 'Vecāks',
      text,
      rating: Number(rating) || 5,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    // Return success message
    return res.status(200).json({
      success: true,
      message: 'Atsauksme veiksmīgi saņemta un nosūtīta uz moderāciju!',
      review: reviewData
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
}
