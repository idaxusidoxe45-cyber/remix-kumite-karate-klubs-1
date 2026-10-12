import { GalleryItem, Testimonial } from '../types';
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
  return items.filter(item => {
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
    const res = await fetch('/api/trash');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const cloudItems: TrashItem[] = data.items;
        const valid = filterExpired(cloudItems);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
          } catch {}
        }
        return valid;
      }
    }
  } catch (err) {
    console.error('Failed to fetch trash from cloud:', err);
  }
  return getStoredTrashItems();
}

export function moveToTrash(
  type: 'gallery' | 'review' | 'submission',
  itemData: any,
  title: string,
  subtitle?: string,
  previewImage?: string
): TrashItem {
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
    expiresAt: expires.toISOString()
  };

  const current = getStoredTrashItems();
  const updated = [trashItem, ...current];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  // Sync to Cloud API
  fetch('/api/trash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trashItem)
  }).catch(() => {});

  return trashItem;
}

export async function restoreItem(trashId: string): Promise<TrashItem | null> {
  const current = getStoredTrashItems();
  const target = current.find(t => t.id === trashId);
  if (!target) return null;

  // 1. Restore item back to its domain
  if (target.type === 'gallery') {
    // Un-blacklist if it was blacklisted
    try {
      const deletedArr: string[] = JSON.parse(localStorage.getItem('kumite_deleted_gallery_ids') || '[]');
      const filtered = deletedArr.filter(id => String(id) !== String(target.originalId));
      localStorage.setItem('kumite_deleted_gallery_ids', JSON.stringify(filtered));

      // If it was a custom added gallery photo, re-add to custom list & cloud
      const customGal: GalleryItem[] = JSON.parse(localStorage.getItem('kumite_custom_gallery') || '[]');
      if (!customGal.some(c => String(c.id) === String(target.originalId))) {
        customGal.unshift(target.data);
        localStorage.setItem('kumite_custom_gallery', JSON.stringify(customGal));
      }

      // Re-create in cloud gallery
      fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target.data)
      }).catch(() => {});
    } catch (e) {
      console.error('Error restoring gallery item:', e);
    }
  } else if (target.type === 'review') {
    try {
      const storedReviews: Testimonial[] = JSON.parse(localStorage.getItem('user_submitted_reviews') || '[]');
      if (!storedReviews.some(r => String(r.id) === String(target.originalId))) {
        storedReviews.unshift(target.data);
        localStorage.setItem('user_submitted_reviews', JSON.stringify(storedReviews));
      }

      // Re-create in cloud reviews
      fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target.data)
      }).catch(() => {});
    } catch (e) {
      console.error('Error restoring review:', e);
    }
  } else if (target.type === 'submission') {
    try {
      const storedSubs: FormSubmission[] = JSON.parse(localStorage.getItem('kumite_form_submissions') || '[]');
      if (!storedSubs.some(s => String(s.id) === String(target.originalId))) {
        storedSubs.unshift(target.data);
        localStorage.setItem('kumite_form_submissions', JSON.stringify(storedSubs));
      }

      // Re-create in cloud submissions
      fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target.data)
      }).catch(() => {});
    } catch (e) {
      console.error('Error restoring submission:', e);
    }
  }

  // 2. Remove from trash
  const updated = current.filter(t => t.id !== trashId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  fetch(`/api/trash?id=${encodeURIComponent(trashId)}`, {
    method: 'DELETE'
  }).catch(() => {});

  return target;
}

export async function permanentlyDeleteItem(trashId: string): Promise<void> {
  const current = getStoredTrashItems();
  const target = current.find(t => t.id === trashId);
  const updated = current.filter(t => t.id !== trashId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  try {
    await fetch(`/api/trash?id=${encodeURIComponent(trashId)}`, {
      method: 'DELETE'
    });
  } catch {}

  // If it's a gallery item, also ensure deleted from cloud gallery
  if (target && target.type === 'gallery') {
    try {
      await fetch(`/api/gallery?id=${encodeURIComponent(target.originalId)}`, {
        method: 'DELETE'
      });
    } catch {}
  }
}

export async function emptyTrash(): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
  }

  try {
    await fetch('/api/trash?clearAll=true', {
      method: 'DELETE'
    });
  } catch {}
}

export function getDaysRemaining(expiresAt: string): number {
  if (!expiresAt) return 30;
  const exp = new Date(expiresAt).getTime();
  const diff = exp - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}
