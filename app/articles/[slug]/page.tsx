import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allArticles, getArticleBySlug } from '@/app/data/articles';
import { getStyleBySlug } from '@/app/data/styles';

const BASE_URL = 'https://www.yogacandy.info';

export function generateStaticParams() {
  return allArticles.map((article) => ({ slug: article.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${BASE_URL}/articles/${slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedStyle = article.styleSlug ? getStyleBySlug(article.styleSlug) : undefined;

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/articles" className="text-blue-600 text-sm font-bold hover:underline underline-offset-4">
          ← Back to articles
        </Link>

        <header className="mt-6 mb-10">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
              {article.category}
            </span>
            {article.regions.includes('global') ? (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                Global
              </span>
            ) : null}
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">{article.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{article.excerpt}</p>
          <div className="mt-4 text-sm text-gray-400 flex flex-wrap gap-4">
            <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>{article.readMin} min read</span>
          </div>
        </header>

        <article className="space-y-8 text-gray-700 leading-relaxed">
          <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-3">Why this matters</h2>
            <p>
              This article exists because readers need a focused, specific answer rather than a generic yoga roundup.
              YogaCandy uses the article to connect a real problem, a region, and a relevant style or practice theme.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-3">Key takeaways</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>The topic is anchored to the article category and location rather than generic wellness copy.</li>
              <li>The content is designed to support searchers looking for a practical next step, not only broad inspiration.</li>
              <li>Related styles and routes are linked so the article can lead somewhere useful.</li>
            </ul>
          </section>

          {relatedStyle ? (
            <section className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold mb-3">Related yoga style</h2>
              <p className="mb-4 text-gray-700">{relatedStyle.description}</p>
              <Link href={`/styles/${relatedStyle.slug}`} className="inline-flex text-blue-700 font-bold hover:underline underline-offset-4">
                Explore {relatedStyle.name} →
              </Link>
            </section>
          ) : null}

          <section className="bg-black text-white rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-3">Need a more specific guide?</h2>
            <p className="text-white/70 mb-5">
              Browse the full article index or jump into the yoga styles directory for a deeper connection between topic and practice.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/articles" className="bg-white text-black px-5 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                All Articles
              </Link>
              <Link href="/styles" className="border border-white/30 text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-colors">
                Yoga Styles
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
