"use client";

import { useState, useMemo } from "react";
import { Event } from "@/lib/api";

interface DeskCalendarProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

export default function DeskCalendar({ events, onSelectEvent }: DeskCalendarProps) {
  const [dateInfo] = useState(() => {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.toLocaleString("es-CO", { month: "long" }).toUpperCase(),
      year: now.getFullYear(),
    };
  });

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const initialEventIndex = useMemo(() => {
    if (sortedEvents.length === 0) return 0;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const idx = sortedEvents.findIndex(event => new Date(event.date) >= now);
    return idx !== -1 ? idx : 0;
  }, [sortedEvents]);

  const [eventIndex, setEventIndex] = useState(initialEventIndex);

  const currentEvent = sortedEvents[eventIndex];

  const nextEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sortedEvents.length > 0) {
      setEventIndex((prev) => (prev + 1) % sortedEvents.length);
    }
  };

  const prevEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sortedEvents.length > 0) {
      setEventIndex((prev) => (prev === 0 ? sortedEvents.length - 1 : prev - 1));
    }
  };

  return (
    <div
      className="relative w-full h-full bg-[#001220]/70 backdrop-blur-xl rounded-2xl flex flex-col shadow-[0_0_40px_rgba(34,211,238,0.2),inset_0_0_25px_rgba(34,211,238,0.1)] overflow-hidden z-20 group"
    >
      {/* Holographic Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(34,211,238,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-0 mix-blend-overlay" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-green-400 via-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.6)] rounded-t-2xl z-20" />

       {/* Header - Current Date (Compact & Spread) */}
       <div className="px-5 py-2 border-b border-cyan-500/30 bg-[#0ea5e9]/10 relative z-10 shrink-0">
          <div className="flex items-center justify-between w-full">
             <span className="text-[10px] font-black text-cyan-400 tracking-[0.2em] uppercase leading-none w-1/3 text-left drop-shadow-md">
                {dateInfo.month}
             </span>
             <span className="text-4xl font-black text-cyan-300 leading-none drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] w-1/3 text-center">
                {dateInfo.day}
             </span>
             <span className="text-sm font-black text-cyan-200 font-serif drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] w-1/3 text-right">
                {dateInfo.year}
             </span>
          </div>
       </div>

      {/* Events Section */}
      <div className="flex-1 px-3 py-2 relative flex flex-col items-center z-10 overflow-hidden">
         <div className="text-[9px] font-black text-cyan-100 uppercase tracking-[0.2em] mb-2 flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            Holo-Eventos
         </div>
         
         {currentEvent ? (
            <div 
              className="flex flex-col items-center text-center group/event cursor-pointer w-full relative flex-1"
              onClick={() => onSelectEvent(currentEvent)}
            >
               {/* Carousel Controls */}
               <button onClick={prevEvent} className="absolute left-0 top-12 text-cyan-500 hover:text-cyan-300 p-1 transition-colors drop-shadow-[0_0_8px_#22d3ee] text-xs z-20">
                  ◀
               </button>
               <button onClick={nextEvent} className="absolute right-0 top-12 text-cyan-500 hover:text-cyan-300 p-1 transition-colors drop-shadow-[0_0_8px_#22d3ee] text-xs z-20">
                  ▶
               </button>

               {/* Event Day Badge (Aurora Styled) */}
               <div className="flex flex-col items-center justify-center bg-[#001220]/80 border-[1.5px] rounded-lg w-10 h-10 shadow-[0_0_15px_rgba(34,211,238,0.3)] mb-2 group-hover/event:bg-cyan-900/50 transition-colors shrink-0"
                  style={{ borderImage: 'linear-gradient(to top right, #4ade80, #22d3ee, #3b82f6) 1' }}>
                  <span className="text-xl font-black text-cyan-300 group-hover/event:text-white leading-none">
                     {new Date(currentEvent.date).getUTCDate()}
                  </span>
               </div>

               {/* Event Content Container - Scrollable if needed */}
               <div className="w-full flex flex-col items-center overflow-y-auto custom-scrollbar flex-1 pb-2">
                  <h4 className="text-xs font-black text-white group-hover/event:text-cyan-200 transition-colors leading-tight px-2 drop-shadow-md mb-1 uppercase tracking-tight">
                     {currentEvent.title}
                  </h4>

                  <p className="text-[10px] text-cyan-300 font-serif italic px-2 leading-snug mb-2 drop-shadow-sm opacity-90">
                     {currentEvent.location}
                  </p>

                  <div className="mt-auto">
                     <p className="text-[9px] font-black text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 font-mono uppercase tracking-widest shadow-[0_0_8px_rgba(34,211,238,0.1)]">
                        {new Date(currentEvent.date).toLocaleDateString('es-CO', { month: 'long', day: 'numeric', timeZone: 'UTC' }).toUpperCase()}
                     </p>
                  </div>
               </div>
            </div>
         ) : (
            <p className="text-xs text-cyan-500 italic mt-4">No hay eventos próximos.</p>
         )}

         {/* Carousel indicators */}
         {sortedEvents.length > 1 && (
            <div className="flex gap-1.5 mt-auto pt-2 shrink-0">
               {sortedEvents.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_#22d3ee] transition-colors ${i === eventIndex ? 'bg-cyan-300' : 'bg-cyan-800'}`} />
               ))}
            </div>
         )}
      </div>
    </div>
  );
}
