"use client";

import Image from 'next/image';
import { useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import MagazineReader from '@/components/MagazineReader';
import { Edition } from '@/lib/api';

interface EditionDetailClientProps {
  edition: Edition;
}

export default function EditionDetailClient({ edition }: EditionDetailClientProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const FALLBACK_EDITION = 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=2000&auto=format&fit=crop';

  return (
    <>
      {isReaderOpen && (
        <MagazineReader 
          articles={edition.articles} 
          editionTitle={edition.title} 
          onClose={() => setIsReaderOpen(false)} 
        />
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header Section */}
        <div className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={edition.image || FALLBACK_EDITION}
              alt={edition.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
          </div>
          
          <div className="relative z-10 max-w-4xl px-6 flex flex-col items-center">
            <Link href="/editions" className="inline-flex items-center text-indigo-400 font-bold mb-8 hover:underline gap-2 uppercase tracking-widest text-xs">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
               Archivo Histórico
            </Link>
            <p className="text-indigo-300 font-black uppercase tracking-[0.4em] mb-4 text-sm">{edition.date}</p>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-none mb-10 uppercase tracking-tighter italic">
              {edition.title}
            </h1>
            
            <button 
              onClick={() => setIsReaderOpen(true)}
              className="group relative flex items-center gap-4 px-10 py-5 bg-white text-indigo-900 font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 uppercase tracking-widest"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
               Abrir Revista Digital
               <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full animate-bounce">NUEVO</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* Sidebar Info */}
            <div className="lg:col-span-1">
               <div className="sticky top-24">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">En esta edición</h2>
                  <div className="h-1.5 w-16 bg-indigo-600 mb-10" />
                  <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-12 italic border-l-4 border-indigo-100 dark:border-indigo-900 pl-6">
                    {edition.description}
                  </p>
                  
                  <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xl">CB</div>
                        <div>
                           <h3 className="text-gray-900 dark:text-white font-bold leading-tight">Editorial</h3>
                           <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Colombia Bastarda</p>
                        </div>
                     </div>
                     <div className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex justify-between">
                           <span>Artículos</span>
                           <span className="font-bold text-gray-900 dark:text-white">{edition.articles.length}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Formato</span>
                           <span className="font-bold text-gray-900 dark:text-white">Digital Magazine</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Articles Grid */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-12 uppercase tracking-tight flex items-center gap-4">
                 Índice de Contenidos
                 <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </h2>
              <div className="grid gap-12 sm:grid-cols-2">
                {edition.articles.map(article => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
              
              {edition.articles.length === 0 && (
                 <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 font-medium italic">Estamos preparando más historias para esta edición...</p>
                 </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <section className="bg-indigo-950 py-24">
           <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tighter uppercase italic">¿Tienes una historia que contar?</h2>
              <p className="text-xl text-indigo-200 mb-12 max-w-2xl mx-auto leading-relaxed">
                 Buscamos voces críticas y creativas para nuestras próximas ediciones mensuales. El arte es nuestra resistencia.
              </p>
              <a href="mailto:colabora@colombiabastarda.com" className="inline-flex items-center px-12 py-5 bg-white text-indigo-950 font-black rounded-2xl hover:bg-indigo-500 hover:text-white transition-all uppercase tracking-widest shadow-2xl">
                 Enviar mi Propuesta
              </a>
           </div>
        </section>
      </div>
    </>
  );
}
