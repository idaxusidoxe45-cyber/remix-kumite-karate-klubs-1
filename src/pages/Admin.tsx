import React, { useState, useEffect } from 'react';
import { 
  getStoredSubmissions, 
  updateSubmissionStatus, 
  deleteSubmission, 
  FormSubmission 
} from '../services/emailService';
import { getDynamicTestimonials, getDynamicGalleryItems } from '../data';
import { Testimonial, GalleryItem } from '../types';
import { 
  Lock, 
  LogOut, 
  Inbox, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Plus, 
  Star, 
  Save, 
  UserCheck, 
  Download,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('kumite_admin_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'submissions' | 'reviews' | 'gallery' | 'settings'>('submissions');
  
  // Custom admin credentials stored in localStorage
  const getStoredPassword = () => {
    if (typeof window === 'undefined') return 'kumite2026';
    return localStorage.getItem('kumite_admin_pass') || 'kumite2026';
  };

  // State data
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [targetEmail, setTargetEmail] = useState(() => {
    if (typeof window === 'undefined') return 'u2086344644@gmail.com';
    return localStorage.getItem('kumite_target_email') || 'u2086344644@gmail.com';
  });
  
  // New review form modal
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Settings change pass state
  const [newPassword, setNewPassword] = useState('');
  const [passSaveSuccess, setPassSaveSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = () => {
    setSubmissions(getStoredSubmissions());
    setReviews(getDynamicTestimonials());
    setGalleryItems(getDynamicGalleryItems());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = getStoredPassword();
    if (username.trim().toLowerCase() === 'admin' && password === correctPass) {
      sessionStorage.setItem('kumite_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Nepareizs lietotājvārds vai parole!');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kumite_admin_auth');
    setIsAuthenticated(false);
  };

  const handleStatusToggle = (id: string, currentStatus: FormSubmission['status']) => {
    const nextStatus = currentStatus === 'new' ? 'contacted' : 'new';
    updateSubmissionStatus(id, nextStatus);
    setSubmissions(getStoredSubmissions());
  };

  const handleDeleteSub = (id: string) => {
    if (confirm('Vai tiešām vēlaties dzēst šo pieteikumu?')) {
      deleteSubmission(id);
      setSubmissions(getStoredSubmissions());
    }
  };

  const handleToggleReviewStatus = (reviewId: number | string, currentStatus?: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const updated = reviews.map(r => r.id === reviewId ? { ...r, status: newStatus as any } : r);
    setReviews(updated);

    // Save to user_submitted_reviews in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('user_submitted_reviews') || '[]');
      const filtered = existing.filter((item: any) => item.id !== reviewId);
      const targetReview = updated.find(item => item.id === reviewId);
      if (targetReview) {
        localStorage.setItem('user_submitted_reviews', JSON.stringify([...filtered, targetReview]));
      }
    } catch {
      // ignore
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;

    const newRev: Testimonial = {
      id: Date.now(),
      author: newReviewAuthor.trim(),
      role: newReviewRole.trim() || undefined,
      rating: newReviewRating,
      text: newReviewText.trim(),
      status: 'published'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('user_submitted_reviews') || '[]');
      localStorage.setItem('user_submitted_reviews', JSON.stringify([newRev, ...existing]));
    } catch {
      // ignore
    }

    setReviews([newRev, ...reviews]);
    setShowAddReviewModal(false);
    setNewReviewAuthor('');
    setNewReviewRole('');
    setNewReviewText('');
    setNewReviewRating(5);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) return;
    localStorage.setItem('kumite_admin_pass', newPassword);
    setPassSaveSuccess(true);
    setNewPassword('');
    setTimeout(() => setPassSaveSuccess(false), 3000);
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
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 font-sans text-white relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111827] border-2 border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-red-600/20 rounded-full text-[#dc2626] mb-3">
              <Logo variant="dark" className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-heading font-bold uppercase tracking-wider text-white">Kumite Karate Klubs</h1>
            <p className="text-xs uppercase font-heading tracking-widest text-[#dc2626] font-bold mt-1">CMS Vadības Panelis</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-heading font-bold text-slate-300 mb-1">Lietotājvārds</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-heading font-bold text-slate-300 mb-1">Parole</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-lg uppercase tracking-wider py-3.5 rounded-lg font-bold transition-all transform active:scale-95 shadow-lg border border-white flex items-center justify-center space-x-2"
            >
              <Lock className="w-5 h-5" />
              <span>Ieiet vadības panelī</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-[#0a0a0c] text-white border-b-4 border-[#dc2626] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo variant="dark" className="w-8 h-8" />
            <div>
              <h2 className="font-heading font-bold uppercase tracking-wider text-base leading-tight">Kumite Karate — CMS Admin</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Autorizēts kā Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-[#1e293b] hover:bg-[#dc2626] px-3.5 py-2 rounded-lg text-xs font-heading uppercase font-bold text-slate-200 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Iziet</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'submissions'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Pieteikumi ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'reviews'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Atsauksmes ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'gallery'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galerija ({galleryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Iestatījumi</span>
          </button>
        </div>

        {/* TAB 1: SUBMISSIONS LOG */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h3 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Saņemtie pieteikumi</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Visas анкеты un ziņas, ko lietotāji aizpildījuši mājaslapā</p>
              </div>

              {submissions.length > 0 && (
                <button
                  onClick={exportSubmissionsCSV}
                  className="flex items-center space-x-2 bg-[#0a0a0c] hover:bg-[#1e293b] text-white text-xs font-heading font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow transition-colors"
                >
                  <Download className="w-4 h-4 text-[#dc2626]" />
                  <span>Lejupielādēt CSV</span>
                </button>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-heading uppercase text-sm">Pagaidām nav jaunu pieteikumu</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                            <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-heading font-bold uppercase ${
                              sub.type === 'trial' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {sub.type === 'trial' ? 'Bezmaksas treniņš' : 'Kontaktforma'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900">{sub.name}</td>
                          <td className="p-4">
                            {sub.phone && <div className="font-semibold text-slate-800">{sub.phone}</div>}
                            {sub.email && <div className="text-xs text-slate-500">{sub.email}</div>}
                          </td>
                          <td className="p-4 max-w-xs text-slate-700 text-xs">
                            {sub.message || '—'}
                          </td>
                          <td className="p-4 text-xs text-slate-400 whitespace-nowrap">
                            {new Date(sub.createdAt).toLocaleString('lv-LV')}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <button
                              onClick={() => handleStatusToggle(sub.id, sub.status)}
                              className={`px-3 py-1 rounded-full text-xs font-heading font-bold uppercase transition-colors ${
                                sub.status === 'contacted'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200 animate-pulse'
                              }`}
                            >
                              {sub.status === 'contacted' ? 'Sazināts ✓' : 'Jauns !'}
                            </button>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteSub(sub.id)}
                              className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                              title="Dzēst"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h3 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Atsauksmju pārvaldība</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Moderējiet, apstipriniet vai pievienojiet jaunas atsauksmes</p>
              </div>

              <button
                onClick={() => setShowAddReviewModal(true)}
                className="flex items-center space-x-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-heading font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
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
                      <div className="flex text-amber-500 space-x-1">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      <span className={`text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded ${
                        rev.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rev.status === 'published' ? 'Publicēts' : 'Moderācijā'}
                      </span>
                    </div>

                    <p className="text-slate-700 italic text-sm font-sans whitespace-pre-line mb-4">{rev.text}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-slate-900 text-base">{rev.author}</h4>
                      {rev.role && <p className="text-xs text-slate-400 font-sans">{rev.role}</p>}
                    </div>

                    <button
                      onClick={() => handleToggleReviewStatus(rev.id, rev.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-heading uppercase font-bold transition-colors ${
                        rev.status === 'published'
                          ? 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800'
                          : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow'
                      }`}
                    >
                      {rev.status === 'published' ? 'Paslēpt' : 'Publicēt ✓'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY PREVIEW */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Galerijas fotogrāfijas</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Šobrīd mājaslapā ir {galleryItems.length} fotoattēli</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="h-36 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] uppercase font-heading tracking-wider text-[#dc2626] font-bold block">{item.category}</span>
                    <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Paziņojumu e-pasta adrese</h3>
              <p className="text-xs text-slate-500 font-sans">Uz šo e-pasta adresi tiks nosūtīti visi pieteikumi no mājaslapas</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                localStorage.setItem('kumite_target_email', targetEmail);
                setPassSaveSuccess(true);
                setTimeout(() => setPassSaveSuccess(false), 3000);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-heading font-bold text-slate-700 mb-1">E-pasta adrese pieteikumu saņemšanai</label>
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="u2086344644@gmail.com"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0a0a0c] hover:bg-[#1e293b] text-white font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-lg font-bold shadow transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4 text-[#dc2626]" />
                  <span>Saglabāt E-pastu</span>
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xl font-heading font-bold uppercase tracking-wide text-[#0a0a0c]">Paroles maiņa</h3>
              
              {passSaveSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-lg text-sm">
                  Iestatījumi veiksmīgi saglabāti!
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-heading font-bold text-slate-700 mb-1">Jaunā admin parole</label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ievadiet jauno paroli..."
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-lg font-bold shadow transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Saglabāt paroli</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0c] border-2 border-slate-800 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddReviewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            <h3 className="text-2xl font-heading font-bold uppercase tracking-wide text-white mb-4">Pievienot jaunu atsauksmi</h3>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-heading font-bold text-slate-300 mb-1">Vārds *</label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="Piem., Anna Kalniņa"
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-heading font-bold text-slate-300 mb-1">Loma (Neobligāti)</label>
                <input
                  type="text"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  placeholder="Piem., Vecāks"
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-heading font-bold text-slate-300 mb-1">Vērtējums</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReviewRating(s)}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${s <= newReviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-heading font-bold text-slate-300 mb-1">Atsauksmes teksts *</label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Atsauksmes teksts..."
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#dc2626]"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs font-heading uppercase font-bold"
                >
                  Atcelt
                </button>
                <button
                  type="submit"
                  className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-heading font-bold uppercase px-5 py-2.5 rounded-lg shadow"
                >
                  Saglabāt un Publicēt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
