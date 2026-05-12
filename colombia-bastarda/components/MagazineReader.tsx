"use client";

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '@/lib/api';

interface MagazineReaderProps {
  articles: Article[];
  editionTitle: string;
  onClose: () => void;
}

export default function MagazineReader({ articles, editionTitle, onClose }: MagazineReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Total pages = Cover + (1 page per article)
  const totalPages = articles.length + 1;

  const paginate = useCallback((newDirection: number) => {
    const nextPage = currentPage + newDirection;
    if (nextPage >= 0 && nextPage < totalPages) {
      setDirection(newDirection);
      setCurrentPage(nextPage);
    }
  }, [currentPage, totalPages]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, onClose, paginate]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
         <div className="text-white">
            <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Leyendo Edición</p>
            <h2 className="text-lg font-bold truncate max-w-[200px] md:max-w-md uppercase tracking-tight">{editionTitle}</h2>
         </div>
         <div className="flex items-center gap-6">
            <span className="text-white/50 text-xs font-bold font-mono">PÁGINA {currentPage + 1} / {totalPages}</span>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
         </div>
      </div>

      {/* Magazine Content Container */}
      <div className="relative w-full h-full flex items-center justify-center perspective-1000 px-4 md:px-20">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              rotateY: { duration: 0.6 }
            }}
            className="absolute w-full max-w-5xl h-[85vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {currentPage === 0 ? (
              /* THE COVER PAGE */
              <div className="w-full h-full relative flex flex-col items-center justify-center p-12 text-center bg-indigo-900">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="relative z-10 flex flex-col items-center">
                   <h3 className="text-indigo-400 font-black tracking-[0.4em] mb-4 uppercase">BASTARDA</h3>
                   <h1 className="text-5xl md:text-8xl font-black text-white leading-none mb-8 uppercase tracking-tighter italic">
                     {editionTitle.split(':')[1] || editionTitle}
                   </h1>
                   <div className="w-24 h-1 bg-white mb-12" />
                   <p className="text-white/60 text-lg max-w-md font-medium">
                      Explora la cultura, el arte y la resistencia en esta edición especial. Desliza para comenzar la lectura.
                   </p>
                   <button 
                     onClick={() => paginate(1)}
                     className="mt-12 px-10 py-4 bg-white text-indigo-900 font-black rounded-full hover:scale-105 transition-transform uppercase tracking-widest text-sm"
                   >
                     Comenzar Lectura
                   </button>
                </div>
              </div>
            ) : (
              /* ARTICLE PAGE */
              <>
                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gray-200 relative">
                   <Image 
                     src={articles[currentPage - 1].image || 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=1000&auto=format&fit=crop&q=80'} 
                     alt={articles[currentPage - 1].title}
                     fill
                     sizes="(max-width: 768px) 100vw, 50vw"
                     className="object-cover"
                   />
                </div>
                <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 overflow-y-auto bg-white dark:bg-gray-900 flex flex-col">
                   <p className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest mb-4">ARTÍCULO</p>
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 leading-tight uppercase tracking-tighter">
                     {articles[currentPage - 1].title}
                   </h2>
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {articles[currentPage - 1].author.charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{articles[currentPage - 1].author}</p>
                   </div>
                   <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 font-serif space-y-4">
                      {articles[currentPage - 1].content.map((p, i) => (
                        <p key={i} className="leading-relaxed text-lg italic">{p}</p>
                      ))}
                   </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-between items-center z-50">
        <button
          onClick={() => paginate(-1)}
          disabled={currentPage === 0}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${currentPage === 0 ? 'text-white/10' : 'text-white bg-white/10 hover:bg-white/20'}`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex gap-2">
           {Array.from({ length: totalPages }).map((_, i) => (
             <div 
               key={i} 
               className={`h-1.5 transition-all rounded-full ${i === currentPage ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`} 
             />
           ))}
        </div>

        <button
          onClick={() => paginate(1)}
          disabled={currentPage === totalPages - 1}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${currentPage === totalPages - 1 ? 'text-white/10' : 'text-white bg-white/10 hover:bg-white/20'}`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
