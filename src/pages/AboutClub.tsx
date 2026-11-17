import React, { useState, useEffect } from 'react';
import { PageTab, Testimonial, BeltDetail } from '../types';
import {
  BELT_SYSTEM,
  JAPANESE_NUMBERS,
  STRIKE_LEVELS,
  FAQ_ITEMS,
  getDynamicTestimonials,
  fetchCloudTestimonials,
  getBeltSystemDetailsAsync,
} from '../data';
import { Star, ChevronDown } from 'lucide-react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import AccordionItem from '../components/AccordionItem';

interface AboutClubProps {
  setCurrentTab: (tab: PageTab) => void;
  openTrialModal: () => void;
  openReviewModal?: () => void;
}

export default function AboutClub({
  setCurrentTab,
  openTrialModal,
  openReviewModal,
}: AboutClubProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openToggle, setOpenToggle] = useState<number | null>(null);
  const [beltDetails, setBeltDetails] = useState<BeltDetail[] | null>(null);
  const [selectedBeltId, setSelectedBeltId] = useState<number | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    getDynamicTestimonials({ includeLocal: false })
  );

  useEffect(() => {
    setTestimonials(getDynamicTestimonials());
    fetchCloudTestimonials().then((revs) => setTestimonials(revs));
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const toggleAccordion = (idx: number) => {
    const next = openToggle === idx ? null : idx;
    setOpenToggle(next);
    if (next === 0 && !beltDetails) {
      void getBeltSystemDetailsAsync().then((details) => setBeltDetails(details));
    }
  };

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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <span className="hero-stagger-1 text-xs sm:text-sm uppercase tracking-widest text-[#60a5fa] font-heading font-bold block mb-2">
              Kopš 2023
            </span>
            <h1 className="hero-stagger-2 text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">
              Par Mums
            </h1>
            <div className="hero-stagger-3">
              <a
                href="https://wa.link/y3zuwq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] text-center inline-flex items-center justify-center bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-6 sm:px-8 py-3.5 font-bold transition-all hover:-translate-y-0.5 active:scale-[0.97] rounded-xl border border-red-500/30 shadow-xl"
              >
                Uzdod jautājumu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-10 sm:py-12 bg-[#f8fafc] border-b border-slate-200 text-center">
        <div className="scroll-reveal max-w-4xl mx-auto px-4">
          <blockquote className="font-heading text-xl sm:text-2xl text-[#0a0a0c] tracking-wide font-bold">
            “Nav jābaidās no tā, kurš praktizē 10 000 dažādus sitienus. Jābaidās no tā, kurš praktizē vienu sitienu 10 000 reizes.”{' '}
            <cite className="not-italic text-[#dc2626] block mt-2 font-bold text-lg font-serif">
              — Bruce Lee
            </cite>
          </blockquote>
        </div>
      </section>

      {/* Main Club Info */}
      <section className="py-16 sm:py-24 bg-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal space-y-6">
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide">
              Mūsu Klubs
            </h2>
            <div className="w-20 h-1 kumite-aka-ao-bar rounded-full stripe-draw" />
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
                type="button"
                onClick={openTrialModal}
                className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-4 rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 active:scale-[0.97] border border-red-500/30 cursor-pointer"
              >
                Pievienojies mūsu karatē ģimenei
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Intro Teaser */}
      <section className="py-16 sm:py-24 bg-[#0a0a0c] text-white border-y-4 border-[#2563eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveRepelCard maxShift={12} maxRotate={5} onClick={() => setCurrentTab('coaches')}>
            <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 items-center p-6 sm:p-8 bg-[#111827] rounded-2xl border-2 border-slate-800 hover:border-[#2563eb] transition-colors cursor-pointer">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-heading text-white text-2xl sm:text-4xl uppercase font-bold tracking-wide">
                  “Karatē ir mācība uz visu mūžu.” (Kenwa Mabuni)
                </h2>
                <p className="text-slate-200 leading-relaxed text-base font-sans">
                  “Kumite karatē klubā” treniņus vada sertificēts (Sertifikāta Nr.: 3973) treneris{' '}
                  <strong>Nikolajs Bodrovs (2 DAN)</strong>. Treneris ar karatē nodarbojas kopš 1999. gada. Latvijas izlases sportists no 2009. gada – 2021. gadam. Iekļauts Latvijas karatē federācijas Slavas zālē.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTab('coaches');
                    }}
                    className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:scale-[0.97] shadow-lg border border-red-500/30 cursor-pointer relative z-20"
                  >
                    Vairāk par treneri
                  </button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700">
                <img
                  src="/assets_coaches/ka_00302-edit.webp"
                  alt="Treneris Nikolajs Bodrovs"
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-72 sm:h-80 object-cover"
                />
              </div>
            </div>
          </InteractiveRepelCard>
        </div>
      </section>

      {/* Interesting Karate Information / Interactive Accordions */}
      <section className="py-16 sm:py-24 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center mb-12 sm:mb-16">
            <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#2563eb] font-bold">
              Zināšanas un terminoloģija
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">
              Interesanta informācija par karatē
            </h2>
            <div className="w-24 h-1 kumite-aka-ao-bar mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Eksāmenu sistēma mūsu klubā',
                content: beltDetails ? (
                  <div className="py-2 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-600 font-sans">
                      Noklikšķiniet uz jebkuras pakāpes, lai apskatītu prasības (Kihon, Kata, Kumite):
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800 font-sans">
                      {beltDetails.map((belt) => {
                        const isSelected = selectedBeltId === belt.id;
                        return (
                          <li key={belt.id} className="col-span-1">
                            <button
                              type="button"
                              aria-expanded={isSelected}
                              onClick={() => setSelectedBeltId(isSelected ? null : belt.id)}
                              className={`w-full min-h-[44px] bg-white p-3 rounded-lg shadow-xs border text-left flex items-center justify-between gap-2 transition-all cursor-pointer active:scale-[0.985] ${
                                isSelected ? 'border-[#2563eb] ring-1 ring-[#2563eb]' : 'border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              <span className="flex items-center space-x-3 min-w-0">
                                <span
                                  aria-hidden="true"
                                  className="w-7 h-3.5 rounded-sm border border-slate-300 flex-shrink-0"
                                  style={{
                                    background: belt.secondaryColor
                                      ? `linear-gradient(90deg, ${belt.primaryColor} 50%, ${belt.secondaryColor} 50%)`
                                      : belt.primaryColor,
                                  }}
                                />
                                <span className="font-semibold text-sm truncate">{belt.label}</span>
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                                  isSelected ? 'rotate-180 text-[#2563eb]' : ''
                                }`}
                                aria-hidden="true"
                              />
                            </button>
                            {isSelected && (
                              <div className="mt-1.5 bg-white border border-slate-200 rounded-lg p-3.5 text-xs sm:text-sm space-y-2 animate-fadeIn">
                                <p className="font-semibold text-[#0a0a0c]">{belt.focus}</p>
                                <p><strong>Kihon:</strong> {belt.kihon}</p>
                                <p><strong>Kata:</strong> {belt.kata}</p>
                                <p><strong>Kumite:</strong> {belt.kumite}</p>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800 py-2 font-sans">
                    {BELT_SYSTEM.map((belt, i) => (
                      <li key={i} className="bg-white p-3 rounded-lg shadow-xs border border-slate-200 flex items-center space-x-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] flex-shrink-0" />
                        <span className="font-semibold">{belt}</span>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: 'Skaitām japāņu valodā',
                content: (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-2">
                    {JAPANESE_NUMBERS.map((n, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg shadow-xs border border-slate-200 text-center">
                        <span className={`font-bold block text-xl font-heading ${i % 2 === 0 ? 'text-[#dc2626]' : 'text-[#2563eb]'}`}>{n.jp}</span>
                        <span className="text-xs text-slate-600 uppercase font-heading font-bold">{n.lv}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                title: 'Sitienu tehnikas nosaukumi',
                content: (
                  <div className="space-y-2 py-2">
                    {STRIKE_LEVELS.map((s, i) => (
                      <div key={i} className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between">
                        <span className="font-heading uppercase text-[#0a0a0c] font-bold text-lg">{s.level}</span>
                        <span className="text-sm text-slate-700 font-sans">{s.desc}</span>
                      </div>
                    ))}
                  </div>
                ),
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
                ),
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
                ),
              },
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
      <section className="py-16 sm:py-24 bg-transparent border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center mb-12 sm:mb-16">
            <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">
              Atbildes uz jautājumiem
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">
              Biežāk uzdotie jautājumi
            </h2>
            <div className="w-24 h-1 kumite-aka-ao-bar mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                title={faq.question}
                isOpen={openFaq === idx}
                onToggle={() => toggleFaq(idx)}
                contentClassName="px-5 pb-5 pt-2 text-slate-700 text-base leading-relaxed border-t border-slate-200 bg-white font-sans"
              >
                {faq.answer}
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="atsauksmes" className="py-16 sm:py-24 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center mb-12 sm:mb-16">
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
              .map((t, idx) => (
                <InteractiveRepelCard key={t.id} maxShift={12} maxRotate={5}>
                  <div
                    data-stagger={String((idx % 3) + 1)}
                    className={`scroll-reveal bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 border-t-4 ${
                      idx % 2 === 1 ? 'border-t-[#2563eb]' : 'border-t-[#dc2626]'
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

          {openReviewModal && (
            <div className="text-center mt-12">
              <button
                type="button"
                onClick={openReviewModal}
                className="w-full sm:w-auto min-h-[48px] inline-block bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] shadow-lg shadow-red-600/20 border border-red-500/30 cursor-pointer"
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
