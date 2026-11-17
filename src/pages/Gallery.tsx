import React, { useState, useEffect, useId, useMemo, useRef } from 'react';
import { GalleryItem } from '../types';
import { getDynamicGalleryItemsAsync, fetchCloudGalleryItems } from '../data';
import LightboxModal from '../components/LightboxModal';
import { CheckCircle, AlertCircle } from 'lucide-react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import { sendFormToEmail } from '../services/emailService';
import { formatLatvianPhoneNumber, isValidLatvianPhoneNumber } from '../utils/phone';

interface GalleryProps {
  openTrialModal: () => void;
}

const GALLERY_BATCH_SIZE = 24;

export default function Gallery({ openTrialModal: _openTrialModal }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(GALLERY_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    getDynamicGalleryItemsAsync().then((fallbackItems) => {
      if (active) setAllGalleryItems((prev) => (prev.length === 0 ? fallbackItems : prev));
    });
    fetchCloudGalleryItems().then((items) => {
      if (active) setAllGalleryItems(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+371 ');
  const [formMessage, setFormMessage] = useState('');
  const [formHoneypot, setFormHoneypot] = useState('');
  const [formGdpr, setFormGdpr] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const resetTimerRef = useRef<number | null>(null);
  const errorId = useId();

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const categories = [
    { key: 'all', label: 'Visi' },
    { key: 'trenini', label: 'Treniņi' },
    { key: 'eksameni', label: 'Eksāmeni' },
    { key: 'sacensibas', label: 'Sacensības' },
    { key: 'nometnes', label: 'Nometnes' },
    { key: 'pasakumi', label: 'Pasākumi' },
    { key: 'zale', label: 'Zāle' },
  ];

  const filteredItems = useMemo(
    () =>
      activeCategory === 'all'
        ? allGalleryItems
        : allGalleryItems.filter((item) => item.category === activeCategory),
    [allGalleryItems, activeCategory]
  );

  const displayedItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  // Auto-append more gallery photos cleanly as user scrolls down on mobile/desktop
  useEffect(() => {
    if (visibleCount >= filteredItems.length) return;
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((prev) => Math.min(filteredItems.length, prev + GALLERY_BATCH_SIZE));
        }
      },
      { rootMargin: '250px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleCount, filteredItems.length]);

  const handleCategoryChange = (key: string) => {
    setSelectedImageIndex(null);
    setActiveCategory(key);
    setVisibleCount(GALLERY_BATCH_SIZE);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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
      const result = await sendFormToEmail({
        type: 'trial',
        name: formName.trim(),
        phone: formPhone.trim(),
        message: formMessage.trim() || undefined,
        website: formHoneypot,
      });
      if (!result.ok) {
        setFormError(result.error || 'Neizdevās nosūtīt pieteikumu.');
        return;
      }
      setFormSubmitted(true);
      resetTimerRef.current = window.setTimeout(() => {
        resetTimerRef.current = null;
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

  const handleNext = () => {
    if (selectedImageIndex === null || filteredItems.length === 0) return;
    setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedImageIndex === null || filteredItems.length === 0) return;
    setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const selectedItem =
    selectedImageIndex !== null && filteredItems[selectedImageIndex]
      ? filteredItems[selectedImageIndex]
      : null;

  const adjacentSrcs = useMemo(() => {
    if (selectedImageIndex === null || filteredItems.length <= 1) return undefined;
    const len = filteredItems.length;
    const srcs: string[] = [];
    const offsets = [1, -1, 2, -2];
    for (const offset of offsets) {
      const target = filteredItems[(selectedImageIndex + offset + len * 2) % len];
      if (target?.image) srcs.push(target.image);
      if (target?.fullImage && target.fullImage !== target.image) srcs.push(target.fullImage);
    }
    return srcs;
  }, [selectedImageIndex, filteredItems]);

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
            <h1 className="hero-stagger-2 text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-4 leading-tight">
              Galerija
            </h1>
            <p className="hero-stagger-3 text-slate-200 max-w-xl text-base font-sans">
              Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru un mēs ar tevi sazināsimies.
            </p>
          </div>
        </div>
      </section>

      {/* Trial Form inside top section */}
      <section className="py-12 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveRepelCard maxShift={10} maxRotate={4}>
            <div className="bg-[#0a0a0c] text-white p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-slate-800 border-t-4 border-t-[#2563eb]">
              <h2 className="text-2xl sm:text-3xl font-heading text-white uppercase font-bold tracking-wide mb-2">
                Iepazīšanas nodarbība bezmaksas
              </h2>
              <p className="text-sm text-slate-200 mb-6 font-sans">
                Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru un mēs ar tevi sazināsimies.
              </p>

              {formSubmitted ? (
                <div role="status" aria-live="polite" className="text-center py-8 space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#f87171] mx-auto animate-softPop" aria-hidden="true" />
                  <h3 className="text-2xl font-heading text-white uppercase font-bold">
                    Pieteikums nosūtīts!
                  </h3>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gallery-trial-name" className="visually-hidden">
                        Jūsu vārds
                      </label>
                      <input
                        id="gallery-trial-name"
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
                        placeholder="Jūsu vārds *"
                        className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label htmlFor="gallery-trial-phone" className="visually-hidden">
                        Tālruņa numurs
                      </label>
                      <input
                        id="gallery-trial-phone"
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
                        aria-describedby={formError ? errorId : undefined}
                        placeholder="+371 29177274 *"
                        className="w-full min-h-[44px] bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-base font-mono focus:outline-none focus:border-[#2563eb]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="gallery-trial-message" className="visually-hidden">
                      Jūsu ziņa
                    </label>
                    <textarea
                      id="gallery-trial-message"
                      name="message"
                      rows={3}
                      enterKeyHint="send"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Jūsu ziņa vai bērna vecums"
                      className="w-full bg-[#0a0a0c] border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                  <label htmlFor="gallery-trial-gdpr" className="flex items-start space-x-3 pt-1 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      id="gallery-trial-gdpr"
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
                      Piekrītu personas datu apstrādei pieteikuma izskatīšanai.
                    </span>
                  </label>
                  {formError && (
                    <div id={errorId} role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-xl text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{formError}</span>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:scale-[0.97] shadow-lg shadow-red-600/20 border border-red-500/30 cursor-pointer"
                    >
                      {formSubmitting ? 'Sūta...' : 'Nosūtīt'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </InteractiveRepelCard>
        </div>
      </section>

      {/* Gallery Filter & Grid */}
      <section className="py-14 sm:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                aria-pressed={activeCategory === cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`min-h-[44px] font-heading text-xs sm:text-base uppercase tracking-wider px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold transition-all active:scale-[0.96] cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-[#dc2626] text-white shadow-md border border-[#dc2626]'
                    : 'bg-white text-[#0a0a0c] hover:bg-slate-100 hover:border-[#2563eb] border border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div
            key={activeCategory}
            className="animate-fadeIn grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 p-1 sm:p-4"
          >
            {displayedItems.map((item, idx) => (
              <InteractiveRepelCard
                key={item.id}
                maxShift={8}
                maxRotate={3}
                className="h-44 sm:h-64"
              >
                <button
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`Atvērt foto: ${item.title}`}
                  className="scroll-reveal relative w-full h-full text-left overflow-hidden rounded-xl bg-[#0a0a0c] border border-slate-200 group shadow-lg hover:border-[#2563eb] active:scale-[0.98] transition-all cursor-pointer block"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={284}
                    loading={idx < 8 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <span className="inline-block px-2 py-0.5 rounded bg-black/55 backdrop-blur-xs text-white font-semibold text-[11px] sm:text-xs leading-tight">
                      {item.title}
                    </span>
                  </div>
                </button>
              </InteractiveRepelCard>
            ))}
          </div>

          {visibleCount < filteredItems.length && (
            <div ref={sentinelRef} className="mt-10 text-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => Math.min(filteredItems.length, prev + GALLERY_BATCH_SIZE))
                }
                className="min-h-[44px] px-7 py-3 rounded-full bg-[#0a0a0c] hover:bg-[#2563eb] text-white font-heading text-xs sm:text-sm uppercase tracking-wider font-bold transition-all active:scale-[0.97] shadow-md cursor-pointer"
              >
                Rādīt vairāk ({displayedItems.length} / {filteredItems.length})
              </button>
            </div>
          )}
        </div>
      </section>

      <LightboxModal
        item={selectedItem}
        onClose={() => setSelectedImageIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={selectedImageIndex ?? undefined}
        totalCount={filteredItems.length}
        adjacentSrcs={adjacentSrcs}
      />
    </div>
  );
}
