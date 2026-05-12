"use client";

import { motion } from "framer-motion";

interface TypewriterProps {
  onClick: () => void;
}

export default function Typewriter({ onClick }: TypewriterProps) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -200, right: 200, top: -100, bottom: 50 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      className="relative w-80 h-64 cursor-grab z-20 group"
    >
      {/* Interactive Paper Area */}
      <motion.div 
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-36 bg-[#fdfbf7] rounded-t-sm shadow-[0_-5px_15px_rgba(0,0,0,0.2),inset_0_0_20px_rgba(0,0,0,0.05)] flex flex-col items-center pt-4 z-10 border border-gray-300 transform -rotate-2 cursor-pointer hover:bg-white transition-colors"
        onClick={onClick}
      >
         <div className="absolute top-2 right-2 flex gap-1 animate-pulse">
            <span className="text-[8px] text-red-600 font-bold uppercase tracking-tighter">Publicar</span>
         </div>
         <div className="w-10 h-[2px] bg-red-800/40 mb-3 mt-2" />
         <div className="w-32 h-[1.5px] bg-gray-800/30 mb-2" />
         <div className="w-28 h-[1.5px] bg-gray-800/30 mb-2" />
         <div className="w-32 h-[1.5px] bg-gray-800/30 mb-2" />
         <div className="w-24 h-[1.5px] bg-gray-800/30" />
         
         <div className="mt-auto mb-4 px-3 py-1 bg-black/5 rounded border border-black/10">
            <span className="text-[10px] text-gray-500 font-bold">CLICK PARA ESCRIBIR</span>
         </div>
      </motion.div>

      {/* Roller (Platen) */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-56 h-8 bg-[#1a1a1a] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] z-20 flex items-center justify-between px-[-10px] pointer-events-none">
         <div className="w-4 h-6 bg-gray-600 rounded-l-md -translate-x-4 border-r border-gray-800" />
         <div className="w-4 h-6 bg-gray-600 rounded-r-md translate-x-4 border-l border-gray-800" />
      </div>

      {/* Typewriter Body */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-[#3d4447] to-[#1e2324] rounded-t-3xl rounded-b-xl shadow-[0_20px_30px_rgba(0,0,0,0.7)] border-t-4 border-[#525b5e] z-30 flex flex-col items-center pt-6 px-4 pointer-events-none">
         
         {/* Logo Plate */}
         <div className="w-16 h-4 bg-amber-600/80 rounded-sm mb-4 border border-amber-900 shadow-inner flex items-center justify-center">
            <span className="text-[8px] font-black tracking-widest text-black/50 uppercase">Bastarda</span>
         </div>

         {/* Keyboard Area */}
         <div className="w-full flex-1 bg-black/60 rounded-t-2xl shadow-[inset_0_5px_10px_rgba(0,0,0,0.8)] p-3 flex flex-col gap-1.5 border-t border-white/5">
            {/* Rows of keys */}
            <div className="flex justify-center gap-1.5">
               {[1,2,3,4,5,6,7,8,9,10].map(k => (
                 <div key={k} className="w-5 h-5 rounded-full bg-gradient-to-b from-[#e0e0e0] to-[#909090] shadow-[0_2px_0_#444] border border-gray-500" />
               ))}
            </div>
            <div className="flex justify-center gap-1.5 ml-2">
               {[1,2,3,4,5,6,7,8,9].map(k => (
                 <div key={k} className="w-5 h-5 rounded-full bg-gradient-to-b from-[#e0e0e0] to-[#909090] shadow-[0_2px_0_#444] border border-gray-500" />
               ))}
            </div>
            <div className="flex justify-center gap-1.5 ml-4">
               {[1,2,3,4,5,6,7,8].map(k => (
                 <div key={k} className="w-5 h-5 rounded-full bg-gradient-to-b from-[#e0e0e0] to-[#909090] shadow-[0_2px_0_#444] border border-gray-500" />
               ))}
            </div>
            {/* Spacebar */}
            <div className="flex justify-center mt-1">
               <div className="w-32 h-4 rounded-sm bg-gradient-to-b from-[#e0e0e0] to-[#909090] shadow-[0_2px_0_#444] border border-gray-500" />
            </div>
         </div>
      </div>
    </motion.div>
  );
}
