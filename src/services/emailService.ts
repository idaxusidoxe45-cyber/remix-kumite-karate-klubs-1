export interface FormSubmission {
  id: string;
  type: 'trial' | 'contact' | 'review';
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'archived';
}

export interface SendFormResult {
  ok: boolean;
  saved: boolean;
  error?: string;
}

const STORAGE_KEY = 'kumite_form_submissions';

function isLocalDevHost(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h.startsWith('192.168.') ||
    h.startsWith('10.') ||
    h.endsWith('.local')
  );
}

export function getStoredSubmissions(): FormSubmission[] {
  if (!isLocalDevHost()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function fetchSubmissionsFromCloud(): Promise<FormSubmission[]> {
  try {
    const res = await fetch('/api/submissions', { credentials: 'include' });
    if (res.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    const isJson = res.ok && Boolean(res.headers.get('content-type')?.includes('application/json'));
    if (isJson) {
      const data = await res.json();
      if (data.success && Array.isArray(data.submissions)) {
        return data.submissions;
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') throw err;
  }
  return getStoredSubmissions();
}

export async function updateSubmissionStatus(id: string, status: FormSubmission['status']): Promise<boolean> {
  if (isLocalDevHost()) {
    try {
      const current = getStoredSubmissions();
      const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  try {
    const res = await fetch('/api/submissions', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    return res.ok;
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') throw err;
    return isLocalDevHost();
  }
}

export async function deleteSubmission(id: string): Promise<boolean> {
  if (isLocalDevHost()) {
    try {
      const current = getStoredSubmissions();
      const updated = current.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  try {
    const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    return res.ok;
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') throw err;
    return isLocalDevHost();
  }
}

/**
 * Single clean submission pipeline:
 * Sends one POST to `/api/submissions` (which stores the record for `/admin`
 * and triggers any optional server-side notification hook if configured).
 * Never stores visitor PII in `localStorage` on public domains.
 */
export async function sendFormToEmail(data: {
  type: 'trial' | 'contact' | 'review';
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  website?: string;
}): Promise<SendFormResult> {
  const payload = {
    type: data.type,
    name: data.name.trim(),
    phone: data.phone?.trim() || undefined,
    email: data.email?.trim() || undefined,
    message: data.message?.trim() || undefined,
    ...(data.website ? { website: data.website } : {}),
  };

  try {
    const subRes = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const isJson = Boolean(subRes.headers.get('content-type')?.includes('application/json'));
    if (isJson) {
      const json = await subRes.json().catch(() => ({}));
      if (subRes.ok && json.success) {
        return { ok: true, saved: true };
      }
      return {
        ok: false,
        saved: false,
        error: json.message || 'Neizdevās nosūtīt pieteikumu. Lūdzu, mēģiniet vēlāk.',
      };
    }
  } catch {
    // Offline or local static preview without serverless runtime
  }

  if (isLocalDevHost()) {
    try {
      const localSubmission: FormSubmission = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: data.type,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        message: payload.message,
        createdAt: new Date().toISOString(),
        status: 'new',
      };
      const existing = getStoredSubmissions();
      localStorage.setItem(STORAGE_KEY, JSON.stringify([localSubmission, ...existing]));
      return { ok: true, saved: true };
    } catch {}
  }

  return {
    ok: false,
    saved: false,
    error: 'Neizdevās nosūtīt pieteikumu. Lūdzu, pārbaudiet interneta savienojumu vai zvaniet +371 29177274.',
  };
}
