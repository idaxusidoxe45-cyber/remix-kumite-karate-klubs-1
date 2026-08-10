export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { type, name, phone, email, message, targetEmail } = req.body || {};

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const recipient = targetEmail || process.env.NOTIFICATION_EMAIL || 'u2086344644@gmail.com';

    console.log(`[FORM SUBMISSION] Type: ${type}, Name: ${name}, Phone: ${phone}, Email: ${email}, Message: ${message} -> Sending to: ${recipient}`);

    // If RESEND_API_KEY environment variable is configured in Vercel
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Kumite Karate Klubs <onboarding@resend.dev>',
            to: [recipient],
            subject: `Jauns pieteikums (${type === 'trial' ? 'Bezmaksas treniņš' : 'Kontaktforma'}): ${name}`,
            html: `
              <h2>Jauns pieteikums no mājaslapas</h2>
              <p><strong>Vārds:</strong> ${name}</p>
              <p><strong>Telefona numurs:</strong> ${phone || 'Nav norādīts'}</p>
              <p><strong>E-pasts:</strong> ${email || 'Nav norādīts'}</p>
              <p><strong>Ziņa / Bērna vecums:</strong> ${message || 'Nav norādīts'}</p>
              <hr />
              <p><small>Nosūtīts no Kumite Karate Klubs mājaslapas</small></p>
            `
          })
        });
        if (resendRes.ok) {
          return res.status(200).json({ success: true, message: 'Email sent successfully via Resend' });
        }
      } catch (err) {
        console.error('Resend API error:', err);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Application recorded successfully',
      data: { name, phone, email, message, recipient }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
}
