import React, { useState, useEffect, useRef, useId } from 'react';
import { Link } from 'react-router-dom';
import { PageTab } from '../types';
import { Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentTab: PageTab;
  setCurrentTab: (tab: PageTab) => void;
  openTrialModal: () => void;
}

export default function Navbar({ currentTab, openTrialModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const aboutMenuId = useId();
  const mobileMenuId = useId();

  const navItems: { tab: PageTab; path: string; label: string; hasSub?: boolean }[] = [
    { tab: 'home', path: '/', label: 'SĀKUMS' },
    { tab: 'about', path: '/about', label: 'PAR KLUBU', hasSub: true },
    { tab: 'schedule', path: '/schedule', label: 'NODARBĪBU GRAFIKS' },
    { tab: 'gallery', path: '/gallery', label: 'GALERIJA' },
    { tab: 'contacts', path: '/contacts', label: 'SAZINIES AR MUMS' },
  ];

  // Close menus on Escape or outside pointer click
  useEffect(() => {
    if (!aboutDropdownOpen && !mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAboutDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (
        aboutDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAboutDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [aboutDropdownOpen, mobileMenuOpen]);

  const supportsDesktopHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const isAboutSectionActive = currentTab === 'about' || currentTab === 'coaches';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0c] shadow-lg border-b border-[#1e293b]">
      <nav aria-label="Galvenā navigācija">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[4rem] sm:min-h-[5rem] py-2 gap-1.5 sm:gap-4">
            {/* Logo */}
            <Link
              to="/"
              aria-current={currentTab === 'home' ? 'page' : undefined}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group py-1 flex-shrink-0"
            >
              <Logo
                variant="dark"
                className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 group-hover:scale-[1.03] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-lg flex-shrink-0"
              />
              <div className="flex flex-col justify-center flex-shrink-0">
                <span className="font-heading text-xs xs:text-sm sm:text-base md:text-lg lg:text-base xl:text-lg font-bold tracking-wider text-white group-hover:text-[#f87171] transition-colors leading-snug block uppercase whitespace-nowrap">
                  KUMITE KARATE KLUBS
                </span>
                <span className="hidden sm:block text-[10px] md:text-[11px] uppercase tracking-wider text-slate-300 font-semibold leading-tight whitespace-nowrap">
                  Rīga • Bērnu un Jauniešu Karatē
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (from lg 1024px+) */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-7 flex-shrink-0">
              {navItems.map((item) => {
                if (item.hasSub) {
                  return (
                    <div
                      key={item.tab}
                      ref={dropdownRef}
                      className="relative py-2"
                      onPointerEnter={(e) => {
                        if (e.pointerType !== 'touch' && supportsDesktopHover()) {
                          setAboutDropdownOpen(true);
                        }
                      }}
                      onPointerLeave={(e) => {
                        if (e.pointerType !== 'touch' && supportsDesktopHover()) {
                          setAboutDropdownOpen(false);
                        }
                      }}
                      onBlur={(e) => {
                        if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
                          setAboutDropdownOpen(false);
                        }
                      }}
                    >
                      <button
                        type="button"
                        aria-expanded={aboutDropdownOpen}
                        aria-controls={aboutMenuId}
                        onClick={() => setAboutDropdownOpen((prev) => !prev)}
                        className={`relative min-h-[44px] inline-flex items-center space-x-1 font-heading tracking-wider text-xs xl:text-sm 2xl:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          isAboutSectionActive
                            ? 'text-[#f87171]'
                            : 'text-slate-100 hover:text-[#f87171]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            aboutDropdownOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                        {isAboutSectionActive && (
                          <span
                            aria-hidden="true"
                            className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-[#dc2626] rounded-full"
                          />
                        )}
                      </button>

                      <div
                        id={aboutMenuId}
                        data-open={aboutDropdownOpen ? 'true' : 'false'}
                        aria-hidden={!aboutDropdownOpen}
                        {...(!aboutDropdownOpen ? { inert: true } : {})}
                        className="dropdown-menu absolute top-full left-0 w-48 bg-[#0a0a0c] shadow-xl rounded-b-lg border-t-2 border-[#dc2626] border-x border-b border-[#1e293b] py-1.5 z-50"
                      >
                        <Link
                          to="/about"
                          aria-current={currentTab === 'about' ? 'page' : undefined}
                          onClick={() => setAboutDropdownOpen(false)}
                          className={`block w-full text-left px-4 py-3 text-sm font-heading tracking-wider transition-colors ${
                            currentTab === 'about'
                              ? 'bg-[#1e293b] text-[#f87171] font-bold border-l-4 border-[#dc2626]'
                              : 'hover:bg-[#1e293b] text-slate-100 hover:text-[#f87171]'
                          }`}
                        >
                          PAR KLUBU
                        </Link>
                        <Link
                          to="/coaches"
                          aria-current={currentTab === 'coaches' ? 'page' : undefined}
                          onClick={() => setAboutDropdownOpen(false)}
                          className={`block w-full text-left px-4 py-3 text-sm font-heading tracking-wider transition-colors ${
                            currentTab === 'coaches'
                              ? 'bg-[#1e293b] text-[#f87171] font-bold border-l-4 border-[#dc2626]'
                              : 'hover:bg-[#1e293b] text-slate-100 hover:text-[#f87171]'
                          }`}
                        >
                          TRENERI
                        </Link>
                      </div>
                    </div>
                  );
                }

                const isActive = currentTab === item.tab;
                return (
                  <Link
                    key={item.tab}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`min-h-[44px] inline-flex items-center font-heading tracking-wider text-xs xl:text-sm 2xl:text-base font-medium transition-colors relative py-2 whitespace-nowrap ${
                      isActive
                        ? 'text-[#f87171]'
                        : 'text-slate-100 hover:text-[#f87171]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-[#dc2626] rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Action & Socials */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
              <div className="hidden xl:flex items-center space-x-2">
                <a
                  href="https://www.facebook.com/kumitekarateklubs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kumite Karate Klubs Facebook profils"
                  className="w-9 h-9 rounded bg-[#1e293b] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all hover:scale-[1.04] active:scale-[0.97]"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kumite Karate Klubs Instagram profils"
                  className="w-9 h-9 rounded bg-[#1e293b] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all hover:scale-[1.04] active:scale-[0.97]"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="https://www.youtube.com/@KUMITEKARATEKLUBS"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kumite Karate Klubs YouTube kanāls"
                  className="w-9 h-9 rounded bg-[#1e293b] hover:bg-[#dc2626] text-white flex items-center justify-center transition-all hover:scale-[1.04] active:scale-[0.97]"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>

              <button
                type="button"
                onClick={openTrialModal}
                className="min-h-[44px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading tracking-wider px-3.5 xl:px-4 py-2 rounded shadow-lg border border-[#ef4444] transition-all hover:-translate-y-0.5 active:scale-[0.98] text-xs xl:text-sm uppercase font-semibold whitespace-nowrap cursor-pointer"
              >
                Bezmaksas treniņš
              </button>
            </div>

            {/* Mobile / Tablet controls */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:hidden flex-shrink-0">
              <button
                type="button"
                onClick={openTrialModal}
                className="min-h-[44px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-heading tracking-wider px-3 sm:px-4 py-2 rounded-lg uppercase font-bold shadow-md border border-red-500/50 transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
              >
                Pieteikties
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls={mobileMenuId}
                aria-label={mobileMenuOpen ? 'Aizvērt navigācijas izvēlni' : 'Atvērt navigācijas izvēlni'}
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-white bg-[#1e293b] hover:bg-[#dc2626] border border-slate-700/80 transition-all active:scale-[0.96] shadow-sm flex-shrink-0 cursor-pointer"
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

        {/* Smooth GPU Mobile Drawer */}
        <div
          id={mobileMenuId}
          data-open={mobileMenuOpen ? 'true' : 'false'}
          aria-hidden={!mobileMenuOpen}
          {...(!mobileMenuOpen ? { inert: true } : {})}
          className="lg:hidden drawer-grid bg-[#0a0a0c] shadow-2xl"
        >
          <div className="drawer-inner">
            <div className="drawer-content border-t border-b border-[#1e293b] px-4 pt-2 pb-6 space-y-1.5 max-h-[85vh] overflow-y-auto">
              <Link
                to="/"
                aria-current={currentTab === 'home' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center w-full text-left px-3 py-2.5 rounded-md font-heading text-lg font-medium transition-colors ${
                  currentTab === 'home'
                    ? 'bg-[#1e293b] text-[#f87171] border-l-4 border-[#dc2626]'
                    : 'text-slate-100 hover:bg-[#1e293b] hover:text-[#f87171]'
                }`}
              >
                SĀKUMS
              </Link>
              <Link
                to="/about"
                aria-current={currentTab === 'about' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center w-full text-left px-3 py-2.5 rounded-md font-heading text-lg font-medium transition-colors ${
                  currentTab === 'about'
                    ? 'bg-[#1e293b] text-[#f87171] border-l-4 border-[#dc2626]'
                    : 'text-slate-100 hover:bg-[#1e293b] hover:text-[#f87171]'
                }`}
              >
                PAR KLUBU
              </Link>
              <Link
                to="/coaches"
                aria-current={currentTab === 'coaches' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center w-full text-left px-6 py-2.5 rounded-md font-heading text-base transition-colors ${
                  currentTab === 'coaches'
                    ? 'bg-[#1e293b] text-[#f87171] border-l-4 border-[#dc2626]'
                    : 'text-slate-300 hover:bg-[#1e293b] hover:text-[#f87171]'
                }`}
              >
                — Treneri
              </Link>
              <Link
                to="/schedule"
                aria-current={currentTab === 'schedule' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center w-full text-left px-3 py-2.5 rounded-md font-heading text-lg font-medium transition-colors ${
                  currentTab === 'schedule'
                    ? 'bg-[#1e293b] text-[#f87171] border-l-4 border-[#dc2626]'
                    : 'text-slate-100 hover:bg-[#1e293b] hover:text-[#f87171]'
                }`}
              >
                NODARBĪBU GRAFIKS
              </Link>
              <Link
                to="/gallery"
                aria-current={currentTab === 'gallery' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center w-full text-left px-3 py-2.5 rounded-md font-heading text-lg font-medium transition-colors ${
                  currentTab === 'gallery'
                    ? 'bg-[#1e293b] text-[#f87171] border-l-4 border-[#dc2626]'
                    : 'text-slate-100 hover:bg-[#1e293b] hover:text-[#f87171]'
                }`}
              >
                GALERIJA
              </Link>
              <Link
                to="/contacts"
                aria-current={currentTab === 'contacts' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center w-full text-left px-3 py-2.5 rounded-md font-heading text-lg font-medium transition-colors ${
                  currentTab === 'contacts'
                    ? 'bg-[#1e293b] text-[#f87171] border-l-4 border-[#dc2626]'
                    : 'text-slate-100 hover:bg-[#1e293b] hover:text-[#f87171]'
                }`}
              >
                SAZINIES AR MUMS
              </Link>

              <div className="pt-4 flex items-center justify-center space-x-4 border-t border-[#1e293b]">
                <a
                  href="https://www.facebook.com/kumitekarateklubs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kumite Karate Klubs Facebook profils"
                  className="w-11 h-11 inline-flex items-center justify-center bg-[#1e293b] hover:bg-[#1877F2] text-white rounded-lg transition-all hover:scale-[1.04] active:scale-[0.97]"
                >
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kumite Karate Klubs Instagram profils"
                  className="w-11 h-11 inline-flex items-center justify-center bg-[#1e293b] text-white rounded-lg hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] transition-all hover:scale-[1.04] active:scale-[0.97]"
                >
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href="https://www.youtube.com/@KUMITEKARATEKLUBS"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kumite Karate Klubs YouTube kanāls"
                  className="w-11 h-11 inline-flex items-center justify-center bg-[#1e293b] text-white rounded-lg hover:bg-[#dc2626] transition-all hover:scale-[1.04] active:scale-[0.97]"
                >
                  <Youtube className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
