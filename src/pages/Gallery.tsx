import React, { useState, useEffect, useId } from 'react';
import { GalleryItem } from '../types';
import { getDynamicGalleryItems, fetchCloudGalleryItems } from '../data';
import LightboxModal from '../components/LightboxModal';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { m } from 'motion/react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import { sendFormToEmail } from '../services/emailService';
import { formatLatvianPhoneNumber, isValidLatvianPhoneNumber } from '../utils/phone';

interface GalleryProps {
  openTrialModal: () => void;
}

export default function Gallery({ openTrialModal: _openTrialModal }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>(() => getDynamicGalleryItems());

  useEffect(() => {
    fetchCloudGalleryItems().then((items) => setAllGalleryItems(items));
  }, []);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+371 ');
  const [formMessage, setFormMessage] = useState('');
  const [formHoneypot, setFormHoneypot] = useState('');
  const [formGdpr, setFormGdpr] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const errorId = useId();

  const categories = [
    { key: 'all', label: 'Visi' },
    { key: 'trenini', label: 'Treniņi' },
    { key: 'eksameni', label: 'Eksāmeni' },
    { key: 'sacensibas', label: 'Sacensības' },
    { key: 'nometnes', label: 'Nometnes' },
    { key: 'pasakumi', label: 'Pasākumi' },
    { key: 'zale', label: 'Zāle' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? allGalleryItems
      : allGalleryItems.filter((item) => item.category === activeCategory);

  const handleCategoryChange = (key: string) => {
    setSelectedImageIndex(null);
    setActiveCategory(key);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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

  const adjacentSrcs =
    selectedImageIndex !== null && filteredItems.length > 1
      ? [
          filteredItems[(selectedImageIndex + 1) % filteredItems.length]?.fullImage ||
            filteredItems[(selectedImageIndex + 1) % filteredItems.length]?.image,
          filteredItems[(selectedImageIndex - 1 + filteredItems.length) % filteredItems.length]?.fullImage ||
            filteredItems[(selectedImageIndex - 1 + filteredItems.length) % filteredItems.length]?.image,
        ]
      : undefined;

  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-20 lg:py-28 overflow-hidden border-b-8 border-[#dc2626]">
        <img
          src="/assets_gallery/trenini/karate-web-17.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-45 filter grayscale pointer-events-none select-none"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-xs sm:text-sm uppercase tracking-widest text-[#f87171] font-heading font-bold block mb-2">
              Kumite Karate Klubs
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-4 leading-tight">
              Galerija
            </h1>
            <p className="text-slate-200 max-w-xl text-base font-sans">
              Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru un mēs ar tevi sazināsimies.
            </p>
          </m.div>
        </div>
      </section>

      {/* Trial Form inside top section */}
      <section className="py-12 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveRepelCard maxShift={10} maxRotate={4}>
            <div className="bg-[#0a0a0c] text-white p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-slate-800">
              <h2 className="text-2xl sm:text-3xl font-heading text-white uppercase font-bold tracking-wide mb-2">
                Iepazīšanas nodarbība bezmaksas
              </h2>
              <p className="text-sm text-slate-200 mb-6 font-sans">
                Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru un mēs ar tevi sazināsimies.
              </p>

              {formSubmitted ? (
                <div role="status" aria-live="polite" className="text-center py-8 space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#f87171] mx-auto" aria-hidden="true" />
                  <h3 className="text-2xl font-heading text-white uppercase font-bold">
                    Pieteikums nosūtīts!
                  </h3>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
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
                        type="text"
                        required
                        autoComplete="name"
                        enterKeyHint="next"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Jūsu vārds *"
                        className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                      />
                    </div>
                    <div>
                      <label htmlFor="gallery-trial-phone" className="visually-hidden">
                        Tālruņa numurs
                      </label>
                      <input
                        id="gallery-trial-phone"
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
                        aria-describedby={formError ? errorId : undefined}
                        placeholder="+371 29177274 *"
                        className="w-full min-h-[44px] bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base font-mono focus:outline-none focus:border-[#dc2626]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="gallery-trial-message" className="visually-hidden">
                      Jūsu ziņa
                    </label>
                    <textarea
                      id="gallery-trial-message"
                      rows={3}
                      enterKeyHint="send"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Jūsu ziņa vai bērna vecums"
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-base focus:outline-none focus:border-[#dc2626]"
                    />
                  </div>
                  <div className="flex items-start space-x-3 pt-1">
                    <input
                      type="checkbox"
                      id="gallery-trial-gdpr"
                      required
                      checked={formGdpr}
                      onChange={(e) => setFormGdpr(e.target.checked)}
                      className="mt-1 accent-[#dc2626] w-5 h-5 rounded flex-shrink-0 cursor-pointer"
                    />
                    <label htmlFor="gallery-trial-gdpr" className="text-xs sm:text-sm text-slate-200 leading-snug cursor-pointer">
                      Piekrītu personas datu apstrādei pieteikuma izskatīšanai.
                    </label>
                  </div>
                  {formError && (
                    <div id={errorId} role="alert" className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{formError}</span>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!formGdpr || formSubmitting}
                      className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading text-lg uppercase tracking-widest px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 border-white cursor-pointer"
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
      <section className="py-16 sm:py-24 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                aria-pressed={activeCategory === cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`min-h-[44px] font-heading text-xs sm:text-base uppercase tracking-wider px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold transition-colors duration-200 cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-[#dc2626] text-white shadow-md border-2 border-[#0a0a0c]'
                    : 'bg-white text-[#0a0a0c] hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <m.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 p-1 sm:p-4 content-visibility-auto"
          >
            {filteredItems.map((item, idx) => (
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
                  className="relative w-full h-full text-left overflow-hidden rounded-xl bg-gray-900 border border-gray-800 group shadow-lg hover:border-[#dc2626] transition-colors cursor-pointer block"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 sm:p-4">
                    <div>
                      <p className="text-white font-semibold text-xs sm:text-base leading-tight">
                        {item.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-200 font-sans hidden xs:block">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </button>
              </InteractiveRepelCard>
            ))}
          </m.div>
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
