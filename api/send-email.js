import { getCloudData, saveCloudData } from './_kv.js';

const SUBMISSIONS_KEY = 'kumite_submissions';

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
    const formTypeLabel = type === 'trial' ? 'Bezmaksas treniņš' : 'Kontaktforma / Pieteikums';

    console.log(`[FORM SUBMISSION] Type: ${type}, Name: ${name}, Phone: ${phone}, Email: ${email}, Message: ${message} -> Sending to: ${recipient}`);

    // 1. Save submission to Cloud Key-Value store
    try {
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

      const currentSubs = await getCloudData(SUBMISSIONS_KEY, []);
      const updatedSubs = [newSubmission, ...currentSubs];
      await saveCloudData(SUBMISSIONS_KEY, updatedSubs);
    } catch (dbErr) {
      console.error('Cloud DB Save Error:', dbErr);
    }

    // 2. Dispatch email via Resend if API key is set
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
            subject: `Jauns pieteikums (${formTypeLabel}): ${name}`,
            html: `
              <h2>Jauns pieteikums no mājaslapas</h2>
              <p><strong>Veids:</strong> ${formTypeLabel}</p>
              <p><strong>Vārds:</strong> ${name}</p>
              <p><strong>Telefona numurs:</strong> ${phone || 'Nav norādīts'}</p>
              <p><strong>E-pasts:</strong> ${email || 'Nav norādīts'}</p>
              <p><strong>Ziņa / Vecums:</strong> ${message || 'Nav norādīts'}</p>
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

    // 3. Dispatch email via Web3Forms API fallback (Guaranteed direct delivery)
    try {
      const web3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '6b63c7b3-85f0-4c3e-bfa1-e631d87e0766',
          subject: `Jauns pieteikums (${formTypeLabel}): ${name}`,
          from_name: 'Kumite Karate Klubs',
          to_email: recipient,
          name: name,
          phone: phone || 'Nav norādīts',
          email: email || 'Nav norādīts',
          message: message || 'Nav norādīts',
          type: type
        })
      });

      if (web3Res.ok) {
        return res.status(200).json({ success: true, message: 'Email sent successfully via Web3Forms' });
      }
    } catch (web3Err) {
      console.error('Web3Forms API error:', web3Err);
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
