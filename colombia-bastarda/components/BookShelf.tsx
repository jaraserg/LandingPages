"use client";

import { motion } from "framer-motion";
import { Edition } from "@/lib/api";

interface BookShelfProps {
  editions: Edition[];
  onSelectEdition: (edition: Edition) => void;
}

export default function BookShelf({ editions, onSelectEdition }: BookShelfProps) {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] flex items-end justify-center pb-8 border-b-8 border-gray-900/80 shadow-[inset_0_-20px_20px_-10px_rgba(0,0,0,0.8)]">
      {/* Shelf Backing Texture */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />

      {/* The Books (Thin Volumes) */}
      <div className="relative z-10 flex gap-1 sm:gap-3 px-4 items-end">
        {editions.map((edition, index) => {
          const colors = [
            "from-blue-950 via-indigo-900 to-indigo-950",
            "from-red-950 via-red-900 to-red-950",
            "from-emerald-950 via-emerald-900 to-emerald-950",
            "from-orange-950 via-amber-900 to-amber-950",
          ];
          const color = colors[index % colors.length];
          const height = 190 + (index % 3) * 15;

          const dateObj = new Date(edition.date);
          const numericDate = dateObj.toLocaleDateString('es-CO', { month: '2-digit', year: 'numeric' });
          const titleText = edition.title.includes(':') ? edition.title.split(':')[1].trim() : edition.title;

          return (
            <motion.div
              key={edition.id}
              onClick={() => onSelectEdition(edition)}
              whileHover={{ y: -20, rotateZ: -2, zIndex: 20 }}
              className={`relative w-10 sm:w-12 md:w-14 rounded-t-sm shadow-[0_20px_25px_-5px_rgba(0,0,0,0.8),inset_2px_0_4px_rgba(255,255,255,0.2)] cursor-pointer group bg-gradient-to-r ${color} border-l border-r border-t border-black/80`}
              style={{ height: `${height}px` }}
            >
              {/* Leather Texture */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-40 mix-blend-overlay" />
              
              <div className="absolute inset-0 flex flex-col items-center py-2 justify-between">
                <div className="w-full px-1 flex flex-col gap-0.5">
                   <div className="h-0.5 w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-sm opacity-80" />
                   <div className="h-1.5 w-full bg-black/60 shadow-inner" />
                   <div className="h-0.5 w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-sm opacity-80" />
                </div>
                
                {/* Spine Text */}
                <div className="flex-1 flex items-center justify-center w-full py-4 overflow-hidden">
                  <span className="text-[#fef3c7] font-black tracking-[0.1em] uppercase text-[10px] sm:text-[12px] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center leading-snug [writing-mode:vertical-rl] rotate-180">
                    {titleText}
                  </span>
                </div>

                <div className="w-full px-1 flex flex-col items-center">
                   <span className="text-[#fef3c7] font-serif text-[10px] sm:text-[11px] mb-2 font-bold uppercase tracking-widest text-center leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)] block px-1">{numericDate}</span>
                   <div className="h-0.5 w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-sm opacity-80" />
                   <div className="h-1 w-full bg-black/60 shadow-inner mt-0.5" />
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
