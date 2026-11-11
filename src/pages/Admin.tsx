import React, { useState, useEffect, useCallback } from 'react';
import { 
  getStoredSubmissions, 
  fetchSubmissionsFromCloud,
  updateSubmissionStatus, 
  deleteSubmission, 
  FormSubmission 
} from '../services/emailService';
import { 
  getDynamicTestimonials, 
  fetchCloudTestimonials, 
  getDynamicGalleryItems,
  fetchCloudGalleryItems 
} from '../data';
import { 
  TrashItem, 
  getStoredTrashItems, 
  fetchTrashFromCloud, 
  moveToTrash, 
  restoreItem, 
  permanentlyDeleteItem, 
  emptyTrash, 
  getDaysRemaining 
} from '../services/trashService';
import { compressImageForGallery, CompressedImageResult } from '../utils/imageCompress';
import { Testimonial, GalleryItem } from '../types';
import { 
  Lock, 
  LogOut, 
  Inbox, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  Trash2, 
  Plus, 
  Star, 
  Save, 
  Download,
  Eye,
  RefreshCw,
  X,
  Upload,
  AlertCircle,
  RotateCcw,
  Clock,
  Search,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { m } from 'motion/react';
import { Logo } from '../components/Logo';
import { useDialogModal } from '../hooks/useDialogModal';

export default function Admin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');

  const [activeTab, setActiveTab] = useState<'submissions' | 'reviews' | 'gallery' | 'trash' | 'settings'>('submissions');

  // State data
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [trashFilter, setTrashFilter] = useState<'all' | 'gallery' | 'review' | 'submission'>('all');
  const [trashSearch, setTrashSearch] = useState('');
  const [targetEmail, setTargetEmail] = useState('info@kumitekarate.lv');
  
  // Review modals
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Gallery modals & viewer
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<GalleryItem['category']>('trenini');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [compressedPhoto, setCompressedPhoto] = useState<CompressedImageResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Settings change pass & email state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const addReviewDialog = useDialogModal(showAddReviewModal, () => setShowAddReviewModal(false));
  const addGalleryDialog = useDialogModal(showAddGalleryModal, () => setShowAddGalleryModal(false));
  const photoViewerDialog = useDialogModal(Boolean(selectedGalleryItem), () => setSelectedGalleryItem(null));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUnauthorized = useCallback(() => {
    setIsAuthenticated(false);
    setLoginError('Sesija ir beigusies. Lūdzu, autorizējieties vēlreiz.');
  }, []);

  // Verify persistent HttpOnly session cookie on load / F5 refresh
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth', { credentials: 'include' });
        if (res.ok && mounted) {
          const data = await res.json();
          setIsAuthenticated(Boolean(data.authenticated));
          setNeedsSetup(Boolean(data.needsSetup));
          if (data.notificationEmail) setTargetEmail(data.notificationEmail);
        }
      } catch {
        // Offline / server unavailable
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    setSubmissions(getStoredSubmissions());
    setReviews(getDynamicTestimonials());
    setGalleryItems(getDynamicGalleryItems());
    setTrashItems(getStoredTrashItems());

    try {
      const [cloudSubs, cloudRevs, cloudGal, cloudTrash] = await Promise.all([
        fetchSubmissionsFromCloud(),
        fetchCloudTestimonials(),
        fetchCloudGalleryItems(),
        fetchTrashFromCloud()
      ]);
      setSubmissions(cloudSubs);
      setReviews(cloudRevs);
      setGalleryItems(cloudGal);
      setTrashItems(cloudTrash);
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        handleUnauthorized();
      } else {
        console.error('Data refresh error:', err);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      const interval = setInterval(refreshData, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshData]);

  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setupPassword.length < 8) {
      setLoginError('Parolei jābūt vismaz 8 simbolus garai.');
      return;
    }
    if (setupPassword !== setupConfirm) {
      setLoginError('Paroles nesakrīt.');
      return;
    }

    setAuthBusy(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth?action=setup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: setupPassword })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setNeedsSetup(false);
        setIsAuthenticated(true);
        setSetupPassword('');
        setSetupConfirm('');
        if (data.notificationEmail) setTargetEmail(data.notificationEmail);
        showToast('Administratora parole izveidota!');
      } else {
        setLoginError(data.message || 'Neizdevās saglabāt paroli.');
      }
    } catch {
      setLoginError('Savienojuma kļūda.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPassword('');
        if (data.notificationEmail) setTargetEmail(data.notificationEmail);
        showToast('Veiksmīgi autorizējies!');
      } else if (data.needsSetup) {
        setNeedsSetup(true);
        setLoginError(data.message || 'Nepieciešama sākotnējā iestatīšana.');
      } else {
        setLoginError(data.message || 'Nepareizs lietotājvārds vai parole!');
      }
    } catch {
      setLoginError('Neizdevās savienoties ar serveri.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth?action=logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch {}
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleStatusToggle = async (id: string, currentStatus: FormSubmission['status']) => {
    const nextStatus = currentStatus === 'new' ? 'contacted' : 'new';
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));
    try {
      await updateSubmissionStatus(id, nextStatus);
      showToast(`Pieteikuma statuss: ${nextStatus === 'contacted' ? 'Apstrādāts' : 'Jauns'}`);
      refreshData();
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') handleUnauthorized();
      else showToast('Neizdevās atjaunināt statusu.');
    }
  };

  const handleDeleteSub = async (id: string) => {
    const targetSub = submissions.find(s => s.id === id);
    if (!targetSub) return;

    if (!confirm(`Vai pārvietot pieteikumu no "${targetSub.name}" uz atkritni?\nTas glabāsies 30 dienas ar iespēju jebkurā laikā to atjaunot.`)) {
      return;
    }

    try {
      const trashed = await moveToTrash(
        'submission',
        targetSub,
        targetSub.name,
        `${targetSub.type === 'trial' ? 'Bezmaksas treniņš' : 'Kontakti'} | ${targetSub.phone || targetSub.email || ''}`
      );
      setTrashItems(prev => [trashed, ...prev]);
      setSubmissions(prev => prev.filter(s => s.id !== id));
      await deleteSubmission(id);
      showToast('Pieteikums pārvietots uz atkritni (glabājas 30 dienas).');
      refreshData();
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') handleUnauthorized();
      else showToast('Neizdevās dzēst pieteikumu.');
    }
  };

  const handleToggleReviewStatus = async (reviewId: number | string, currentStatus?: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    setReviews(prev => prev.map(r => String(r.id) === String(reviewId) ? { ...r, status: newStatus as any } : r));

    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, status: newStatus })
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) throw new Error('Update failed');
      showToast(`Atsauksme: ${newStatus === 'published' ? 'Publicēta mājaslapā' : 'Paslēpta'}`);
    } catch {
      showToast('Kļūda saglabājot atsauksmes statusu.');
    }

    refreshData();
  };

  const handleDeleteReview = async (reviewId: number | string) => {
    const targetReview = reviews.find(r => String(r.id) === String(reviewId));
    if (!targetReview) return;

    if (!confirm(`Vai pārvietot atsauksmi no "${targetReview.author}" uz atkritni?\nTā glabāsies 30 dienas ar iespēju jebkurā laikā to atjaunot.`)) {
      return;
    }

    try {
      const trashed = await moveToTrash(
        'review',
        targetReview,
        targetReview.author,
        `${targetReview.role || 'Atsauksme'} • ★ ${targetReview.rating || 5}`
      );
      setTrashItems(prev => [trashed, ...prev]);
      setReviews(prev => prev.filter(r => String(r.id) !== String(reviewId)));

      const res = await fetch(`/api/reviews?id=${encodeURIComponent(reviewId)}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      showToast('Atsauksme pārvietota uz atkritni (glabājas 30 dienas).');
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') handleUnauthorized();
      else showToast('Neizdevās dzēst atsauksmi.');
    }

    refreshData();
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev: Testimonial = {
      id: Date.now(),
      author: newReviewAuthor.trim(),
      role: newReviewRole.trim() || undefined,
      rating: newReviewRating,
      text: newReviewText.trim(),
      status: 'published'
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRev, isCustom: true })
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) throw new Error('Failed');
      setShowAddReviewModal(false);
      setNewReviewAuthor('');
      setNewReviewRole('');
      setNewReviewText('');
      setNewReviewRating(5);
      showToast('Atsauksme veiksmīgi pievienota un publicēta!');
      refreshData();
    } catch {
      showToast('Kļūda pievienojot atsauksmi.');
    }
  };

  // GALLERY MANAGEMENT
  const handleDeleteGalleryItem = async (itemId: number | string) => {
    const targetItem = galleryItems.find(g => String(g.id) === String(itemId));
    if (!targetItem) return;

    if (!confirm(`Vai pārvietot fotoattēlu "${targetItem.title}" uz atkritni?\nTas glabāsies 30 dienas ar iespēju jebkurā laikā to atjaunot.`)) {
      return;
    }

    try {
      const trashed = await moveToTrash(
        'gallery',
        targetItem,
        targetItem.title,
        `Kategorija: ${targetItem.category}`,
        targetItem.image
      );
      setTrashItems(prev => [trashed, ...prev]);
      setGalleryItems(prev => prev.filter(g => String(g.id) !== String(itemId)));

      const res = await fetch(`/api/gallery?id=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (selectedGalleryItem && String(selectedGalleryItem.id) === String(itemId)) {
        setSelectedGalleryItem(null);
      }

      showToast('Fotoattēls pārvietots uz atkritni (glabājas 30 dienas).');
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') handleUnauthorized();
      else showToast('Kļūda dzēšot fotoattēlu.');
    }

    refreshData();
  };

  // TRASH RESTORE & PERMANENT DELETE HANDLERS
  const handleRestoreFromTrash = async (trashId: string) => {
    try {
      const restored = await restoreItem(trashId);
      if (restored) {
        setTrashItems(prev => prev.filter(t => t.id !== trashId));
        showToast(`"${restored.title}" veiksmīgi atjaunots!`);
        refreshData();
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') handleUnauthorized();
      else showToast('Neizdevās atjaunot vienumu.');
    }
  };

  const handlePermanentDelete = async (trashId: string, title: string) => {
    if (!confirm(`Vai tiešām vēlaties NEATGRIEZENISKI dzēst "${title}"?\nŠo darbību nebūs iespējams atsaukt!`)) {
      return;
    }

    try {
      await permanentlyDeleteItem(trashId);
      setTrashItems(prev => prev.filter(t => t.id !== trashId));
      showToast(`"${title}" neatgriezeniski izdzēsts.`);
      refreshData();
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') handleUnauthorized();
      else showToast('Kļūda dzēšot vienumu.');
    }
  };

  const handleEmptyTrash = async () => {
    if (trashItems.length === 0) return;
    if (!confirm(`UZMANĪBU: Vai tiešām vēlaties IZTĪRĪT visu atkritni (${trashItems.length} vienumi)?\nVisi elementi tiks neatgriezeniski izdzēsti!`)) {
      return;
    }

    try {
      await emptyTrash();
      setTrashItems([]);
      showToast('Atkritne pilnībā iztīrīta.');
      refreshData();
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') handleUnauthorized();
      else showToast('Kļūda tīrot atkritni.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Lūdzu, izvēlieties derīgu attēlu (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Attēls ir pārāk liels (maks. 20 MB pirms saspiešanas).');
      return;
    }

    setUploadError('');
    setIsCompressing(true);
    try {
      const result = await compressImageForGallery(file);
      setCompressedPhoto(result);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Neizdevās apstrādāt attēlu.');
      setCompressedPhoto(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const uploadBlobToCloudinary = async (blob: Blob, signData: any): Promise<string> => {
    const form = new FormData();
    form.append('file', blob, 'photo.webp');
    form.append('api_key', signData.apiKey);
    form.append('timestamp', String(signData.timestamp));
    form.append('signature', signData.signature);
    form.append('folder', signData.folder);

    const upRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
      method: 'POST',
      body: form
    });
    const upJson = await upRes.json();
    if (!upRes.ok || !upJson.secure_url) {
      throw new Error(upJson?.error?.message || 'Cloudinary augšupielāde neizdevās.');
    }
    return upJson.secure_url;
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim() || !compressedPhoto) {
      setUploadError('Lūdzu, norādiet nosaukumu un izvēlieties attēlu.');
      return;
    }

    setIsUploadingPhoto(true);
    setUploadError('');

    try {
      let imageUrl = compressedPhoto.thumbDataUrl;
      let fullImageUrl = compressedPhoto.fullDataUrl;

      // Check if direct Cloudinary upload is configured on server (bypasses 4.5MB limit completely)
      const signRes = await fetch('/api/upload', { credentials: 'include' });
      if (signRes.status === 401) {
        handleUnauthorized();
        return;
      }
      if (signRes.ok) {
        const signData = await signRes.json();
        if (signData.mode === 'cloudinary') {
          const [uploadedThumb, uploadedFull] = await Promise.all([
            uploadBlobToCloudinary(compressedPhoto.thumbBlob, signData),
            uploadBlobToCloudinary(compressedPhoto.fullBlob, signData)
          ]);
          imageUrl = uploadedThumb;
          fullImageUrl = uploadedFull;
        }
      }

      const newItem: GalleryItem = {
        id: 'gal-' + Date.now(),
        title: newPhotoTitle.trim(),
        category: newPhotoCategory,
        caption: newPhotoCaption.trim() || newPhotoTitle.trim(),
        image: imageUrl,
        fullImage: fullImageUrl
      };

      const res = await fetch('/api/gallery', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const resJson = await res.json().catch(() => ({}));
      if (!res.ok || !resJson.success) {
        setUploadError(resJson.message || 'Serveris noraidīja attēlu.');
        return;
      }

      setShowAddGalleryModal(false);
      setNewPhotoTitle('');
      setNewPhotoCaption('');
      setCompressedPhoto(null);
      setUploadError('');
      showToast('Jauns fotoattēls veiksmīgi pievienots galerijai!');
      refreshData();
    } catch (err) {
      console.error('Gallery upload error:', err);
      setUploadError(err instanceof Error ? err.message : 'Kļūda augšupielādējot fotoattēlu.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveSettingsEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);
    try {
      const res = await fetch('/api/auth?action=update-settings', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationEmail: targetEmail.trim() })
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSettingsMsg({ type: 'ok', text: 'Paziņojumu e-pasts saglabāts serverī!' });
        showToast('E-pasta adrese atjaunināta.');
      } else {
        setSettingsMsg({ type: 'err', text: data.message || 'Neizdevās saglabāt e-pastu.' });
      }
    } catch {
      setSettingsMsg({ type: 'err', text: 'Savienojuma kļūda.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);
    if (newPassword.length < 8) {
      setSettingsMsg({ type: 'err', text: 'Jaunajai parolei jābūt vismaz 8 simbolus garai.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSettingsMsg({ type: 'err', text: 'Jaunās paroles nesakrīt.' });
      return;
    }

    try {
      const res = await fetch('/api/auth?action=change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setSettingsMsg({ type: 'ok', text: 'Parole nomainīta! Visas pārējās sesijas atiestatītas.' });
        showToast('Parole veiksmīgi nomainīta!');
      } else {
        setSettingsMsg({ type: 'err', text: data.message || 'Neizdevās nomainīt paroli.' });
      }
    } catch {
      setSettingsMsg({ type: 'err', text: 'Savienojuma kļūda.' });
    }
  };

  const exportSubmissionsCSV = () => {
    const headers = 'ID,Veids,Vārds,Tālrunis,E-pasts,Ziņa,Datums,Statuss\n';
    const rows = submissions.map(s => 
      `"${s.id}","${s.type}","${s.name}","${s.phone || ''}","${s.email || ''}","${(s.message || '').replace(/"/g, '""')}","${s.createdAt}","${s.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pieteikumi-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    showToast('CSV fails eksportēts.');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 text-white">
        <Loader2 className="w-10 h-10 text-[#dc2626] animate-spin" />
      </div>
    );
  }

  // FIRST-RUN SETUP OR LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 font-sans text-white relative">
        <m.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111827] border-2 border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-red-600/20 rounded-full text-[#f87171] mb-3">
              <Logo variant="dark" className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-heading font-bold uppercase tracking-wider text-white">Kumite Karate Klubs</h1>
            <p className="text-xs uppercase font-heading tracking-widest text-[#f87171] font-bold mt-1">
              {needsSetup ? 'Drošības sākotnējā iestatīšana' : 'CMS Vadības Panelis'}
            </p>
          </div>

          {loginError && (
            <div role="alert" className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm text-center">
              {loginError}
            </div>
          )}

          {needsSetup ? (
            <form onSubmit={handleSetupPassword} className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                Šī ir pirmā autorizācija. Izveidojiet drošu administratora paroli (vismaz 8 simboli), kas tiks šifrēta serverī.
              </p>
              <div>
                <label htmlFor="admin-setup-password" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Jaunā parole *
                </label>
                <input
                  id="admin-setup-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="Vismaz 8 simboli..."
                  className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                />
              </div>
              <div>
                <label htmlFor="admin-setup-confirm" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Atkārtojiet paroli *
                </label>
                <input
                  id="admin-setup-confirm"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={setupConfirm}
                  onChange={(e) => setSetupConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                />
              </div>
              <button
                type="submit"
                disabled={authBusy}
                className="w-full min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white font-heading text-lg uppercase tracking-wider py-3.5 rounded-lg font-bold transition-all shadow-lg border border-white flex items-center justify-center space-x-2 cursor-pointer"
              >
                {authBusy ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <ShieldCheck className="w-5 h-5" aria-hidden="true" />}
                <span>Saglabāt un ieiet</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-login-username" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Lietotājvārds
                </label>
                <input
                  id="admin-login-username"
                  type="text"
                  required
                  autoComplete="username"
                  enterKeyHint="next"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                />
              </div>

              <div>
                <label htmlFor="admin-login-password" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Parole
                </label>
                <input
                  id="admin-login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  enterKeyHint="go"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                />
              </div>

              <button
                type="submit"
                disabled={authBusy}
                className="w-full min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white font-heading text-lg uppercase tracking-wider py-3.5 rounded-lg font-bold transition-all transform active:scale-95 shadow-lg border border-white flex items-center justify-center space-x-2 cursor-pointer"
              >
                {authBusy ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Lock className="w-5 h-5" aria-hidden="true" />}
                <span>Ieiet vadības panelī</span>
              </button>
            </form>
          )}
        </m.div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-[#0a0a0c] text-white border-b-4 border-[#dc2626] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Logo variant="dark" className="w-8 h-8 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="font-heading font-bold uppercase tracking-wider text-xs sm:text-base leading-tight truncate">
                Kumite Karate — CMS Admin
              </h1>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest hidden sm:block">
                Autorizēts kā Admin
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <button
              type="button"
              onClick={refreshData}
              disabled={isRefreshing}
              aria-label="Atjaunot datus no mākoņa"
              title="Atjaunot datus no mākoņa"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center space-x-1.5 bg-[#1e293b] hover:bg-[#334155] px-3 py-2 rounded-lg text-xs font-heading uppercase font-bold text-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#f87171]' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Atjaunot</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Iziet no vadības paneļa"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center space-x-1.5 bg-[#1e293b] hover:bg-[#dc2626] px-3 py-2 sm:px-3.5 rounded-lg text-xs font-heading uppercase font-bold text-slate-100 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Iziet</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Responsive Segmented Navigation Tabs (zero awkward mobile scroll) */}
        <nav aria-label="CMS sadaļas" className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 border-b border-slate-200 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            aria-current={activeTab === 'submissions' ? 'page' : undefined}
            className={`min-h-[44px] flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-5 py-2.5 rounded-lg font-heading text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Pieteikumi ({submissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            aria-current={activeTab === 'reviews' ? 'page' : undefined}
            className={`min-h-[44px] flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-5 py-2.5 rounded-lg font-heading text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Atsauksmes ({reviews.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            aria-current={activeTab === 'gallery' ? 'page' : undefined}
            className={`min-h-[44px] flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-5 py-2.5 rounded-lg font-heading text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Galerija ({galleryItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trash')}
            aria-current={activeTab === 'trash' ? 'page' : undefined}
            className={`min-h-[44px] flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-5 py-2.5 rounded-lg font-heading text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap relative cursor-pointer ${
              activeTab === 'trash'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Trash2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Atkritne ({trashItems.length})</span>
            {trashItems.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'trash' ? 'bg-white text-red-700' : 'bg-red-600 text-white'
                }`}
              >
                {trashItems.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            aria-current={activeTab === 'settings' ? 'page' : undefined}
            className={`col-span-2 sm:col-span-1 min-h-[44px] flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-5 py-2.5 rounded-lg font-heading text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Iestatījumi</span>
          </button>
        </nav>

        {/* TAB 1: SUBMISSIONS LOG */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Saņemtie pieteikumi</h2>
                <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">Visas anketas un ziņas, ko lietotāji aizpildījuši mājaslapā</p>
              </div>

              {submissions.length > 0 && (
                <button
                  type="button"
                  onClick={exportSubmissionsCSV}
                  className="w-full sm:w-auto min-h-[44px] flex items-center justify-center space-x-2 bg-[#0a0a0c] hover:bg-[#1e293b] text-white text-xs font-heading font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#f87171]" aria-hidden="true" />
                  <span>Lejupielādēt CSV</span>
                </button>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" aria-hidden="true" />
                <p className="text-slate-600 font-heading uppercase text-sm">Pagaidām nav jaunu pieteikumu</p>
              </div>
            ) : (
              <>
                {/* Mobile Cards View */}
                <div className="md:hidden space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className={`bg-white rounded-xl p-4 border shadow-sm space-y-3 transition-colors ${
                        sub.status === 'new' ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[11px] font-heading font-bold uppercase ${
                            sub.type === 'trial' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {sub.type === 'trial' ? 'Bezmaksas treniņš' : 'Kontaktforma'}
                        </span>
                        <span className="text-xs text-slate-600 font-mono">
                          {new Date(sub.createdAt).toLocaleDateString('lv-LV')}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{sub.name}</h3>
                        {sub.phone && (
                          <a
                            href={`tel:${sub.phone.replace(/\s+/g, '')}`}
                            className="min-h-[36px] inline-flex items-center text-sm text-blue-700 font-semibold mt-1 hover:underline"
                          >
                            📞 {sub.phone}
                          </a>
                        )}
                        {sub.email && (
                          <a
                            href={`mailto:${sub.email}`}
                            className="text-xs text-slate-600 block truncate mt-0.5 hover:underline"
                          >
                            ✉️ {sub.email}
                          </a>
                        )}
                      </div>

                      {sub.message && (
                        <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
                          {sub.message}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(sub.id, sub.status)}
                          className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-heading font-bold uppercase transition-colors cursor-pointer ${
                            sub.status === 'contacted'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {sub.status === 'contacted' ? 'Sazināts ✓' : 'Jauns !'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSub(sub.id)}
                          aria-label={`Pārvietot ${sub.name} pieteikumu uz atkritni`}
                          className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Pārvietot uz atkritni"
                        >
                          <Trash2 className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-sans">
                      <thead className="bg-slate-900 text-white font-heading uppercase text-xs tracking-wider">
                        <tr>
                          <th className="p-4">Veids</th>
                          <th className="p-4">Vārds</th>
                          <th className="p-4">Tālrunis / E-pasts</th>
                          <th className="p-4">Ziņa / Vecums</th>
                          <th className="p-4">Datums</th>
                          <th className="p-4">Statuss</th>
                          <th className="p-4 text-right">Darbības</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {submissions.map((sub) => (
                          <tr key={sub.id} className={sub.status === 'new' ? 'bg-red-50/40' : ''}>
                            <td className="p-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded text-[11px] font-heading font-bold uppercase ${
                                  sub.type === 'trial' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {sub.type === 'trial' ? 'Bezmaksas treniņš' : 'Kontaktforma'}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-slate-900">{sub.name}</td>
                            <td className="p-4">
                              {sub.phone && <div className="font-semibold text-slate-800">{sub.phone}</div>}
                              {sub.email && <div className="text-xs text-slate-600">{sub.email}</div>}
                            </td>
                            <td className="p-4 max-w-xs text-slate-700 text-xs">
                              {sub.message || '—'}
                            </td>
                            <td className="p-4 text-xs text-slate-600 whitespace-nowrap">
                              {new Date(sub.createdAt).toLocaleString('lv-LV')}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleStatusToggle(sub.id, sub.status)}
                                className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-colors cursor-pointer ${
                                  sub.status === 'contacted'
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                              >
                                {sub.status === 'contacted' ? 'Sazināts ✓' : 'Jauns !'}
                              </button>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleDeleteSub(sub.id)}
                                aria-label={`Dzēst ${sub.name} pieteikumu`}
                                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Dzēst"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Atsauksmju pārvaldība</h2>
                <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">Moderējiet, apstipriniet vai pievienojiet jaunas atsauksmes</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddReviewModal(true)}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center space-x-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-heading font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Pievienot atsauksmi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between space-y-4 relative ${
                    rev.status === 'published' ? 'border-slate-200' : 'border-amber-400 bg-amber-50/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-500 space-x-1" aria-label={`Vērtējums ${rev.rating || 5} no 5`}>
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" aria-hidden="true" />
                        ))}
                      </div>

                      <span
                        className={`text-[11px] font-heading font-bold uppercase px-2.5 py-0.5 rounded ${
                          rev.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.status === 'published' ? 'Publicēts' : 'Moderācijā'}
                      </span>
                    </div>

                    <p className="text-slate-700 italic text-sm font-sans whitespace-pre-line mb-4">{rev.text}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-slate-900 text-base truncate">{rev.author}</h3>
                      {rev.role && <p className="text-xs text-slate-600 font-sans truncate">{rev.role}</p>}
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleReviewStatus(rev.id, rev.status)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-heading uppercase font-bold transition-colors cursor-pointer ${
                          rev.status === 'published'
                            ? 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800'
                            : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow'
                        }`}
                      >
                        {rev.status === 'published' ? 'Paslēpt' : 'Publicēt ✓'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev.id)}
                        aria-label={`Dzēst ${rev.author} atsauksmi`}
                        title="Dzēst atsauksmi"
                        className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Galerijas pārvaldība</h2>
                <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
                  Šobrīd mājaslapā ir <strong>{galleryItems.length}</strong> fotoattēli. Noklikšķiniet uz attēla, lai to apskatītu vai dzēstu.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddGalleryModal(true)}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center space-x-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-heading font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Pievienot jaunu fotoattēlu</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 content-visibility-auto">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md hover:border-[#dc2626] transition-all relative flex flex-col justify-between"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryItem(item)}
                    aria-label={`Apskatīt attēlu: ${item.title}`}
                    className="w-full h-36 overflow-hidden relative cursor-pointer block text-left"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <span className="bg-white/90 text-slate-900 p-2 rounded-full shadow">
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                  </button>

                  <div className="p-2.5 sm:p-3 bg-white flex items-center justify-between gap-1">
                    <div className="truncate mr-1">
                      <span className="text-[10px] uppercase font-heading tracking-wider text-[#b91c1c] font-bold block">
                        {item.category}
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate" title={item.title}>
                        {item.title}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      aria-label={`Dzēst attēlu ${item.title}`}
                      title="Dzēst attēlu no galerijas"
                      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            {settingsMsg && (
              <div
                role="status"
                className={`p-3 rounded-lg text-sm border ${
                  settingsMsg.type === 'ok'
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : 'bg-red-100 border-red-400 text-red-800'
                }`}
              >
                {settingsMsg.text}
              </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Paziņojumu e-pasta adrese</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans">Uz šo e-pasta adresi tiks nosūtīti visi pieteikumi no mājaslapas</p>

              <form onSubmit={handleSaveSettingsEmail} className="space-y-4">
                <div>
                  <label htmlFor="admin-settings-email" className="block text-xs uppercase font-heading font-bold text-slate-700 mb-1">
                    E-pasta adrese pieteikumu saņemšanai
                  </label>
                  <input
                    id="admin-settings-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="info@kumitekarate.lv"
                    className="w-full min-h-[44px] border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-base focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] bg-[#0a0a0c] hover:bg-[#1e293b] text-white font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-lg font-bold shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#f87171]" aria-hidden="true" />
                  <span>Saglabāt E-pastu</span>
                </button>
              </form>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Paroles maiņa</h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="admin-settings-current-pw" className="block text-xs uppercase font-heading font-bold text-slate-700 mb-1">
                    Pašreizējā admin parole
                  </label>
                  <input
                    id="admin-settings-current-pw"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ievadiet pašreizējo paroli..."
                    className="w-full min-h-[44px] border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-base focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div>
                  <label htmlFor="admin-settings-new-pw" className="block text-xs uppercase font-heading font-bold text-slate-700 mb-1">
                    Jaunā admin parole (min. 8 simboli)
                  </label>
                  <input
                    id="admin-settings-new-pw"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ievadiet jauno paroli..."
                    className="w-full min-h-[44px] border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-base focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div>
                  <label htmlFor="admin-settings-confirm-pw" className="block text-xs uppercase font-heading font-bold text-slate-700 mb-1">
                    Apstiprināt jauno paroli
                  </label>
                  <input
                    id="admin-settings-confirm-pw"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Atkārtojiet jauno paroli..."
                    className="w-full min-h-[44px] border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-base focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-lg font-bold shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>Saglabāt paroli</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: TRASH / RECYCLE BIN (30 DAYS RETENTION) */}
        {activeTab === 'trash' && (
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Atkritne (Miskaste)</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-heading font-bold uppercase bg-red-100 text-red-800">
                    30 dienu glabāšana
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
                  Visi dzēstie elementi šeit tiek droši uzglabāti 30 dienas un pēc tam tiek neatgriezeniski izdzēsti.
                  Jūs varat jebkurā brīdī tos atjaunot vai izdzēst pavisam.
                </p>
              </div>

              {trashItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleEmptyTrash}
                  className="w-full sm:w-auto min-h-[44px] flex items-center justify-center space-x-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-heading font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-700" aria-hidden="true" />
                  <span>Iztīrīt visu atkritni</span>
                </button>
              )}
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs sm:text-sm text-amber-900 font-sans">
              <Clock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold">Automātiskā tīrīšana pēc 30 dienām:</p>
                <p className="text-amber-800 mt-0.5">
                  Katram elementam tiek sekots atlikušais dienu skaits. Noklikšķiniet uz <strong>«Atjaunot»</strong>, lai atgrieztu fotoattēlu, atsauksmi vai pieteikumu sākotnējā vietā bez datu zuduma.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setTrashFilter('all')}
                  aria-pressed={trashFilter === 'all'}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    trashFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Visi ({trashItems.length})
                </button>

                <button
                  type="button"
                  onClick={() => setTrashFilter('gallery')}
                  aria-pressed={trashFilter === 'gallery'}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    trashFilter === 'gallery'
                      ? 'bg-purple-700 text-white'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  Fotoattēli ({trashItems.filter((i) => i.type === 'gallery').length})
                </button>

                <button
                  type="button"
                  onClick={() => setTrashFilter('review')}
                  aria-pressed={trashFilter === 'review'}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    trashFilter === 'review'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Atsauksmes ({trashItems.filter((i) => i.type === 'review').length})
                </button>

                <button
                  type="button"
                  onClick={() => setTrashFilter('submission')}
                  aria-pressed={trashFilter === 'submission'}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    trashFilter === 'submission'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  Pieteikumi ({trashItems.filter((i) => i.type === 'submission').length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <label htmlFor="admin-trash-search" className="visually-hidden">
                  Meklēt atkritnē
                </label>
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="admin-trash-search"
                  type="search"
                  value={trashSearch}
                  onChange={(e) => setTrashSearch(e.target.value)}
                  placeholder="Meklēt atkritnē..."
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-base sm:text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            </div>

            {(() => {
              const filtered = trashItems.filter((item) => {
                if (trashFilter !== 'all' && item.type !== trashFilter) return false;
                if (trashSearch.trim()) {
                  const q = trashSearch.toLowerCase();
                  const matchTitle = item.title.toLowerCase().includes(q);
                  const matchSub = (item.subtitle || '').toLowerCase().includes(q);
                  const matchData = JSON.stringify(item.data).toLowerCase().includes(q);
                  if (!matchTitle && !matchSub && !matchData) return false;
                }
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-2xl p-12 sm:p-16 text-center border border-slate-200">
                    <Trash2 className="w-12 h-12 text-slate-400 mx-auto mb-3" aria-hidden="true" />
                    <h3 className="font-heading font-bold uppercase text-slate-700 text-sm">
                      {trashItems.length === 0 ? 'Atkritne ir tukša' : 'Nekas netika atrasts'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1 max-w-sm mx-auto">
                      {trashItems.length === 0
                        ? 'Šeit tiks saglabāti dzēstie fotoattēli, atsauksmes un pieteikumi 30 dienu laikā ar iespēju tos atjaunot.'
                        : 'Mēģiniet mainīt meklēšanas vaicājumu vai izvēlēties citu kategoriju.'}
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((item) => {
                    const daysRemaining = getDaysRemaining(item.expiresAt);

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`text-[11px] font-heading font-bold uppercase px-2.5 py-1 rounded-md ${
                                item.type === 'gallery'
                                  ? 'bg-purple-100 text-purple-800'
                                  : item.type === 'review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.type === 'gallery' && '🖼 Fotoattēls'}
                              {item.type === 'review' && '★ Atsauksme'}
                              {item.type === 'submission' && '✉ Pieteikums'}
                            </span>

                            <span
                              className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 border ${
                                daysRemaining > 15
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : daysRemaining > 5
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
                              }`}
                            >
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              <span>{daysRemaining} {daysRemaining === 1 ? 'diena' : 'dienas'}</span>
                            </span>
                          </div>

                          {item.type === 'gallery' && item.previewImage && (
                            <div className="h-40 w-full rounded-xl overflow-hidden mb-3 bg-slate-900 border border-slate-100 relative">
                              <img
                                src={item.previewImage}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover filter grayscale contrast-125 opacity-90"
                              />
                              <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] uppercase font-heading px-2 py-0.5 rounded">
                                Dzēsts
                              </div>
                            </div>
                          )}

                          <h3 className="font-heading font-bold text-base text-slate-900 leading-tight">
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <p className="text-xs text-slate-600 font-sans mt-0.5">
                              {item.subtitle}
                            </p>
                          )}

                          {item.type === 'review' && item.data && (
                            <div className="mt-2 text-xs text-slate-700 font-sans italic bg-slate-50 p-2.5 rounded-lg border border-slate-200 line-clamp-3">
                              "{item.data.text}"
                            </div>
                          )}

                          {item.type === 'submission' && item.data && (
                            <div className="mt-2 text-xs text-slate-700 font-sans bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                              {item.data.phone && <div><strong>Tālr:</strong> {item.data.phone}</div>}
                              {item.data.message && <div><strong>Ziņa:</strong> {item.data.message}</div>}
                            </div>
                          )}

                          <div className="mt-3 text-[11px] text-slate-600 font-sans flex items-center justify-between">
                            <span>Dzēsts: {new Date(item.deletedAt).toLocaleDateString('lv-LV')}</span>
                            <span>Derīgs līdz: {new Date(item.expiresAt).toLocaleDateString('lv-LV')}</span>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleRestoreFromTrash(item.id)}
                            className="flex-1 min-h-[44px] flex items-center justify-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-heading font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Atjaunot</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePermanentDelete(item.id, item.title)}
                            aria-label={`Dzēst ${item.title} neatgriezeniski`}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-heading font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg border border-slate-300 hover:border-rose-300 transition-colors cursor-pointer"
                            title="Dzēst neatgriezeniski"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">Dzēst pavisam</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Add Review Native Modal */}
      <dialog
        {...addReviewDialog.dialogProps}
        aria-label="Pievienot jaunu atsauksmi"
        className="m-auto p-0 bg-[#0a0a0c] border-2 border-slate-800 text-white rounded-2xl max-w-lg w-[calc(100%-1.5rem)] shadow-2xl max-h-[90dvh] overflow-y-auto"
      >
        {showAddReviewModal && (
          <div className="p-5 sm:p-6 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setShowAddReviewModal(false)}
              aria-label="Aizvērt atsauksmes pievienošanas logu"
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute top-3 right-3 text-slate-200 hover:text-white rounded-full bg-slate-800 hover:bg-[#dc2626] cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-wide text-white mb-4 pr-10">
              Pievienot jaunu atsauksmi
            </h2>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label htmlFor="admin-rev-author" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Vārds *
                </label>
                <input
                  id="admin-rev-author"
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="Piem., Anna Kalniņa"
                  className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label htmlFor="admin-rev-role" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Loma (Neobligāti)
                </label>
                <input
                  id="admin-rev-role"
                  type="text"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  placeholder="Piem., Vecāks"
                  className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <span className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">Vērtējums</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReviewRating(s)}
                      aria-label={`${s} no 5 zvaigznēm`}
                      aria-pressed={newReviewRating === s}
                      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg hover:bg-slate-800 cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${s <= newReviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="admin-rev-text" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Atsauksmes teksts *
                </label>
                <textarea
                  id="admin-rev-text"
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Atsauksmes teksts..."
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 text-xs font-heading uppercase font-bold cursor-pointer"
                >
                  Atcelt
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-heading font-bold uppercase px-5 py-2.5 rounded-lg shadow cursor-pointer"
                >
                  Saglabāt un Publicēt
                </button>
              </div>
            </form>
          </div>
        )}
      </dialog>

      {/* MODAL: ADD GALLERY PHOTO */}
      <dialog
        {...addGalleryDialog.dialogProps}
        aria-label="Pievienot fotoattēlu galerijai"
        className="m-auto p-0 bg-[#0a0a0c] border-2 border-slate-800 text-white rounded-2xl max-w-lg w-[calc(100%-1.5rem)] shadow-2xl max-h-[90dvh] overflow-y-auto"
      >
        {showAddGalleryModal && (
          <div className="p-5 sm:p-8 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setShowAddGalleryModal(false)}
              aria-label="Aizvērt pievienošanas logu"
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute top-3 right-3 text-slate-200 hover:text-white rounded-full bg-slate-800 hover:bg-[#dc2626] cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-wide text-white mb-1 pr-10">
              Pievienot fotoattēlu
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mb-5">
              Attēls tiek automātiski saspiests WebP formātā pirms augšupielādes.
            </p>

            {uploadError && (
              <div role="alert" className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleAddGalleryItem} className="space-y-4">
              <div>
                <label htmlFor="admin-photo-title" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Nosaukums (Title) *
                </label>
                <input
                  id="admin-photo-title"
                  type="text"
                  required
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="Piem., Ziemas nometne 2026"
                  className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label htmlFor="admin-photo-category" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Kategorija *
                </label>
                <select
                  id="admin-photo-category"
                  value={newPhotoCategory}
                  onChange={(e) => setNewPhotoCategory(e.target.value as GalleryItem['category'])}
                  className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-[#dc2626]"
                >
                  <option value="trenini">Treniņi</option>
                  <option value="eksameni">Eksāmeni</option>
                  <option value="sacensibas">Sacensības</option>
                  <option value="nometnes">Nometnes</option>
                  <option value="pasakumi">Pasākumi</option>
                  <option value="zale">Zāle</option>
                </select>
              </div>

              <div>
                <label htmlFor="admin-photo-caption" className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Apraksts (Caption)
                </label>
                <input
                  id="admin-photo-caption"
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Attēla paraksts..."
                  className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <span className="block text-xs uppercase font-heading font-bold text-slate-200 mb-1">
                  Augšupielādēt attēlu no tālruņa vai datora
                </span>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 hover:border-[#dc2626] rounded-xl cursor-pointer bg-[#111827] transition-colors p-3 text-center">
                  {isCompressing ? (
                    <>
                      <Loader2 className="w-8 h-8 text-[#f87171] animate-spin mb-2" aria-hidden="true" />
                      <span className="text-xs text-slate-200 font-sans">Saspiež attēlu WebP formātā...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-300 mb-2" aria-hidden="true" />
                      <span className="text-xs text-slate-200 font-sans">Izvēlieties foto (JPG, PNG, WEBP)</span>
                    </>
                  )}
                  <input type="file" accept="image/*" disabled={isCompressing || isUploadingPhoto} onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {compressedPhoto && (
                <div className="space-y-2">
                  <div className="relative rounded-lg overflow-hidden border border-slate-700 h-28 bg-slate-900 flex items-center justify-center">
                    <img src={compressedPhoto.thumbDataUrl} alt="Priekšskatījums" className="max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setCompressedPhoto(null)}
                      aria-label="Noņemt izvēlēto foto"
                      className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center absolute top-2 right-2 bg-red-600 text-white rounded-full shadow cursor-pointer"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono text-center">
                    WebP saspiešana: {(compressedPhoto.origBytes / 1024).toFixed(0)} KB → {(compressedPhoto.compressedBytes / 1024).toFixed(0)} KB ({(compressedPhoto.thumbBlob.size / 1024).toFixed(0)} KB priekšskatījums)
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 text-xs font-heading uppercase font-bold cursor-pointer"
                >
                  Atcelt
                </button>
                <button
                  type="submit"
                  disabled={!compressedPhoto || isCompressing || isUploadingPhoto}
                  className="min-h-[44px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white text-xs font-heading font-bold uppercase px-6 py-2.5 rounded-lg shadow flex items-center justify-center space-x-2 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isUploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Augšupielādē...</span>
                    </>
                  ) : (
                    <span>Pievienot galerijai</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </dialog>

      {/* MODAL: PHOTO VIEWER & DELETE CONFIRMATION */}
      <dialog
        {...photoViewerDialog.dialogProps}
        aria-label={selectedGalleryItem?.title || 'Fotoattēla priekšskatījums'}
        className="m-auto p-0 bg-[#0a0a0c] border-2 border-slate-800 text-white rounded-2xl max-w-2xl w-[calc(100%-1.5rem)] shadow-2xl max-h-[90dvh] overflow-y-auto"
      >
        {selectedGalleryItem && (
          <div className="p-5 sm:p-6 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setSelectedGalleryItem(null)}
              aria-label="Aizvērt fotoattēla logu"
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute top-3 right-3 text-slate-200 hover:text-white rounded-full bg-slate-800 hover:bg-[#dc2626] z-10 cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </button>

            <div className="max-h-[50dvh] sm:max-h-[60dvh] overflow-hidden rounded-xl border border-slate-800 bg-black flex items-center justify-center mb-4">
              <img
                src={selectedGalleryItem.fullImage || selectedGalleryItem.image}
                alt={selectedGalleryItem.title}
                decoding="async"
                className="max-h-[50dvh] sm:max-h-[60dvh] max-w-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
              <div>
                <span className="text-[11px] uppercase font-heading tracking-wider text-[#f87171] font-bold block">
                  {selectedGalleryItem.category}
                </span>
                <h3 className="text-base sm:text-lg font-heading font-bold text-white">
                  {selectedGalleryItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                  {selectedGalleryItem.caption}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteGalleryItem(selectedGalleryItem.id)}
                className="w-full sm:w-auto min-h-[44px] justify-center bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-heading uppercase text-xs font-bold flex items-center space-x-2 transition-colors shadow cursor-pointer"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                <span>Dzēst šo fotoattēlu</span>
              </button>
            </div>
          </div>
        )}
      </dialog>

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 bg-[#0a0a0c] text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-heading font-bold tracking-wide animate-fadeIn"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
