"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getEditions, getEvents, Edition, Event } from "@/lib/api";
import BookShelf from "@/components/BookShelf";
import Radio from "@/components/Radio";
import DeskCalendar from "@/components/DeskCalendar";
import MagazineReader from "@/components/MagazineReader";
import SafeImage from "@/components/SafeImage";

const PHOTO_POSITIONS = [
  { top: '2%',  left: '0%',  w: 'w-14', h: 'h-14', rot: 'rotate-3' },
  { top: '2%',  left: '30%', w: 'w-12', h: 'h-12', rot: '-rotate-6' },
  { top: '2%',  left: '65%', w: 'w-14', h: 'h-14', rot: 'rotate-12' },
  { top: '22%', left: '5%',  w: 'w-14', h: 'h-14', rot: '-rotate-12' },
  { top: '24%', left: '38%', w: 'w-12', h: 'h-12', rot: 'rotate-6' },
  { top: '22%', left: '72%', w: 'w-14', h: 'h-14', rot: '-rotate-6' },
  { top: '44%', left: '0%',  w: 'w-12', h: 'h-12', rot: 'rotate-2' },
  { top: '46%', left: '32%', w: 'w-14', h: 'h-14', rot: 'rotate-12' },
  { top: '44%', left: '66%', w: 'w-14', h: 'h-14', rot: '-rotate-3' },
  { top: '66%', left: '30%', w: 'w-12', h: 'h-12', rot: 'rotate-6' },
];

interface Track {
  name: string;
  date: string;
  url: string;
  color: string;
}

const PODCASTS: Track[] = [
  { name: "Resistencia Sonora", date: "Vol. 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", color: "cyan" },
  { name: "Voces Ocultas", date: "Vol. 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", color: "orange" },
  { name: "Ecos de la Calle", date: "Vol. 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", color: "purple" },
  { name: "Memoria Viva", date: "Vol. 4", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", color: "yellow" },
  { name: "Ritmos Rebeldes", date: "Vol. 5", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", color: "green" },
  { name: "Latidos del Pacífico", date: "Vol. 6", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", color: "blue" },
  { name: "Arte y Protesta", date: "Vol. 7", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", color: "pink" },
];

const LIVE_RADIO: Track = {
  name: "En Vivo: Artistas Locales",
  date: "LIVE FM",
  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  color: "red"
};

const PHOTOS = [
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=800&q=80",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
  "https://images.unsplash.com/photo-1549888834-3ec93abae044?w=800&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=800&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
  "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80",
];


export default function Home() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track>(PODCASTS[0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [editionsData, eventsData] = await Promise.all([
          getEditions(),
          getEvents(),
        ]);
        setEditions(editionsData);
        setEvents(eventsData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a1412] font-sans selection:bg-amber-900 selection:text-white">
      
      {/* Hidden Preloader for Event Images for zero delay */}
      <div className="hidden">
        {events.map((ev, i) => (
          <Image key={i} src={ev.image} alt="preload" width={10} height={10} priority={true} />
        ))}
      </div>

      <AnimatePresence>
        {selectedEdition && (
          <MagazineReader 
            articles={selectedEdition.articles} 
            editionTitle={selectedEdition.title} 
            onClose={() => setSelectedEdition(null)} 
          />
        )}

        {selectedEvent && (
          <div 
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedEvent(null)}
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-[#fdfbf7] w-full max-w-2xl max-h-[85vh] rounded-sm shadow-2xl relative overflow-hidden flex flex-col md:flex-row cursor-default"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="w-full md:w-2/5 h-48 md:h-auto relative shrink-0">
                   <SafeImage src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" priority={true} />
                   <div className="absolute top-4 left-4 bg-red-800 text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                      Evento
                   </div>
                </div>
                <div className="w-full md:w-3/5 p-8 flex flex-col">
                   <p className="text-red-800 font-black text-xs uppercase tracking-widest mb-2 mt-4">
                     {new Date(selectedEvent.date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </p>
                   <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter leading-tight">{selectedEvent.title}</h2>
                   <p className="text-sm text-gray-500 font-serif italic mb-6 border-l-2 border-red-800/30 pl-3">
                     📍 {selectedEvent.location}
                   </p>
                   <div className="prose prose-sm text-gray-700 font-serif flex-1 overflow-y-auto mb-6 pr-2">
                     {selectedEvent.description.map((p, i) => <p key={i}>{p}</p>)}
                   </div>
                   <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 border border-gray-900 text-gray-900 font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors text-xs text-center block"
                   >
                      Ubicación en el Mapa
                   </a>
                </div>
             </motion.div>
          </div>
        )}

        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPhoto(null)}
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white p-4 pb-16 w-full max-w-4xl h-full max-h-[90vh] shadow-2xl relative cursor-default"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="relative w-full h-full">
                   <Image 
                       src={selectedPhoto} 
                       alt="Fotografía Ampliada" 
                       fill 
                       priority
                       sizes="(max-width: 768px) 100vw, 1200px"
                       className="object-contain" 
                   />
                </div>
                <p className="absolute bottom-6 left-0 right-0 text-center font-mono text-gray-500 text-sm tracking-widest uppercase font-black">Fotografía Análoga - Archivo</p>
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors z-10"
                >✕</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LAYER 1: THE ROOM (BACKGROUND) --- */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] z-10 flex items-end">
         <div className="absolute inset-0 opacity-10 mix-blend-luminosity">
            <Image 
               src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=2000&auto=format&fit=crop" 
               alt="Background Room" 
               fill 
               priority 
               className="object-cover" 
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent" />
         
         <div className="relative w-full max-w-7xl mx-auto h-full flex items-end px-4">
            <div className="w-[40%] h-full pb-4 flex items-end relative perspective-1000">
               <div className="absolute inset-y-0 left-0 w-20 bg-black/60 transform rotateY-[45deg] origin-left border-r-8 border-gray-900 shadow-2xl" />
               <div className="w-full relative z-10">
                 {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                       <div className="animate-pulse flex gap-4 items-end pb-8">
                          {[1,2,3].map(i => <div key={i} className="w-10 h-40 bg-gray-800/50 rounded-sm" />)}
                       </div>
                    </div>
                 ) : (
                    <BookShelf editions={editions} onSelectEdition={setSelectedEdition} />
                 )}
               </div>
            </div>

            <div className="flex-1 h-full pb-8 flex justify-center items-end relative perspective-1000 z-0">
               <div className="w-full flex justify-center items-center gap-6 transform rotateX-[60deg] scale-150 translate-y-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#3c2a21] to-[#1a120b] rounded-[2rem] shadow-[0_20px_30px_rgba(0,0,0,0.8),inset_0_5px_10px_rgba(255,255,255,0.1)] border border-white/5 flex items-center justify-center">
                     <div className="w-16 h-16 rounded-3xl bg-black/20 shadow-inner" />
                  </div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8b5a2b] to-[#5c3a1a] shadow-[0_20px_30px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.2)] border-2 border-orange-900/30 flex items-center justify-center">
                     <div className="w-12 h-12 rounded-full border border-white/5" />
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-br from-[#3c2a21] to-[#1a120b] rounded-[2rem] shadow-[0_20px_30px_rgba(0,0,0,0.8),inset_0_5px_10px_rgba(255,255,255,0.1)] border border-white/5 flex items-center justify-center">
                     <div className="w-16 h-16 rounded-3xl bg-black/20 shadow-inner" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --- LAYER 2: THE DESK (FOREGROUND) --- */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] z-20 shadow-[0_-30px_50px_rgba(0,0,0,0.8)] flex flex-col">
        <div className="relative flex-1 w-full overflow-visible">
           <div className="absolute inset-0">
              <Image 
                 src="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=2000&auto=format&fit=crop" 
                 alt="Desk Background" 
                 fill 
                 priority 
                 className="object-cover object-top" 
              />
           </div>
           
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent mix-blend-multiply pointer-events-none" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-12 pointer-events-none" />

           <div className="absolute inset-0 flex flex-row items-stretch px-4 py-3 gap-8">

               {/* Left Column (Radio) - FIXED CENTERING */}
               <div className="w-[30%] h-full flex items-center justify-center relative">
                  <div className="w-full max-w-[320px]">
                     <Radio 
                        trackName={currentTrack.name} 
                        streamUrl={currentTrack.url}
                        podcasts={PODCASTS}
                        onSelectTrack={setCurrentTrack}
                        onPlayLive={() => {}}
                     />
                  </div>
               </div>

                {/* Center Column (Magazine) - PORTRAIT & DOUBLE HEIGHT */}
                <div className="w-[40%] h-full relative overflow-visible flex justify-center">
                   <div
                      id="magazine-container"
                      className="absolute bottom-2 cursor-pointer group flex flex-col items-center w-full max-w-[340px] h-[75vh] max-h-[800px] z-20"
                      onClick={() => editions.length > 0 && setSelectedEdition(editions[0])}
                   >
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-72 h-16 bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none" />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 bg-cyan-400 rounded-full shadow-[0_0_30px_#22d3ee,0_0_60px_#22d3ee] opacity-80 animate-pulse pointer-events-none" />

                      {/* Outer Blue Container with Glow */}
                      <div className="relative flex flex-col w-full h-full bg-[#001220]/90 backdrop-blur-2xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_60px_rgba(34,211,238,0.3)] p-2.5">
                         
                         {/* Inner Cyan Bordered Box */}
                         <div className="relative flex-1 flex flex-col w-full border border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(34,211,238,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
                            
                            <div className="flex flex-col h-full p-2.5 overflow-hidden">
                               <div className="flex justify-center items-center mb-3 mt-1 shrink-0">
                                  <h3 className="text-white font-serif italic font-black tracking-[0.1em] uppercase text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] text-center leading-none">
                                     COLOMBIA<br />BASTARDA
                                  </h3>
                               </div>
                               
                               {/* Image Container with Centered Title */}
                               <div className="flex-1 w-full relative shadow-2xl border border-white/10 rounded-sm overflow-hidden bg-black/60 min-h-0 flex items-center justify-center">
                                  <Image 
                                     src={editions[0]?.image || 'https://images.unsplash.com/photo-1549888834-3ec93abae044?auto=format&fit=crop&q=80'} 
                                     alt="Revista Actual" 
                                     fill 
                                     priority
                                     sizes="400px"
                                     className="object-cover grayscale brightness-90 contrast-125" 
                                  />
                                  <div className="absolute inset-0 bg-black/40" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                                  
                                  {/* Centered Title with Glitch Effect */}
                                  <div className="relative z-10 text-center px-2 sm:px-4 w-full">
                                     <h1 className="text-white font-black italic uppercase text-3xl sm:text-4xl leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-glitch relative break-words text-balance">
                                        RESISTENCIA Y CULTURA
                                        <span className="absolute top-0 left-[2px] text-[#ff00ff] opacity-50 blur-[0.5px] w-full h-full flex items-center justify-center break-words text-balance">RESISTENCIA Y CULTURA</span>
                                        <span className="absolute top-0 -left-[2px] text-cyan-500 opacity-50 blur-[0.5px] w-full h-full flex items-center justify-center break-words text-balance">RESISTENCIA Y CULTURA</span>
                                     </h1>
                                  </div>
                               </div>
                               
                               <div className="mt-2 text-center shrink-0">
                                  <div className="inline-block px-4 py-1 border border-[#ff00ff] text-[#ff00ff] text-[7px] font-black uppercase tracking-[0.4em] bg-[#ff00ff]/10 shadow-[0_0_15px_rgba(255,0,255,0.2)]">
                                     Edición Holográfica
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* RIGHT COLUMN: Calendar + Photos */}
                <div className="w-[30%] h-full min-w-0 relative overflow-visible">
                   {/* Calendar - aligned with top of magazine */}
                   <div 
                      className="absolute left-[-15%] w-full max-w-[280px] h-[240px] z-30"
                      style={{ bottom: 'calc(75vh + 0.5rem - 240px)' }}
                   >
                      <DeskCalendar events={events} onSelectEvent={setSelectedEvent} />
                   </div>

                   {/* All 10 photos - percentage-based positions */}
                   <div className="absolute inset-0 overflow-visible pointer-events-none">
                      {PHOTOS.map((photo, i) => {
                        const pos = PHOTO_POSITIONS[i];
                        return (
                          <div
                            key={i}
                            className={`absolute ${pos.w} ${pos.h} bg-white p-[2px] shadow-2xl ${pos.rot} pointer-events-auto cursor-pointer z-10 hover:z-20 hover:scale-110 transition-transform duration-200`}
                            style={{ top: pos.top, left: pos.left }}
                            onClick={() => setSelectedPhoto(photo)}
                          >
                            <div className="relative w-full h-full overflow-hidden">
                              <Image src={photo} alt={`foto-${i}`} fill sizes="100px" className="object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                            </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
            </div>
         </div>
         
         {/* Desk Drawers Front (Bottom) */}
        <div className="h-32 w-full bg-[#1a110a] border-t-[12px] border-[#2c1d11] shadow-[inset_0_20px_20px_-10px_rgba(0,0,0,0.8)] relative z-50 flex px-10 md:px-32">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none" />
           <div className="absolute top-0 left-0 right-0 h-2 bg-black/40 pointer-events-none" />
           
           <div className="w-1/4 h-full border-r border-black/40 flex flex-col p-2 gap-2">
              <div className="flex-1 bg-[#24180e] shadow-inner border border-white/5 rounded-sm flex items-center justify-center hover:bg-[#2a1c11] transition-colors cursor-pointer group">
                 <div className="w-12 h-1.5 bg-black/60 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.1)] group-active:translate-y-0.5" />
              </div>
              <div className="flex-1 bg-[#24180e] shadow-inner border border-white/5 rounded-sm flex items-center justify-center hover:bg-[#2a1c11] transition-colors cursor-pointer group">
                 <div className="w-12 h-1.5 bg-black/60 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.1)] group-active:translate-y-0.5" />
              </div>
           </div>
           
           <div className="flex-1 h-full bg-black/80 shadow-[inset_0_30px_30px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
           </div>
           
           <div className="w-1/4 h-full border-l border-black/40 flex flex-col p-2 gap-2">
              <div className="flex-1 bg-[#24180e] shadow-inner border border-white/5 rounded-sm flex items-center justify-center hover:bg-[#2a1c11] transition-colors cursor-pointer group">
                 <div className="w-12 h-1.5 bg-black/60 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.1)] group-active:translate-y-0.5" />
              </div>
              <div className="flex-1 bg-[#24180e] shadow-inner border border-white/5 rounded-sm flex items-center justify-center hover:bg-[#2a1c11] transition-colors cursor-pointer group">
                 <div className="w-12 h-1.5 bg-black/60 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.1)] group-active:translate-y-0.5" />
              </div>
           </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] mix-blend-multiply" />
    </div>
   );
}
