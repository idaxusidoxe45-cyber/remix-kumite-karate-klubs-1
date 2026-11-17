import React, { useState, useEffect, useId, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTab, Testimonial, GalleryItem } from '../types';
import {
  getDynamicTestimonials,
  getDynamicGalleryItems,
  fetchCloudTestimonials,
  fetchCloudGalleryItems,
} from '../data';
import {
  CheckCircle,
  ArrowRight,
  Star,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const trialTimerRef = useRef<number | null>(null);
  const contactTimerRef = useRef<number | null>(null);

  const trialErrorId = useId();
  const contactErrorId = useId();

  useEffect(() => {
    return () => {
      if (trialTimerRef.current !== null) window.clearTimeout(trialTimerRef.current);
      if (contactTimerRef.current !== null) window.clearTimeout(contactTimerRef.current);
    };
  }, []);

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubmitting) return;

    if (formHoneypot) {
      setFormSubmitted(true);
      return;
    }

    if (!formName.trim()) {
      setFormError('Lūdzu, ievadiet savu vārdu.');
      return;
    }

    if (!isValidLatvianPhoneNumber(formPhone)) {
      setFormError('Lūdzu, ievadiet derīgu Latvijas tālruņa numuru (piemēram, +371 29177274).');
      return;
    }

    if (!formGdpr) {
      setFormError('Lūdzu, atzīmējiet piekrišanu personas datu apstrādei.');
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
      trialTimerRef.current = window.setTimeout(() => {
        trialTimerRef.current = null;
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

    if (!contactName.trim()) {
      setContactError('Lūdzu, ievadiet savu vārdu.');
      return;
    }

    if (!EMAIL_REGEX.test(contactEmail.trim())) {
      setContactError('Lūdzu, ievadiet derīgu e-pasta adresi.');
      return;
    }

    if (!contactMessage.trim()) {
      setContactError('Lūdzu, uzrakstiet savu ziņu.');
      return;
    }

    if (!contactGdpr) {
      setContactError('Lūdzu, atzīmējiet piekrišanu personas datu apstrādei.');
      return;
    }

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
      contactTimerRef.current = window.setTimeout(() => {
        contactTimerRef.current = null;
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

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    getDynamicTestimonials({ includeLocal: false })
  );
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() =>
    getDynamicGalleryItems({ includeLocal: false })
  );

  useEffect(() => {
    setTestimonials(getDynamicTestimonials());
    setGalleryList(getDynamicGalleryItems());
    fetchCloudTestimonials().then((revs) => setTestimonials(revs));
    fetchCloudGalleryItems({ previewOnly: true }).then((items) => setGalleryList(items));
  }, []);

  const previewGallery = galleryList.slice(0, 3);

  const ageGroupCards = [
    {
      age: '5 – 6 gadi',
      title: 'Jaunākā grupa',
      desc: 'Pamati, lokanība, koordinācija un rotaļu elementi drošā un draudzīgā vidē.',
      borderClass: 'border-t-[#dc2626]',
      badgeClass: 'bg-[#dc2626]',
      ctaClass: 'text-[#dc2626] hover:text-[#b91c1c]',
    },
    {
      age: '7 – 9 gadi',
      title: 'Vidējā grupa',
      desc: 'Tehnikas pamati, disciplīna, fiziskā sagatavotība un pirmie sasniegumi uz tatami.',
      borderClass: 'border-t-[#2563eb]',
      badgeClass: 'bg-[#2563eb]',
      ctaClass: 'text-[#2563eb] hover:text-[#1d4ed8]',
    },
    {
      age: '10+ gadi',
      title: 'Vecākā grupa',
      desc: 'Padziļināta karatē tehnika, kumite sparingi un sagatavošanās sacensībām.',
      borderClass: 'border-t-[#0f172a]',
      badgeClass: 'bg-[#0a0a0c]',
      ctaClass: 'text-[#dc2626] hover:text-[#b91c1c]',
    },
  ];

  return (
    <div className="text-[#0f172a]">
      {/* Hero Section - Red (Aka), Blue (Ao), White & Black Championship Style */}
      <section className="relative bg-[#0a0a0c] text-white overflow-hidden py-14 sm:py-22 lg:py-32 border-b-8 border-[#dc2626]">
        {/* Dual Red/Blue GPU-composited radial halos visible across mobile, tablet & desktop */}
        <div
          aria-hidden="true"
          className="ambient-orb-primary z-10 absolute -right-24 top-1/4 w-80 h-80 sm:w-[440px] sm:h-[440px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(220, 38, 38, 0.36) 0%, transparent 65%)' }}
        />
        <div
          aria-hidden="true"
          className="ambient-orb-secondary z-10 absolute -left-24 bottom-0 w-72 h-72 sm:w-[380px] sm:h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.30) 0%, transparent 65%)' }}
        />

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
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale contrast-125 pointer-events-none select-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/55 to-[#0a0a0c]/75 pointer-events-none"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left max-w-3xl">
            <div className="hero-stagger-1 flex items-center justify-center lg:justify-start gap-2.5 mb-4 sm:mb-5">
              <Logo variant="dark" className="hidden sm:block w-10 h-10 shadow-lg flex-shrink-0" />
              <span className="inline-block text-center bg-[#1e293b]/95 border border-slate-700 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs uppercase tracking-wider text-slate-100 font-heading font-bold shadow-sm leading-snug">
                <span className="hidden sm:inline">Kumite Karate Klubs • </span>
                <span className="text-[#f87171]">Vairāk</span>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className="text-[#60a5fa]">Ātrāk</span>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className="text-white">Spēcīgāk</span>
              </span>
            </div>

            <h1 className="hero-stagger-2 fluid-hero-title font-heading text-white uppercase tracking-tight font-extrabold mb-4 sm:mb-5 break-words">
              Izmēģini karatē nodarbības un palīdzi savam bērnam kļūt pārliecinātākam
            </h1>
            <p className="hero-stagger-2 text-sm sm:text-base md:text-lg text-slate-200 font-sans mb-7 sm:mb-9 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Kumite Karatē klubs piedāvā jautras un attīstošas karatē un fiziskās sagatavotības nodarbības zēniem un meitenēm no 5 gadu vecuma Rīgā, apvienojot tradicionālo japāņu garu un mūsdienu metodiku.
            </p>

            <div className="hero-stagger-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={openTrialModal}
                className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] hover:brightness-110 hover:shadow-xl hover:shadow-red-600/30 text-white font-heading text-sm xs:text-base sm:text-lg uppercase tracking-wider px-4 sm:px-8 py-3.5 sm:py-4 font-bold transition-all active:scale-[0.97] shadow-xl rounded-xl border border-red-400 cursor-pointer"
              >
                Piesakies bezmaksas nodarbībai
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('about')}
                className="w-full sm:w-auto min-h-[48px] bg-[#1e293b]/95 hover:bg-[#2563eb] text-white font-heading text-sm xs:text-base sm:text-lg uppercase tracking-wider px-4 sm:px-8 py-3.5 sm:py-4 font-bold transition-all active:scale-[0.97] rounded-xl border border-[#2563eb]/60 hover:border-white shadow-md cursor-pointer"
              >
                Uzzini vairāk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm uppercase font-heading tracking-[0.16em] sm:tracking-[0.3em] text-[#2563eb] font-bold">
              Karatē Bērniem un Jauniešiem
            </span>
            <h2 className="fluid-section-title font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">
              Grupu sadalījums pēc vecuma
            </h2>
            <div className="w-24 h-1 kumite-aka-ao-bar mx-auto mt-4 rounded-full stripe-draw" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ageGroupCards.map((group, idx) => (
              <InteractiveRepelCard
                key={group.age}
                maxShift={12}
                maxRotate={5}
                onClick={() => setCurrentTab('schedule')}
              >
                <div
                  data-stagger={String(idx + 1)}
                  className={`scroll-reveal bg-white rounded-2xl shadow-lg p-7 sm:p-8 border-t-8 ${group.borderClass} text-center border-x border-b border-slate-200 h-full flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                >
                  <div>
                    <span className={`inline-block ${group.badgeClass} text-white font-heading text-lg font-bold px-5 py-1.5 rounded-full mb-5 shadow-sm`}>
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
                    className={`mt-6 min-h-[44px] inline-flex items-center justify-center ${group.ctaClass} font-heading uppercase tracking-wider text-base font-bold group cursor-pointer`}
                  >
                    <span>Skatīt grafiku</span>
                    <ArrowRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </button>
                </div>
              </InteractiveRepelCard>
            ))}
          </div>
        </div>
      </section>

      {/* "Pirmais treniņš bez stresa" 3-Step Beginner Guide */}
      <section className="py-16 sm:py-20 bg-transparent border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs sm:text-sm uppercase font-heading tracking-[0.16em] sm:tracking-[0.3em] text-[#dc2626] font-bold">
              Vienkārši un droši
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">
              Pirmais treniņš bez stresa
            </h2>
            <p className="text-slate-600 font-sans text-base mt-3">
              Mēs parūpēsimies, lai bērna pirmā pieredze karatē zālē būtu iedvesmojoša, droša un bez jebkāda satraukuma.
            </p>
            <div className="w-24 h-1 kumite-aka-ao-bar mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <InteractiveRepelCard maxShift={10} maxRotate={4}>
              <div data-stagger="1" className="scroll-reveal bg-[#f8fafc] rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:border-[#dc2626] hover:bg-white hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-12 h-12 rounded-2xl bg-[#dc2626] text-white flex items-center justify-center font-heading text-2xl font-bold shadow-md">
                      1
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mb-3">
                    Bezmaksas pieteikums
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans mb-4">
                    Aizpildi īso anketu zemāk vai piezvani pa tālr.{' '}
                    <a href="tel:+37129177274" className="font-bold text-[#b91c1c] underline">
                      +371 29177274
                    </a>
                    . Mēs atbildēsim un palīdzēsim izvēlēties bērna vecumam un sagatavotībai piemērotāko grupu.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 text-xs font-heading uppercase tracking-wider text-slate-600 font-bold">
                  Nav nepieciešama priekšzināšana
                </div>
              </div>
            </InteractiveRepelCard>

            <InteractiveRepelCard maxShift={10} maxRotate={4}>
              <div data-stagger="2" className="scroll-reveal bg-[#f8fafc] rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:border-[#2563eb] hover:bg-white hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-heading text-2xl font-bold shadow-md">
                      2
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mb-3">
                    Kas jāņem līdzi?
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans mb-4">
                    Kimono pašiem <strong>nav</strong> jāpērk! Pirmā treniņa komplekts ir ļoti vienkāršs:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 font-sans">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" />
                      <span>Ērts sporta tērps (sporta krekls, bikses/šorti)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" />
                      <span>Čības nokļūšanai no ģērbtuves līdz tatami</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" />
                      <span>Dzeramā ūdens pudele (nodarbība notiek ar basām kājām)</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-slate-200/80 text-xs font-heading uppercase tracking-wider text-slate-600 font-bold">
                  Kimono iegūst tikai pēc pirmā eksāmena
                </div>
              </div>
            </InteractiveRepelCard>

            <InteractiveRepelCard maxShift={10} maxRotate={4}>
              <div data-stagger="3" className="scroll-reveal bg-[#f8fafc] rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:border-[#0a0a0c] hover:bg-white hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-12 h-12 rounded-2xl bg-[#0a0a0c] text-white flex items-center justify-center font-heading text-2xl font-bold shadow-md">
                      3
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mb-3">
                    Pirmā tikšanās bez stresa
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans mb-4">
                    Treneris Nikolajs personīgi sagaidīs audzēkni, iepazīstinās ar zāli un bērnu grupu. Nodarbība rit caur spēlēm, koordināciju un drošiem bāzes elementiem.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 font-sans flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#2563eb] flex-shrink-0" aria-hidden="true" />
                    <span><strong>Vecākiem atļauts:</strong> varat palikt zālē un skatīties treniņa norisi!</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200/80 text-xs font-heading uppercase tracking-wider text-slate-600 font-bold">
                  Bezmaksas auto stāvvieta pie zāles
                </div>
              </div>
            </InteractiveRepelCard>
          </div>
        </div>
      </section>

      {/* Free Trial Form Section */}
      <section className="py-16 sm:py-24 bg-[#0a0a0c] text-white border-y-4 border-[#dc2626] content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            <div className="scroll-reveal space-y-6">
              <span className="text-xs sm:text-sm uppercase font-heading tracking-[0.16em] sm:tracking-[0.3em] text-[#60a5fa] font-bold">
                Bezmaksas izmēģinājums
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading text-white uppercase tracking-wide font-bold leading-tight">
                Iepazīšanās nodarbība bezmaksas
              </h2>
              <p className="text-slate-200 text-base leading-relaxed font-sans">
                Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru, un mēs ar tevi sazināsimies.
              </p>
              <div className="space-y-4 pt-2 sm:pt-4">
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
            </div>

            <div data-stagger="2" className="scroll-reveal bg-[#111827] p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-slate-800 border-t-4 border-t-[#2563eb]">
              {formSubmitted ? (
                <div role="status" aria-live="polite" className="text-center py-12 space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#f87171] mx-auto animate-softPop" aria-hidden="true" />
                  <h3 className="text-3xl font-heading text-white font-bold uppercase">
                    Pieteikums nosūtīts!
                  </h3>
                  <p className="text-slate-200 text-base">
                    Paldies! Mēs drīz ar jums sazināsimies.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTrialSubmit} className="space-y-4" noValidate>
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
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      enterKeyHint="next"
                      value={formName}
                      onChange={(e) => {
                        setFormName(e.target.value);
                        if (formError) setFormError('');
                      }}
                      placeholder="Jūsu vārds"
                      className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#2563eb] text-base"
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
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                      value={formPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormPhone((prev) => formatLatvianPhoneNumber(val, prev));
                        if (formError) setFormError('');
                      }}
                      aria-invalid={Boolean(formError) || undefined}
                      aria-describedby={formError ? trialErrorId : undefined}
                      placeholder="+371 29177274"
                      className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#2563eb] text-base font-mono"
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
                      name="message"
                      rows={3}
                      enterKeyHint="send"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Jūsu ziņa vai bērna vecums..."
                      className="w-full bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#2563eb] text-base"
                    />
                  </div>
                  <label htmlFor="home-trial-gdpr" className="flex items-start space-x-3 pt-1 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      id="home-trial-gdpr"
                      name="gdprConsent"
                      required
                      checked={formGdpr}
                      onChange={(e) => {
                        setFormGdpr(e.target.checked);
                        if (e.target.checked && formError) setFormError('');
                      }}
                      className="mt-1 accent-[#dc2626] w-5 h-5 rounded flex-shrink-0 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-slate-200 leading-snug">
                      Piekrītu personas datu apstrādei, lai saņemtu atbildi par izmēģinājuma treniņu.
                    </span>
                  </label>
                  {formError && (
                    <div id={trialErrorId} role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-xl text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{formError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] hover:shadow-2xl hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading text-base sm:text-lg uppercase tracking-wider py-4 rounded-xl font-bold transition-all active:scale-[0.97] shadow-xl border border-red-500/30 cursor-pointer"
                  >
                    {formSubmitting ? 'Sūta...' : 'Nosūtīt pieteikumu'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Club Preview & Video Section */}
      <section className="py-16 sm:py-24 bg-transparent content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            <div className="scroll-reveal">
              <span className="text-xs sm:text-sm uppercase font-heading tracking-[0.16em] sm:tracking-[0.3em] text-[#2563eb] font-bold">
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
                  className="min-h-[48px] w-full sm:w-auto bg-[#0a0a0c] hover:bg-[#2563eb] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.97] shadow-md cursor-pointer"
                >
                  Uzzināt vairāk par klubu
                </button>
              </div>
            </div>

            <div className="w-full">
              <div data-stagger="2" className="scroll-reveal rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-[#dc2626]">
                <YouTubeFacade
                  videoId="B4dpn-buHYk"
                  title="UZ STARTA LĪNIJAS #19 | KARATE"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-16 sm:py-24 bg-[#f8fafc] border-y border-slate-200 content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
            <div>
              <span className="text-xs sm:text-sm uppercase font-heading tracking-[0.16em] sm:tracking-[0.3em] text-[#dc2626] font-bold">
                Mūsu mirkļi
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">
                Galerija un treniņi
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentTab('gallery')}
              className="mt-4 md:mt-0 min-h-[44px] inline-flex items-center text-[#2563eb] hover:text-[#dc2626] font-heading uppercase tracking-wider font-bold text-lg group transition-all cursor-pointer"
            >
              <span>Skatīt visu galeriju</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewGallery.map((item, idx) => (
              <InteractiveRepelCard
                key={item.id}
                maxShift={10}
                maxRotate={5}
                onClick={() => setCurrentTab('gallery')}
              >
                <div
                  data-stagger={String(idx + 1)}
                  className="scroll-reveal group cursor-pointer relative overflow-hidden rounded-xl shadow-md bg-white aspect-[4/3] border border-slate-200 h-full hover:border-[#2563eb] transition-colors duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={284}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/85 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <p className="text-white font-heading uppercase tracking-wider text-lg font-bold">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </InteractiveRepelCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-transparent content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span aria-hidden="true" className="text-6xl text-[#dc2626] font-serif font-bold">
              “
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-1">
              Atsauksmes
            </h2>
            <div className="w-24 h-1 kumite-aka-ao-bar mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials
              .filter((t) => t.status === 'published')
              .slice(0, 3)
              .map((t, idx) => (
                <InteractiveRepelCard key={t.id} maxShift={12} maxRotate={5}>
                  <div
                    data-stagger={String(idx + 1)}
                    className={`scroll-reveal bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 border-t-4 ${
                      idx === 1 ? 'border-t-[#2563eb]' : 'border-t-[#dc2626]'
                    } shadow-md flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="space-y-4">
                      <div className="flex text-[#dc2626] space-x-1" aria-label={`Vērtējums ${t.rating || 5} no 5 zvaigznēm`}>
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
                  </div>
                </InteractiveRepelCard>
              ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 sm:mt-12">
            <button
              type="button"
              onClick={() => navigate('/about#atsauksmes')}
              className="min-h-[48px] w-full sm:w-auto inline-block bg-[#0a0a0c] hover:bg-[#2563eb] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.97] shadow-md cursor-pointer"
            >
              Lasīt visas atsauksmes
            </button>
            {openReviewModal && (
              <button
                type="button"
                onClick={openReviewModal}
                className="min-h-[48px] w-full sm:w-auto inline-block bg-[#dc2626] hover:bg-[#b91c1c] hover:shadow-xl hover:shadow-red-600/25 text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.97] shadow-lg border border-red-500/30 cursor-pointer"
              >
                Atstāt atsauksmi
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Contact & Form Section */}
      <section className="py-16 sm:py-24 bg-[#0a0a0c] text-white border-t-8 border-[#2563eb] content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            <div className="scroll-reveal space-y-6">
              <span className="text-xs sm:text-sm uppercase font-heading tracking-[0.16em] sm:tracking-[0.3em] text-[#f87171] font-bold">
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
                  <Mail className="w-6 h-6 text-[#60a5fa] flex-shrink-0" aria-hidden="true" />
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

            <div data-stagger="2" className="scroll-reveal bg-[#111827] p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-slate-800 border-t-4 border-t-[#dc2626]">
              {contactSubmitted ? (
                <div role="status" aria-live="polite" className="text-center py-12 space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#f87171] mx-auto animate-softPop" aria-hidden="true" />
                  <h3 className="text-3xl font-heading text-white font-bold uppercase">
                    Ziņa nosūtīta!
                  </h3>
                  <p className="text-slate-200 text-base">
                    Paldies! Mēs atbildēsim pēc iespējas ātrāk.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactFormSubmit} className="space-y-4" noValidate>
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
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      enterKeyHint="next"
                      value={contactName}
                      onChange={(e) => {
                        setContactName(e.target.value);
                        if (contactError) setContactError('');
                      }}
                      placeholder="Vārds"
                      className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#2563eb] text-base"
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
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      enterKeyHint="next"
                      value={contactEmail}
                      onChange={(e) => {
                        setContactEmail(e.target.value);
                        if (contactError) setContactError('');
                      }}
                      aria-invalid={Boolean(contactError) || undefined}
                      aria-describedby={contactError ? contactErrorId : undefined}
                      placeholder="E-pasta adrese"
                      className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#2563eb] text-base"
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
                      name="message"
                      rows={3}
                      required
                      enterKeyHint="send"
                      value={contactMessage}
                      onChange={(e) => {
                        setContactMessage(e.target.value);
                        if (contactError) setContactError('');
                      }}
                      placeholder="Jūsu ziņa"
                      className="w-full bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#2563eb] text-base"
                    />
                  </div>
                  <label htmlFor="home-contact-gdpr" className="flex items-start space-x-3 pt-1 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      id="home-contact-gdpr"
                      name="gdprConsent"
                      required
                      checked={contactGdpr}
                      onChange={(e) => {
                        setContactGdpr(e.target.checked);
                        if (e.target.checked && contactError) setContactError('');
                      }}
                      className="mt-1 accent-[#dc2626] w-5 h-5 rounded flex-shrink-0 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-slate-200 leading-snug">
                      Piekrītu personas datu apstrādei atbildes sniegšanai.
                    </span>
                  </label>
                  {contactError && (
                    <div id={contactErrorId} role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-xl text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{contactError}</span>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] hover:shadow-2xl hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.97] shadow-lg border border-red-500/30 cursor-pointer"
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
