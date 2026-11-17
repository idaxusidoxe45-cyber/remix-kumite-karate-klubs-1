import crypto from 'node:crypto';
import { getCloudData, saveCloudData } from './_kv.js';

export const PASS_HASH_KEY = 'kumite_admin_pass_hash';
export const SESSION_SECRET_KEY = 'kumite_admin_session_secret';
export const SESSION_COOKIE_NAME = 'kumite_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

let cachedProcessSecret = '';

export function setApiHeaders(req, res, { allowCredentials = true } = {}) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const origin = req.headers.origin;
  const reqHost = String(req.headers.host || '').split(':')[0].toLowerCase();
  if (origin) {
    let allowed = false;
    try {
      const url = new URL(origin);
      const host = url.hostname.toLowerCase();
      if (
        (reqHost && host === reqHost) ||
        host === 'kumitekarate.lv' ||
        host === 'www.kumitekarate.lv' ||
        (host.startsWith('remix-kumite-karate-klubs-') && host.endsWith('.vercel.app')) ||
        host === 'localhost' ||
        host === '127.0.0.1'
      ) {
        allowed = true;
      }
    } catch {
      allowed = false;
    }

    if (allowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      if (allowCredentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export async function getSessionSecret() {
  const envSecret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  if (envSecret.length >= 16) return envSecret;

  const kvSecret = await getCloudData(SESSION_SECRET_KEY, null);
  if (typeof kvSecret === 'string' && kvSecret.length >= 32) {
    return kvSecret;
  }

  const envCred = (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD || '').trim();
  if (envCred) {
    return crypto.scryptSync(envCred, 'kumite-admin-session-v1', 32).toString('hex');
  }

  if (!cachedProcessSecret) {
    cachedProcessSecret = crypto.randomBytes(32).toString('hex');
  }
  await saveCloudData(SESSION_SECRET_KEY, cachedProcessSecret);
  return cachedProcessSecret;
}

export function hashPasswordScrypt(password, saltHex = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(String(password), saltHex, 64).toString('hex');
  return { salt: saltHex, hash: derived };
}

export function timingSafeEqualHex(aHex, bHex) {
  if (!aHex || !bHex || aHex.length !== bHex.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(aHex, 'hex'), Buffer.from(bHex, 'hex'));
  } catch {
    return false;
  }
}

export function timingSafeEqualText(a, b) {
  const bufA = crypto.createHash('sha256').update(String(a || '')).digest();
  const bufB = crypto.createHash('sha256').update(String(b || '')).digest();
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Resolves current active credential source:
 * 1) KV salted scrypt hash (`kumite_admin_pass_hash`)
 * 2) Env `ADMIN_PASSWORD_HASH` (`salt:hex`)
 * 3) Env `ADMIN_PASSWORD` (plaintext env var)
 * Returns null if first-run setup is required.
 */
export async function getConfiguredCredential() {
  const kvRecord = await getCloudData(PASS_HASH_KEY, null);
  if (kvRecord && typeof kvRecord.salt === 'string' && typeof kvRecord.hash === 'string') {
    return {
      source: 'kv',
      salt: kvRecord.salt,
      hash: kvRecord.hash,
      version: Number(kvRecord.version || 1),
    };
  }

  const envHash = (process.env.ADMIN_PASSWORD_HASH || '').trim();
  if (envHash.includes(':')) {
    const [salt, hash] = envHash.split(':');
    if (salt && hash) {
      return { source: 'env-hash', salt, hash, version: 1 };
    }
  }

  const envPass = (process.env.ADMIN_PASSWORD || '').trim();
  if (envPass) {
    return { source: 'env-plain', plain: envPass, version: 1 };
  }

  return null;
}

export async function verifyAdminPassword(candidatePassword) {
  const cred = await getConfiguredCredential();
  if (!cred) return { ok: false, needsSetup: true, version: 0 };

  if (cred.source === 'env-plain') {
    const ok = timingSafeEqualText(candidatePassword, cred.plain);
    return { ok, needsSetup: false, version: cred.version };
  }

  const { hash } = hashPasswordScrypt(candidatePassword, cred.salt);
  const ok = timingSafeEqualHex(hash, cred.hash);
  return { ok, needsSetup: false, version: cred.version };
}

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  const map = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        map[key] = decodeURIComponent(val);
      } catch {
        map[key] = val;
      }
    }
  }
  return map;
}

export async function createSessionToken(version) {
  const secret = await getSessionSecret();
  const nowSec = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({ u: 'admin', iat: nowSec, exp: nowSec + SESSION_TTL_SECONDS, v: Number(version || 1) })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export async function verifySession(req) {
  try {
    const cookies = parseCookies(req);
    const token = cookies[SESSION_COOKIE_NAME];
    if (!token || !token.includes('.')) return null;

    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) return null;

    const secret = await getSessionSecret();
    const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');

    const sigBuf = Buffer.from(sigB64);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!parsed || parsed.u !== 'admin') return null;

    const nowSec = Math.floor(Date.now() / 1000);
    if (!parsed.exp || parsed.exp <= nowSec) return null;

    const cred = await getConfiguredCredential();
    if (!cred) return null;
    if (Number(parsed.v || 1) !== Number(cred.version || 1)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function appendSessionCookie(req, res, token) {
  const isHttps =
    req.headers['x-forwarded-proto'] === 'https' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.NODE_ENV === 'production';

  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];
  if (isHttps) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(req, res) {
  const isHttps =
    req.headers['x-forwarded-proto'] === 'https' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.NODE_ENV === 'production';

  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (isHttps) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export async function requireAdmin(req, res) {
  const session = await verifySession(req);
  if (!session) {
    res.status(401).json({ success: false, message: 'Nepieciešama administratora autorizācija.' });
    return null;
  }
  return session;
}
