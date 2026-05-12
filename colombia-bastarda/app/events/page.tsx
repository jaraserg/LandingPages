import EventCard from '@/components/EventCard';
import { getEvents } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function EventsPage() {
  const events = await getEvents();

  if (!events || events.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block px-4 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-black rounded-full uppercase tracking-widest mb-6">
               Agenda
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter uppercase">
               Próximos Eventos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
               Descubre la vibrante escena cultural de Colombia. Festivales, conciertos y encuentros que no te puedes perder.
            </p>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
      
      {/* Community Section */}
      <section className="bg-indigo-900 text-white py-20">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black mb-6 tracking-tight uppercase">¿Organizas un evento?</h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
               Ayudamos a difundir la cultura alternativa e independiente. Envíanos los detalles de tu evento para incluirlo en nuestra agenda.
            </p>
            <a href="mailto:eventos@colombiabastarda.com" className="inline-flex items-center px-10 py-4 bg-white text-indigo-900 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest">
               Publicar Evento
            </a>
         </div>
      </section>
    </div>
  );
}