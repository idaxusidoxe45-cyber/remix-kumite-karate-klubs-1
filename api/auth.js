import { getCloudData, saveCloudData, isKvConfigured, checkRateLimit } from './_kv.js';
import {
  PASS_HASH_KEY,
  setApiHeaders,
  getClientIp,
  getConfiguredCredential,
  verifyAdminPassword,
  hashPasswordScrypt,
  createSessionToken,
  verifySession,
  appendSessionCookie,
  clearSessionCookie,
  requireAdmin,
} from './_auth.js';

export const NOTIFICATION_EMAIL_KEY = 'kumite_notification_email';

async function getSafeNotificationEmail() {
  const kvEmail = await getCloudData(NOTIFICATION_EMAIL_KEY, null);
  if (typeof kvEmail === 'string' && kvEmail.includes('@')) return kvEmail;
  return (process.env.NOTIFICATION_EMAIL || 'info@kumitekarate.lv').trim();
}

export default async function handler(req, res) {
  setApiHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const cred = await getConfiguredCredential();
      const session = cred ? await verifySession(req) : null;
      const response = {
        success: true,
        authenticated: Boolean(session),
        needsSetup: !cred,
        hasKv: isKvConfigured(),
      };
      if (session) {
        response.notificationEmail = await getSafeNotificationEmail();
      }
      return res.status(200).json(response);
    }

    if (req.method === 'POST') {
      const action = req.query?.action || req.body?.action || 'login';

      if (action === 'logout') {
        clearSessionCookie(req, res);
        return res.status(200).json({ success: true });
      }

      if (action === 'setup') {
        const existing = await getConfiguredCredential();
        if (existing) {
          return res.status(403).json({
            success: false,
            message: 'Sākotnējā parole jau ir iestatīta.',
          });
        }
        if (!isKvConfigured()) {
          return res.status(503).json({
            success: false,
            message: 'Datubāze (Upstash KV) nav konfigurēta — iestatiet ADMIN_PASSWORD vides mainīgo.',
          });
        }

        const newPass = String(req.body?.password || '');
        if (newPass.length < 8) {
          return res.status(400).json({
            success: false,
            message: 'Parolei jābūt vismaz 8 simbolus garai.',
          });
        }

        const { salt, hash } = hashPasswordScrypt(newPass);
        const record = { salt, hash, version: 1, updatedAt: new Date().toISOString() };
        await saveCloudData(PASS_HASH_KEY, record);

        const token = await createSessionToken(record.version);
        appendSessionCookie(req, res, token);
        return res.status(200).json({
          success: true,
          authenticated: true,
          notificationEmail: await getSafeNotificationEmail(),
        });
      }

      if (action === 'login') {
        const ip = getClientIp(req);
        const rl = await checkRateLimit(`login:${ip}`, 6, 15 * 60);
        if (!rl.allowed) {
          return res.status(429).json({
            success: false,
            message: 'Pārāk daudz neveiksmīgu mēģinājumu. Mēģiniet vēlreiz pēc 15 minūtēm.',
          });
        }

        const username = String(req.body?.username || '').trim().toLowerCase();
        const password = String(req.body?.password || '');

        if (username !== 'admin') {
          return res.status(401).json({ success: false, message: 'Nepareizs lietotājvārds vai parole!' });
        }

        const result = await verifyAdminPassword(password);
        if (result.needsSetup) {
          return res.status(428).json({
            success: false,
            needsSetup: true,
            message: 'Vispirms izveidojiet administratora paroli.',
          });
        }

        if (!result.ok) {
          return res.status(401).json({ success: false, message: 'Nepareizs lietotājvārds vai parole!' });
        }

        const token = await createSessionToken(result.version);
        appendSessionCookie(req, res, token);
        return res.status(200).json({
          success: true,
          authenticated: true,
          notificationEmail: await getSafeNotificationEmail(),
        });
      }

      if (action === 'change-password') {
        const session = await requireAdmin(req, res);
        if (!session) return;

        const currentPassword = String(req.body?.currentPassword || '');
        const newPassword = String(req.body?.newPassword || '');

        const currentCheck = await verifyAdminPassword(currentPassword);
        if (!currentCheck.ok) {
          return res.status(403).json({
            success: false,
            message: 'Pašreizējā parole ir nepareiza.',
          });
        }

        if (newPassword.length < 8) {
          return res.status(400).json({
            success: false,
            message: 'Jaunajai parolei jābūt vismaz 8 simbolus garai.',
          });
        }

        const nextVersion = Number(currentCheck.version || 1) + 1;
        const { salt, hash } = hashPasswordScrypt(newPassword);
        await saveCloudData(PASS_HASH_KEY, {
          salt,
          hash,
          version: nextVersion,
          updatedAt: new Date().toISOString(),
        });

        const token = await createSessionToken(nextVersion);
        appendSessionCookie(req, res, token);
        return res.status(200).json({ success: true, message: 'Parole veiksmīgi nomainīta!' });
      }

      if (action === 'update-settings') {
        const session = await requireAdmin(req, res);
        if (!session) return;

        const email = String(req.body?.notificationEmail || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
          return res.status(400).json({
            success: false,
            message: 'Lūdzu, ievadiet derīgu e-pasta adresi.',
          });
        }

        await saveCloudData(NOTIFICATION_EMAIL_KEY, email);
        return res.status(200).json({ success: true, notificationEmail: email });
      }

      return res.status(400).json({ success: false, message: 'Nezināma darbība.' });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ success: false, message: 'Servera kļūda' });
  }
}
