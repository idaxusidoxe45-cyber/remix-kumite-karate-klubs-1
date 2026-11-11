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
  emailSent: boolean;
  error?: string;
}

const STORAGE_KEY = 'kumite_form_submissions';
export const WEB3FORMS_ACCESS_KEY = '74607c0c-3e71-4933-ac8a-a30812a30b34';

export function getStoredSubmissions(): FormSubmission[] {
  if (typeof window === 'undefined') return [];
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
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.submissions)) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.submissions));
          } catch {}
        }
        return data.submissions;
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') throw err;
    console.error('Cloud fetch failed, using local cache:', err);
  }
  return getStoredSubmissions();
}

export async function updateSubmissionStatus(id: string, status: FormSubmission['status']): Promise<boolean> {
  const current = getStoredSubmissions();
  const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  const res = await fetch('/api/submissions', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  return res.ok;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const current = getStoredSubmissions();
  const updated = current.filter((item) => item.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  return res.ok;
}

/**
 * Persists submission once in `/api/submissions` AND sends email notification
 * cleanly via server `/api/send-email` (falling back to Web3Forms only if Resend is unconfigured).
 */
export async function sendFormToEmail(data: {
  type: 'trial' | 'contact' | 'review';
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  website?: string;
}): Promise<SendFormResult> {
  let saved = false;
  let emailSent = false;
  let errorMsg = '';

  const payload = {
    type: data.type,
    name: data.name.trim(),
    phone: data.phone?.trim() || undefined,
    email: data.email?.trim() || undefined,
    message: data.message?.trim() || undefined,
    ...(data.website ? { website: data.website } : {}),
  };

  // 1. Save once in database (/api/submissions)
  try {
    const subRes = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (subRes.ok) {
      saved = true;
    } else if (subRes.status === 429) {
      const errJson = await subRes.json().catch(() => ({}));
      return {
        ok: false,
        saved: false,
        emailSent: false,
        error: errJson.message || 'Pārāk daudz pieteikumu. Lūdzu, mēģiniet vēlāk.',
      };
    }
  } catch (err) {
    console.warn('Submission save error:', err);
  }

  // 2. Dispatch email notification from server (no client targetEmail allowed)
  let needsWeb3Fallback = false;
  try {
    const mailRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const mailJson = await mailRes.json().catch(() => ({}));
    if (mailRes.ok && mailJson.success) {
      emailSent = true;
    } else if (mailJson.fallback) {
      needsWeb3Fallback = true;
    } else if (!saved) {
      errorMsg = mailJson.message || 'Neizdevās nosūtīt ziņu.';
    }
  } catch {
    needsWeb3Fallback = true;
  }

  // 3. Fallback to Web3Forms only if Resend isn't configured or unreachable
  if (needsWeb3Fallback && !emailSent) {
    try {
      const formLabel =
        data.type === 'trial'
          ? 'Jauns pieteikums BEZMAKSAS izmēģinājuma treniņam'
          : 'Jauna ziņa no kontaktformas';

      const w3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Kumite Karate: ${formLabel} - ${payload.name}`,
          from_name: 'Kumite Karate Klubs Mājaslapa',
          name: payload.name,
          phone: payload.phone || 'Nav norādīts',
          email: payload.email || 'Nav norādīts',
          message: payload.message || 'Nav pievienota ziņa',
        }),
      });
      if (w3Res.ok) {
        const w3Json = await w3Res.json().catch(() => ({}));
        if (w3Json.success) emailSent = true;
      }
    } catch (err) {
      console.warn('Web3Forms fallback failed:', err);
    }
  }

  const ok = saved || emailSent;
  if (!ok && !errorMsg) {
    errorMsg = 'Neizdevās nosūtīt pieteikumu. Lūdzu, pārbaudiet interneta savienojumu vai zvaniet +371 29177274.';
  }

  return { ok, saved, emailSent, ...(ok ? {} : { error: errorMsg }) };
}
