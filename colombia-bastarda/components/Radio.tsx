"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Podcast {
  name: string;
  date: string;
  url: string;
  color: string;
}

interface RadioProps {
  streamUrl?: string; // This should ONLY be the podcast URL
  trackName?: string;
  onPlayLive?: () => void;
  podcasts?: Podcast[];
  onSelectTrack?: (track: Podcast) => void;
}

export default function Radio({ streamUrl = "", trackName = "RX-800", onPlayLive, podcasts = [], onSelectTrack }: RadioProps) {
  const [activeSource, setActiveSource] = useState<'none' | 'podcast' | 'live'>('none');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bars, setBars] = useState<{ height: string[]; duration: number }[]>([]);

  const LIVE_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    const newBars = [1, 2, 3].map(() => ({
      height: [`${20 + Math.random() * 20}%`, `${60 + Math.random() * 40}%`, `${20 + Math.random() * 20}%`],
      duration: 0.2 + Math.random() * 0.3
    }));
    setBars(newBars);
  }, []);

  // Audio Management
  useEffect(() => {
    // Determine the source URL based on activeSource
    // If podcast, use streamUrl. If live, use LIVE_URL.
    const url = activeSource === 'live' 
      ? LIVE_URL 
      : (activeSource === 'podcast' ? streamUrl : null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (url) {
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;
      audio.play().catch(e => console.error("Radio Audio Error:", e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeSource, streamUrl]);

  const handleTogglePodcast = () => {
    // If currently live, switch to podcast. If already podcast, toggle off.
    if (activeSource === 'live') {
      setActiveSource('podcast');
    } else {
      setActiveSource(prev => prev === 'podcast' ? 'none' : 'podcast');
    }
  };

  const handleToggleLive = () => {
    // If currently podcast, switch to live. If already live, toggle off.
    if (activeSource === 'podcast') {
      setActiveSource('live');
    } else {
      setActiveSource(prev => prev === 'live' ? 'none' : 'live');
    }
    // We don't call onPlayLive here anymore to avoid updating the parent's streamUrl with the live one
  };

  const handleSelectPodcast = (p: Podcast) => {
    onSelectTrack?.(p); // This updates the parent's currentTrack/streamUrl
    setActiveSource('podcast');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full h-36 bg-[#001220]/80 backdrop-blur-xl border-2 border-cyan-400/60 rounded-2xl flex flex-col p-3 z-30 shadow-[0_0_30px_rgba(34,211,238,0.5)] group">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(34,211,238,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-0 opacity-30 rounded-2xl overflow-hidden" />
      
      <div className="w-full flex justify-between items-start mb-2 px-1 relative z-10">
         <div className="flex-1 border-b border-cyan-400/30 pb-1">
            <h3 className="text-cyan-400 font-mono text-[8px] uppercase tracking-widest opacity-70">Aether Node</h3>
            <p className="text-white font-mono text-[11px] font-black truncate mt-0.5 uppercase">
               {activeSource === 'live' ? "RADIO EN VIVO: LIVE FM" : (activeSource === 'podcast' ? trackName : "SISTEMA STANDBY")}
            </p>
         </div>
      </div>

      <div className="flex-1 flex w-full relative z-10 gap-3">
         {/* Visualizer (Wider & More Horizontal) */}
         <div className="w-[40%] h-full relative rounded-lg border border-cyan-500/40 overflow-hidden bg-black/40 flex items-center justify-center p-1">
            <div className="flex gap-1 items-center h-full w-full justify-center">
              {bars.map((bar, i) => (
                <motion.div 
                   key={i}
                   animate={{ height: activeSource !== 'none' ? bar.height : "10%" }}
                   transition={{ duration: bar.duration, repeat: Infinity, ease: "linear" }}
                   className="flex-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee] max-w-[8px]"
                />
              ))}
            </div>
         </div>

         <div className="w-[60%] flex flex-col gap-2">
            <div className="flex gap-2 items-center">
               <div className="flex-1 relative">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full text-left px-2 py-1.5 border border-cyan-500/50 bg-black/40 text-cyan-100 text-[10px] font-bold flex justify-between items-center hover:bg-cyan-900/30">
                     <span className="truncate">PROGRAMAS</span>
                     <span className="text-cyan-400">{isDropdownOpen ? '▲' : '▼'}</span>
                  </button>
                  {isDropdownOpen && (
                     <div className="absolute bottom-full left-0 w-full mb-1 border border-cyan-500 bg-[#001220] shadow-2xl z-50 rounded-sm max-h-40 overflow-y-auto custom-scrollbar">
                        {podcasts.map((p, idx) => (
                           <div key={idx} onClick={() => handleSelectPodcast(p)} className="px-2 py-2 border-b border-cyan-900 hover:bg-cyan-800 cursor-pointer text-white text-[10px] font-bold truncate">{p.name}</div>
                        ))}
                     </div>
                  )}
               </div>
               
               {/* PODCAST PLAY BUTTON */}
               <button 
                  onClick={handleTogglePodcast} 
                  title="Reproducir Programa"
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${activeSource === 'podcast' ? "bg-cyan-500/30 border-cyan-400 shadow-[0_0_15px_#22d3ee]" : "bg-black/60 border-cyan-800"}`}
               >
                  {activeSource === 'podcast' ? (
                    <div className="flex gap-1">
                      <div className="w-1 h-3 bg-white" />
                      <div className="w-1 h-3 bg-white" />
                    </div>
                  ) : (
                    <svg className="w-4 h-4 fill-cyan-400" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
               </button>
            </div>

            {/* LIVE FM TOGGLE */}
            <button 
               onClick={handleToggleLive} 
               className={`w-full py-1.5 border flex items-center justify-center gap-2 text-[10px] font-black tracking-widest transition-all ${activeSource === 'live' ? "bg-red-600/60 border-red-400 text-white shadow-[0_0_15px_red]" : "bg-black/40 border-white/10 text-white/30 hover:text-white/60"}`}
            >
               <span className={`w-1.5 h-1.5 rounded-full ${activeSource === 'live' ? 'bg-white animate-pulse shadow-[0_0_5px_#fff]' : 'bg-white/20'}`} />
               LIVE FM MODE
            </button>
         </div>
      </div>
    </div>
  );
}
