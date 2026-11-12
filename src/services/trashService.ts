import { FormSubmission } from './emailService';

export interface TrashItem {
  id: string;
  originalId: string | number;
  type: 'gallery' | 'review' | 'submission';
  title: string;
  subtitle?: string;
  previewImage?: string;
  data: any;
  deletedAt: string;
  expiresAt: string;
}

const STORAGE_KEY = 'kumite_trash_items';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function filterExpired(items: TrashItem[]): TrashItem[] {
  const now = Date.now();
  return items.filter((item) => {
    if (!item.expiresAt) return true;
    return new Date(item.expiresAt).getTime() > now;
  });
}

export function getStoredTrashItems(): TrashItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: TrashItem[] = JSON.parse(raw);
    const valid = filterExpired(parsed);
    if (valid.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}

export async function fetchTrashFromCloud(): Promise<TrashItem[]> {
  try {
    const res = await fetch('/api/trash', { credentials: 'include' });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    const isJson = res.ok && Boolean(res.headers.get('content-type')?.includes('application/json'));
    if (isJson) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const valid = filterExpired(data.items as TrashItem[]);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
          } catch {}
        }
        return valid;
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') throw err;
    console.error('Failed to fetch trash from cloud:', err);
  }
  return getStoredTrashItems();
}

export async function moveToTrash(
  type: 'gallery' | 'review' | 'submission',
  itemData: any,
  title: string,
  subtitle?: string,
  previewImage?: string
): Promise<TrashItem> {
  const now = new Date();
  const expires = new Date(now.getTime() + THIRTY_DAYS_MS);

  const trashItem: TrashItem = {
    id: `trash-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    originalId: itemData.id,
    type,
    title: title || 'Nenosaukts elements',
    subtitle,
    previewImage: previewImage || (type === 'gallery' ? itemData.image : undefined),
    data: itemData,
    deletedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };

  const current = getStoredTrashItems();
  const updated = [trashItem, ...current];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  const res = await fetch('/api/trash', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trashItem),
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');

  return trashItem;
}

export async function restoreItem(trashId: string): Promise<TrashItem | null> {
  const current = getStoredTrashItems();
  const target = current.find((t) => t.id === trashId);
  if (!target) return null;

  if (target.type === 'gallery') {
    try {
      const deletedArr: string[] = JSON.parse(localStorage.getItem('kumite_deleted_gallery_ids') || '[]');
      const filtered = deletedArr.filter((id) => String(id) !== String(target.originalId));
      localStorage.setItem('kumite_deleted_gallery_ids', JSON.stringify(filtered));

      const res = await fetch('/api/gallery', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target.data),
      });
      if (res.status === 401) throw new Error('UNAUTHORIZED');
    } catch (e) {
      if (e instanceof Error && e.message === 'UNAUTHORIZED') throw e;
      console.error('Error restoring gallery item:', e);
    }
  } else if (target.type === 'review') {
    try {
      const idNum = Number(target.originalId);
      const isBuiltIn = Number.isFinite(idNum) && idNum > 0 && idNum < 30000;
      const res = await fetch('/api/reviews', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...target.data, isCustom: !isBuiltIn }),
      });
      if (res.status === 401) throw new Error('UNAUTHORIZED');
    } catch (e) {
      if (e instanceof Error && e.message === 'UNAUTHORIZED') throw e;
      console.error('Error restoring review:', e);
    }
  } else if (target.type === 'submission') {
    try {
      const storedSubs: FormSubmission[] = JSON.parse(localStorage.getItem('kumite_form_submissions') || '[]');
      if (!storedSubs.some((s) => String(s.id) === String(target.originalId))) {
        storedSubs.unshift(target.data);
        localStorage.setItem('kumite_form_submissions', JSON.stringify(storedSubs));
      }

      const res = await fetch('/api/submissions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target.data),
      });
      if (res.status === 401) throw new Error('UNAUTHORIZED');
    } catch (e) {
      if (e instanceof Error && e.message === 'UNAUTHORIZED') throw e;
      console.error('Error restoring submission:', e);
    }
  }

  const updated = current.filter((t) => t.id !== trashId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  const delRes = await fetch(`/api/trash?id=${encodeURIComponent(trashId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (delRes.status === 401) throw new Error('UNAUTHORIZED');

  return target;
}

export async function permanentlyDeleteItem(trashId: string): Promise<void> {
  const current = getStoredTrashItems();
  const target = current.find((t) => t.id === trashId);
  const updated = current.filter((t) => t.id !== trashId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  const res = await fetch(`/api/trash?id=${encodeURIComponent(trashId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');

  if (target && target.type === 'gallery') {
    await fetch(`/api/gallery?id=${encodeURIComponent(target.originalId)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }
}

export async function emptyTrash(): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
  }

  const res = await fetch('/api/trash?clearAll=true', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
}

export function getDaysRemaining(expiresAt: string): number {
  if (!expiresAt) return 30;
  const exp = new Date(expiresAt).getTime();
  const diff = exp - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}
