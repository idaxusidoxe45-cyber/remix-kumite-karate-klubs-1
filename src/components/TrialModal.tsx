import React, { useState, useEffect, useId } from 'react';
import { X, CheckCircle, Send, Loader2, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import { sendFormToEmail } from '../services/emailService';
import { formatLatvianPhoneNumber, isValidLatvianPhoneNumber } from '../utils/phone';
import { useDialogModal } from '../hooks/useDialogModal';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+371 ');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [gdprConsent, setGdprConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const headingId = useId();
  const phoneErrorId = useId();
  const { dialogProps } = useDialogModal(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) {
      setSubmitError('');
      setPhoneError('');
    }
  }, [isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLatvianPhoneNumber(e.target.value);
    setPhone(formatted);
    if (phoneError && isValidLatvianPhoneNumber(formatted)) {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (websiteHoneypot) {
      setSubmitted(true);
      return;
    }

    if (!name.trim() || !gdprConsent) return;

    if (!isValidLatvianPhoneNumber(phone)) {
      setPhoneError('Lūdzu, ievadiet derīgu Latvijas tālruņa numuru (piemēram, +371 29177274).');
      return;
    }

    setPhoneError('');
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await sendFormToEmail({
        type: 'trial',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim() || undefined,
        website: websiteHoneypot,
      });

      if (!result.ok) {
        setSubmitError(result.error || 'Neizdevās nosūtīt pieteikumu.');
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setPhone('+371 ');
        setEmail('');
        setMessage('');
        setWebsiteHoneypot('');
        onClose();
      }, 2500);
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
      className="m-auto p-0 bg-[#0a0a0c] text-white rounded-2xl shadow-2xl max-w-lg w-[calc(100%-1.5rem)] border-2 border-slate-800 max-h-[90dvh] overflow-y-auto"
    >
      {isOpen && (
        <div className="relative p-5 sm:p-8 animate-fadeIn">
          <button
            type="button"
            onClick={onClose}
            aria-label="Aizvērt pieteikuma logu"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute top-3 right-3 text-slate-200 hover:text-white rounded-full bg-[#1e293b] hover:bg-[#dc2626] transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {submitted ? (
            <div role="status" aria-live="polite" className="text-center py-12 space-y-4">
              <CheckCircle className="w-16 h-16 text-[#f87171] mx-auto animate-bounce" aria-hidden="true" />
              <h2 id={headingId} className="text-2xl sm:text-3xl font-heading text-white uppercase font-bold tracking-wide">
                Paldies par pieteikumu!
              </h2>
              <p className="text-slate-200 text-base font-sans">
                Mēs ar jums sazināsimies tuvākajā laikā, lai vienotos par bezmaksas izmēģinājuma treniņu.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6 pr-10">
                <div className="flex items-center space-x-2 mb-2">
                  <Logo variant="dark" className="w-8 h-8" />
                  <span className="text-xs sm:text-sm uppercase font-heading tracking-widest text-[#f87171] font-bold">
                    Kumite Karate Klubs
                  </span>
                </div>
                <h2 id={headingId} className="text-2xl sm:text-3xl font-heading text-white uppercase font-bold tracking-wide leading-snug">
                  Piesakies bezmaksas treniņam
                </h2>
                <p className="text-sm text-slate-200 mt-2 leading-relaxed font-sans">
                  Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru un mēs ar tevi sazināsimies.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot trap */}
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

                <div>
                  <label htmlFor="trial-modal-name" className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-1 font-bold">
                    Jūsu vārds *
                  </label>
                  <input
                    id="trial-modal-name"
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jūsu vārds"
                    className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="trial-modal-phone" className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-1 font-bold">
                      Tālruņa numurs *
                    </label>
                    <input
                      id="trial-modal-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                      value={phone}
                      onChange={handlePhoneChange}
                      aria-invalid={Boolean(phoneError) || undefined}
                      aria-describedby={phoneError ? phoneErrorId : undefined}
                      placeholder="+371 29177274"
                      className={`w-full min-h-[44px] bg-[#1e293b] border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base font-mono ${
                        phoneError ? 'border-red-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="trial-modal-email" className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-1 font-bold">
                      E-pasta adrese
                    </label>
                    <input
                      id="trial-modal-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      enterKeyHint="next"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="epasts@epasts.lv"
                      className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                </div>

                {phoneError && (
                  <p id={phoneErrorId} role="alert" className="text-xs sm:text-sm text-red-300 font-medium">
                    {phoneError}
                  </p>
                )}

                <div>
                  <label htmlFor="trial-modal-message" className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-1 font-bold">
                    Jūsu ziņa / Bērna vecums
                  </label>
                  <textarea
                    id="trial-modal-message"
                    rows={3}
                    enterKeyHint="send"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Jūsu ziņa vai bērna vecums..."
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                  />
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <input
                    type="checkbox"
                    id="trial-gdpr"
                    required
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 accent-[#dc2626] w-5 h-5 rounded flex-shrink-0 cursor-pointer"
                  />
                  <label htmlFor="trial-gdpr" className="text-xs sm:text-sm text-slate-200 leading-snug cursor-pointer">
                    Piekrītu personas datu apstrādei, lai Kumite Karate Klubs varētu ar mani sazināties.
                  </label>
                </div>

                {submitError && (
                  <div role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={!gdprConsent || isSubmitting}
                    className="w-full min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white font-heading text-lg sm:text-xl uppercase tracking-widest px-6 py-4 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl border-2 border-white disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        <span>Sūta...</span>
                      </>
                    ) : (
                      <>
                        <span>Nosūtīt pieteikumu</span>
                        <Send className="w-5 h-5" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
