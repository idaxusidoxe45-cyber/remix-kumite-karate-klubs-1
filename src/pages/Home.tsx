import React, { useState } from 'react';
import { PageTab } from '../types';
import { getDynamicTestimonials, getDynamicGalleryItems } from '../data';
import { CheckCircle, ArrowRight, Play, Star, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import InteractiveRepelCard from '../components/InteractiveRepelCard';
import { Logo } from '../components/Logo';

interface HomeProps {
  setCurrentTab: (tab: PageTab) => void;
  openTrialModal: () => void;
  openReviewModal?: () => void;
}

export default function Home({ setCurrentTab, openTrialModal, openReviewModal }: HomeProps) {
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormName('');
      setFormPhone('');
      setFormMessage('');
    }, 3000);
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 3000);
  };

  const previewGallery = getDynamicGalleryItems().slice(0, 3);

  return (
    <div className="bg-[#ffffff] text-[#0f172a]">
      {/* Hero Section - High-Impact Red, Black & White Graphic Style with subtle blue accents */}
      <section className="relative bg-[#0a0a0c] text-white overflow-hidden py-24 lg:py-36 border-b-8 border-[#dc2626]">
        {/* Subtle Red & Accent Glow Background */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-tr from-[#dc2626]/40 via-[#2563eb]/20 to-transparent opacity-60 blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity filter contrast-125 pointer-events-none"
          style={{ backgroundImage: "url('/assets_gallery/trenini/karate-web-17.webp')" }}
        ></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left max-w-3xl"
          >
            <div className="flex items-center justify-center lg:justify-start space-x-2.5 mb-5 flex-wrap gap-y-2">
              <Logo variant="dark" className="w-8 h-8 sm:w-10 sm:h-10 shadow-lg flex-shrink-0" />
              <span className="inline-flex items-center bg-[#1e293b]/90 border border-slate-700/80 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-wider text-red-500 font-heading font-bold shadow-sm">
                Kumite Karate Klubs • Vairāk • Ātrāk • Spēcīgāk
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white uppercase tracking-tight font-extrabold leading-tight mb-5 break-words">
              Izmēģini karatē nodarbības un palīdzi savam bērnam kļūt pārliecinātākam
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-sans mb-8 sm:mb-10 leading-relaxed max-w-2xl">
              Kumite Karatē klubs piedāvā jautras un attīstošas karatē un fiziskās sagatavotības nodarbības zēniem un meitenēm no 5 gadu vecuma Rīgā, apvienojot tradicionālo japāņu garu un mūsdienu metodiku.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 w-full">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openTrialModal}
                className="w-full sm:w-auto bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 font-bold transition-all shadow-xl rounded-xl border border-red-500 hover:border-red-400 cursor-pointer"
              >
                Piesakies bezmaksas nodarbībai
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentTab('about')}
                className="w-full sm:w-auto bg-[#1e293b]/90 hover:bg-[#334155] text-white font-heading text-base sm:text-lg uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 font-bold transition-all rounded-xl border border-slate-700 shadow-md cursor-pointer"
              >
                Uzzini vairāk
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-24 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">Karatē Bērniem un Jauniešiem</span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">Grupu sadalījums pēc vecuma</h2>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { age: '5 – 6 gadi', title: 'Jaunākā grupa', desc: 'Pamati, lokanība, koordinācija un rotaļu elementi drošā un draudzīgā vidē.' },
              { age: '7 – 9 gadi', title: 'Vidējā grupa', desc: 'Tehnikas pamati, disciplīna, fiziskā sagatavotība un pirmie sasniegumi uz tatami.' },
              { age: '10+ gadi', title: 'Vecākā grupa', desc: 'Padziļināta karatē tehnika, kumite sparingi un sagatavošanās sacensībām.' }
            ].map((group, idx) => (
              <InteractiveRepelCard key={idx} maxShift={14} maxRotate={6} onClick={() => setCurrentTab('schedule')}>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-white rounded-2xl shadow-lg p-8 border-t-8 border-[#dc2626] text-center border-x border-b border-slate-200 h-full flex flex-col justify-between hover:shadow-xl transition-shadow"
                >
                  <div>
                    <span className="inline-block bg-[#0f172a] text-white font-heading text-lg font-bold px-5 py-1.5 rounded-full mb-5 shadow-sm">
                      {group.age}
                    </span>
                    <h3 className="text-2xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mb-3">{group.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-sans">{group.desc}</p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('schedule')}
                    className="mt-6 inline-flex items-center justify-center text-[#dc2626] hover:text-[#b91c1c] font-heading uppercase tracking-wider text-base font-bold group"
                  >
                    <span>Skatīt grafiku</span>
                    <ArrowRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </InteractiveRepelCard>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial Form Section */}
      <section className="py-24 bg-[#0a0a0c] text-white border-y-4 border-[#dc2626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#2563eb] font-bold">Bezmaksas izmēģinājums</span>
              <h2 className="text-3xl sm:text-5xl font-heading text-white uppercase tracking-wide font-bold leading-tight">
                Iepazīšanās nodarbība bezmaksas
              </h2>
              <p className="text-slate-300 text-base leading-relaxed font-sans">
                Atved bērnu uz bezmaksas izmēģinājuma treniņu! Atstāj savu vārdu un telefona numuru, un mēs ar tevi sazināsimies.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3 text-slate-200">
                  <div className="w-9 h-9 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-bold font-heading text-lg shadow">1</div>
                  <span className="font-medium">Aizpildi vienkāršu pieteikuma formu</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-200">
                  <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold font-heading text-lg shadow">2</div>
                  <span className="font-medium">Saņem mūsu zvanu un saskaņo sev ērtu laiku</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-200">
                  <div className="w-9 h-9 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-bold font-heading text-lg shadow">3</div>
                  <span className="font-medium">Apmeklē pirmo treniņu pilnīgi bez maksas!</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#111827] p-8 rounded-2xl shadow-2xl border-2 border-slate-800"
            >
              {formSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#dc2626] mx-auto animate-bounce" />
                  <h3 className="text-3xl font-heading text-white font-bold uppercase">Pieteikums nosūtīts!</h3>
                  <p className="text-slate-300 text-base">Paldies! Mēs drīz ar jums sazināsimies.</p>
                </div>
              ) : (
                <form onSubmit={handleTrialSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-2 font-bold">Jūsu vārds *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Jūsu vārds"
                      className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-2 font-bold">Tālruņa numurs *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+371 XXXXXXXX"
                      className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase font-heading tracking-wider text-slate-200 mb-2 font-bold">Jūsu ziņa</label>
                    <textarea
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Jūsu ziņa..."
                      className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-xl uppercase tracking-widest py-4 rounded-lg font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl border-2 border-white"
                  >
                    Nosūtīt pieteikumu
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Club Preview & Video Section */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">Pievienojies ģimenei</span>
              <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2 mb-6">Pievienojies mūsu karatē ģimenei</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed text-base font-sans">
                <p>
                  Karatē ir japāņu cīņas māksla, kurā kā ieroci izmanto visu cilvēka ķermeni, piemēram rokas, dūres, elkoņus, kājas, ceļgalus.
                </p>
                <p>
                  Karatē liela nozīme ir cilvēka garīgajam spēkam un labai disciplīnai, kā arī tā mērķis ir attīstīt ķermeņa fiziskās īpašības.
                </p>
                <p>
                  Mēs ticam, ka pašdisciplīna un fiziskā sagatavotība ir pamats veselai dzīvei. Parādi savam bērnam ceļu uz drosmi un pārliecību kopā ar mums!
                </p>
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentTab('about')}
                  className="bg-[#0a0a0c] hover:bg-[#dc2626] text-white font-heading text-lg uppercase tracking-wider px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                >
                  Uzzināt vairāk par klubu
                </button>
              </div>
            </motion.div>

            <InteractiveRepelCard maxShift={16} maxRotate={8} className="w-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.025, y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video flex items-center justify-center relative border-4 border-slate-900 hover:border-[#dc2626] transition-all duration-300 hover:shadow-red-600/30"
              >
                <iframe
                  title="UZ STARTA LĪNIJAS #19 | KARATE"
                  src="https://www.youtube.com/embed/B4dpn-buHYk?feature=oembed"
                  className="w-full h-full absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </InteractiveRepelCard>
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-24 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">Mūsu mirkļi</span>
              <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-2">Galerija un treniņi</h2>
            </div>
            <button
              onClick={() => setCurrentTab('gallery')}
              className="mt-4 md:mt-0 inline-flex items-center text-[#dc2626] hover:text-[#b91c1c] font-heading uppercase tracking-wider font-bold text-lg group transition-all"
            >
              <span>Skatīt visu galeriju</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewGallery.map((item, idx) => (
              <InteractiveRepelCard key={item.id} maxShift={12} maxRotate={6} onClick={() => setCurrentTab('gallery')}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group cursor-pointer relative overflow-hidden rounded-xl shadow-md bg-white aspect-[4/3] border border-slate-200 h-full hover:border-[#dc2626] transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white font-heading uppercase tracking-wider text-xl font-bold">{item.caption}</p>
                  </div>
                </motion.div>
              </InteractiveRepelCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-6xl text-[#dc2626] font-serif font-bold">“</span>
            <h2 className="text-3xl sm:text-5xl font-heading text-[#0f172a] font-bold uppercase tracking-wide mt-1">Atsauksmes</h2>
            <div className="w-24 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getDynamicTestimonials().filter(t => t.status === 'published').slice(0, 3).map((t, idx) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md flex flex-col justify-between h-full select-text cursor-default"
              >
                <div className="space-y-4">
                  <div className="flex text-amber-500 space-x-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic text-sm leading-relaxed font-sans whitespace-pre-line">{t.text}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <h4 className="font-heading uppercase tracking-wider text-[#0a0a0c] text-lg font-bold">{t.author}</h4>
                  {t.role && <span className="text-xs text-slate-400 font-sans">{t.role}</span>}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            <button
              onClick={() => {
                setCurrentTab('about');
                setTimeout(() => {
                  const el = document.getElementById('atsauksmes');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="inline-block bg-[#0a0a0c] hover:bg-[#dc2626] text-white font-heading text-lg uppercase tracking-wider px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md"
            >
              Lasīt visas atsauksmes
            </button>
            {openReviewModal && (
              <button
                onClick={openReviewModal}
                className="inline-block bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-lg uppercase tracking-wider px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md border-2 border-white"
              >
                Atstāt atsauksmi
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Contact & Form Section */}
      <section className="py-24 bg-[#0a0a0c] text-white border-t-8 border-[#dc2626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-sm uppercase font-heading tracking-[0.3em] text-[#dc2626] font-bold">Sazinies ar mums</span>
              <h3 className="text-3xl sm:text-5xl font-heading text-white uppercase tracking-wide font-bold mb-6">Kumite Karate</h3>
              <div className="space-y-4 text-slate-300 font-sans">
                <p className="flex items-center space-x-3 text-lg">
                  <MapPin className="w-6 h-6 text-[#dc2626] flex-shrink-0" />
                  <span>Zāles adrese: Rīga, Gustava Zemgala gatve 71</span>
                </p>
                <p className="flex items-center space-x-3 text-lg">
                  <Mail className="w-6 h-6 text-[#dc2626] flex-shrink-0" />
                  <span>E-Pasts: <a href="mailto:info@kumitekarate.lv" className="underline hover:text-white">info@kumitekarate.lv</a></span>
                </p>
                <p className="flex items-center space-x-3 text-lg">
                  <Phone className="w-6 h-6 text-[#dc2626] flex-shrink-0" />
                  <span>Telefona numurs: +371 29177274</span>
                </p>
              </div>
            </div>

            <div className="bg-[#111827] p-8 rounded-2xl shadow-xl border-2 border-slate-800">
              {contactSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#dc2626] mx-auto animate-bounce" />
                  <h3 className="text-3xl font-heading text-white font-bold uppercase">Ziņa nosūtīta!</h3>
                  <p className="text-slate-300 text-base">Paldies! Mēs atbildēsim pēc iespējas ātrāk.</p>
                </div>
              ) : (
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold">Vārds *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Vārds"
                      className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold">E-pasta adrese *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="E-pasta adrese"
                      className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-slate-200 mb-1 font-heading font-bold">Jūsu ziņa *</label>
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Jūsu ziņa"
                      className="w-full bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#dc2626] text-base"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-heading text-lg uppercase tracking-widest px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg border-2 border-white"
                    >
                      Nosūtīt
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
