import React, { useState, useEffect } from 'react';
import { PageTab } from '../types';
import { BELT_SYSTEM, JAPANESE_NUMBERS, STRIKE_LEVELS, FAQ_ITEMS, getDynamicTestimonials } from '../data';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import AccordionItem from '../components/AccordionItem';

interface AboutClubProps {
  setCurrentTab: (tab: PageTab) => void;
  openTrialModal: () => void;
  openReviewModal?: () => void;
}

export default function AboutClub({ setCurrentTab, openTrialModal, openReviewModal }: AboutClubProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openToggle, setOpenToggle] = useState<number | null>(null);

  useEffect(() => {
    if (window.location.hash === '#atsauksmes') {
      const timer = setTimeout(() => {
        const el = document.getElementById('atsauksmes');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const toggleAccordion = (idx: number) => {
    setOpenToggle(openToggle === idx ? null : idx);
  };

  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-20 lg:py-28 overflow-hidden border-b-8 border-[#dc2626]">
        <div className="absolute inset-0 bg-cover bg-center opacity-45 filter grayscale" style={{ backgroundImage: "url('/assets_gallery/trenini/karate-web-17.webp')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs sm:text-sm uppercase tracking-widest text-[#dc2626] font-heading font-bold block mb-2">Kopš 2023</span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">Par Mums</h1>
            <a
              href="https://wa.link/y3zuwq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest px-8 py-3.5 font-bold transition-all transform hover:scale-105 active:scale-95 rounded-lg border-2 border-white shadow-xl"
            >
              Uzdod jautājumu
            </a>
          </motion.div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-12 bg-[#f8fafc] border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="font-heading text-xl sm:text-2xl text-[#0a0a0c] tracking-wide font-bold">
            “Nav jābaidās no tā, kurš praktizē 10 000 dažādus sitienus. Jābaidās no tā, kurš praktizē vienu sitienu 10 000 reizes.” <span className="text-[#dc2626] block mt-2 font-bold text-lg font-serif">— Bruce Lee</span>
          </h3>
        </div>
      </section>

      {/* Main Club Info */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide">Mūsu Klubs</h2>
            <div className="space-y-4 text-slate-700 leading-relaxed font-sans text-lg">
              <p>
                <strong>“Kumite karatē klubs”</strong> ir dibināts 2023. gadā augustā, kā arī iestājas Latvijas Karatē Federācijā.
              </p>
              <p>
                Kluba dibinātājs ir <strong>Nikolajs Bodrovs</strong>.
              </p>
              <p>
                <strong>Kluba mērķis:</strong> ar karatē palīdzību attīstīt bērna fizisko sagatavotību un disciplīnu, stiprināt veselību, iegūt pārliecību un spēt sevi aizstāvēt.
              </p>
              <p>
                Klubs katru gadu organizē bērnu nometnes, attestācijas eksāmenus, kluba iekšējos pasākumus, kā arī piedalās dažāda līmeņa sacensībās gan Latvijā, gan ārzemēs.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={openTrialModal}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest px-8 py-4 rounded-lg font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-white"
              >
                Pievienojies mūsu karatē ģimenei
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coach Intro Teaser */}
      <section className="py-24 bg-[#0a0a0c] text-white border-y-4 border-[#dc2626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveRepelCard maxShift={14} maxRotate={6} onClick={() => setCurrentTab('coaches')}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center p-8 bg-[#111827] rounded-2xl border-2 border-slate-800 cursor-pointer">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-heading text-white text-2xl sm:text-4xl uppercase font-bold tracking-wide">
                  “Karatē ir mācība uz visu mūžu.” (Kenwa Mabuni)
                </h3>
                <p className="text-slate-200 leading-relaxed text-base font-sans">
                  “Kumite karatē klubā” treniņus vada sertificēts (Sertifikāta Nr.: 3973) treneris <strong>Nikolajs Bodrovs (2 DAN)</strong>. Treneris ar karatē nodarbojas kopš 1999. gada. Latvijas izlases sportists no 2009. gada – 2021. gadam. Iekļauts Latvijas karatē federācijas Slavas zālē.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTab('coaches');
                    }}
                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-lg uppercase tracking-widest px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg border-2 border-white cursor-pointer relative z-20"
                  >
                    Vairāk par treneri
                  </button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700">
                <img
                  src="/assets_coaches/ka_00302-edit.webp"
                  alt="Treneris Nikolajs Bodrovs"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </InteractiveRepelCard>
        </div>
      </section>

      {/* Interesting Karate Information / Toggles */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">Zināšanas un terminoloģija</span>
            <h3 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">Interesanta informācija par karatē</h3>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {/* Accordions */}
            {[
              {
                title: 'Eksāmenu sistēma mūsu klubā',
                content: (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800 py-2 font-sans">
                    {BELT_SYSTEM.map((belt, i) => (
                      <li key={i} className="bg-white p-3 rounded-lg shadow-xs border border-slate-200 flex items-center space-x-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
                        <span className="font-semibold">{belt}</span>
                      </li>
                    ))}
                  </ul>
                )
              },
              {
                title: 'Skaitām japāņu valodā',
                content: (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-2">
                    {JAPANESE_NUMBERS.map((n, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg shadow-xs border border-slate-200 text-center">
                        <span className="font-bold text-[#dc2626] block text-xl font-heading">{n.jp}</span>
                        <span className="text-xs text-slate-500 uppercase font-heading font-bold">{n.lv}</span>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                title: 'Sitienu tehnikas nosaukumi',
                content: (
                  <div className="space-y-2 py-2">
                    {STRIKE_LEVELS.map((s, i) => (
                      <div key={i} className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between">
                        <span className="font-heading uppercase text-[#0a0a0c] font-bold text-lg">{s.level}</span>
                        <span className="text-sm text-slate-600 font-sans">{s.desc}</span>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                title: 'Sitieni ar rokām',
                content: (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
                    {['Kizami Zuki', 'Gyaku Zuki', 'Uraken Uchi'].map((h, i) => (
                      <div key={i} className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 text-center font-heading uppercase font-bold text-xl text-[#0a0a0c]">
                        {h}
                      </div>
                    ))}
                  </div>
                )
              },
              {
                title: 'Sitieni ar kājām',
                content: (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
                    {['Mae Geri', 'Yoko Geri', 'Mawashi Geri', 'Ura Mawashi Geri', 'Ushiro Geri'].map((k, i) => (
                      <div key={i} className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 text-center font-heading uppercase font-bold text-xl text-[#0a0a0c]">
                        {k}
                      </div>
                    ))}
                  </div>
                )
              }
            ].map((toggle, idx) => (
              <AccordionItem
                key={idx}
                title={toggle.title}
                isOpen={openToggle === idx}
                onToggle={() => toggleAccordion(idx)}
              >
                {toggle.content}
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#ffffff] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">Atbildes uz jautājumiem</span>
            <h3 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">Biežāk uzdotie jautājumi</h3>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                title={faq.question}
                isOpen={openFaq === idx}
                onToggle={() => toggleFaq(idx)}
                contentClassName="px-5 pb-5 pt-2 text-slate-600 text-base leading-relaxed border-t border-slate-200 bg-white font-sans"
              >
                {faq.answer}
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="atsauksmes" className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-6xl text-[#dc2626] font-serif font-bold">“</span>
            <h3 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-1">Atsauksmes</h3>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getDynamicTestimonials().filter(t => t.status === 'published').map((t, idx) => (
              <InteractiveRepelCard key={t.id} maxShift={14} maxRotate={6}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="bg-white rounded-xl p-8 border border-slate-200 shadow-md flex flex-col justify-between h-full hover:shadow-xl hover:border-[#dc2626] transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex text-amber-500 space-x-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 italic text-sm leading-relaxed font-sans whitespace-pre-line">{t.text}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <h4 className="font-heading uppercase tracking-wider text-[#0a0a0c] text-lg font-bold">{t.author}</h4>
                    {t.role && <span className="text-xs text-slate-400 font-sans">{t.role}</span>}
                  </div>
                </motion.div>
              </InteractiveRepelCard>
            ))}
          </div>

          {openReviewModal && (
            <div className="text-center mt-12">
              <button
                onClick={openReviewModal}
                className="inline-block bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-lg uppercase tracking-wider px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md border-2 border-white"
              >
                Atstāt atsauksmi
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
