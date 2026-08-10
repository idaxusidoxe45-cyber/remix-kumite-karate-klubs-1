import React, { useState } from 'react';
import { X, CheckCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { sendFormToEmail } from '../services/emailService';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [gdprConsent, setGdprConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteHoneypot) {
      // Honeypot triggered by spam bot
      setSubmitted(true);
      return;
    }
    if (!name || !phone || !gdprConsent) return;

    // Send application to email & store for Admin panel
    sendFormToEmail({
      type: 'trial',
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      message: message.trim() || undefined
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setWebsiteHoneypot('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0a0a0c] text-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border-2 border-slate-800"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-white p-2 rounded-full bg-[#1e293b] transition-transform transform hover:scale-110 active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle className="w-16 h-16 text-[#dc2626] mx-auto animate-bounce" />
            <h3 className="text-3xl font-heading text-white uppercase font-bold tracking-wide">Paldies par pieteikumu!</h3>
            <p className="text-slate-300 text-base font-sans">Mēs ar jums sazināsimies tuvākajā laikā, lai vienotos par bezmaksas izmēģinājuma treniņu.</p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Logo variant="dark" className="w-8 h-8" />
                <span className="text-xs sm:text-sm uppercase font-heading tracking-widest text-[#dc2626] font-bold">Kumite Karate Klubs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading text-white uppercase font-bold tracking-wide leading-snug">Piesakies bezmaksas treniņam</h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed font-sans">Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru un mēs ar tevi sazināsimies.</p>
            </div>

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

              <div>
                <label className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-1 font-bold">Jūsu vārds *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jūsu vārds"
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-1 font-bold">Tālruņa numurs *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+371 XXXXXXXX"
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-1 font-bold">E-pasta adrese</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="epasts@epasts.lv"
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-1 font-bold">Jūsu ziņa / Bērna vecums</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Jūsu ziņa vai bērna vecums..."
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                ></textarea>
              </div>

              {/* GDPR Consent */}
              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="trial-gdpr"
                  required
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-1 accent-[#dc2626] w-4 h-4 rounded"
                />
                <label htmlFor="trial-gdpr" className="text-xs text-slate-300 leading-snug cursor-pointer">
                  Piekrītu personas datu apstrādei, lai Kumite Karate Klubs varētu ar mani sazināties.
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!gdprConsent}
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white font-heading text-xl uppercase tracking-widest px-6 py-4 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 border-white"
                >
                  <span>Nosūtīt pieteikumu</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
