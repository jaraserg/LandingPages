import Link from 'next/link';
import { getEditions } from '@/lib/api';
import { notFound } from 'next/navigation';
import SafeImage from '@/components/SafeImage';

export default async function EditionsPage() {
  const editions = await getEditions();

  if (!editions || editions.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-black rounded-full uppercase tracking-widest mb-6">
               Publicaciones
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter uppercase">
               Ediciones Mensuales
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
               Cada mes exploramos a fondo un tema vital para la cultura y sociedad colombiana.
            </p>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Featured Edition */}
        {editions[0] && (
          <div className="mb-24 relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
             <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                 <div className="aspect-[16/10] bg-gray-200 overflow-hidden">
                   <SafeImage
                     src={editions[0].image}
                     alt={editions[0].title}
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                   />
                 </div>
                 <div className="p-10 md:p-16 flex flex-col justify-center">
                   <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest mb-4">ÚLTIMA EDICIÓN</span>
                   <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter leading-tight">
                     {editions[0].title}
                   </h3>
                   <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">{editions[0].date}</p>
                   <p className="mb-10 text-xl text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4">
                     {editions[0].description}
                   </p>
                   <Link
                     href={`/editions/${editions[0].id}`}
                     className="inline-flex items-center justify-center px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 w-fit"
                   >
                     Leer edición completa
                     <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                     </svg>
                   </Link>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Archive Grid */}
        <div className="flex items-center gap-6 mb-12">
           <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Archivo Histórico</h2>
           <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>
        
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {editions.slice(1).map(edition => (
            <Link
              key={edition.id}
              href={`/editions/${edition.id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col"
            >
              <div className="aspect-[16/9] bg-gray-200 overflow-hidden">
                <SafeImage
                  src={edition.image}
                  alt={edition.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{edition.date}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {edition.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-8 flex-1 leading-relaxed">
                  {edition.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 dark:border-gray-700">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Explorar</span>
                  <span className="text-xs text-gray-400">{edition.articles.length} artículos</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}