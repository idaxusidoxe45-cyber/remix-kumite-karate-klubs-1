import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0c] text-white py-14 border-t-8 border-[#dc2626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center space-x-3">
            <Logo variant="dark" className="w-12 h-12 shadow-lg" />
            <div>
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-wider text-white block uppercase">
                KUMITE KARATE KLUBS
              </span>
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#dc2626]">Rīga • Bērnu un Jauniešu Karatē</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://www.facebook.com/kumitekarateklubs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-lg bg-[#1e293b] hover:bg-[#1877F2] hover:text-white text-slate-200 flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-lg bg-[#1e293b] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@KUMITEKARATEKLUBS"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-lg bg-[#1e293b] hover:bg-[#dc2626] text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-[#1e293b] pt-8 text-center">
          <p className="text-sm tracking-wide text-slate-400 font-sans">
            Copyrights © 2026 | Kumite Karate Klubs | Rīga, Gustava Zemgala gatve 71, mob. +371 29177274
          </p>
        </div>
      </div>
    </footer>
  );
}
