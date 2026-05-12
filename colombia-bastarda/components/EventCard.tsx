import Link from 'next/link';
import SafeImage from './SafeImage';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  excerpt?: string;
}

export default function EventCard({ id, title, date, location, image, excerpt }: EventCardProps) {
  return (
    <Link href={`/events/${id}`} className="group hover:-translate-y-2 transition-transform block h-full">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-all h-full flex flex-col border border-gray-100 dark:border-gray-700">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          <SafeImage
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
             <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg shadow-sm">
                EVENTO
             </span>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
             <time dateTime={date}>{new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
             <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
             <span className="truncate">{location}</span>
          </div>

          {excerpt && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-1">
              {excerpt}
            </p>
          )}
          
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
             <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Ver detalles</span>
             <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5-5 5M6 7l5 5-5 5" />
             </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}