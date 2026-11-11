import React, { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTab, Testimonial, GalleryItem } from '../types';
import {
  getDynamicTestimonials,
  getDynamicGalleryItems,
  fetchCloudTestimonials,
  fetchCloudGalleryItems,
} from '../data';
import { CheckCircle, ArrowRight, Star, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { m } from 'motion/react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import { Logo } from '../components/Logo';
import YouTubeFacade from '../components/YouTubeFacade';
import { sendFormToEmail } from '../services/emailService';
import { formatLatvianPhoneNumber, isValidLatvianPhoneNumber } from '../utils/phone';

interface HomeProps {
  setCurrentTab: (tab: PageTab) => void;
  openTrialModal: () => void;
  openReviewModal?: () => void;
}

export default function Home({ setCurrentTab, openTrialModal, openReviewModal }: HomeProps) {
  const navigate = useNavigate();

  // Quick Free Trial form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+371 ');
  const [formMessage, setFormMessage] = useState('');
  const [formHoneypot, setFormHoneypot] = useState('');
  const [formGdpr, setFormGdpr] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Bottom Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactHoneypot, setContactHoneypot] = useState('');
  const [contactGdpr, setContactGdpr] = useState(true);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const trialErrorId = useId();
  const contactErrorId = useId();

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubmitting) return;

    if (formHoneypot) {
      setFormSubmitted(true);
      return;
    }
    if (!formName.trim() || !formGdpr) return;

    if (!isValidLatvianPhoneNumber(formPhone)) {
      setFormError('Lūdzu, ievadiet derīgu Latvijas tālruņa numuru (piemēram, +371 29177274).');
      return;
    }

    setFormSubmitting(true);
    setFormError('');
    try {
      const res = await sendFormToEmail({
        type: 'trial',
        name: formName.trim(),
        phone: formPhone.trim(),
        message: formMessage.trim() || undefined,
        website: formHoneypot,
      });
      if (!res.ok) {
        setFormError(res.error || 'Neizdevās nosūtīt pieteikumu.');
        return;
      }
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormName('');
        setFormPhone('+371 ');
        setFormMessage('');
        setFormHoneypot('');
      }, 3000);
    } catch {
      setFormError('Savienojuma kļūda.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactSubmitting) return;

    if (contactHoneypot) {
      setContactSubmitted(true);
      return;
    }
    if (!contactName.trim() || !contactEmail.trim() || !contactGdpr) return;

    setContactSubmitting(true);
    setContactError('');
    try {
      const res = await sendFormToEmail({
        type: 'contact',
        name: contactName.trim(),
        email: contactEmail.trim(),
        message: contactMessage.trim() || undefined,
        website: contactHoneypot,
      });
      if (!res.ok) {
        setContactError(res.error || 'Neizdevās nosūtīt ziņu.');
        return;
      }
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setContactHoneypot('');
      }, 3000);
    } catch {
      setContactError('Savienojuma kļūda.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getDynamicTestimonials());
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() => getDynamicGalleryItems());

  useEffect(() => {
    fetchCloudTestimonials().then((revs) => setTestimonials(revs));
    fetchCloudGalleryItems().then((items) => setGalleryList(items));
  }, []);

  const previewGallery = galleryList.slice(0, 3);

  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Section - High-Impact Red, Black & White Graphic Style with subtle blue accents */}
      <section className="relative bg-[#0a0a0c] text-white overflow-hidden py-24 lg:py-36 border-b-8 border-[#dc2626]">
        {/* Desktop glow blob (hidden on weak mobile GPUs) */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-tr from-[#dc2626]/40 via-[#2563eb]/20 to-transparent opacity-60 blur-3xl pointer-events-none animate-pulse-slow"
        />
        <img
          src="/assets_gallery/trenini/karate-web-17.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity filter contrast-125 pointer-events-none select-none"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left max-w-3xl"
          >
            <div className="flex items-center justify-center lg:justify-start space-x-2.5 mb-5 flex-wrap gap-y-2">
              <Logo variant="dark" className="w-8 h-8 sm:w-10 sm:h-10 shadow-lg flex-shrink-0" />
              <span className="inline-flex items-center bg-[#1e293b]/90 border border-slate-700/80 px-3 py-1 rounded-full text-[11px] sm:text-xs uppercase tracking-wider text-[#f87171] font-heading font-bold shadow-sm">
                Kumite Karate Klubs • Vairāk • Ātrāk • Spēcīgāk
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white uppercase tracking-tight font-extrabold leading-tight mb-5 break-words">
              Izmēģini karatē nodarbības un palīdzi savam bērnam kļūt pārliecinātākam
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-200 font-sans mb-8 sm:mb-10 leading-relaxed max-w-2xl">
              Kumite Karatē klubs piedāvā jautras un attīstošas karatē un fiziskās sagatavotības nodarbības zēniem un meitenēm no 5 gadu vecuma Rīgā, apvienojot tradicionālo japāņu garu un mūsdienu metodiku.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 w-full">
              <m.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openTrialModal}
                className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 font-bold transition-all shadow-xl rounded-xl border border-red-500 hover:border-red-400 cursor-pointer"
              >
                Piesakies bezmaksas nodarbībai
              </m.button>
              <m.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentTab('about')}
                className="w-full sm:w-auto min-h-[48px] bg-[#1e293b]/90 hover:bg-[#334155] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 font-bold transition-all rounded-xl border border-slate-700 shadow-md cursor-pointer"
              >
                Uzzini vairāk
              </m.button>
            </div>
          </m.div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-24 bg-[#f8fafc] border-b border-slate-200 content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">
              Karatē Bērniem un Jauniešiem
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">
              Grupu sadalījums pēc vecuma
            </h2>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full" />
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                age: '5 – 6 gadi',
                title: 'Jaunākā grupa',
                desc: 'Pamati, lokanība, koordinācija un rotaļu elementi drošā un draudzīgā vidē.',
              },
              {
                age: '7 – 9 gadi',
                title: 'Vidējā grupa',
                desc: 'Tehnikas pamati, disciplīna, fiziskā sagatavotība un pirmie sasniegumi uz tatami.',
              },
              {
                age: '10+ gadi',
                title: 'Vecākā grupa',
                desc: 'Padziļināta karatē tehnika, kumite sparingi un sagatavošanās sacensībām.',
              },
            ].map((group, idx) => (
              <InteractiveRepelCard
                key={idx}
                maxShift={14}
                maxRotate={6}
                onClick={() => setCurrentTab('schedule')}
              >
                <m.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-8 border-t-8 border-[#dc2626] text-center border-x border-b border-slate-200 h-full flex flex-col justify-between hover:shadow-xl transition-shadow"
                >
                  <div>
                    <span className="inline-block bg-[#0f172a] text-white font-heading text-lg font-bold px-5 py-1.5 rounded-full mb-5 shadow-sm">
                      {group.age}
                    </span>
                    <h3 className="text-2xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mb-3">
                      {group.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-sans">{group.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTab('schedule');
                    }}
                    className="mt-6 min-h-[44px] inline-flex items-center justify-center text-[#dc2626] hover:text-[#b91c1c] font-heading uppercase tracking-wider text-base font-bold group cursor-pointer"
                  >
                    <span>Skatīt grafiku</span>
                    <ArrowRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </button>
                </m.div>
              </InteractiveRepelCard>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial Form Section */}
      <section className="py-24 bg-[#0a0a0c] text-white border-y-4 border-[#dc2626] content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <m.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#60a5fa] font-bold">
                Bezmaksas izmēģinājums
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading text-white uppercase tracking-wide font-bold leading-tight">
                Iepazīšanās nodarbība bezmaksas
              </h2>
              <p className="text-slate-200 text-base leading-relaxed font-sans">
                Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru, un mēs ar tevi sazināsimies.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3 text-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-bold font-heading text-lg shadow flex-shrink-0">
                    1
                  </div>
                  <span className="font-medium">Aizpildi vienkāršu pieteikuma formu</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold font-heading text-lg shadow flex-shrink-0">
                    2
                  </div>
                  <span className="font-medium">Saņem mūsu zvanu un saskaņo sev ērtu laiku</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-bold font-heading text-lg shadow flex-shrink-0">
                    3
                  </div>
                  <span className="font-medium">Apmeklē pirmo treniņu pilnīgi bez maksas!</span>
                </div>
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
              className="bg-[#111827] p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-slate-800"
            >
              {formSubmitted ? (
                <div role="status" aria-live="polite" className="text-center py-12 space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#f87171] mx-auto animate-bounce" aria-hidden="true" />
                  <h3 className="text-3xl font-heading text-white font-bold uppercase">
                    Pieteikums nosūtīts!
                  </h3>
                  <p className="text-slate-200 text-base">
                    Paldies! Mēs drīz ar jums sazināsimies.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTrialSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="website"
                    className="visually-hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                    value={formHoneypot}
                    onChange={(e) => setFormHoneypot(e.target.value)}
                  />
                  <div>
                    <label
                      htmlFor="home-trial-name"
                      className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-2 font-bold"
                    >
                      Jūsu vārds *
                    </label>
                    <input
                      id="home-trial-name"
                      type="text"
                      required
                      autoComplete="name"
                      enterKeyHint="next"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Jūsu vārds"
                      className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="home-trial-phone"
                      className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-2 font-bold"
                    >
                      Tālruņa numurs *
                    </label>
                    <input
                      id="home-trial-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                      value={formPhone}
                      onChange={(e) => {
                        setFormPhone(formatLatvianPhoneNumber(e.target.value));
                        if (formError) setFormError('');
                      }}
                      aria-invalid={Boolean(formError) || undefined}
                      aria-describedby={formError ? trialErrorId : undefined}
                      placeholder="+371 29177274"
                      className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base font-mono"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="home-trial-message"
                      className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-2 font-bold"
                    >
                      Jūsu ziņa
                    </label>
                    <textarea
                      id="home-trial-message"
                      rows={3}
                      enterKeyHint="send"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Jūsu ziņa vai bērna vecums..."
                      className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div className="flex items-start space-x-3 pt-1">
                    <input
                      type="checkbox"
                      id="home-trial-gdpr"
                      required
                      checked={formGdpr}
                      onChange={(e) => setFormGdpr(e.target.checked)}
                      className="mt-1 accent-[#dc2626] w-5 h-5 rounded flex-shrink-0 cursor-pointer"
                    />
                    <label htmlFor="home-trial-gdpr" className="text-xs sm:text-sm text-slate-200 leading-snug cursor-pointer">
                      Piekrītu personas datu apstrādei, lai saņemtu atbildi par izmēģinājuma treniņu.
                    </label>
                  </div>
                  {formError && (
                    <div id={trialErrorId} role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{formError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={!formGdpr || formSubmitting}
                    className="w-full min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading text-lg sm:text-xl uppercase tracking-widest py-4 rounded-lg font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl border-2 border-white cursor-pointer"
                  >
                    {formSubmitting ? 'Sūta...' : 'Nosūtīt pieteikumu'}
                  </button>
                </form>
              )}
            </m.div>
          </div>
        </div>
      </section>

      {/* About Club Preview & Video Section */}
      <section className="py-24 bg-[#ffffff] content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">
                Pievienojies ģimenei
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2 mb-6">
                Pievienojies mūsu karatē ģimenei
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed text-base font-sans">
                <p>
                  Karatē ir japāņu cīņas māksla, kurā kā ieroci izmanto visu cilvēka ķermeni, piemēram rokas, dūres, elkoņus, kājas, ceļgalus.
                </p>
                <p>
                  Karatē liela nozīme ir cilvēka garīgajam spēkam un labai disciplīnai, kā arī tā mērķis ir attīstīt ķermeņa fiziskās īpašības.
                </p>
                <p>
                  Mēs ticam, ka pašdisciplīna un fiziskā sagatavotība ir pamats veselai dzīvei. Parādi savam bērnam ceļu uz drosmi un pārliecību kopā ar mums!
                </p>
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentTab('about')}
                  className="min-h-[48px] w-full sm:w-auto bg-[#0a0a0c] hover:bg-[#dc2626] text-white font-heading text-lg uppercase tracking-wider px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                >
                  Uzzināt vairāk par klubu
                </button>
              </div>
            </m.div>

            <div className="w-full">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-[#dc2626]"
              >
                <YouTubeFacade
                  videoId="B4dpn-buHYk"
                  title="UZ STARTA LĪNIJAS #19 | KARATE"
                />
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-24 bg-[#f8fafc] border-y border-slate-200 content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">
                Mūsu mirkļi
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">
                Galerija un treniņi
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentTab('gallery')}
              className="mt-4 md:mt-0 min-h-[44px] inline-flex items-center text-[#dc2626] hover:text-[#b91c1c] font-heading uppercase tracking-wider font-bold text-lg group transition-all cursor-pointer"
            >
              <span>Skatīt visu galeriju</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewGallery.map((item, idx) => (
              <InteractiveRepelCard
                key={item.id}
                maxShift={12}
                maxRotate={6}
                onClick={() => setCurrentTab('gallery')}
              >
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="group cursor-pointer relative overflow-hidden rounded-xl shadow-md bg-white aspect-[4/3] border border-slate-200 h-full hover:border-[#dc2626] transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/90 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white font-heading uppercase tracking-wider text-xl font-bold">
                      {item.caption}
                    </p>
                  </div>
                </m.div>
              </InteractiveRepelCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#ffffff] content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span aria-hidden="true" className="text-6xl text-[#dc2626] font-serif font-bold">
              “
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-1">
              Atsauksmes
            </h2>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials
              .filter((t) => t.status === 'published')
              .slice(0, 3)
              .map((t, idx) => (
                <InteractiveRepelCard key={t.id} maxShift={14} maxRotate={6}>
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.3, delay: idx * 0.08 }}
                    className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md flex flex-col justify-between h-full hover:shadow-xl hover:border-[#dc2626] transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex text-amber-500 space-x-1" aria-label={`Vērtējums ${t.rating || 5} no 5 zvaigznēm`}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      <p className="text-slate-700 italic text-sm leading-relaxed font-sans whitespace-pre-line">
                        {t.text}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <p className="font-heading uppercase tracking-wider text-[#0a0a0c] text-lg font-bold">
                        {t.author}
                      </p>
                      {t.role && <span className="text-xs text-slate-600 font-sans">{t.role}</span>}
                    </div>
                  </m.div>
                </InteractiveRepelCard>
              ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            <button
              type="button"
              onClick={() => navigate('/about#atsauksmes')}
              className="min-h-[48px] w-full sm:w-auto inline-block bg-[#0a0a0c] hover:bg-[#dc2626] text-white font-heading text-lg uppercase tracking-wider px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              Lasīt visas atsauksmes
            </button>
            {openReviewModal && (
              <button
                type="button"
                onClick={openReviewModal}
                className="min-h-[48px] w-full sm:w-auto inline-block bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-lg uppercase tracking-wider px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md border-2 border-white cursor-pointer"
              >
                Atstāt atsauksmi
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Contact & Form Section */}
      <section className="py-24 bg-[#0a0a0c] text-white border-t-8 border-[#dc2626] content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#f87171] font-bold">
                Sazinies ar mums
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading text-white uppercase tracking-wide font-bold mb-6">
                Kumite Karate
              </h2>
              <div className="space-y-4 text-slate-200 font-sans">
                <p className="flex items-center space-x-3 text-lg">
                  <MapPin className="w-6 h-6 text-[#f87171] flex-shrink-0" aria-hidden="true" />
                  <span>Zāles adrese: Rīga, Gustava Zemgala gatve 71</span>
                </p>
                <p className="flex items-center space-x-3 text-lg">
                  <Mail className="w-6 h-6 text-[#f87171] flex-shrink-0" aria-hidden="true" />
                  <span>
                    E-Pasts:{' '}
                    <a href="mailto:info@kumitekarate.lv" className="underline hover:text-white">
                      info@kumitekarate.lv
                    </a>
                  </span>
                </p>
                <p className="flex items-center space-x-3 text-lg">
                  <Phone className="w-6 h-6 text-[#f87171] flex-shrink-0" aria-hidden="true" />
                  <span>
                    Telefona numurs:{' '}
                    <a href="tel:+37129177274" className="underline hover:text-white">
                      +371 29177274
                    </a>
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-slate-800">
              {contactSubmitted ? (
                <div role="status" aria-live="polite" className="text-center py-12 space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#f87171] mx-auto animate-bounce" aria-hidden="true" />
                  <h3 className="text-3xl font-heading text-white font-bold uppercase">
                    Ziņa nosūtīta!
                  </h3>
                  <p className="text-slate-200 text-base">
                    Paldies! Mēs atbildēsim pēc iespējas ātrāk.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="website"
                    className="visually-hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                    value={contactHoneypot}
                    onChange={(e) => setContactHoneypot(e.target.value)}
                  />
                  <div>
                    <label
                      htmlFor="home-contact-name"
                      className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold"
                    >
                      Vārds *
                    </label>
                    <input
                      id="home-contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      enterKeyHint="next"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Vārds"
                      className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="home-contact-email"
                      className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold"
                    >
                      E-pasta adrese *
                    </label>
                    <input
                      id="home-contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      enterKeyHint="next"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="E-pasta adrese"
                      className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="home-contact-message"
                      className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold"
                    >
                      Jūsu ziņa *
                    </label>
                    <textarea
                      id="home-contact-message"
                      rows={3}
                      required
                      enterKeyHint="send"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Jūsu ziņa"
                      className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div className="flex items-start space-x-3 pt-1">
                    <input
                      type="checkbox"
                      id="home-contact-gdpr"
                      required
                      checked={contactGdpr}
                      onChange={(e) => setContactGdpr(e.target.checked)}
                      className="mt-1 accent-[#dc2626] w-5 h-5 rounded flex-shrink-0 cursor-pointer"
                    />
                    <label htmlFor="home-contact-gdpr" className="text-xs sm:text-sm text-slate-200 leading-snug cursor-pointer">
                      Piekrītu personas datu apstrādei atbildes sniegšanai.
                    </label>
                  </div>
                  {contactError && (
                    <div id={contactErrorId} role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{contactError}</span>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!contactGdpr || contactSubmitting}
                      className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading text-lg uppercase tracking-widest px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg border-2 border-white cursor-pointer"
                    >
                      {contactSubmitting ? 'Sūta...' : 'Nosūtīt'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
