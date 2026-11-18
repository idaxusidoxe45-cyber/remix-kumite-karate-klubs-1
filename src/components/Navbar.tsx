import React, { useState, useEffect, useRef, useId } from 'react';
import { Link } from 'react-router-dom';
import { PageTab } from '../types';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentTab: PageTab;
  setCurrentTab: (tab: PageTab) => void;
  openTrialModal: () => void;
}

export default function Navbar({ currentTab, openTrialModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuId = useId();

  const navItems: { tab: PageTab; path: string; label: string }[] = [
    { tab: 'home', path: '/', label: 'SĀKUMS' },
    { tab: 'about', path: '/about', label: 'PAR KLUBU' },
    { tab: 'coaches', path: '/coaches', label: 'TRENERI' },
    { tab: 'schedule', path: '/schedule', label: 'NODARBĪBU GRAFIKS' },
    { tab: 'gallery', path: '/gallery', label: 'GALERIJA' },
    { tab: 'contacts', path: '/contacts', label: 'SAZINIES AR MUMS' },
  ];

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px] xl:hidden animate-fadeIn"
        />
      )}

      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full max-w-full overflow-x-clip bg-[#0a0a0c]/95 backdrop-blur-md shadow-lg border-b border-[#1e293b]"
      >
        <nav aria-label="Galvenā navigācija">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between min-h-[4rem] sm:min-h-[5rem] py-2 gap-2 sm:gap-4">
              {/* Brand Logo */}
              <Link
                to="/"
                aria-current={currentTab === 'home' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group py-1 min-w-0 sm:flex-shrink-0"
              >
                <Logo
                  variant="dark"
                  className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 group-hover:scale-[1.04] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-lg flex-shrink-0"
                />
                <div className="flex flex-col justify-center min-w-0">
                  <span className="font-heading text-[11px] min-[400px]:text-xs sm:text-base md:text-lg xl:text-base 2xl:text-lg font-bold tracking-normal sm:tracking-wider text-white group-hover:text-[#f87171] transition-colors leading-tight block uppercase truncate sm:overflow-visible sm:whitespace-nowrap">
                    KUMITE KARATE KLUBS
                  </span>
                  <span className="hidden sm:block text-[10px] md:text-[11px] uppercase tracking-wider text-slate-300 font-semibold leading-tight whitespace-nowrap">
                    Rīga • Bērnu un Jauniešu Karatē
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links (xl 1280px+ so 1024px tablets never crowd) */}
              <div className="hidden xl:flex items-center gap-5 2xl:gap-7 flex-shrink-0">
                {navItems.map((item) => {
                  const isActive = currentTab === item.tab;
                  return (
                    <Link
                      key={item.tab}
                      to={item.path}
                      aria-current={isActive ? 'page' : undefined}
                      className={`min-h-[44px] inline-flex items-center font-heading tracking-wider text-xs 2xl:text-sm font-bold transition-colors relative py-2 whitespace-nowrap ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-200 hover:text-[#60a5fa]'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-1 left-0 right-0 h-[3px] bg-[#dc2626] rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Right Action & Socials */}
              <div className="hidden xl:flex items-center gap-3 2xl:gap-4 flex-shrink-0">
                <div className="hidden 2xl:flex items-center gap-2">
                  <a
                    href="https://www.facebook.com/kumitekarateklubs"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kumite Karate Klubs Facebook profils"
                    className="w-9 h-9 rounded-xl bg-[#1e293b] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all hover:scale-[1.06] active:scale-[0.96]"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kumite Karate Klubs Instagram profils"
                    className="w-9 h-9 rounded-xl bg-[#1e293b] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all hover:scale-[1.06] active:scale-[0.96]"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.youtube.com/@KUMITEKARATEKLUBS"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kumite Karate Klubs YouTube kanāls"
                    className="w-9 h-9 rounded-xl bg-[#1e293b] hover:bg-[#FF0000] text-white flex items-center justify-center transition-all hover:scale-[1.06] active:scale-[0.96]"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={openTrialModal}
                  className="min-h-[44px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading tracking-wider px-4 py-2 rounded-xl shadow-lg shadow-red-600/20 border border-red-500/30 transition-all active:scale-[0.97] text-xs 2xl:text-sm uppercase font-bold whitespace-nowrap cursor-pointer"
                >
                  Bezmaksas treniņš
                </button>
              </div>

              {/* Mobile / Tablet controls (< 1280px) */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 xl:hidden flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openTrialModal();
                  }}
                  className="min-h-[44px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[11px] sm:text-xs font-heading tracking-wider px-2.5 sm:px-4 py-2 rounded-xl uppercase font-bold shadow-md border border-red-500/30 transition-all active:scale-[0.96] whitespace-nowrap cursor-pointer"
                >
                  Pieteikties
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-expanded={mobileMenuOpen}
                  aria-controls={mobileMenuId}
                  aria-label={mobileMenuOpen ? 'Aizvērt navigācijas izvēlni' : 'Atvērt navigācijas izvēlni'}
                  className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-white border transition-all active:scale-[0.94] shadow-sm flex-shrink-0 cursor-pointer ${
                    mobileMenuOpen
                      ? 'bg-[#1e293b] border-slate-400'
                      : 'bg-[#1e293b] hover:bg-[#2563eb] border-slate-700/80'
                  }`}
                >
                  <span aria-hidden="true" className="w-5 h-4 flex flex-col justify-center items-center gap-[5px]">
                    <span
                      className={`block w-5 h-[2px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        mobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''
                      }`}
                    />
                    <span
                      className={`block w-5 h-[2px] rounded-full bg-current transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                      }`}
                    />
                    <span
                      className={`block w-5 h-[2px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Smooth GPU Mobile & Tablet Drawer */}
          <div
            id={mobileMenuId}
            data-open={mobileMenuOpen ? 'true' : 'false'}
            aria-hidden={!mobileMenuOpen}
            {...(!mobileMenuOpen ? { inert: true } : {})}
            className="xl:hidden drawer-grid bg-[#0a0a0c] shadow-2xl"
          >
            <div className="drawer-inner">
              <div className="drawer-content border-t border-b border-[#1e293b] px-4 pt-3 pb-6 space-y-1 max-h-[85dvh] overflow-y-auto overscroll-contain">
                {navItems.map((item) => {
                  const isActive = currentTab === item.tab;
                  return (
                    <Link
                      key={item.tab}
                      to={item.path}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-[48px] flex items-center justify-between w-full text-left px-4 py-2.5 font-heading text-base sm:text-lg uppercase tracking-wider font-bold transition-colors active:scale-[0.99] ${
                        isActive
                          ? 'bg-[#1e293b] text-white border-l-4 border-[#dc2626] rounded-r-xl'
                          : 'text-slate-200 hover:bg-[#1e293b]/70 hover:text-[#60a5fa] rounded-xl'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#dc2626]" />}
                    </Link>
                  );
                })}

                <div className="pt-4 mt-2 flex items-center justify-center gap-4 border-t border-[#1e293b]">
                  <a
                    href="https://www.facebook.com/kumitekarateklubs"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kumite Karate Klubs Facebook profils"
                    className="w-11 h-11 inline-flex items-center justify-center bg-[#1e293b] hover:bg-[#1877F2] text-white rounded-xl transition-all hover:scale-[1.05] active:scale-[0.95]"
                  >
                    <Facebook className="w-5 h-5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kumite Karate Klubs Instagram profils"
                    className="w-11 h-11 inline-flex items-center justify-center bg-[#1e293b] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white rounded-xl transition-all hover:scale-[1.05] active:scale-[0.95]"
                  >
                    <Instagram className="w-5 h-5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.youtube.com/@KUMITEKARATEKLUBS"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kumite Karate Klubs YouTube kanāls"
                    className="w-11 h-11 inline-flex items-center justify-center bg-[#1e293b] hover:bg-[#FF0000] text-white rounded-xl transition-all hover:scale-[1.05] active:scale-[0.95]"
                  >
                    <Youtube className="w-5 h-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Kumite Aka/Ao Scroll Progress Indicator */}
        <div aria-hidden="true" className="h-[3px] w-full bg-[#1e293b]/70 overflow-hidden">
          <div className="scroll-progress-bar h-full w-full" />
        </div>
      </header>
    </>
  );
}
