import type { Metadata } from "next";
import { allStyles, getStyleBySlug, type FocusScores } from "@/app/data/styles";
import RegionalInsight from "@/components/RegionalInsight";
import StudioList from "@/components/StudioList";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allStyles.map((style) => ({ slug: style.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const style = getStyleBySlug(slug);
  if (!style) return {};
  return {
    title: `${style.name} Yoga`,
    description: style.tagline,
    openGraph: {
      title: `${style.name} Yoga - YogaCandy`,
      description: style.tagline,
      url: `https://yogacandy.info/styles/${slug}`,
    },
    alternates: { canonical: `https://yogacandy.info/styles/${slug}` },
  };
}

const scoreLabels: { key: keyof FocusScores; label: string; icon: string }[] = [
  { key: "flexibility", label: "Flexibility", icon: "🤸" },
  { key: "strength", label: "Strength", icon: "⚡" },
  { key: "balance", label: "Balance", icon: "⚖️" },
  { key: "breath", label: "Breath", icon: "🌬️" },
  { key: "mind", label: "Mind", icon: "🧠" },
];

const popularityConfig = {
  high: { label: "Very Popular", color: "bg-green-500", width: "w-full" },
  medium: { label: "Popular", color: "bg-yellow-400", width: "w-2/3" },
  low: { label: "Emerging", color: "bg-gray-300", width: "w-1/3" },
};

function ScoreBar({ score, description }: { score: number; description: string }) {
  return (
    <div className="group relative">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-3 flex-1 rounded-full transition-all ${
              n <= score ? "bg-blue-600" : "bg-gray-100 border border-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function JsonLd({ style }: { style: NonNullable<ReturnType<typeof getStyleBySlug>> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${style.name} Yoga`,
    description: style.tagline,
    url: `https://yogacandy.info/styles/${style.slug}`,
    publisher: {
      "@type": "Organization",
      name: "YogaCandy",
      url: "https://yogacandy.info",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function StylePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const style = getStyleBySlug(slug);
  if (!style) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd style={style} />

      <section className={`bg-gradient-to-br ${style.gradient} text-white py-20`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/styles"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            ← All Yoga Styles
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{style.icon}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider bg-white/20 border-white/30 text-white">
                  {style.level}
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">{style.name}</h1>
              <p className="text-xl text-white/80 max-w-2xl">{style.tagline}</p>
            </div>
            <div className="text-right text-white/70 text-sm shrink-0">
              <div className="font-bold text-white text-base">{style.origin.founder}</div>
              <div>
                {style.origin.year} · {style.origin.place}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">About {style.name}</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">{style.description}</p>
          <div className="flex flex-wrap gap-2">
            {style.benefits.map((benefit) => (
              <span
                key={benefit}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                ✓ {benefit}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Yoga Wheel Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scoreLabels.map(({ key, label, icon }) => (
              <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <span className="font-bold text-sm uppercase tracking-wider">{label}</span>
                  </div>
                  <span className="text-2xl font-extrabold text-blue-600">
                    {style.scores[key]}
                    <span className="text-gray-300 font-normal text-lg">/5</span>
                  </span>
                </div>
                <ScoreBar score={style.scores[key]} description={style.scoreDescriptions[key]} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">History & Origins</h2>
          <div className="flex gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-4 text-center flex-1 border border-gray-100">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Founder</div>
              <div className="font-bold text-sm">{style.origin.founder}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center flex-1 border border-gray-100">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Period</div>
              <div className="font-bold text-sm">{style.origin.year}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center flex-1 border border-gray-100">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Origin</div>
              <div className="font-bold text-sm">{style.origin.place}</div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{style.history}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Global Popularity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {style.countryPopularity.map((country) => {
              const config = popularityConfig[country.level];
              return (
                <div
                  key={country.country}
                  className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{country.country}</span>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">{config.label}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${config.color} ${config.width}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Studios & Practice Centres</h2>
            <StudioList styleName={style.name} fallbackCenters={style.practiceCenters} />
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Teacher Training</h2>
            <div className="space-y-4">
              {style.teacherTraining.map((training) => (
                <div
                  key={training.name}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <span className="text-green-600 mt-0.5">🎓</span>
                  <div>
                    <div className="font-semibold text-sm">{training.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{training.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <RegionalInsight style={style} />

        <section>
          <h2 className="text-2xl font-bold mb-6">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {style.images.map((img) => (
              <div key={img.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                <img
                  src={`https://images.unsplash.com/photo-${img.id}?auto=format&fit=crop&w=800&q=80`}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />
                <div className="absolute bottom-2 right-3 text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  📷 {img.credit} / Unsplash
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black text-white rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to try {style.name}?</h2>
          <p className="text-gray-400 mb-6">
            Find events, classes and teachers near you in the YogaCandy community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/community"
              className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm"
            >
              Find Classes
            </Link>
            <Link
              href="/styles"
              className="border border-white/30 text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-colors text-sm"
            >
              Explore Other Styles
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
