import React, { useState, useId } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import { sendFormToEmail } from '../services/emailService';
import { formatLatvianPhoneNumber, isValidLatvianPhoneNumber } from '../utils/phone';

interface ContactsProps {
  openTrialModal: () => void;
}

export default function Contacts({ openTrialModal }: ContactsProps) {
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

  const phoneErrorId = useId();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLatvianPhoneNumber(e.target.value);
    setPhone(formatted);
    const digits = formatted.replace(/\D/g, '');
    if (phoneError && (digits.length <= 3 || isValidLatvianPhoneNumber(formatted))) {
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

    if (!name.trim() || !email.trim() || !gdprConsent) return;

    const digits = phone.replace(/\D/g, '');
    if (digits.length > 3 && !isValidLatvianPhoneNumber(phone)) {
      setPhoneError('Lūdzu, ievadiet derīgu Latvijas tālruņa numuru vai atstājiet tukšu.');
      return;
    }

    setPhoneError('');
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await sendFormToEmail({
        type: 'contact',
        name: name.trim(),
        phone: digits.length > 3 ? phone.trim() : undefined,
        email: email.trim(),
        message: message.trim() || undefined,
        website: websiteHoneypot,
      });

      if (!result.ok) {
        setSubmitError(result.error || 'Neizdevās nosūtīt ziņu.');
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
      }, 3000);
    } catch {
      setSubmitError('Savienojuma kļūda. Lūdzu, mēģiniet vēlreiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const workingHours = [
    { day: 'Pirmdiena', time: '15:30 – 20:30' },
    { day: 'Otrdiena', time: '18:00 – 20:15' },
    { day: 'Trešdiena', time: '15:30 – 20:30' },
    { day: 'Ceturtdiena', time: '18:00 – 20:15' },
    { day: 'Piektdiena', time: '15:30 – 20:30' },
    { day: 'Sestdiena', time: 'slēgts' },
    { day: 'Svētdiena', time: 'slēgts' },
  ];

  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-20 lg:py-28 overflow-hidden border-b-8 border-[#dc2626]">
        <img
          src="/assets_gallery/trenini/karate-web-17.webp"
          srcSet="/assets_gallery/trenini/karate-web-17-800w.webp 800w, /assets_gallery/trenini/karate-web-17.webp 1600w"
          sizes="100vw"
          width={1600}
          height={1066}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-45 filter grayscale pointer-events-none select-none"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hero-enter">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-[#f87171] font-heading font-bold block mb-2">
              Kumite Karate Klubs
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">
              Sazinies ar mums
            </h1>
            <button
              type="button"
              onClick={openTrialModal}
              className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-lg sm:text-xl uppercase tracking-widest px-8 py-3.5 font-bold transition-all hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.985] shadow-xl border-2 border-white rounded-lg cursor-pointer"
            >
              Pievienojies mums
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Info & Form */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Contact Form */}
            <InteractiveRepelCard maxShift={10} maxRotate={4}>
              <div className="bg-[#0a0a0c] text-white p-6 sm:p-10 rounded-2xl shadow-2xl border-2 border-slate-800 h-full">
                <h2 className="text-2xl sm:text-3xl font-heading text-white uppercase font-bold tracking-wide mb-6">
                  Nosūtīt ziņu
                </h2>
                {submitted ? (
                  <div role="status" aria-live="polite" className="text-center py-12 space-y-4">
                    <CheckCircle className="w-16 h-16 text-[#f87171] mx-auto animate-softPop" aria-hidden="true" />
                    <h3 className="text-3xl font-heading text-white uppercase font-bold">
                      Paldies par ziņu!
                    </h3>
                    <p className="text-slate-200 text-base font-sans">
                      Mēs ar jums sazināsimies tuvākajā laikā.
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contacts-name"
                          className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold"
                        >
                          Jūsu vārds *
                        </label>
                        <input
                          id="contacts-name"
                          type="text"
                          required
                          autoComplete="name"
                          enterKeyHint="next"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jūsu vārds"
                          className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contacts-phone"
                          className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold"
                        >
                          Tālruņa numurs
                        </label>
                        <input
                          id="contacts-phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          enterKeyHint="next"
                          value={phone}
                          onChange={handlePhoneChange}
                          aria-invalid={Boolean(phoneError) || undefined}
                          aria-describedby={phoneError ? phoneErrorId : undefined}
                          placeholder="+371 29177274"
                          className={`w-full min-h-[44px] bg-[#1e293b] border rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base font-mono focus:outline-none focus:border-[#dc2626] ${
                            phoneError ? 'border-red-500' : 'border-slate-700'
                          }`}
                        />
                      </div>
                    </div>
                    {phoneError && (
                      <p id={phoneErrorId} role="alert" className="text-xs sm:text-sm text-red-300 font-medium">
                        {phoneError}
                      </p>
                    )}
                    <div>
                      <label
                        htmlFor="contacts-email"
                        className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold"
                      >
                        E-pasta adrese *
                      </label>
                      <input
                        id="contacts-email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        enterKeyHint="next"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-pasta adrese"
                        className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contacts-message"
                        className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold"
                      >
                        Jūsu ziņa *
                      </label>
                      <textarea
                        id="contacts-message"
                        rows={4}
                        required
                        enterKeyHint="send"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Jūsu ziņa"
                        className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                      />
                    </div>
                    <div className="flex items-start space-x-3 pt-1">
                      <input
                        type="checkbox"
                        id="contacts-gdpr"
                        required
                        checked={gdprConsent}
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="mt-1 accent-[#dc2626] w-5 h-5 rounded flex-shrink-0 cursor-pointer"
                      />
                      <label htmlFor="contacts-gdpr" className="text-xs sm:text-sm text-slate-200 leading-snug cursor-pointer">
                        Piekrītu personas datu apstrādei, lai Kumite Karate Klubs varētu atbildēt uz manu ziņu.
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
                        className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white font-heading text-xl uppercase tracking-widest px-8 py-3.5 rounded-lg font-bold transition-all hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.985] shadow-xl border-2 border-white flex items-center justify-center space-x-2 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                            <span>Sūta...</span>
                          </>
                        ) : (
                          <span>Nosūtīt</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </InteractiveRepelCard>

            {/* Hours & Contact details */}
            <div className="space-y-8">
              <InteractiveRepelCard maxShift={10} maxRotate={4}>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
                  <h2 className="text-2xl sm:text-3xl font-heading uppercase tracking-wider mb-6 flex items-center text-[#0a0a0c] font-bold">
                    <Clock className="w-7 h-7 text-[#dc2626] mr-3" aria-hidden="true" />
                    <span>Zāles darba laiks</span>
                  </h2>
                  <ul className="space-y-3 font-sans">
                    {workingHours.map((wh, idx) => (
                      <li key={idx} className="flex justify-between items-center text-base border-b border-slate-200 pb-2">
                        <span className="font-semibold text-slate-800">{wh.day}</span>
                        <span className={`font-bold ${wh.time === 'slēgts' ? 'text-[#b91c1c]' : 'text-slate-900'}`}>
                          {wh.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </InteractiveRepelCard>

              <InteractiveRepelCard maxShift={10} maxRotate={4}>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-heading uppercase tracking-wider mb-4 text-[#0a0a0c] font-bold">
                    Kontakti
                  </h2>
                  <div className="space-y-3 text-base text-slate-700 font-sans">
                    <p className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[#dc2626] flex-shrink-0" aria-hidden="true" />
                      <span>
                        Telefona numurs:{' '}
                        <a href="tel:+37129177274" className="underline font-bold text-[#b91c1c] hover:text-[#dc2626]">
                          +371 29177274
                        </a>
                      </span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[#dc2626] flex-shrink-0" aria-hidden="true" />
                      <span>
                        E-Pasts:{' '}
                        <a href="mailto:info@kumitekarate.lv" className="underline font-bold text-[#b91c1c] hover:text-[#dc2626]">
                          info@kumitekarate.lv
                        </a>
                      </span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-[#dc2626] flex-shrink-0" aria-hidden="true" />
                      <span className="font-semibold text-slate-800">
                        Zāles adrese: Rīga, Gustava Zemgala gatve 71
                      </span>
                    </p>
                  </div>
                </div>
              </InteractiveRepelCard>
            </div>
          </div>

          {/* Map & Waze Link */}
          <InteractiveRepelCard maxShift={10} maxRotate={4}>
            <div className="scroll-reveal bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 text-center space-y-6 shadow-md content-visibility-auto">
              <h2 className="text-3xl font-heading text-[#0f172a] uppercase font-bold tracking-wide">
                Kā mūs atrast
              </h2>
              <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl border-2 border-slate-900 relative">
                <a
                  href="https://waze.com/ul?ll=56.971622,24.166368&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative"
                >
                  <img
                    src="/assets_gallery/zale/img_2357-400x284.webp"
                    alt="Gustava Zemgala gatve 71 Zāle"
                    width={400}
                    height={284}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                    <span className="min-h-[48px] inline-flex items-center justify-center bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-sm sm:text-xl uppercase tracking-wider px-5 sm:px-8 py-3 sm:py-4 rounded-xl shadow-2xl font-bold transition-all group-hover:-translate-y-0.5 group-hover:scale-[1.02] active:scale-[0.98] border-2 border-white text-center">
                      Atvērt Waze navigāciju
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </InteractiveRepelCard>
        </div>
      </section>
    </div>
  );
}
