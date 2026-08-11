// Shared Cloud Key-Value persistence helper for serverless API handlers
let memoryStore = {};

export async function getCloudData(key, fallback = []) {
  const KV_URL = process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (KV_URL && KV_TOKEN) {
    try {
      const response = await fetch(`${KV_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` }
      });
      const json = await response.json();
      if (json.result) {
        return JSON.parse(json.result);
      }
    } catch (err) {
      console.error(`KV Read Error (${key}):`, err);
    }
  }

  return memoryStore[key] || fallback;
}

export async function saveCloudData(key, value) {
  memoryStore[key] = value;
  const KV_URL = process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/set/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        body: JSON.stringify(JSON.stringify(value))
      });
    } catch (err) {
      console.error(`KV Write Error (${key}):`, err);
    }
  }
}
