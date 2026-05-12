import { notFound } from 'next/navigation';
import { getArticleById } from '@/lib/api';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';

export default async function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="mb-12">
          <Link href="/articles" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2 font-medium">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
             Volver a todos los artículos
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
             <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-widest">
                Cultura
             </span>
             <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={article.date}>
               {new Date(article.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
             </time>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                {article.author.charAt(0)}
             </div>
             <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{article.author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Redacción Colombia Bastarda</p>
             </div>
          </div>
        </header>
        
        {/* Featured Image */}
        <figure className="mb-12">
          <div className="aspect-[21/9] w-full bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <SafeImage
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          {article.excerpt && (
            <figcaption className="mt-4 text-center italic text-gray-500 dark:text-gray-400 text-sm">
              {article.excerpt}
            </figcaption>
          )}
        </figure>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed font-serif">
          {article.content.map((paragraph, index) => (
            <p key={index} className="mb-8 text-xl">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Footer of the article */}
        <footer className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-800">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                 <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.014-.607 1.794-1.35 2.203-2.382-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.054 0 14.007-7.496 13.991-13.986.002-.223.01-.447.01-.672 0-1.492-.01-2.97-.02-4.452z"/></svg>
                 </button>
                 <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-15.35c-2.478 0-4.488 2.01-4.488 4.488v15.025c0 2.477 2.01 4.487 4.488 4.487h15.35c2.477 0 4.487-2.01 4.487-4.488v-15.025c0-2.478-2.01-4.488-4.487-4.488zM12 14.25c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-9.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/></svg>
                 </button>
              </div>
              <Link href="/articles" className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                 Explorar más artículos
              </Link>
           </div>
        </footer>
      </article>
    </div>
  );
}