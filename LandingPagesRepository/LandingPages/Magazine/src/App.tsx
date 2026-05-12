/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Utensils, Landmark, TreePine, Moon, Sparkles, Star, Calendar, ExternalLink, Globe2, HeartHandshake, Languages, Banknote, Sun, MessageSquare, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TravelGuidance, Recommendation, LocalGuide, TravelEvent, TravelTip } from './types';
import { CURATED_DATA } from './data/curatedData';
import ThreeFallingFlowers from './components/ThreeFallingFlowers';

const ICON_MAP: Record<string, React.ElementType> = {
  HeartHandshake,
  Languages,
  Compass,
  Banknote,
  Sun
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [data, setData] = useState<TravelGuidance | null>(CURATED_DATA['en']['medellin']);
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    en: {
      tagline: "The City of Eternal Spring",
      places: "Curated Experiences",
      guides: "Local Experts",
      events: "Upcoming Events",
      bookGuide: "Book Guide",
      perHour: "hr",
      verified: "Verified Local",
      insight: "Local Insight",
      essentials: "Travel Essentials"
    },
    es: {
      tagline: "La Ciudad de la Eterna Primavera",
      places: "Experiencias Curadas",
      guides: "Expertos Locales",
      events: "Próximos Eventos",
      bookGuide: "Reservar",
      perHour: "h",
      verified: "Local Verificado",
      insight: "Dato Local",
      essentials: "Esenciales de Viaje"
    }
  }[lang];

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'es' : 'en';
    setLang(newLang);
    setData(CURATED_DATA[newLang]['medellin']);
  };

  if (!data) return null;

  const currentDate = new Date();
  const upcomingEvents = data.events.filter(event => {
    const endDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    endDate.setDate(endDate.getDate() + 1);
    return endDate > currentDate;
  });

  // Filter recommendations and events based on search
  const filteredRecommendations = data.recommendations.filter(rec =>
    rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = upcomingEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen text-slate-800 font-sans selection:bg-slate-800 selection:text-white"
      style={{
        backgroundColor: '#f4f7f6',
        backgroundImage: "url('/tree.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Full-page tint so the tree is subtle */}
      <div className="fixed inset-0 bg-[#f4f7f6]/85 pointer-events-none" style={{ zIndex: 0 }} />
      <ThreeFallingFlowers />
      
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 shadow-sm"
        style={{
          backgroundImage: "url('/header.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Dark scrim so text is readable over the photo */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
        <div className="relative flex items-center gap-3">
          <Compass className="w-8 h-8 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight text-white">Vander</span>
        </div>
        <button 
          onClick={toggleLang}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all text-sm font-semibold border border-white/30"
        >
          <Globe2 className="w-4 h-4" />
          {lang === 'en' ? 'ES' : 'EN'}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[65vh] w-full flex flex-col items-center justify-center text-center px-6 md:px-12 mt-16 rounded-b-[40px] overflow-hidden shadow-sm">
        <div className="absolute inset-0 z-0">
          <img 
            src={data.heroImage || "https://images.unsplash.com/photo-1549888834-3ec93abae044?auto=format&fit=crop&q=80"}
            alt={data.city} 
            className="w-full h-full object-cover"
          />
          {/* Lighter gradient for light mode hero */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl flex flex-col items-center mt-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg"
          >
            {data.city}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-2xl drop-shadow-md"
          >
            {data.tagline}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-12 py-20 max-w-7xl mx-auto space-y-24">
        
        {/* Overview & Dynamic Tips */}
        <section className="flex flex-col items-center text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <p className="text-xl md:text-2xl leading-relaxed text-slate-600 font-medium">
              {data.overview}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-xl"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">{t.essentials}</h3>
            <TipsCarousel tips={data.tips} />
          </motion.div>
        </section>

        {/* Search Bar */}
        <section className="flex justify-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl"
          >
            <div className="bg-white rounded-3xl p-2 flex items-center gap-3 border border-slate-200 shadow-sm focus-within:ring-2 ring-emerald-500/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder={lang === 'en' ? "Search places, events, guides..." : "Buscar lugares, eventos, guías..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none text-slate-800 placeholder-slate-400 text-sm py-2"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors mr-1"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </motion.div>
        </section>

        {/* Curated Experiences */}
        <CarouselContainer title={t.places} count={searchTerm ? filteredRecommendations.length : undefined} searchTerm={searchTerm}>
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((rec, i) => (
              <PlaceCard key={rec.name} rec={rec} city={data.city} t={t} index={i} />
            ))
          ) : searchTerm ? (
            <div className="flex-shrink-0 w-full py-12 text-center text-slate-500 italic">
              No places found matching "{searchTerm}"
            </div>
          ) : (
            data.recommendations.map((rec, i) => (
              <PlaceCard key={rec.name} rec={rec} city={data.city} t={t} index={i} />
            ))
          )}
        </CarouselContainer>

        {/* Local Guides */}
        <CarouselContainer title={t.guides} centered>
          {data.localGuides.map((guide, i) => (
            <GuideCard key={guide.name} guide={guide} t={t} lang={lang} index={i} />
          ))}
        </CarouselContainer>

        {/* Upcoming Events */}
        <CarouselContainer title={t.events} count={searchTerm ? filteredEvents.length : undefined} searchTerm={searchTerm}>
          <AnimatePresence>
            {filteredEvents.length > 0 ? filteredEvents.map((event, i) => (
              <EventCard key={event.title} event={event} city={data.city} index={i} />
            )) : searchTerm ? (
              <div className="flex-shrink-0 w-full py-12 text-center text-slate-500 italic bg-white rounded-3xl shadow-sm border border-slate-100">
                No events found matching "{searchTerm}"
              </div>
            ) : (
              <div className="w-full py-12 text-center text-slate-500 italic bg-white rounded-3xl shadow-sm border border-slate-100">
                No upcoming events at this time.
              </div>
            )}
          </AnimatePresence>
        </CarouselContainer>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 text-center text-slate-500 text-sm bg-white">
        <p>© 2026 Vander Travel. AI-Curated, Locally Verified.</p>
      </footer>
    </div>
  );
}

function CarouselContainer({ children, title, count, searchTerm, centered }: { children: React.ReactNode, title: string, count?: number, searchTerm?: string, centered?: boolean }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (searchTerm || isHovered || centered) return;
    
    const intervalId = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 320 + 24, behavior: 'smooth' });
        }
      }
    }, 4000); 
    
    return () => clearInterval(intervalId);
  }, [searchTerm, isHovered, centered]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.2 : clientWidth / 1.2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative group mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{title}</h2>
          {count !== undefined && searchTerm && (
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {count} result{count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {!centered && (
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="p-3 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all active:scale-95 text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all active:scale-95 text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div 
        ref={scrollRef}
        className={`flex gap-4 md:gap-6 pb-8 px-2 ${
          centered
            ? 'justify-center flex-wrap'
            : 'overflow-x-auto snap-x snap-mandatory no-scrollbar'
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function TipsCarousel({ tips }: { tips: TravelTip[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="relative h-[160px] bg-white rounded-[32px] overflow-hidden flex items-center justify-center p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center text-center absolute w-full px-6"
        >
          {(() => {
            const IconComponent = ICON_MAP[tips[currentIndex].iconName] || Star;
            return <IconComponent className="w-6 h-6 text-emerald-500 mb-3" />;
          })()}
          <h4 className="text-base font-bold mb-2 text-slate-800">{tips[currentIndex].topic}</h4>
          <p className="text-slate-600 text-sm leading-relaxed">{tips[currentIndex].text}</p>
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {tips.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-5 bg-emerald-500' : 'w-1.5 bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
}

function PlaceCard({ rec, city, t, index }: { rec: Recommendation, city: string, t: any, index: number }) {
  const Icon = {
    Food: Utensils,
    Culture: Landmark,
    Nature: TreePine,
    Nightlife: Moon,
    'Hidden Gem': Sparkles
  }[rec.category] || MapPin;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rec.name + ' ' + city)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-[340px] w-[280px] md:w-[320px] snap-center rounded-[32px] overflow-hidden cursor-pointer flex-shrink-0 shadow-md hover:shadow-xl transition-all"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={rec.imageUrl || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80"} 
          alt={rec.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full text-center">
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Icon className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800">{rec.category}</span>
        </div>

        <a 
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 text-slate-800"
        >
          <MapPin className="w-3.5 h-3.5" />
        </a>

        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center w-full">
          <h3 className="text-xl font-bold text-white mb-2">{rec.name}</h3>
          <p className="text-white/90 text-xs line-clamp-2 mb-3 group-hover:line-clamp-none transition-all duration-500 px-2 drop-shadow-sm">
            {rec.description}
          </p>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex flex-col items-center w-full">
            <div className="h-px w-1/2 bg-white/30 mb-3" />
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-300 drop-shadow-md" />
              <p className="text-[10px] text-white/90 italic px-2 drop-shadow-sm">
                "{rec.whyLocal}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GuideCard({ guide, t, lang, index }: { guide: LocalGuide, t: any, lang: string, index: number }) {
  const whatsappUrl = guide.phoneNumber 
    ? `https://wa.me/${guide.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lang === 'en' ? `Hi ${guide.name}, I found you on Vander and would like to learn more about your ${guide.specialty} guide services!` : `¡Hola ${guide.name}! Te encontré en Vander y me gustaría saber más sobre tus servicios como guía de ${guide.specialty}.`)}`
    : '#';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-[32px] flex flex-col w-[280px] md:w-[300px] snap-center overflow-visible border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex-shrink-0"
    >
      {/* Photo — taller so faces show fully */}
      <div className="h-48 w-full relative shrink-0 overflow-hidden rounded-t-[32px] bg-slate-100">
        {guide.imageUrl ? (
          <img 
            src={guide.imageUrl} 
            alt={guide.name} 
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
            style={{ backgroundColor: guide.avatarColor || '#3B82F6' }}
          >
            {guide.name.charAt(0)}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-[10px] font-bold text-slate-800">{guide.rating}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col items-center text-center flex-1 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold shadow-sm border-2 border-white whitespace-nowrap">
          {t.verified}
        </div>
        
        <h3 className="text-xl font-extrabold mt-3 mb-0.5 text-slate-900">{guide.name}</h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">{guide.specialty}</p>
        
        <p className="text-slate-600 text-xs leading-relaxed mb-4 flex-grow italic line-clamp-2">
          "{guide.bio}"
        </p>
        
        <div className="flex items-center justify-between w-full pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">${guide.pricePerHour}</span>
            <span className="text-[10px] text-slate-500 uppercase">/{t.perHour}</span>
          </div>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-full hover:bg-[#1ebd5b] transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#25D366]/20"
            title={t.bookGuide}
          >
            <MessageSquare className="w-4 h-4 fill-current" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function EventCard({ event, city, index }: { event: TravelEvent, city: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-[340px] w-[280px] md:w-[320px] snap-center rounded-[32px] overflow-hidden cursor-pointer flex-shrink-0 shadow-md hover:shadow-xl transition-all"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />
      </div>

      <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full text-center">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">{event.date}</span>
        </div>

        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center w-full">
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <p className="text-white/90 text-xs line-clamp-2 mb-4 group-hover:line-clamp-none transition-all duration-500 px-2 drop-shadow-sm">
            {event.description}
          </p>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 w-full pt-3 border-t border-white/30">
            <div className="flex justify-between items-center w-full px-2">
              <div className="flex items-center gap-1.5 text-white/90 text-[10px] font-medium drop-shadow-sm">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{event.locationName}</span>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.locationName + ' ' + city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors text-white"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
