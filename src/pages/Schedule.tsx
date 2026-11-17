import React, { useState, useEffect, useMemo } from 'react';
import { SCHEDULE_GROUPS } from '../data';
import type { AgeGroupFilter } from '../types';
import {
  Calendar,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  Radio,
  Printer,
} from 'lucide-react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';

interface ScheduleProps {
  openTrialModal: () => void;
}

const DAY_NAMES_LV = [
  'Svētdiena',
  'Pirmdiena',
  'Otrdiena',
  'Trešdiena',
  'Ceturtdiena',
  'Piektdiena',
  'Sestdiena',
];

const SLOT_DAY_UPPER_BY_INDEX: Record<number, string> = {
  1: 'PIRMDIENA',
  2: 'OTRDIENA',
  3: 'TREŠDIENA',
  4: 'CETURTDIENA',
  5: 'PIEKTDIENA',
};

const WEEKDAY_SHORT_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getRigaWeekdayIndex(): number {
  try {
    const short = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Riga',
      weekday: 'short',
    }).format(new Date());
    if (short in WEEKDAY_SHORT_MAP) return WEEKDAY_SHORT_MAP[short];
  } catch {
    // Fallback if timezone data unavailable
  }
  return new Date().getDay();
}

export default function Schedule({ openTrialModal }: ScheduleProps) {
  const [ageFilter, setAgeFilter] = useState<'all' | AgeGroupFilter>('all');
  const [dayFilter, setDayFilter] = useState<'all' | 'mwf' | 'tt'>('all');
  const [todayDayIndex, setTodayDayIndex] = useState<number | null>(null);

  useEffect(() => {
    setTodayDayIndex(getRigaWeekdayIndex());
  }, []);

  const filteredGroups = useMemo(() => {
    return SCHEDULE_GROUPS.filter((group) => {
      const matchesAge =
        ageFilter === 'all' || (group.ageGroups ? group.ageGroups.includes(ageFilter) : true);
      const matchesDay = dayFilter === 'all' || group.dayPattern === dayFilter;
      return matchesAge && matchesDay;
    });
  }, [ageFilter, dayFilter]);

  const todayStatus = useMemo(() => {
    if (todayDayIndex === null) return null;
    const dayName = DAY_NAMES_LV[todayDayIndex];
    if (todayDayIndex === 1 || todayDayIndex === 3 || todayDayIndex === 5) {
      return {
        isOpenToday: true,
        dayName,
        text: `Šodien (${dayName}) zālē notiek nodarbības: 15:30 – 20:30 (1.–4. grupa)`,
      };
    }
    if (todayDayIndex === 2 || todayDayIndex === 4) {
      return {
        isOpenToday: true,
        dayName,
        text: `Šodien (${dayName}) zālē notiek nodarbības: 18:00 – 20:15 (5.–6. grupa)`,
      };
    }
    return {
      isOpenToday: false,
      dayName,
      text: `Šodien (${dayName}) zālē ir brīvdiena — nākamie treniņi pirmdien no plkst. 15:30`,
    };
  }, [todayDayIndex]);

  const todayUpperPrefix = todayDayIndex !== null ? SLOT_DAY_UPPER_BY_INDEX[todayDayIndex] : undefined;

  const ageFilterOptions: { key: 'all' | AgeGroupFilter; label: string }[] = [
    { key: 'all', label: 'Visi' },
    { key: '5-6', label: '5–6 gadi' },
    { key: '7-9', label: '7–9 gadi' },
    { key: '10+', label: '10+ gadi' },
  ];

  const dayFilterOptions: { key: 'all' | 'mwf' | 'tt'; label: string }[] = [
    { key: 'all', label: 'Visas dienas' },
    { key: 'mwf', label: 'P · T · Pk' },
    { key: 'tt', label: 'O · C' },
  ];

  return (
    <div className="text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-16 sm:py-24 lg:py-28 overflow-hidden border-b-8 border-[#dc2626] no-print">
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
            <h1 className="hero-stagger-2 text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">
              Nodarbību Grafiks
            </h1>
            <div className="hero-stagger-3">
              <button
                type="button"
                onClick={openTrialModal}
                className="w-full sm:w-auto min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] hover:brightness-110 hover:shadow-xl hover:shadow-red-600/30 text-white font-heading text-base sm:text-xl uppercase tracking-wider px-6 sm:px-8 py-3.5 font-bold transition-all active:scale-[0.97] shadow-xl border-2 border-white rounded-lg text-center cursor-pointer"
              >
                Pieteikties bezmaksas nodarbībai
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Groups Grid */}
      <section className="py-14 sm:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center max-w-2xl mx-auto mb-10">
            <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#2563eb] font-bold">
              Nodarbību laiki
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] uppercase font-bold tracking-wide mt-2">
              Mūsu Treniņu Grafiks
            </h2>
            <div className="w-24 h-1 kumite-aka-ao-bar mx-auto mt-4 rounded-full stripe-draw" />
          </div>

          {/* Live "Šodien zālē" Indicator */}
          <div
            role="status"
            aria-live="polite"
            className={`mb-8 rounded-2xl border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs ${
              todayStatus === null
                ? 'bg-[#f8fafc] border-slate-200 text-slate-800'
                : todayStatus.isOpenToday
                  ? 'bg-[#eff6ff] border-[#2563eb]/40 text-[#0f172a]'
                  : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${
                  todayStatus === null
                    ? 'bg-slate-400'
                    : todayStatus.isOpenToday
                      ? 'bg-[#2563eb] animate-pulse'
                      : 'bg-[#dc2626]'
                }`}
              />
              <div>
                <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-[#dc2626]">
                  <Radio className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Šodien zālē (Rīga)</span>
                </div>
                <p className="text-sm sm:text-base font-sans font-semibold mt-0.5">
                  {todayStatus
                    ? todayStatus.text
                    : 'Zāles darba laiks: P, T, Pk (15:30–20:30) un O, C (18:00–20:15)'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="no-print min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#0a0a0c] hover:text-white text-[#0f172a] border border-slate-300 text-xs font-heading font-bold uppercase tracking-wider transition-all active:scale-[0.97] shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#dc2626]" aria-hidden="true" />
              <span>Drukāt grafiku</span>
            </button>
          </div>

          {/* Age-Group & Day Filter Toolbar */}
          <div className="no-print bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 sm:p-5 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-600 mr-1">
                Vecums:
              </span>
              {ageFilterOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={ageFilter === opt.key}
                  onClick={() => setAgeFilter(opt.key)}
                  className={`min-h-[44px] px-4 py-1.5 rounded-full text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all active:scale-[0.96] cursor-pointer ${
                    ageFilter === opt.key
                      ? 'bg-[#dc2626] text-white shadow-md border-2 border-[#0a0a0c]'
                      : 'bg-white text-[#0f172a] hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-600 mr-1">
                Dienas:
              </span>
              {dayFilterOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={dayFilter === opt.key}
                  onClick={() => setDayFilter(opt.key)}
                  className={`min-h-[44px] px-4 py-1.5 rounded-full text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all active:scale-[0.96] cursor-pointer ${
                    dayFilter === opt.key
                      ? 'bg-[#2563eb] text-white shadow-md border-2 border-[#0a0a0c]'
                      : 'bg-white text-[#0f172a] hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-10 text-center space-y-4">
              <p className="text-slate-700 font-sans text-base">
                Izvēlētajam vecuma un dienu filtram šobrīd nav atbilstošu grupu.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAgeFilter('all');
                  setDayFilter('all');
                }}
                className="min-h-[44px] px-6 py-2.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-sm uppercase font-bold tracking-wider cursor-pointer active:scale-[0.97]"
              >
                Rādīt visas grupas
              </button>
            </div>
          ) : (
            <div className="print-schedule-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGroups.map((group, idx) => (
                <InteractiveRepelCard key={group.id} maxShift={12} maxRotate={5}>
                  <div
                    data-stagger={String((idx % 3) + 1)}
                    className="print-card scroll-reveal bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 flex flex-col justify-between hover:border-[#dc2626] hover:shadow-xl transition-all h-full"
                  >
                    <div>
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={group.image}
                          alt={group.title}
                          width={400}
                          height={284}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute top-4 left-4 text-white font-heading text-lg uppercase tracking-wider px-4 py-1.5 rounded-lg font-bold shadow-md border border-white ${
                            group.dayPattern === 'tt' ? 'bg-[#2563eb]' : 'bg-[#dc2626]'
                          }`}
                        >
                          {group.title}
                        </div>
                        {group.ageLabel && (
                          <div className="absolute bottom-3 left-4 bg-[#0a0a0c]/88 text-white text-xs font-sans font-semibold px-3 py-1 rounded-full border border-white/25">
                            {group.ageLabel}
                          </div>
                        )}
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="font-heading text-2xl uppercase tracking-wider text-[#0a0a0c] mb-4 flex items-center font-bold">
                          <Clock
                            className={`w-6 h-6 mr-2 ${
                              group.dayPattern === 'tt' ? 'text-[#2563eb]' : 'text-[#dc2626]'
                            }`}
                            aria-hidden="true"
                          />
                          <span>Grafiks</span>
                        </h3>
                        <ul className="space-y-2.5">
                          {group.schedule.map((slot, sIdx) => {
                            const isTodaySlot =
                              Boolean(todayUpperPrefix) &&
                              slot.toUpperCase().startsWith(todayUpperPrefix!);
                            return (
                              <li
                                key={sIdx}
                                className={`flex items-center justify-between gap-2 text-sm p-3 rounded-lg border font-semibold font-sans ${
                                  isTodaySlot
                                    ? 'bg-[#eff6ff] border-[#2563eb] text-[#0f172a]'
                                    : 'text-slate-800 bg-slate-50 border-slate-200'
                                }`}
                              >
                                <span className="flex items-center">
                                  <Calendar
                                    className={`w-4 h-4 mr-2.5 flex-shrink-0 ${
                                      isTodaySlot ? 'text-[#2563eb]' : 'text-[#dc2626]'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  <span>{slot}</span>
                                </span>
                                {isTodaySlot && (
                                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2563eb] text-white flex-shrink-0">
                                    Šodien
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    <div className="p-6 pt-0 no-print">
                      <button
                        type="button"
                        onClick={openTrialModal}
                        className="w-full min-h-[48px] bg-[#dc2626] hover:bg-[#b91c1c] hover:brightness-110 hover:shadow-xl hover:shadow-red-600/30 text-white font-heading text-xl uppercase tracking-wider py-3.5 rounded-lg font-bold transition-all active:scale-[0.97] flex items-center justify-center space-x-2 shadow-lg border border-white cursor-pointer"
                      >
                        <span>Pieteikties grupā</span>
                        <ArrowRight className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </InteractiveRepelCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Social Media Footer Section */}
      <section className="no-print py-20 sm:py-24 bg-[#0a0a0c] text-white border-t-8 border-[#2563eb] text-center content-visibility-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="scroll-reveal text-3xl sm:text-4xl font-heading text-white uppercase font-bold tracking-wide">
            SEKO MUMS SOCIĀLAJOS TĪKLOS
          </h2>
          <p className="scroll-reveal text-slate-200 font-sans">
            Skaties jaunākos ierakstus, bildes un video mūsu kontos
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <a
              href="https://www.facebook.com/kumitekarateklubs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kumite Karate Klubs Facebook profils"
              className="w-12 h-12 rounded-lg bg-[#1e293b] hover:bg-[#2563eb] text-white flex items-center justify-center transition-all hover:scale-[1.06] active:scale-[0.95] shadow-lg border border-slate-700"
              title="Facebook"
            >
              <Facebook className="w-6 h-6" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kumite Karate Klubs Instagram profils"
              className="w-12 h-12 rounded-lg bg-[#1e293b] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all hover:scale-[1.06] active:scale-[0.95] shadow-lg border border-slate-700"
              title="Instagram"
            >
              <Instagram className="w-6 h-6" aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com/@KUMITEKARATEKLUBS"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kumite Karate Klubs YouTube kanāls"
              className="w-12 h-12 rounded-lg bg-[#1e293b] hover:bg-[#dc2626] text-white flex items-center justify-center transition-all hover:scale-[1.06] active:scale-[0.95] shadow-lg border border-slate-700"
              title="YouTube"
            >
              <Youtube className="w-6 h-6" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
