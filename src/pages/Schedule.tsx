import React from 'react';
import { SCHEDULE_GROUPS } from '../data';
import { Calendar, Clock, Facebook, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';

interface ScheduleProps {
  openTrialModal: () => void;
}

export default function Schedule({ openTrialModal }: ScheduleProps) {
  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-20 lg:py-28 overflow-hidden border-b-8 border-[#dc2626]">
        <div className="absolute inset-0 bg-cover bg-center opacity-45 filter grayscale" style={{ backgroundImage: "url('/assets_gallery/trenini/karate-web-17.webp')" }}></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs sm:text-sm uppercase tracking-widest text-[#dc2626] font-heading font-bold block mb-2">Kumite Karate Klubs</span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">Nodarbību Grafiks</h1>
            <button
              onClick={openTrialModal}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest px-8 py-3.5 font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 border-white rounded-lg"
            >
              Pieteikties bezmaksas nodarbībai
            </button>
          </motion.div>
        </div>
      </section>

      {/* Schedule Groups Grid */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">Nodarbību laiki</span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] uppercase font-bold tracking-wide mt-2">Mūsu Treniņu Grafiks</h2>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SCHEDULE_GROUPS.map((group, idx) => (
              <InteractiveRepelCard key={group.id} maxShift={12} maxRotate={6}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 flex flex-col justify-between hover:border-[#dc2626] transition-colors h-full"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={group.image}
                        alt={group.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-[#dc2626] text-white font-heading text-lg uppercase tracking-wider px-4 py-1.5 rounded-lg font-bold shadow-md border border-white">
                        {group.title}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="font-heading text-2xl uppercase tracking-wider text-[#0a0a0c] mb-4 flex items-center font-bold">
                        <Clock className="w-6 h-6 text-[#dc2626] mr-2" />
                        <span>Grafiks</span>
                      </h3>
                      <ul className="space-y-2.5">
                        {group.schedule.map((slot, sIdx) => (
                          <li key={sIdx} className="flex items-center text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 font-semibold font-sans">
                            <Calendar className="w-4 h-4 text-[#dc2626] mr-2.5 flex-shrink-0" />
                            <span>{slot}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={openTrialModal}
                      className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-wider py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg border border-white"
                    >
                      <span>Pieteikties grupā</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </InteractiveRepelCard>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Footer Section */}
      <section className="py-24 bg-[#0a0a0c] text-white border-t-8 border-[#dc2626] text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-heading text-white uppercase font-bold tracking-wide">SEKO MUMS SOCIĀLAJOS TĪKLOS</h2>
          <p className="text-slate-300 font-sans">Skaties jaunākos ierakstus, bildes un video mūsu kontos</p>
          <div className="flex justify-center space-x-4 pt-4">
            <a
              href="https://www.facebook.com/kumitekarateklubs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-[#1e293b] hover:bg-[#1d4ed8] text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-[#1e293b] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.youtube.com/@KUMITEKARATEKLUBS"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-[#1e293b] hover:bg-[#dc2626] text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
