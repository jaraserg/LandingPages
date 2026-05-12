import ArticleCard from '@/components/ArticleCard';
import { getArticles } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function ArticlesPage() {
  const articles = await getArticles();
  
  if (!articles || articles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-black rounded-full uppercase tracking-widest mb-6">
               Archivo
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter uppercase">
               Explorar Artículos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
               Historias de arte, música, sociedad y resistencia. Nuestra colección completa de reportajes y crónicas.
            </p>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
}