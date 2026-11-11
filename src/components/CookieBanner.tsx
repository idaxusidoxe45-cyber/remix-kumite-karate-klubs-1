import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kumite_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = (accepted: boolean) => {
    localStorage.setItem('kumite_cookie_consent', accepted ? 'accepted' : 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.aside
          role="region"
          aria-label="Sīkdatņu izmantošanas paziņojums"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 inset-x-0 sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-md z-50 bg-[#0a0a0c]/95 backdrop-blur-md text-white border-t sm:border border-slate-800/90 shadow-2xl p-4 sm:p-5 sm:rounded-xl rounded-t-2xl"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#f87171] flex-shrink-0" aria-hidden="true" />
              <h2 className="font-heading text-sm sm:text-base font-bold text-white tracking-wider uppercase">
                Sīkdatnes un privātums
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleDismiss(false)}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-300 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Aizvērt"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed mb-3 text-slate-200 font-sans">
            Mēs izmantojam sīkdatnes, lai nodrošinātu labāku vietnes darbību un analizētu satiksmi. Nospiežot "Apstiprināt", jūs piekrītat sīkdatņu izmantošanai.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDismiss(false)}
              className="flex-1 min-h-[44px] bg-[#1e293b] border border-slate-600 hover:bg-slate-800 text-xs sm:text-sm font-bold py-2.5 px-3 rounded-lg text-slate-100 transition-all active:scale-95 text-center cursor-pointer"
            >
              Noraidīt
            </button>
            <button
              type="button"
              onClick={() => handleDismiss(true)}
              className="flex-1 min-h-[44px] bg-[#dc2626] hover:bg-[#b91c1c] text-xs sm:text-sm font-bold py-2.5 px-3 rounded-lg text-white transition-all active:scale-95 shadow-md border border-red-500/50 text-center cursor-pointer"
            >
              Apstiprināt
            </button>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
