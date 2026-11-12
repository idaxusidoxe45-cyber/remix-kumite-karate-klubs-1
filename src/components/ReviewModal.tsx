import React, { useState, useEffect, useId } from 'react';
import { X, Star, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Testimonial } from '../types';
import { useDialogModal } from '../hooks/useDialogModal';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview?: (review: Testimonial) => void;
}

export default function ReviewModal({ isOpen, onClose, onSubmitReview }: ReviewModalProps) {
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const headingId = useId();
  const ratingLabelId = useId();
  const { dialogProps } = useDialogModal(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) {
      setSubmitError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (websiteHoneypot) {
      setSubmitted(true);
      return;
    }
    if (!author.trim() || !text.trim()) return;

    setIsSubmitting(true);
    setSubmitError('');

    const newReview: Testimonial = {
      id: Date.now(),
      author: author.trim(),
      role: role.trim() || undefined,
      rating,
      text: text.trim(),
      status: 'draft',
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newReview, website: websiteHoneypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'Neizdevās nosūtīt atsauksmi.');
        return;
      }

      if (onSubmitReview) {
        onSubmitReview(newReview);
      }

      try {
        const existing = JSON.parse(localStorage.getItem('user_submitted_reviews') || '[]');
        localStorage.setItem('user_submitted_reviews', JSON.stringify([...existing, newReview]));
      } catch {
        // Ignore storage errors
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setAuthor('');
        setRole('');
        setRating(5);
        setText('');
        setWebsiteHoneypot('');
        onClose();
      }, 3000);
    } catch {
      setSubmitError('Savienojuma kļūda. Lūdzu, mēģiniet vēlreiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      {...dialogProps}
      aria-labelledby={headingId}
      className="m-auto p-0 w-[calc(100%-1.5rem)] max-w-lg bg-[#0a0a0c] border-2 border-slate-800 rounded-2xl shadow-2xl text-white max-h-[90dvh] overflow-y-auto"
    >
      <div className="relative p-5 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute top-3 right-3 text-slate-200 hover:text-white transition-colors active:scale-95 rounded-full bg-slate-800/90 hover:bg-[#dc2626] cursor-pointer"
            aria-label="Aizvērt atsauksmes logu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {submitted ? (
            <div role="status" aria-live="polite" className="py-8 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-[#f87171] mx-auto animate-softPop" aria-hidden="true" />
              <h2 id={headingId} className="text-2xl font-heading font-bold uppercase tracking-wide text-white">
                Paldies par atsauksmi!
              </h2>
              <p className="text-slate-200 font-sans text-sm max-w-sm mx-auto">
                Jūsu atsauksme ir saņemta un tiks publicēta mājaslapā pēc administratora pārbaudes (moderācijas).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="website"
                className="visually-hidden"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                value={websiteHoneypot}
                onChange={(e) => setWebsiteHoneypot(e.target.value)}
              />

              <div className="pr-10">
                <h2 id={headingId} className="text-2xl font-heading font-bold uppercase tracking-wide text-white mb-1">
                  Atstāt atsauksmi
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-sans mb-2">
                  Jūsu atsauksme tiks nosūtīta uz moderāciju un parādīsies mājaslapā pēc apstiprināšanas.
                </p>
              </div>

              <div>
                <label htmlFor="review-author" className="block text-xs font-heading uppercase text-slate-200 mb-1 font-bold">
                  Jūsu Vārds *
                </label>
                <input
                  id="review-author"
                  type="text"
                  required
                  autoComplete="name"
                  enterKeyHint="next"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Piem., Jānis Bērziņš"
                  className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label htmlFor="review-role" className="block text-xs font-heading uppercase text-slate-200 mb-1 font-bold">
                  Loma / Apraksts (Neobligāti)
                </label>
                <input
                  id="review-role"
                  type="text"
                  enterKeyHint="next"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Piem., Kārļa tētis"
                  className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <span id={ratingLabelId} className="block text-xs font-heading uppercase text-slate-200 mb-1 font-bold">
                  Vērtējums
                </span>
                <div role="group" aria-labelledby={ratingLabelId} className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`${star} no 5 zvaigznēm`}
                      aria-pressed={rating === star}
                      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg hover:bg-slate-800/70 transition-all hover:scale-[1.06] active:scale-[0.96] cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-500'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="review-text" className="block text-xs font-heading uppercase text-slate-200 mb-1 font-bold">
                  Atsauksmes teksts *
                </label>
                <textarea
                  id="review-text"
                  required
                  rows={4}
                  enterKeyHint="send"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Uzrakstiet savu pieredzi un iespaidus..."
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              {submitError && (
                <div role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-5 py-2.5 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 text-xs sm:text-sm font-heading uppercase font-bold transition-all active:scale-[0.98] cursor-pointer"
                >
                  Atcelt
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] bg-[#dc2626] hover:bg-[#b91c1c] hover:brightness-110 hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-50 text-white font-heading text-xs sm:text-sm uppercase tracking-widest px-6 py-2.5 rounded-lg font-bold transition-all active:scale-[0.98] shadow-lg border border-white/20 inline-flex items-center justify-center space-x-1.5 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Sūta...</span>
                    </>
                  ) : (
                    <span>Nosūtīt atsauksmi</span>
                  )}
                </button>
              </div>
            </form>
          )}
      </div>
    </dialog>
  );
}
