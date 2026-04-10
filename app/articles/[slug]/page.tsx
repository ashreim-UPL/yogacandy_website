import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allArticles, getArticleBySlug } from '@/app/data/articles';
import { getStyleBySlug } from '@/app/data/styles';

const BASE_URL = 'https://www.yogacandy.info';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function sourceLabel(article: (typeof allArticles)[number]) {
  if (article.sourceType === 'external') return 'External';
  if (article.sourceType === 'teacher') return 'Teacher';
  if (article.sourceType === 'student') return 'Student';
  if (article.sourceType === 'ai') return 'AI-assisted';
  return 'Editorial';
}

function reviewLabel(article: (typeof allArticles)[number]) {
  if (article.reviewStatus === 'verified') return 'Verified';
  if (article.reviewStatus === 'needs-review') return 'Needs review';
  return 'Draft';
}

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
  const source = sourceLabel(article);
  const review = reviewLabel(article);
  const isMysoreGuide = article.id === 'mysore-pilgrim';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/articles" className="text-blue-600 text-sm font-bold hover:underline underline-offset-4">
          ← Back to articles
        </Link>

        <header className="mt-6 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {article.category}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
              {article.regions.includes('global') ? 'Global' : article.regions.join(', ')}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded">
              {source}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
              {review}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400 mb-3">
                {article.author ?? 'YogaCandy editorial'}
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">{article.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{article.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>{formatDate(article.publishedAt)}</span>
                <span>{article.readMin} min read</span>
                {article.styleSlug ? <span>Related to {getStyleBySlug(article.styleSlug)?.name ?? article.styleSlug}</span> : null}
              </div>
            </div>

            <aside className="bg-black text-white rounded-3xl p-6 shadow-lg">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">At a glance</p>
              <ul className="space-y-3 text-sm text-white/80">
                <li>• A practical guide for people who want a clear next step, not generic inspiration.</li>
                <li>• Grounded in location, style, and the type of yoga trip or reading goal.</li>
                <li>• Links out to a related style if the article is meant to lead into practice.</li>
              </ul>
            </aside>
          </div>
        </header>

        <article className="space-y-6 text-gray-700 leading-relaxed">
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-3">Why this guide exists</h2>
            <p className="mb-4">
              {isMysoreGuide
                ? 'Mysore is not just a destination; it is the reference point for a serious Ashtanga practice. The goal of this guide is to help a practitioner arrive with expectations that are realistic, respectful, and useful.'
                : 'This guide exists to answer a specific yoga question with enough context that a reader can act on it without wading through generic wellness language.'}
            </p>
            <p>
              {isMysoreGuide
                ? 'Instead of treating the trip like a bucket-list item, think of it as a practice reset: choose the right season, understand the classroom rhythm, and leave room for recovery.'
                : 'The article is structured to give you the practical takeaways first, then connect you to the most relevant style or next page on the site.'}
            </p>
          </section>

          {isMysoreGuide ? (
            <>
              <section className="grid gap-6 md:grid-cols-2">
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-3">What to expect in Mysore</h2>
                  <p className="mb-4">
                    Classes tend to be structured around self-practice. You usually arrive early, settle in, and work through a sequence with guidance rather than a loud, led flow class.
                  </p>
                  <p>
                    That rhythm matters: it rewards consistency, patience, and a willingness to meet the same practice more than once.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-3">Plan around the practice</h2>
                  <ul className="space-y-3 list-disc list-inside">
                    <li>Keep the trip long enough to recover between sessions.</li>
                    <li>Leave space for heat, jet lag, and local travel time.</li>
                    <li>Focus on a small number of reliable places instead of trying to do everything.</li>
                  </ul>
                </div>
              </section>

              <section className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                <h2 className="text-2xl font-bold mb-3">A practical checklist</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-semibold mb-2">Before you go</p>
                    <ul className="space-y-2 list-disc list-inside text-sm">
                      <li>Confirm the style and level you want to practise.</li>
                      <li>Check accommodation near the practice area.</li>
                      <li>Bring a routine that supports early starts and recovery.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Once you arrive</p>
                    <ul className="space-y-2 list-disc list-inside text-sm">
                      <li>Start conservatively and listen to the room rhythm.</li>
                      <li>Ask the teacher how they handle beginners and drop-ins.</li>
                      <li>Keep the rest of the day simple so practice remains the priority.</li>
                    </ul>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-3">Key takeaways</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>The topic is anchored to the article category and location rather than generic wellness copy.</li>
                <li>The content is designed to support searchers looking for a practical next step, not only broad inspiration.</li>
                <li>Related styles and routes are linked so the article can lead somewhere useful.</li>
              </ul>
            </section>
          )}

          {relatedStyle ? (
            <section className="bg-black text-white rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-3">Related yoga style</h2>
              <p className="mb-4 text-white/80">
                {relatedStyle.name} is the best next step if this topic is pushing you toward a more structured practice.
              </p>
              <p className="mb-5 text-white/70">{relatedStyle.description}</p>
              <Link href={`/styles/${relatedStyle.slug}`} className="inline-flex text-white font-bold hover:underline underline-offset-4">
                Explore {relatedStyle.name} →
              </Link>
            </section>
          ) : null}

          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-3">What to read next</h2>
            <p className="text-gray-600 mb-4">
              Use the article index for broader reading, or jump into styles when you want the practice angle to be more concrete.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/articles" className="bg-black text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                All Articles
              </Link>
              <Link href="/styles" className="border border-gray-200 text-gray-800 px-5 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">
                Yoga Styles
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
