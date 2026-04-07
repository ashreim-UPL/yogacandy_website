'use client';

import { useLocation } from '@/app/context/LocationContext';
import { allArticles, getArticlesForCountry } from '@/app/data/articles';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function RegionalArticles() {
  const { location } = useLocation();

  const articles = location?.countryCode
    ? getArticlesForCountry(location.countryCode, 6)
    : allArticles
        .filter((a) => a.regions.includes('global'))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 6);

  const hasRegional = location?.countryCode && articles.some((a) => a.regions.includes(location.countryCode));

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full mb-3 border border-green-100">
              Articles
            </span>
            <h2 className="text-3xl font-bold">
              {hasRegional ? `Yoga Reads for ${location!.country || location!.city}` : 'Yoga Reads'}
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              {hasRegional
                ? 'Local guides, research, and inspiration selected for your region.'
                : 'Guides, research, and inspiration for every practitioner.'}
            </p>
          </div>
          <a href="#" className="text-blue-600 font-bold text-sm hover:underline underline-offset-4 flex-shrink-0">
            All Articles →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const isLocal = location?.countryCode && article.regions.includes(location.countryCode) && !article.regions.includes('global');
            return (
              <a
                key={article.id}
                href={article.externalUrl ?? article.styleSlug ? `/styles/${article.styleSlug}` : '#'}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                  {isLocal && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded">
                      Local
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base mb-2 group-hover:text-blue-600 transition-colors leading-snug flex-grow">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{formatDate(article.publishedAt)}</span>
                  <span className="text-xs text-gray-400">{article.readMin} min read</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
