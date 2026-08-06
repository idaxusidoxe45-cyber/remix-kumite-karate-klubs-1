import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data';
import LightboxModal from '../components/LightboxModal';
import { ZoomIn, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';

interface GalleryProps {
  openTrialModal: () => void;
}

export default function Gallery({ openTrialModal }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = [
    { key: 'all', label: 'Visi' },
    { key: 'trenini', label: 'Treniņi' },
    { key: 'eksameni', label: 'Eksāmeni' },
    { key: 'sacensibas', label: 'Sacensības' },
    { key: 'nometnes', label: 'Nometnes' },
    { key: 'pasakumi', label: 'Pasākumi' },
    { key: 'zale', label: 'Zāle' }
  ];

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormName('');
      setFormPhone('');
      setFormMessage('');
    }, 3000);
  };

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-20 lg:py-28 overflow-hidden border-b-8 border-[#dc2626]">
        <div className="absolute inset-0 bg-cover bg-center opacity-25 filter grayscale" style={{ backgroundImage: "url('/assets_gallery/trenini/karate-web-17.webp')" }}></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs sm:text-sm uppercase tracking-widest text-[#dc2626] font-heading font-bold block mb-2">Kumite Karate Klubs</span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-4 leading-tight">Galerija</h1>
            <p className="text-slate-300 max-w-xl text-base font-sans">Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru un mēs ar tevi sazināsimies.</p>
          </motion.div>
        </div>
      </section>

      {/* Trial Form inside top section matching original layout */}
      <section className="py-12 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveRepelCard maxShift={10} maxRotate={4}>
            <div className="bg-[#0a0a0c] text-white p-8 rounded-2xl shadow-2xl border-2 border-slate-800">
              <h3 className="text-2xl sm:text-3xl font-heading text-white uppercase font-bold tracking-wide mb-2">Iepazīšanas nodarbība bezmaksas</h3>
              <p className="text-sm text-slate-300 mb-6 font-sans">Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru un mēs ar tevi sazināsimies.</p>
              
              {formSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#dc2626] mx-auto" />
                  <h4 className="text-2xl font-heading text-white uppercase font-bold">Pieteikums nosūtīts!</h4>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Jūsu vārds"
                      className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-[#dc2626]"
                    />
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="Tālruņa numurs"
                      className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-[#dc2626]"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Jūsu ziņa"
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-[#dc2626]"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-lg uppercase tracking-widest px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 border-white"
                    >
                      Nosūtīt
                    </button>
                  </div>
                </form>
              )}
            </div>
          </InteractiveRepelCard>
        </div>
      </section>

      {/* Gallery Filter & Grid */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`font-heading text-lg uppercase tracking-wider px-6 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 ${
                  activeCategory === cat.key
                    ? 'bg-[#dc2626] text-white shadow-lg border-2 border-white'
                    : 'bg-white text-[#0a0a0c] hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0.4, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
          >
            {filteredItems.map((item, idx) => (
              <InteractiveRepelCard
                key={item.id}
                onClick={() => setSelectedImageIndex(idx)}
                maxShift={8}
                maxRotate={3}
                className="h-64"
              >
                <div className="relative w-full h-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800 group shadow-lg hover:border-[#dc2626] transition-colors">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="text-white font-semibold text-base">{item.title}</p>
                      <p className="text-xs text-slate-300 font-sans">{item.caption}</p>
                    </div>
                  </div>
                </div>
              </InteractiveRepelCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <LightboxModal
        item={selectedImageIndex !== null ? filteredItems[selectedImageIndex] : null}
        onClose={() => setSelectedImageIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
