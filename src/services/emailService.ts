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

const STORAGE_KEY = 'kumite_form_submissions';
export const DEFAULT_TARGET_EMAIL = 'u2086344644@gmail.com';
export const WEB3FORMS_ACCESS_KEY = '74607c0c-3e71-4933-ac8a-a30812a30b34';

export function getTargetEmail(): string {
  if (typeof window === 'undefined') return DEFAULT_TARGET_EMAIL;
  const stored = localStorage.getItem('kumite_target_email');
  if (!stored || stored.includes('idaxusidoxe45') || stored.includes('demo')) {
    localStorage.setItem('kumite_target_email', DEFAULT_TARGET_EMAIL);
    return DEFAULT_TARGET_EMAIL;
  }
  return stored;
}

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
    const res = await fetch('/api/submissions');
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
    console.error('Cloud fetch failed, using local storage cache:', err);
  }
  return getStoredSubmissions();
}

export function saveSubmission(submission: Omit<FormSubmission, 'id' | 'createdAt' | 'status'>): FormSubmission {
  const newSub: FormSubmission = {
    ...submission,
    id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  const current = getStoredSubmissions();
  const updated = [newSub, ...current];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  // Also post to Cloud API
  fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission)
  }).catch(() => {});

  return newSub;
}

export async function updateSubmissionStatus(id: string, status: FormSubmission['status']) {
  const current = getStoredSubmissions();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  // Update in Cloud API
  try {
    await fetch('/api/submissions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
  } catch {}
}

export async function deleteSubmission(id: string) {
  const current = getStoredSubmissions();
  const updated = current.filter(item => item.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  // Delete in Cloud API
  try {
    await fetch('/api/submissions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  } catch {}
}

export async function sendFormToEmail(data: {
  type: 'trial' | 'contact' | 'review';
  name: string;
  phone?: string;
  email?: string;
  message?: string;
}): Promise<boolean> {
  const targetEmail = getTargetEmail();

  // 1. Save to Local DB + Admin Panel Cloud Store
  saveSubmission(data);

  // 2. Fire Serverless Logging endpoint
  fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, targetEmail: DEFAULT_TARGET_EMAIL })
  }).catch(() => {});

  // 3. Direct Browser Dispatch via Web3Forms (Strict Free Tier Compatible Payload)
  try {
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Jauns pieteikums (${data.type === 'trial' ? 'Bezmaksas treniņš' : 'Kontaktforma'}): ${data.name}`,
        from_name: 'Kumite Karate Klubs Mājaslapa',
        name: data.name,
        phone: data.phone || 'Nav norādīts',
        email: data.email || 'Nav norādīts',
        message: data.message || 'Bezmaksas treniņa pieteikums',
        type: data.type
      })
    }).catch(err => console.error('[FORM DISPATCH] Web3Forms error:', err));
  } catch {}

  // 4. Backup Dispatch via FormSubmit directly to DEFAULT_TARGET_EMAIL
  try {
    fetch(`https://formsubmit.co/ajax/${encodeURIComponent(DEFAULT_TARGET_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone || 'Nav norādīts',
        email: data.email || 'Nav norādīts',
        message: data.message || 'Pieteikums no mājaslapas',
        _subject: `Jauns pieteikums (${data.type === 'trial' ? 'Bezmaksas treniņš' : 'Kontaktforma'}): ${data.name}`,
        _template: 'table',
        _captcha: 'false'
      })
    }).catch(err => console.error('[FORM DISPATCH] FormSubmit error:', err));
  } catch {}

  return true; // Form is recorded in Admin Panel regardless
}
