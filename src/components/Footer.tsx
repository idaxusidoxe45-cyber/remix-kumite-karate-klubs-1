import React from 'react';
import { Link } from 'react-router-dom';
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
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#f87171]">
                Rīga • Bērnu un Jauniešu Karatē
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://www.facebook.com/kumitekarateklubs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kumite Karate Klubs Facebook profils"
              className="w-11 h-11 rounded-lg bg-[#1e293b] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="Facebook"
            >
              <Facebook className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/kumite_karate_klubs?igsh=NXE5bmhnOW45cjMx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kumite Karate Klubs Instagram profils"
              className="w-11 h-11 rounded-lg bg-[#1e293b] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com/@KUMITEKARATEKLUBS"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kumite Karate Klubs YouTube kanāls"
              className="w-11 h-11 rounded-lg bg-[#1e293b] hover:bg-[#dc2626] text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 shadow-lg border border-slate-700"
              title="YouTube"
            >
              <Youtube className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="border-t border-[#1e293b] pt-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300 font-sans">
          <p>
            Copyrights © 2026 | Kumite Karate Klubs | Rīga, Gustava Zemgala gatve 71, mob.{' '}
            <a
              href="tel:+37129177274"
              className="text-white hover:text-[#f87171] underline decoration-slate-600 underline-offset-4 transition-colors"
            >
              +371 29177274
            </a>
          </p>
          <Link
            to="/admin"
            className="min-h-[44px] inline-flex items-center px-2 text-slate-300 hover:text-[#f87171] transition-colors uppercase font-heading tracking-widest font-bold text-[11px]"
          >
            Vadības panelis (CMS)
          </Link>
        </div>
      </div>
    </footer>
  );
}
