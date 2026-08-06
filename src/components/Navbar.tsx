import React, { useState } from 'react';
import { PageTab } from '../types';
import { Menu, X, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

interface NavbarProps {
  currentTab: PageTab;
  setCurrentTab: (tab: PageTab) => void;
  openTrialModal: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, openTrialModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  const navItems: { tab: PageTab; label: string; hasSub?: boolean }[] = [
    { tab: 'home', label: 'SĀKUMS' },
    { tab: 'about', label: 'PAR KLUBU', hasSub: true },
    { tab: 'schedule', label: 'NODARBĪBU GRAFIKS' },
    { tab: 'gallery', label: 'GALERIJA' },
    { tab: 'contacts', label: 'SAZINIES AR MUMS' }
  ];

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full bg-[#0a0a0c] shadow-lg border-b border-[#1e293b]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4rem] sm:min-h-[5rem] py-2 gap-1.5 sm:gap-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group py-1 flex-shrink-0" 
            onClick={() => setCurrentTab('home')}
          >
            <Logo variant="dark" className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 group-hover:scale-105 transition-transform shadow-lg flex-shrink-0" />
            <div className="flex flex-col justify-center flex-shrink-0">
              <span className="font-heading text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wider text-white group-hover:text-[#dc2626] transition-colors leading-snug block uppercase whitespace-nowrap">
                KUMITE KARATE KLUBS
              </span>
              <span className="hidden sm:block text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-wider text-[#94a3b8] font-semibold leading-tight whitespace-nowrap">Rīga • Bērnu un Jauniešu Karatē</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-4 2xl:space-x-8 flex-shrink-0">
            {navItems.map((item) => {
              if (item.hasSub) {
                return (
                  <div
                    key={item.tab}
                    className="relative group py-4"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setCurrentTab(item.tab)}
                      className={`flex items-center space-x-1 font-heading tracking-wider text-sm xl:text-base font-medium transition-colors whitespace-nowrap ${
                        currentTab === 'about' || currentTab === 'coaches' ? 'text-[#dc2626]' : 'text-slate-200 hover:text-[#dc2626]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {aboutDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-48 bg-[#0a0a0c] shadow-xl rounded-b-lg border-t-2 border-[#dc2626] border-x border-b border-[#1e293b] py-2"
                      >
                        <button
                          onClick={() => {
                            setCurrentTab('about');
                            setAboutDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-heading tracking-wider hover:bg-[#1e293b] text-slate-200 hover:text-[#dc2626] transition-colors"
                        >
                          PAR KLUBU
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTab('coaches');
                            setAboutDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-heading tracking-wider hover:bg-[#1e293b] text-slate-200 hover:text-[#dc2626] transition-colors"
                        >
                          TRENERI
                        </button>
                      </motion.div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.tab}
                  onClick={() => setCurrentTab(item.tab)}
                  className={`font-heading tracking-wider text-sm xl:text-base font-medium transition-colors relative py-2 whitespace-nowrap ${
                    currentTab === item.tab ? 'text-[#dc2626]' : 'text-slate-200 hover:text-[#dc2626]'
                  }`}
                >
                  {item.label}
                  {currentTab === item.tab && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#dc2626]" 
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Socials */}
          <div className="hidden xl:flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <a
                href="https://www.facebook.com/kumitekarateklubs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#1e293b] hover:bg-[#1877F2] hover:text-white flex items-center justify-center text-slate-200 transition-all transform hover:scale-110 active:scale-90"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#1e293b] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white flex items-center justify-center text-slate-200 transition-all transform hover:scale-110 active:scale-90"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@KUMITEKARATEKLUBS"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#1e293b] hover:bg-[#dc2626] hover:text-white flex items-center justify-center text-slate-200 transition-all transform hover:scale-110 active:scale-90"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={openTrialModal}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading tracking-wider px-4 py-2 rounded shadow-lg border border-[#ef4444] transition-all transform hover:scale-105 active:scale-95 text-sm uppercase font-semibold whitespace-nowrap"
            >
              Bezmaksas treniņš
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 sm:space-x-3 xl:hidden flex-shrink-0">
            <button
              onClick={openTrialModal}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[11px] xs:text-xs sm:text-sm font-heading tracking-wider px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg uppercase font-bold shadow-md border border-red-500/50 transition-all active:scale-95 whitespace-nowrap"
            >
              Pieteikties
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-white bg-[#1e293b] hover:bg-[#dc2626] border border-slate-700/80 focus:outline-none transition-all active:scale-95 shadow-sm flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-[#0a0a0c] border-b border-[#1e293b] px-4 pt-2 pb-6 space-y-2 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setCurrentTab('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-md font-heading text-xl font-medium text-slate-100 hover:bg-[#1e293b] hover:text-[#dc2626]"
            >
              SĀKUMS
            </button>
            <button
              onClick={() => {
                setCurrentTab('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-md font-heading text-xl font-medium text-slate-100 hover:bg-[#1e293b] hover:text-[#dc2626]"
            >
              PAR KLUBU
            </button>
            <button
              onClick={() => {
                setCurrentTab('coaches');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-2 rounded-md font-heading text-lg text-slate-400 hover:bg-[#1e293b] hover:text-[#dc2626]"
            >
              — Treneri
            </button>
            <button
              onClick={() => {
                setCurrentTab('schedule');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-md font-heading text-xl font-medium text-slate-100 hover:bg-[#1e293b] hover:text-[#dc2626]"
            >
              NODARBĪBU GRAFIKS
            </button>
            <button
              onClick={() => {
                setCurrentTab('gallery');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-md font-heading text-xl font-medium text-slate-100 hover:bg-[#1e293b] hover:text-[#dc2626]"
            >
              GALERIJA
            </button>
            <button
              onClick={() => {
                setCurrentTab('contacts');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-md font-heading text-xl font-medium text-slate-100 hover:bg-[#1e293b] hover:text-[#dc2626]"
            >
              SAZINIES AR MUMS
            </button>

            <div className="pt-4 flex items-center justify-center space-x-4 border-t border-[#1e293b]">
              <a href="https://www.facebook.com/kumitekarateklubs" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#1e293b] hover:bg-[#1877F2] hover:text-white rounded text-slate-200 transition-all transform hover:scale-110 active:scale-90">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#1e293b] rounded text-slate-200 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@KUMITEKARATEKLUBS" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#1e293b] rounded text-slate-200 hover:text-[#dc2626]">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
