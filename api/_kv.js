const memoryStore = new Map();

const cleanEnv = (v) => (v ? String(v).trim().replace(/^["']|["']$/g, '') : '');

export function isKvConfigured() {
  return Boolean(cleanEnv(process.env.UPSTASH_REDIS_REST_URL) && cleanEnv(process.env.UPSTASH_REDIS_REST_TOKEN));
}

function unwrapUpstashValue(rawResult, fallback) {
  if (rawResult === null || rawResult === undefined) return fallback;
  let val = rawResult;
  // Unwrap single or accidental legacy double-JSON encoding cleanly
  for (let i = 0; i < 2; i++) {
    if (typeof val === 'string') {
      try {
        val = JSON.parse(val);
      } catch {
        break;
      }
    }
  }
  return val === null || val === undefined ? fallback : val;
}

export async function getCloudData(key, fallback) {
  const KV_URL = cleanEnv(process.env.UPSTASH_REDIS_REST_URL);
  const KV_TOKEN = cleanEnv(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      });
      if (res.ok) {
        const json = await res.json();
        return unwrapUpstashValue(json.result, fallback);
      }
    } catch (e) {
      console.error('KV get error:', key, e);
    }
  }

  return memoryStore.has(key) ? memoryStore.get(key) : fallback;
}

export async function saveCloudData(key, value) {
  memoryStore.set(key, value);

  const KV_URL = cleanEnv(process.env.UPSTASH_REDIS_REST_URL);
  const KV_TOKEN = cleanEnv(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'text/plain; charset=utf-8',
        },
        body: JSON.stringify(value),
      });
      if (!res.ok) {
        console.error('KV set failed:', key, res.status);
      }
    } catch (e) {
      console.error('KV set error:', key, e);
    }
  }
}

/**
 * Simple sliding/fixed-window rate limiter backed by Upstash Redis (or in-memory dev fallback).
 * Returns { allowed: boolean, remaining: number }.
 */
export async function checkRateLimit(bucketKey, maxRequests, windowSeconds) {
  const KV_URL = cleanEnv(process.env.UPSTASH_REDIS_REST_URL);
  const KV_TOKEN = cleanEnv(process.env.UPSTASH_REDIS_REST_TOKEN);
  const key = `rl:${bucketKey}`;

  if (KV_URL && KV_TOKEN) {
    try {
      const incrRes = await fetch(`${KV_URL}/incr/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      });
      if (incrRes.ok) {
        const incrJson = await incrRes.json();
        const count = Number(incrJson.result || 1);
        if (count === 1) {
          await fetch(`${KV_URL}/expire/${encodeURIComponent(key)}/${Number(windowSeconds)}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${KV_TOKEN}` },
          });
        }
        return {
          allowed: count <= maxRequests,
          remaining: Math.max(0, maxRequests - count),
        };
      }
    } catch (e) {
      console.error('Rate limit KV error:', e);
    }
  }

  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.expiresAt <= now) {
    memoryStore.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  entry.count += 1;
  return {
    allowed: entry.count <= maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
  };
}
