import React, { useState } from 'react';
import { Award, GraduationCap, ZoomIn } from 'lucide-react';
import { motion } from 'motion/react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import LightboxModal from '../components/LightboxModal';

interface CoachesProps {
  openTrialModal: () => void;
}

const COACH_GALLERY_PHOTOS = [
  {
    id: 1,
    src: '/assets_coaches/ka_00302-edit.webp',
    title: 'Nikolajs Bodrovs (2 DAN)',
    caption: 'Karatē paraugdemonstrējums pie jūras'
  },
  {
    id: 2,
    src: '/assets_coaches/marikanikolajs-52-scaled.webp',
    title: 'Treneris Nikolajs Bodrovs',
    caption: 'Portrets'
  },
  {
    id: 3,
    src: '/assets_coaches/r6__9073-scaled.webp',
    title: 'Treneris Nikolajs Bodrovs',
    caption: 'Portrets pie jūras'
  },
  {
    id: 4,
    src: '/assets_coaches/img_2715-_1_-scaled.webp',
    title: 'Mūsu kluba kausi un trofejas',
    caption: 'Karatē čempionātu apbalvojumi'
  },
  {
    id: 5,
    src: '/assets_coaches/img_5431-1.webp',
    title: 'Sacensības un turnīri',
    caption: 'Latvijas un starptautiskie čempionāti'
  },
  {
    id: 6,
    src: '/assets_coaches/img_1820-scaled.webp',
    title: 'Treniņu process',
    caption: 'Darbs ar jaunajiem karatistiem'
  },
  {
    id: 7,
    src: '/assets_coaches/img_2122-scaled.webp',
    title: 'Nodarbību vadīšana',
    caption: 'Individuālā pieeja katram audzēknim'
  },
  {
    id: 8,
    src: '/assets_coaches/img_5438.webp',
    title: 'Kumite Karatē Klubs',
    caption: 'Kluba atmosfēra un komandas gars'
  }
];

export default function Coaches({ openTrialModal }: CoachesProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % COACH_GALLERY_PHOTOS.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + COACH_GALLERY_PHOTOS.length) % COACH_GALLERY_PHOTOS.length);
  };

  const currentLightboxItem = selectedPhotoIndex !== null ? {
    id: selectedPhotoIndex,
    title: COACH_GALLERY_PHOTOS[selectedPhotoIndex].title,
    category: 'trenini' as const,
    image: COACH_GALLERY_PHOTOS[selectedPhotoIndex].src,
    fullImage: COACH_GALLERY_PHOTOS[selectedPhotoIndex].src,
    caption: COACH_GALLERY_PHOTOS[selectedPhotoIndex].caption
  } : null;

  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-20 lg:py-28 overflow-hidden border-b-8 border-[#dc2626]">
        <div className="absolute inset-0 bg-cover bg-center opacity-45 filter grayscale" style={{ backgroundImage: "url('/assets_coaches/marikanikolajs-52-scaled.webp')" }}></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs sm:text-sm uppercase tracking-widest text-[#dc2626] font-heading font-bold block mb-2">Vairāk • Ātrāk • Spēcīgāk</span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">Treneri</h1>
            <button
              onClick={openTrialModal}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest px-8 py-3.5 font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 border-white rounded-lg"
            >
              Pievienojies šodien
            </button>
          </motion.div>
        </div>
      </section>

      {/* Coach Nikolajs Bodrovs Profile */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl sm:text-6xl font-heading text-[#0f172a] uppercase font-bold tracking-wide mb-4">Nikolajs Bodrovs</h2>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mb-6 rounded-full"></div>
            <div className="text-slate-700 leading-relaxed space-y-4 text-base font-sans">
              <p>
                Nikolajs Bodrovs ar karatē nodarbojas jau vairāk kā 24 gadus, un ir ieguvis 2 DAN. Viņa pirmais karatē treneris bija Aleksandrs Kudrjavcevs, kurš palīdzēja attīstīties gan fiziski un emocionāli, bet arī garīgi. Tika iedota laba karatē bāze, kas palīdzēja sasniegt mērķus un stiprināt raksturu.
              </p>
              <p>
                Pēc tam Nikolaja treneri bija Aleksandrs Nakonečnijs un Maksims Ivančikovs, kuri trenēja un palīdzēja sasniegt labākos rezultātus Nikolaja karatē karjerā.
              </p>
              <p>
                Treneris Nikolajs uzskata, ka karatē disciplinēja viņu, kas turpmāk viņam palīdzēja ne tikai sasniegt rezultātus sportā, bet arī dzīvē!
              </p>
            </div>
          </motion.div>

          {/* Education & Achievements Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-20">
            {/* Education */}
            <InteractiveRepelCard maxShift={12} maxRotate={6}>
              <div className="bg-[#0a0a0c] text-white p-8 rounded-2xl shadow-xl space-y-4 border border-slate-800 h-full">
                <div className="flex items-center space-x-3 text-[#dc2626] mb-2">
                  <GraduationCap className="w-8 h-8" />
                  <h3 className="font-heading text-white text-2xl uppercase font-bold tracking-wide">Izglītība</h3>
                </div>
                <ul className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
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

            {/* Achievements */}
            <InteractiveRepelCard maxShift={12} maxRotate={6}>
              <div className="bg-[#0a0a0c] text-white p-8 rounded-2xl shadow-xl space-y-4 border border-slate-800 h-full">
                <div className="flex items-center space-x-3 text-[#dc2626] mb-2">
                  <Award className="w-8 h-8" />
                  <h3 className="font-heading text-white text-2xl uppercase font-bold tracking-wide">Sasniegumi karatē</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300 font-sans">
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>1 DAN (melna josta) – 29.08.2013</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>2 DAN – 12.05.2023</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>Komandu Eiropas čempionāts 2010.g. – 1.vieta (juniori)</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>Eiropas čempionāts 2011.g. – 5.vieta (juniori)</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>Pasaules čempionats 2011.g. – 2.vieta (juniori)</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>Pasaules čempionāts 2013.g. – 9.vieta (U-21)</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>Latvijas čempions x8</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>Baltijas čempions</span></li>
                  <li className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span>Ziemeļvalstu čempions x2</span></li>
                </ul>
              </div>
            </InteractiveRepelCard>
          </div>

          {/* Full Coach Photo Gallery Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-heading uppercase font-bold text-[#0f172a] tracking-wide">
                Trenera Fotogalerija
              </h3>
              <p className="text-slate-500 font-sans text-sm mt-1">
                Uzklikšķiniet uz jebkuras fotogrāfijas, lai atvērtu to pilnekrāna režīmā
              </p>
              <div className="w-16 h-1 bg-[#dc2626] mx-auto mt-3 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {COACH_GALLERY_PHOTOS.map((photo, idx) => (
                <InteractiveRepelCard key={photo.id} maxShift={10} maxRotate={4}>
                  <div
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className="relative overflow-hidden rounded-xl bg-gray-900 border border-slate-200 shadow-md group h-72 cursor-pointer hover:border-[#dc2626] transition-all"
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="w-full flex items-end justify-between">
                        <div>
                          <p className="text-white font-heading text-lg font-bold uppercase">{photo.title}</p>
                          <p className="text-xs text-slate-300 font-sans">{photo.caption}</p>
                        </div>
                        <div className="bg-[#dc2626] p-2 rounded-full text-white shadow-lg">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveRepelCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className="py-24 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h3 className="text-3xl sm:text-4xl font-heading text-[#0f172a] uppercase font-bold tracking-wide">Iepazīsti mūsu kluba atmosfēru</h3>
          <InteractiveRepelCard maxShift={14} maxRotate={6}>
            <motion.div 
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden shadow-2xl bg-black aspect-video relative flex items-center justify-center border-4 border-slate-900 hover:border-[#dc2626] transition-all duration-300 hover:shadow-red-600/30"
            >
              <video
                controls
                playsInline
                preload="metadata"
                poster="/assets_gallery/trenini/karate-web-10-1.webp"
                className="w-full h-full object-cover"
              >
                <source src="/assets_video/kumite-video.mp4" type="video/mp4" />
                Jūsu pārlūks neatbalsta video atskaņošanu.
              </video>
            </motion.div>
          </InteractiveRepelCard>
          <button
            onClick={openTrialModal}
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest px-8 py-4 rounded-lg font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-white"
          >
            Pievienojies mūsu karatē ģimenei
          </button>
        </div>
      </section>

      {/* Lightbox Modal for Coach Gallery */}
      <LightboxModal
        item={currentLightboxItem}
        onClose={() => setSelectedPhotoIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
