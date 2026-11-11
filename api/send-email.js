import { getCloudData, checkRateLimit } from './_kv.js';
import { setApiHeaders, getClientIp } from './_auth.js';

const NOTIFICATION_EMAIL_KEY = 'kumite_notification_email';

function escapeHtml(input) {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  setApiHeaders(req, res, { allowCredentials: false });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};

    // Honeypot check
    if (body.website || body.websiteHoneypot) {
      return res.status(200).json({ success: true, ignored: true });
    }

    // Rate limit per IP to prevent abuse
    const ip = getClientIp(req);
    const rl = await checkRateLimit(`email:${ip}`, 10, 3600);
    if (!rl.allowed) {
      return res.status(429).json({
        success: false,
        message: 'Pārāk daudz pieprasījumu. Lūdzu, mēģiniet vēlāk.',
      });
    }

    const name = String(body.name || '').trim().slice(0, 120);
    if (!name) {
      return res.status(400).json({ success: false, message: 'Vārds ir obligāts.' });
    }

    const type = body.type === 'contact' ? 'contact' : 'trial';
    const phone = body.phone ? String(body.phone).trim().slice(0, 40) : '';
    const email = body.email ? String(body.email).trim().slice(0, 160) : '';
    const message = body.message ? String(body.message).trim().slice(0, 2000) : '';

    // SECURITY: Recipient is strictly server-controlled (never accepted from req.body)
    const kvEmail = await getCloudData(NOTIFICATION_EMAIL_KEY, null);
    const recipient =
      (typeof kvEmail === 'string' && kvEmail.includes('@') ? kvEmail : '') ||
      (process.env.NOTIFICATION_EMAIL || '').trim() ||
      'info@kumitekarate.lv';

    const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
    if (!resendApiKey) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'Resend API key not configured on server',
      });
    }

    const formTypeLabel =
      type === 'trial'
        ? 'Jauns pieteikums BEZMAKSAS izmēģinājuma treniņam'
        : 'Jauna ziņa no mājaslapas kontaktformas';

    const subject =
      type === 'trial'
        ? `Kumite Karate: Pieteikums treniņam - ${name}`
        : `Kumite Karate: Ziņa no mājaslapas - ${name}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0a0a0c; color: #ffffff; padding: 20px 24px; border-bottom: 4px solid #dc2626;">
          <h2 style="margin: 0; font-size: 20px;">KUMITE KARATE KLUBS — RĪGA</h2>
          <p style="margin: 4px 0 0; color: #f87171; font-size: 13px;">${escapeHtml(formTypeLabel)}</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p><strong>Vārds:</strong> ${escapeHtml(name)}</p>
          ${phone ? `<p><strong>Tālrunis:</strong> ${escapeHtml(phone)}</p>` : ''}
          ${email ? `<p><strong>E-pasts:</strong> ${escapeHtml(email)}</p>` : ''}
          ${
            message
              ? `<p><strong>Ziņa / Vecums:</strong><br/>${escapeHtml(message).replace(/\r?\n/g, '<br/>')}</p>`
              : ''
          }
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            Šī ziņa ir nosūtīta automātiski no <strong>kumitekarate.lv</strong> mājaslapas.
          </p>
        </div>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kumite Karate Klubs <onboarding@resend.dev>',
        to: [recipient],
        subject,
        html: htmlBody,
        ...(email ? { reply_to: email } : {}),
      }),
    });

    const data = await resendRes.json().catch(() => ({}));
    if (resendRes.ok) {
      return res.status(200).json({ success: true, id: data.id });
    }

    return res.status(502).json({
      success: false,
      fallback: true,
      message: data.message || 'Email delivery failed',
    });
  } catch (error) {
    console.error('Send-email API error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
