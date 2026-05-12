import Link from 'next/link';
import SafeImage from './SafeImage';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date?: string;
  author?: string;
}

export default function ArticleCard({ id, title, excerpt, image, date, author }: ArticleCardProps) {
  return (
    <Link href={`/articles/${id}`} className="group hover:-translate-y-2 transition-transform block">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <SafeImage
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          {(date || author) && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex gap-2">
              {date && <time dateTime={date}>{new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</time>}
              {date && author && <span>·</span>}
              {author && <span>{author}</span>}
            </p>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
            {excerpt}
          </p>
          <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mt-auto">
            Leer más
            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}