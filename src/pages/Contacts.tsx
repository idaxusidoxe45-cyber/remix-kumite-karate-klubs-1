import React, { useState, useId, useRef, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Navigation,
  MessageCircle,
  Bus,
  Car,
  Train,
} from 'lucide-react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import { sendFormToEmail } from '../services/emailService';
import { formatLatvianPhoneNumber, isValidLatvianPhoneNumber } from '../utils/phone';

interface ContactsProps {
  openTrialModal: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const resetTimerRef = useRef<number | null>(null);
  const phoneErrorId = useId();

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone((prev) => {
      const formatted = formatLatvianPhoneNumber(val, prev);
      const digits = formatted.replace(/\D/g, '');
      if (phoneError && (digits.length <= 3 || isValidLatvianPhoneNumber(formatted))) {
        setPhoneError('');
      }
      return formatted;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (websiteHoneypot) {
      setSubmitted(true);
      return;
    }

    if (!name.trim()) {
      setSubmitError('Lūdzu, ievadiet savu vārdu.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setSubmitError('Lūdzu, ievadiet derīgu e-pasta adresi.');
      return;
    }

    if (!message.trim()) {
      setSubmitError('Lūdzu, uzrakstiet savu ziņu.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length > 3 && !isValidLatvianPhoneNumber(phone)) {
      setPhoneError('Lūdzu, ievadiet derīgu Latvijas tālruņa numuru vai atstājiet tukšu.');
      return;
    }

    if (!gdprConsent) {
      setSubmitError('Lūdzu, atzīmējiet piekrišanu personas datu apstrādei.');
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
      resetTimerRef.current = window.setTimeout(() => {
        resetTimerRef.current = null;
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
    <div className="text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-16 sm:py-24 lg:py-28 overflow-hidden border-b-8 border-[#dc2626]">
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
          <div>
            <span className="hero-stagger-1 text-xs sm:text-sm uppercase tracking-widest text-[#60a5fa] font-heading font-bold block mb-2">
              Kumite Karate Klubs
            </span>
            <h1 className="hero-stagger-2 text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">
              Sazinies ar mums
            </h1>
            <div className="hero-stagger-3">
              <button
                type="button"
                onClick={openTrialModal}
                className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 font-bold transition-all hover:-translate-y-0.5 active:scale-[0.97] shadow-xl border border-red-500/30 rounded-xl cursor-pointer"
              >
                Pievienojies mums
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Info & Form */}
      <section className="py-16 sm:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16 sm:mb-20">
            {/* Contact Form */}
            <div data-stagger="1" className="scroll-reveal">
              <div className="bg-[#0a0a0c] text-white p-6 sm:p-10 rounded-2xl shadow-2xl border-2 border-slate-800 border-t-4 border-t-[#dc2626] h-full">
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
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          enterKeyHint="next"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (submitError) setSubmitError('');
                          }}
                          placeholder="Jūsu vārds"
                          className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#2563eb]"
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
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          enterKeyHint="next"
                          value={phone}
                          onChange={handlePhoneChange}
                          aria-invalid={Boolean(phoneError) || undefined}
                          aria-describedby={phoneError ? phoneErrorId : undefined}
                          placeholder="+371 29177274"
                          className={`w-full min-h-[44px] bg-[#0a0a0c] border rounded-xl px-4 py-3 text-white placeholder-slate-400 text-base font-mono focus:outline-none focus:border-[#2563eb] ${
                            phoneError ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
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
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        enterKeyHint="next"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (submitError) setSubmitError('');
                        }}
                        placeholder="E-pasta adrese"
                        className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#2563eb]"
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
                        name="message"
                        rows={4}
                        required
                        enterKeyHint="send"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (submitError) setSubmitError('');
                        }}
                        placeholder="Jūsu ziņa"
                        className="w-full bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#2563eb]"
                      />
                    </div>
                    <label htmlFor="contacts-gdpr" className="flex items-start space-x-3 pt-1 cursor-pointer min-h-[44px]">
                      <input
                        type="checkbox"
                        id="contacts-gdpr"
                        name="gdprConsent"
                        required
                        checked={gdprConsent}
                        onChange={(e) => {
                          setGdprConsent(e.target.checked);
                          if (e.target.checked && submitError) setSubmitError('');
                        }}
                        className="mt-1 accent-[#dc2626] w-5 h-5 rounded flex-shrink-0 cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm text-slate-200 leading-snug">
                        Piekrītu personas datu apstrādei, lai Kumite Karate Klubs varētu atbildēt uz manu ziņu.
                      </span>
                    </label>
                    {submitError && (
                      <div role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-xl text-sm flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{submitError}</span>
                      </div>
                    )}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] hover:shadow-xl hover:shadow-red-600/25 disabled:opacity-50 text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.97] shadow-lg border border-red-500/30 flex items-center justify-center space-x-2 disabled:cursor-not-allowed cursor-pointer"
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
            </div>

            {/* Hours & Contact details */}
            <div className="space-y-8">
              <InteractiveRepelCard maxShift={10} maxRotate={4}>
                <div data-stagger="2" className="scroll-reveal bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 border-t-4 border-t-[#2563eb] shadow-md">
                  <h2 className="text-2xl sm:text-3xl font-heading uppercase tracking-wider mb-6 flex items-center text-[#0a0a0c] font-bold">
                    <Clock className="w-7 h-7 text-[#2563eb] mr-3" aria-hidden="true" />
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
                <div data-stagger="3" className="scroll-reveal bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 border-t-4 border-t-[#dc2626] shadow-md space-y-5">
                  <h2 className="text-2xl sm:text-3xl font-heading uppercase tracking-wider text-[#0a0a0c] font-bold">
                    Kontakti un Saziņa
                  </h2>

                  <div className="space-y-3.5 text-base text-slate-700 font-sans">
                    <p className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[#dc2626] flex-shrink-0" aria-hidden="true" />
                      <span>
                        Telefona numurs:{' '}
                        <a
                          href="tel:+37129177274"
                          className="underline font-bold text-[#b91c1c] hover:text-[#dc2626] transition-colors"
                        >
                          +371 29177274
                        </a>
                      </span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[#2563eb] flex-shrink-0" aria-hidden="true" />
                      <span>
                        E-Pasts:{' '}
                        <a
                          href="mailto:info@kumitekarate.lv"
                          className="underline font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                        >
                          info@kumitekarate.lv
                        </a>
                      </span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-[#dc2626] flex-shrink-0" aria-hidden="true" />
                      <span className="font-semibold text-slate-900">
                        Zāles adrese: Rīga, Gustava Zemgala gatve 71
                      </span>
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://wa.link/y3zuwq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-heading text-sm font-bold uppercase tracking-wider shadow-sm transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                      <MessageCircle className="w-5 h-5" aria-hidden="true" />
                      <span>WhatsApp Čats</span>
                    </a>
                    <a
                      href="tel:+37129177274"
                      className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a0a0c] hover:bg-[#1e293b] text-white font-heading text-sm font-bold uppercase tracking-wider shadow-sm transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                      <Phone className="w-4 h-4 text-[#f87171]" aria-hidden="true" />
                      <span>Zvanīt trenerim</span>
                    </a>
                  </div>
                </div>
              </InteractiveRepelCard>
            </div>
          </div>

          {/* Location & Navigation Hub */}
          <div className="space-y-8">
            <InteractiveRepelCard maxShift={8} maxRotate={3}>
              <div className="scroll-reveal bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-md content-visibility-auto">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#2563eb] font-bold">
                    Ērta nokļūšana
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-heading text-[#0f172a] uppercase font-bold tracking-wide mt-1">
                    Kā mūs atrast
                  </h2>
                  <p className="text-slate-600 font-sans text-sm sm:text-base mt-2">
                    Kluba treniņu zāle atrodas <strong>Rīgā, Gustava Zemgala gatvē 71</strong> ar ērtu piebraukšanu gan ar auto, gan sabiedrisko transportu.
                  </p>
                  <div className="w-20 h-1 kumite-aka-ao-bar mx-auto mt-4 rounded-full" />
                </div>

                {/* 1-Click Navigation Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
                  <a
                    href="https://waze.com/ul?ll=56.971622,24.166368&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-heading text-sm sm:text-base font-bold uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                  >
                    <Navigation className="w-5 h-5" aria-hidden="true" />
                    <span>Waze Navigācija</span>
                  </a>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=56.971622,24.166368"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-sm sm:text-base font-bold uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                  >
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                    <span>Google Maps</span>
                  </a>
                  <a
                    href="https://maps.apple.com/?q=Kumite+Karate+Klubs&ll=56.971622,24.166368"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#0a0a0c] hover:bg-[#1e293b] text-white font-heading text-sm sm:text-base font-bold uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.97] border border-slate-700"
                  >
                    <Navigation className="w-5 h-5 text-[#60a5fa]" aria-hidden="true" />
                    <span>Apple Maps</span>
                  </a>
                </div>

                {/* High-Res Gym Photo with Waze direct link */}
                <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-slate-900 relative mb-10 group">
                  <a
                    href="https://waze.com/ul?ll=56.971622,24.166368&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative"
                  >
                    <img
                      src="/assets_gallery/zale/img_2357-scaled.webp"
                      srcSet="/assets_gallery/zale/img_2357-400x284.webp 400w, /assets_gallery/zale/img_2357-scaled.webp 1600w"
                      sizes="(max-width: 640px) 100vw, 896px"
                      alt="Gustava Zemgala gatve 71 Zāle Rīgā"
                      width={1600}
                      height={1066}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-72 sm:h-96 object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end justify-between p-6 sm:p-8">
                      <div>
                        <p className="text-white font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider">
                          Gustava Zemgala gatve 71, Rīga
                        </p>
                        <p className="text-slate-200 font-sans text-xs sm:text-sm mt-1">
                          Noklikšķini, lai atvērtu maršrutu savā navigācijas lietotnē
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#dc2626] text-white font-heading text-xs font-bold uppercase tracking-wider shadow">
                        Atvērt maršrutu
                      </span>
                    </div>
                  </a>
                </div>

                {/* Public Transit and Parking Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2.5 text-[#dc2626] font-heading uppercase text-sm font-bold tracking-wider">
                      <Bus className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span>Tramvaji un Autobusi</span>
                    </div>
                    <ul className="text-sm text-slate-700 font-sans space-y-1.5">
                      <li><strong>1. un 3. tramvajs:</strong> pietura "Gustava Zemgala gatve" / "VEF"</li>
                      <li><strong>16., 21., 48. autobuss:</strong> pietura tieši pie Gustava Zemgala gatves</li>
                    </ul>
                  </div>

                  <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2.5 text-[#2563eb] font-heading uppercase text-sm font-bold tracking-wider">
                      <Train className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span>Vilciena satiksme</span>
                    </div>
                    <p className="text-sm text-slate-700 font-sans leading-relaxed">
                      Dzelzceļa stacija <strong>"Zemitāni"</strong> atrodas 5–7 minūšu gājiena attālumā no zāles, nodrošinot ātru nokļūšanu no visas Rīgas un Pierīgas.
                    </p>
                  </div>

                  <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2.5 text-[#0f172a] font-heading uppercase text-sm font-bold tracking-wider">
                      <Car className="w-5 h-5 text-[#dc2626] flex-shrink-0" aria-hidden="true" />
                      <span>Auto stāvvieta</span>
                    </div>
                    <p className="text-sm text-slate-700 font-sans leading-relaxed">
                      <strong>Bezmaksas auto stāvvieta</strong> klientiem un vecākiem atrodas tieši pie ēkas ieejas, tāpēc bērna nogādāšana uz nodarbību ir ērta un ātra.
                    </p>
                  </div>
                </div>
              </div>
            </InteractiveRepelCard>
          </div>
        </div>
      </section>
    </div>
  );
}
