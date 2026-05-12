import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/api';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  
  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Navigation */}
        <nav className="mb-10">
          <Link href="/events" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2 font-semibold">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
             Volver a la agenda
          </Link>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="relative h-80 md:h-[450px]">
            <SafeImage
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
               <span className="px-4 py-1 bg-indigo-600 text-white text-xs font-black rounded-full mb-4 inline-block tracking-widest">EVENTO CULTURAL</span>
               <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                 {event.title}
               </h1>
            </div>
          </div>

          <div className="p-10 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Cuándo</p>
                     <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {new Date(event.date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     </p>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-2xl text-red-600 dark:text-red-400">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Dónde</p>
                     <p className="text-xl font-bold text-gray-900 dark:text-white">{event.location}</p>
                  </div>
               </div>

               <div className="flex items-center">
                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 uppercase tracking-widest">
                     Asistir al Evento
                  </button>
               </div>
            </div>

            <div className="prose prose-xl dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {event.description.map((paragraph, index) => (
                <p key={index} className="mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}