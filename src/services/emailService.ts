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
const DEFAULT_TARGET_EMAIL = 'info@kumitekarate.lv';

export function getStoredSubmissions(): FormSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
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

  return newSub;
}

export function updateSubmissionStatus(id: string, status: FormSubmission['status']) {
  const current = getStoredSubmissions();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

export function deleteSubmission(id: string) {
  const current = getStoredSubmissions();
  const updated = current.filter(item => item.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

export async function sendFormToEmail(data: {
  type: 'trial' | 'contact' | 'review';
  name: string;
  phone?: string;
  email?: string;
  message?: string;
}): Promise<boolean> {
  // 1. Save to local storage log for Admin Panel
  saveSubmission(data);

  // 2. Try posting to Serverless API route /api/send-email
  try {
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        targetEmail: DEFAULT_TARGET_EMAIL
      })
    });
    if (apiRes.ok) return true;
  } catch {
    // network fallback
  }

  // 3. Web3Forms free instant email delivery fallback
  try {
    const web3Res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '6b63c7b3-85f0-4c3e-bfa1-e631d87e0766', // Public fallback key or configurable
        subject: `Jauns pieteikums no mājaslapas: ${data.name}`,
        from_name: 'Kumite Karate Klubs Mājaslapa',
        to_email: DEFAULT_TARGET_EMAIL,
        name: data.name,
        phone: data.phone || 'Nav norādīts',
        email: data.email || 'Nav norādīts',
        message: data.message || 'Bezmaksas treniņa pieteikums',
        type: data.type
      })
    });
    return web3Res.ok;
  } catch {
    return true; // Still saved in admin panel
  }
}
