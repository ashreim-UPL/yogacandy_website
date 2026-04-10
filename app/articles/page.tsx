import Link from 'next/link';
import type { Metadata } from 'next';
import { allArticles } from '@/app/data/articles';

export const metadata: Metadata = {
  title: 'Yoga Articles',
  description: 'Original yoga articles, regional guides, and practice insights from YogaCandy.',
  alternates: { canonical: 'https://www.yogacandy.info/articles' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ArticlesPage() {
  const articles = [...allArticles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
            Articles
          </span>
          <h1 className="text-4xl font-extrabold mb-3">YogaCandy Articles</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Regional guides, technique explainers, external reads, and community pieces. Each article shows where it comes from so you can trust the source.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article) => (
            article.externalUrl ? (
              <a
                key={article.id}
                href={article.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all flex flex-col"
              >
                {renderCardContent(article)}
              </a>
            ) : (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all flex flex-col"
              >
                {renderCardContent(article)}
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

function renderCardContent(article: (typeof allArticles)[number]) {
  const sourceLabel =
    article.sourceType === 'external'
      ? 'External'
      : article.sourceType === 'teacher'
        ? 'Teacher'
        : article.sourceType === 'student'
          ? 'Student'
          : article.sourceType === 'ai'
            ? 'AI'
            : 'Editorial';

  return (
    <>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                  {article.category}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                  {article.regions.includes('global') ? 'Global' : article.regions.join(', ')}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded">
                  {sourceLabel}
                </span>
              </div>
              <h2 className="font-bold text-xl mb-2 leading-snug">{article.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{article.excerpt}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400">
                <span>{formatDate(article.publishedAt)}</span>
                <span>{article.readMin} min read</span>
              </div>
    </>
  );
}
