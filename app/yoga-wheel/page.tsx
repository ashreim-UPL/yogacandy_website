import Link from 'next/link';
import type { Metadata } from 'next';
import { allStyles } from '@/app/data/styles';
import { wheelAxes } from '@/app/data/wheel';

export const metadata: Metadata = {
  title: 'The Yoga Wheel',
  description: 'Learn what each YogaCandy wheel axis means and which styles score highest.',
  alternates: { canonical: 'https://www.yogacandy.info/yoga-wheel' },
};

function stylesForAxis(axisId: (typeof wheelAxes)[number]['id']) {
  return [...allStyles]
    .sort((a, b) => b.scores[axisId] - a.scores[axisId])
    .slice(0, 3);
}

export default function YogaWheelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
            Yoga Wheel
          </span>
          <h1 className="text-4xl font-extrabold mb-3">What the Yoga Wheel Measures</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each axis is a practical signal, not just a label. The wheel tells visitors why a style fits their goals, and it connects directly to the style detail pages.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wheelAxes.map((axis) => {
            const topStyles = stylesForAxis(axis.id);
            return (
              <div key={axis.id} id={axis.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    {axis.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{axis.label}</h2>
                    <p className="text-sm text-gray-500">{axis.summary}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{axis.meaning}</p>
                <div className="space-y-2 mb-4">
                  {topStyles.map((style) => (
                    <Link
                      key={style.slug}
                      href={`/styles/${style.slug}`}
                      className="flex items-center justify-between rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <span className="font-medium text-sm">{style.name}</span>
                      <span className="text-xs text-gray-400">{style.scores[axis.id]}/5</span>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  Example styles: {axis.exampleStyles.join(', ')}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-12 bg-black text-white rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Use the wheel as a navigation layer</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            The wheel works when every axis leads somewhere useful, so each label should point to a real explanation, a real style, or a real article.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/styles" className="bg-white text-black px-5 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
              Browse Styles
            </Link>
            <Link href="/articles" className="border border-white/30 text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-colors">
              Read Articles
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
