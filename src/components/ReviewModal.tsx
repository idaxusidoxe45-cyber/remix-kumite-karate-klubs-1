import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import { Testimonial } from '../types';

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
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteHoneypot) {
      // Spam bot trap
      setSubmitted(true);
      return;
    }
    if (!author.trim() || !text.trim()) return;

    const newReview: Testimonial = {
      id: Date.now(),
      author: author.trim(),
      role: role.trim() || undefined,
      rating,
      text: text.trim(),
      status: 'draft',
    };

    if (onSubmitReview) {
      onSubmitReview(newReview);
    }

    // Save locally as draft for instant display & admin moderation review
    try {
      const existing = JSON.parse(localStorage.getItem('user_submitted_reviews') || '[]');
      localStorage.setItem('user_submitted_reviews', JSON.stringify([...existing, newReview]));
    } catch {
      // Ignore storage errors
    }

    // Attempt to post to server API if available
    try {
      fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      }).catch(() => {});
    } catch {
      // Ignore network errors
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0a0a0c] border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg bg-slate-900/80"
          aria-label="Aizvērt"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-[#dc2626] mx-auto animate-bounce" />
            <h3 className="text-2xl font-heading font-bold uppercase tracking-wide text-white">
              Paldies par atsauksmi!
            </h3>
            <p className="text-slate-300 font-sans text-sm max-w-sm mx-auto">
              Jūsu atsauksme ir saņemta un tiks publicēta mājaslapā pēc administratora pārbaudes (moderācijas).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              value={websiteHoneypot}
              onChange={(e) => setWebsiteHoneypot(e.target.value)}
            />

            <h3 className="text-2xl font-heading font-bold uppercase tracking-wide text-white mb-1">
              Atstāt atsauksmi
            </h3>
            <p className="text-xs text-slate-400 font-sans mb-4">
              Jūsu atsauksme tiks nosūtīta uz moderāciju un parādīsies mājaslapā pēc apstiprināšanas.
            </p>

            <div>
              <label className="block text-xs font-heading uppercase text-slate-300 mb-1">
                Jūsu Vārds *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Piem., Jānis Bērziņš"
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-heading uppercase text-slate-300 mb-1">
                Loma / Apraksts (Neobligāti)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Piem., Kārļa tētis"
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-heading uppercase text-slate-300 mb-1">
                Vērtējums
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform active:scale-125"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading uppercase text-slate-300 mb-1">
                Atsauksmes teksts *
              </label>
              <textarea
                required
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Uzrakstiet savu pieredzi un iespaidus..."
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#dc2626]"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-heading uppercase font-bold"
              >
                Atcelt
              </button>
              <button
                type="submit"
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg border border-white/20"
              >
                Nosūtīt atsauksmi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
