import React, { useState } from 'react';
import { Award, GraduationCap } from 'lucide-react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import LightboxModal from '../components/LightboxModal';

interface CoachesProps {
  openTrialModal: () => void;
}

const COACH_GALLERY_PHOTOS = [
  {
    id: 1,
    thumb: '/assets_coaches/ka_00302-edit.webp',
    full: '/assets_coaches/ka_00302-edit.webp',
  },
  {
    id: 2,
    thumb: '/assets_coaches/marikanikolajs-52-800w.webp',
    full: '/assets_coaches/marikanikolajs-52-scaled.webp',
  },
  {
    id: 3,
    thumb: '/assets_coaches/r6__9073-scaled.webp',
    full: '/assets_coaches/r6__9073-scaled.webp',
  },
  {
    id: 4,
    thumb: '/assets_gallery/zale/img_2715-_1_-400x284.webp',
    full: '/assets_coaches/img_2715-_1_-scaled.webp',
  },
  {
    id: 5,
    thumb: '/assets_gallery/sacensibas/img_5431-1-400x284.webp',
    full: '/assets_coaches/img_5431-1.webp',
  },
  {
    id: 6,
    thumb: '/assets_gallery/trenini/img_1820-400x284.webp',
    full: '/assets_coaches/img_1820-scaled.webp',
  },
  {
    id: 7,
    thumb: '/assets_coaches/img_2122-scaled.webp',
    full: '/assets_coaches/img_2122-scaled.webp',
  },
  {
    id: 8,
    thumb: '/assets_coaches/img_5438.webp',
    full: '/assets_coaches/img_5438.webp',
  },
];

export default function Coaches({ openTrialModal }: CoachesProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % COACH_GALLERY_PHOTOS.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(
      (selectedPhotoIndex - 1 + COACH_GALLERY_PHOTOS.length) % COACH_GALLERY_PHOTOS.length
    );
  };

  const currentLightboxItem =
    selectedPhotoIndex !== null
      ? {
          id: selectedPhotoIndex,
          title: '',
          caption: '',
          category: 'trenini' as const,
          image: COACH_GALLERY_PHOTOS[selectedPhotoIndex].thumb,
          fullImage: COACH_GALLERY_PHOTOS[selectedPhotoIndex].full,
        }
      : null;

  const adjacentSrcs =
    selectedPhotoIndex !== null
      ? [
          COACH_GALLERY_PHOTOS[(selectedPhotoIndex + 1) % COACH_GALLERY_PHOTOS.length].full,
          COACH_GALLERY_PHOTOS[
            (selectedPhotoIndex - 1 + COACH_GALLERY_PHOTOS.length) % COACH_GALLERY_PHOTOS.length
          ].full,
        ]
      : undefined;

  return (
    <div className="text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-20 sm:py-28 lg:py-36 min-h-[420px] sm:min-h-[480px] flex items-center overflow-hidden border-b-8 border-[#dc2626]">
        <img
          src="/assets_coaches/marikanikolajs-52-scaled.webp"
          srcSet="/assets_coaches/marikanikolajs-52-800w.webp 800w, /assets_coaches/marikanikolajs-52-scaled.webp 1707w"
          sizes="100vw"
          width={1707}
          height={2560}
          alt="Treneris Nikolajs Bodrovs"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none select-none"
          style={{ objectPosition: 'center 38%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/90 via-[#0a0a0c]/60 to-transparent pointer-events-none" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="hero-stagger-1 text-xs sm:text-sm uppercase tracking-widest text-[#60a5fa] font-heading font-bold block mb-2">
              Vairāk • Ātrāk • Spēcīgāk
            </span>
            <h1 className="hero-stagger-2 text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">
              Treneri
            </h1>
            <div className="hero-stagger-3">
              <button
                type="button"
                onClick={openTrialModal}
                className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] hover:shadow-xl hover:shadow-red-600/25 text-white font-heading text-base sm:text-lg uppercase tracking-wider px-8 py-3.5 font-bold transition-all active:scale-[0.97] shadow-xl border border-red-500/30 rounded-xl cursor-pointer"
              >
                Pievienojies šodien
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Nikolajs Bodrovs Profile */}
      <section className="py-20 sm:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-6xl font-heading text-[#0f172a] uppercase font-bold tracking-wide mb-4">
              Nikolajs Bodrovs
            </h2>
            <div className="w-24 h-1 kumite-aka-ao-bar mx-auto mb-6 rounded-full stripe-draw" />
            <div className="text-slate-700 leading-relaxed space-y-4 text-base font-sans">
              <p>
                Nikolajs Bodrovs ar karatē nodarbojas jau vairāk par 25 gadiem, un ir ieguvis 3 DAN. Viņa pirmais karatē treneris bija Aleksandrs Kudrjavcevs, kurš palīdzēja attīstīties gan fiziski un emocionāli, bet arī garīgi. Tika iedota laba karatē bāze, kas palīdzēja sasniegt mērķus un stiprināt raksturu.
              </p>
              <p>
                Pēc tam Nikolaja treneri bija Aleksandrs Nakonečnijs un Maksims Ivančikovs, kuri trenēja un palīdzēja sasniegt labākos rezultātus Nikolaja karatē karjerā.
              </p>
              <p>
                Treneris Nikolajs uzskata, ka karatē disciplinēja viņu, kas turpmāk viņam palīdzēja ne tikai sasniegt rezultātus sportā, bet arī dzīvē!
              </p>
            </div>
          </div>

          {/* Education & Achievements Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-20">
            <InteractiveRepelCard maxShift={12} maxRotate={5}>
              <div data-stagger="1" className="scroll-reveal bg-[#0a0a0c] text-white p-8 rounded-2xl shadow-xl space-y-4 border border-slate-800 border-t-4 border-t-[#2563eb] h-full">
                <div className="flex items-center space-x-3 text-[#60a5fa] mb-2">
                  <GraduationCap className="w-8 h-8" aria-hidden="true" />
                  <h3 className="font-heading text-white text-2xl uppercase font-bold tracking-wide">
                    Izglītība
                  </h3>
                </div>
                <ul className="space-y-4 text-sm text-slate-200 leading-relaxed font-sans">
                  <li className="border-b border-slate-800 pb-3">
                    <strong className="text-white block mb-1 font-heading text-lg">2013 – 2017. gads</strong>
                    Bakalaura grāds – Inovāciju un produktu attīstība uzņēmējdarbībā. Iestāde – Banku augstskola.
                  </li>
                  <li>
                    <strong className="text-white block mb-1 font-heading text-lg">2018 – 2019. gads</strong>
                    C Kategorijas sporta speciālists (karatē treneris). Iestāde – Latvijas Sporta pedagoģijas akadēmija.
                  </li>
                </ul>
              </div>
            </InteractiveRepelCard>

            <InteractiveRepelCard maxShift={12} maxRotate={5}>
              <div data-stagger="2" className="scroll-reveal bg-[#0a0a0c] text-white p-8 rounded-2xl shadow-xl space-y-4 border border-slate-800 border-t-4 border-t-[#dc2626] h-full">
                <div className="flex items-center space-x-3 text-[#f87171] mb-2">
                  <Award className="w-8 h-8" aria-hidden="true" />
                  <h3 className="font-heading text-white text-2xl uppercase font-bold tracking-wide">
                    Sasniegumi karatē
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-200 font-sans">
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626] flex-shrink-0" /><span>1 DAN (melna josta) – 29.08.2013</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626] flex-shrink-0" /><span>2 DAN – 12.05.2023</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626] flex-shrink-0" /><span>3 DAN – 13.05.2026</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" /><span>Komandu Eiropas čempionāts 2010.g. – 1.vieta (juniori)</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626] flex-shrink-0" /><span>Eiropas čempionāts 2011.g. – 5.vieta (juniori)</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" /><span>Pasaules čempionats 2011.g. – 2.vieta (juniori)</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626] flex-shrink-0" /><span>Pasaules čempionāts 2013.g. – 9.vieta (U-21)</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" /><span>Latvijas čempions x8</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626] flex-shrink-0" /><span>Baltijas čempions</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" /><span>Ziemeļvalstu čempions x2</span></li>
                </ul>
              </div>
            </InteractiveRepelCard>
          </div>

          {/* Clean Coach Photo Gallery Section */}
          <div className="space-y-8">
            <div className="scroll-reveal text-center">
              <h2 className="text-3xl font-heading uppercase font-bold text-[#0f172a] tracking-wide">
                Trenera Fotogalerija
              </h2>
              <div className="w-16 h-1 kumite-aka-ao-bar mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {COACH_GALLERY_PHOTOS.map((photo, idx) => (
                <InteractiveRepelCard key={photo.id} maxShift={10} maxRotate={4}>
                  <button
                    type="button"
                    data-stagger={String((idx % 4) + 1)}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    aria-label={`Atvērt foto ${idx + 1}`}
                    className="scroll-reveal relative w-full text-left overflow-hidden rounded-xl bg-[#0a0a0c] border border-slate-200 shadow-md group h-48 sm:h-72 cursor-pointer hover:border-[#dc2626] active:scale-[0.98] transition-all block"
                  >
                    <img
                      src={photo.thumb}
                      alt="Treneris Nikolajs Bodrovs"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                  </button>
                </InteractiveRepelCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video section — Kluba atmosfēra un treniņi */}
      <section className="py-20 sm:py-24 bg-[#f8fafc] border-t border-slate-200 content-visibility-auto">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs sm:text-sm uppercase font-heading tracking-[0.2em] text-[#dc2626] font-bold">
              Video no zāles
            </span>
            <h2 className="scroll-reveal text-3xl sm:text-4xl font-heading text-[#0f172a] uppercase font-bold tracking-wide">
              Iepazīsti mūsu kluba atmosfēru
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-sans">
              Reāli treniņu mirkļi no mūsu zāles — individuāla pieeja tehnikai un aizrautīgas bērnu nodarbības.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto items-stretch">
            {/* Reel 1: Individuālā pieeja */}
            <InteractiveRepelCard maxShift={10} maxRotate={4}>
              <div className="scroll-reveal bg-[#0a0a0c] text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col h-full hover:border-[#2563eb] transition-colors">
                <div className="relative aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
                  <video
                    controls
                    playsInline
                    preload="none"
                    poster="/assets_video/thumb-individuali.webp"
                    className="w-full h-full object-cover"
                  >
                    <source src="/assets_video/atmosfera-individuali.mp4" type="video/mp4" />
                    Jūsu pārlūks neatbalsta video atskaņošanu.
                  </video>
                </div>
                <div className="p-4 sm:p-5 text-left flex-1 flex flex-col justify-between border-t border-slate-800">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#2563eb]/20 text-[#60a5fa] border border-[#2563eb]/30 mb-2">
                      Individuālā pieeja
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-white tracking-wide">
                      Tehnikas un sparinga slīpēšana
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
                      Treneris personīgi palīdz nostiprināt precīzu sitienu un aizsardzības tehniku.
                    </p>
                  </div>
                </div>
              </div>
            </InteractiveRepelCard>

            {/* Reel 2: Grupu nodarbības */}
            <InteractiveRepelCard maxShift={10} maxRotate={4}>
              <div className="scroll-reveal bg-[#0a0a0c] text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col h-full hover:border-[#dc2626] transition-colors">
                <div className="relative aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
                  <video
                    controls
                    playsInline
                    preload="none"
                    poster="/assets_video/thumb-grupa.webp"
                    className="w-full h-full object-cover"
                  >
                    <source src="/assets_video/atmosfera-grupa.mp4" type="video/mp4" />
                    Jūsu pārlūks neatbalsta video atskaņošanu.
                  </video>
                </div>
                <div className="p-4 sm:p-5 text-left flex-1 flex flex-col justify-between border-t border-slate-800">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#dc2626]/20 text-[#f87171] border border-[#dc2626]/30 mb-2">
                      Grupu treniņi
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-white tracking-wide">
                      Dinamika un cīņas gars
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
                      Aizraujoši sparingi, reakcijas attīstīšana un draudzīga komandas atmosfēra.
                    </p>
                  </div>
                </div>
              </div>
            </InteractiveRepelCard>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={openTrialModal}
              className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 active:scale-[0.97] border border-red-500/30 cursor-pointer"
            >
              Pievienojies mūsu karatē ģimenei
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Coach Gallery */}
      <LightboxModal
        item={currentLightboxItem}
        onClose={() => setSelectedPhotoIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={selectedPhotoIndex ?? undefined}
        totalCount={COACH_GALLERY_PHOTOS.length}
        adjacentSrcs={adjacentSrcs}
      />
    </div>
  );
}
