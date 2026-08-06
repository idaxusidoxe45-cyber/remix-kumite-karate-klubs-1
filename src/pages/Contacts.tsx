import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';

interface ContactsProps {
  openTrialModal: () => void;
}

export default function Contacts({ openTrialModal }: ContactsProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  const workingHours = [
    { day: 'Pirmdiena', time: '15:30 – 20:30' },
    { day: 'Otrdiena', time: '18:00 – 20:15' },
    { day: 'Trešdiena', time: '15:30 – 20:30' },
    { day: 'Ceturtdiena', time: '18:00 – 20:15' },
    { day: 'Piektdiena', time: '15:30 – 20:30' },
    { day: 'Sestdiena', time: 'slēgts' },
    { day: 'Svētdiena', time: 'slēgts' }
  ];

  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Header */}
      <section className="relative bg-[#0a0a0c] text-white py-20 lg:py-28 overflow-hidden border-b-8 border-[#dc2626]">
        <div className="absolute inset-0 bg-cover bg-center opacity-45 filter grayscale" style={{ backgroundImage: "url('/assets_gallery/trenini/karate-web-17.webp')" }}></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs sm:text-sm uppercase tracking-widest text-[#dc2626] font-heading font-bold block mb-2">Kumite Karate Klubs</span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white uppercase font-bold tracking-tight mb-6 leading-tight">Sazinies ar mums</h1>
            <button
              onClick={openTrialModal}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest px-8 py-3.5 font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 border-white rounded-lg"
            >
              Pievienojies mums
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content Info & Form */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Contact Form */}
            <InteractiveRepelCard maxShift={10} maxRotate={4}>
              <div className="bg-[#0a0a0c] text-white p-8 sm:p-10 rounded-2xl shadow-2xl border-2 border-slate-800 h-full">
                <h3 className="text-2xl sm:text-3xl font-heading text-white uppercase font-bold tracking-wide mb-6">Nosūtīt ziņu</h3>
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle className="w-16 h-16 text-[#dc2626] mx-auto animate-bounce" />
                    <h4 className="text-3xl font-heading text-white uppercase font-bold">Paldies par ziņu!</h4>
                    <p className="text-slate-300 text-base font-sans">Mēs ar jums sazināsimies tuvākajā laikā.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold">Jūsu vārds *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jūsu vārds"
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-[#dc2626]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold">Tālruņa numurs</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Tālruņa numurs"
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-[#dc2626]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold">E-pasta adrese *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-pasta adrese"
                        className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-[#dc2626]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold">Jūsu ziņa *</label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Jūsu ziņa"
                        className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-[#dc2626]"
                      ></textarea>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 border-white"
                      >
                        Nosūtīt
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </InteractiveRepelCard>

            {/* Hours & Contact details */}
            <div className="space-y-8">
              <InteractiveRepelCard maxShift={10} maxRotate={4}>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
                  <h3 className="text-2xl sm:text-3xl font-heading uppercase tracking-wider mb-6 flex items-center text-[#0a0a0c] font-bold">
                    <Clock className="w-7 h-7 text-[#dc2626] mr-3" />
                    <span>Zāles darba laiks</span>
                  </h3>
                  <ul className="space-y-3 font-sans">
                    {workingHours.map((wh, idx) => (
                      <li key={idx} className="flex justify-between items-center text-base border-b border-slate-200 pb-2">
                        <span className="font-semibold text-slate-800">{wh.day}</span>
                        <span className={`font-bold ${wh.time === 'slēgts' ? 'text-[#dc2626]' : 'text-slate-900'}`}>{wh.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </InteractiveRepelCard>

              <InteractiveRepelCard maxShift={10} maxRotate={4}>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-heading uppercase tracking-wider mb-4 text-[#0a0a0c] font-bold">Kontakti</h3>
                  <div className="space-y-3 text-base text-slate-700 font-sans">
                    <p className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
                      <span>Telefona numurs: <a href="tel:+37129177274" className="underline font-bold text-[#dc2626]">+371 29177274</a></span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
                      <span>E-Pasts: <a href="mailto:info@kumitekarate.lv" className="underline font-bold text-[#dc2626]">info@kumitekarate.lv</a></span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
                      <span className="font-semibold text-slate-800">Zāles adrese: Rīga, Gustava Zemgala gatve 71</span>
                    </p>
                  </div>
                </div>
              </InteractiveRepelCard>
            </div>
          </div>

          {/* Map & Waze Link */}
          <InteractiveRepelCard maxShift={10} maxRotate={4}>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-6 shadow-md">
              <h3 className="text-3xl font-heading text-[#0f172a] uppercase font-bold tracking-wide">Kā mūs atrast</h3>
              <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl border-2 border-slate-900 relative">
                <a
                  href="https://waze.com/ul?ll=56.971622,24.166368&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative"
                >
                  <img
                    src="/assets_gallery/zale/img_2357-400x284.webp"
                    alt="Gustava Zemgala gatve 71 Zāle"
                    className="w-full h-80 object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest px-8 py-4 rounded-xl shadow-2xl font-bold transition-all transform group-hover:scale-105 active:scale-95 border-2 border-white">
                      Atvērt Waze navigāciju
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </InteractiveRepelCard>
        </div>
      </section>
    </div>
  );
}
