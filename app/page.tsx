import InstagramFeed from "@/components/InstagramFeed";
import LocationBanner from "@/components/LocationBanner";
import NearbyStudios from "@/components/NearbyStudios";
import RegionalArticles from "@/components/RegionalArticles";
import StyleRecommender from "@/components/StyleRecommender";
import AffiliateLink from "@/components/AffiliateLink";
import AdSlot from "@/components/AdSlot";
import HomeLandingState from "@/components/HomeLandingState";
import Link from "next/link";
import { wheelAxes } from "@/app/data/wheel";
import type { ReactNode } from "react";

const wheelIcons: Record<(typeof wheelAxes)[number]["id"], ReactNode> = {
  flexibility: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  strength: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  balance: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  breath: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  mind: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
};

const featuredStyles = [
  {
    name: "Ashtanga",
    slug: "ashtanga",
    description: "A fast-paced, intense, flowing style that follows a set series of poses.",
    tags: ["Intense", "Flow", "Physical"],
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    name: "Yin Yoga",
    slug: "yin-yoga",
    description: "Focuses on stretching connective tissue by holding specific poses for several minutes.",
    tags: ["Relaxing", "Deep Stretch", "Meditation"],
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    name: "Iyengar",
    slug: "iyengar",
    description: "Emphasises precision and alignment, often using props like blocks and straps.",
    tags: ["Alignment", "Props", "Detail"],
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center lg:text-left lg:max-w-2xl">
            <div className="mb-6">
              <LocationBanner />
            </div>
            <HomeLandingState />

            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6 border border-blue-100">
              AI-Powered Yoga Platform
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Modern Yoga for a <span className="text-blue-600">Mindful Life.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Discover your perfect yoga style with AI-powered recommendations and join a community dedicated to wellness and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/styles"
                className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl text-center"
              >
                Find Your Style
              </Link>
              <Link
                href="/events"
                className="border-2 border-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all text-center"
              >
                Explore Classes
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      </section>

      <section className="py-8 border-y bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "10+", label: "Yoga Styles" },
              { value: "500+", label: "Weekly Classes" },
              { value: "50+", label: "Expert Teachers" },
              { value: "AI", label: "Powered Guidance" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl font-extrabold text-black">{stat.value}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
                On-Device AI
              </span>
              <h2 className="text-3xl font-bold mb-4">What Yoga Fits You?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Answer 5 quick questions. Our AI - running entirely on your device, never sending data to a server - matches your health, goals, and lifestyle to the ideal practice.
              </p>
              <p className="text-sm text-gray-400">
                Powered by Chrome AI (Gemini Nano) when available, with a smart rule-based fallback.
              </p>
            </div>
            <StyleRecommender />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">The Yoga Wheel</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            Our unique approach to classifying yoga styles across 5 core areas: Flexibility, Strength, Balance, Breath, and Mind.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {wheelAxes.map((area) => (
              <Link
                key={area.label}
                href={`/yoga-wheel#${area.id}`}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 flex flex-col items-center transition-all group"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-full mb-4 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {wheelIcons[area.id]}
                </div>
                <span className="font-bold text-sm uppercase tracking-wider">{area.label}</span>
              </Link>
            ))}
          </div>

          <Link href="/styles" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline underline-offset-4">
            Explore all styles &rarr;
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Styles</h2>
              <p className="text-gray-600">Explore the diversity of yoga practice.</p>
            </div>
            <Link href="/styles" className="text-blue-600 font-bold hover:underline underline-offset-4">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStyles.map((style) => (
              <Link
                key={style.name}
                href={`/styles/${style.slug}`}
                className={`p-8 rounded-3xl border ${style.color} transition-all hover:scale-[1.02] hover:shadow-md block`}
              >
                <h3 className="text-2xl font-bold mb-4">{style.name}</h3>
                <p className="mb-6 opacity-90">{style.description}</p>
                <div className="flex flex-wrap gap-2">
                  {style.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-bold tracking-widest bg-white/50 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NearbyStudios />
        </div>
      </section>

      <RegionalArticles />

      {/* Affiliate / Gear Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-4 border border-orange-100">
              Trusted Gear
            </span>
            <h2 className="text-3xl font-bold mb-4">What the Community Uses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked yoga equipment recommended by our teacher community. We may earn a small commission — at no extra cost to you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                brand: "Manduka",
                href: "https://www.manduka.com/?ref=yogacandy",
                partner: "manduka",
                title: "PRO Yoga Mat",
                desc: "The gold-standard mat trusted by teachers worldwide. Lifetime guarantee.",
                tag: "Best for: All styles",
                color: "bg-slate-50 border-slate-200",
              },
              {
                brand: "Alo Yoga",
                href: "https://www.aloyoga.com/?ref=yogacandy",
                partner: "alo-yoga",
                title: "Performance Apparel",
                desc: "Studio-to-street clothing designed to move with your practice.",
                tag: "Best for: Hot & Vinyasa",
                color: "bg-rose-50 border-rose-200",
              },
              {
                brand: "Hugger Mugger",
                href: "https://www.huggermugger.com/?ref=yogacandy",
                partner: "hugger-mugger",
                title: "Props & Blocks",
                desc: "Quality blocks, straps, and bolsters for every level of practitioner.",
                tag: "Best for: Iyengar & Yin",
                color: "bg-amber-50 border-amber-200",
              },
            ].map((item) => (
              <AffiliateLink
                key={item.partner}
                href={item.href}
                partner={item.partner}
                page="/"
                className={`block p-6 rounded-2xl border ${item.color} hover:scale-[1.02] hover:shadow-md transition-all`}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{item.brand}</p>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/70 px-2 py-1 rounded border border-current opacity-70">
                  {item.tag}
                </span>
              </AffiliateLink>
            ))}
          </div>

          <AdSlot slot="homepage-gear" format="horizontal" className="max-w-4xl mx-auto" />
        </div>
      </section>

      <InstagramFeed />

      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Build the Community Together</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-xl leading-relaxed">
            Whether you are a student looking for guidance or a teacher ready to share your wisdom, YogaCandy is your home.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10 w-full sm:w-72 text-left hover:bg-white/15 transition-colors">
              <h3 className="font-bold text-xl mb-2 text-white">For Students</h3>
              <p className="text-sm text-gray-400 mb-6">Find teachers, events, and your perfect flow.</p>
              <Link href="/auth/signup" className="text-blue-400 font-bold text-sm hover:underline underline-offset-4 inline-flex items-center gap-1">
                Sign Up Free &rarr;
              </Link>
            </div>
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10 w-full sm:w-72 text-left hover:bg-white/15 transition-colors">
              <h3 className="font-bold text-xl mb-2 text-white">For Teachers</h3>
              <p className="text-sm text-gray-400 mb-6">List your classes, events, and reach more students.</p>
              <Link href="/auth/signup?role=teacher" className="text-blue-400 font-bold text-sm hover:underline underline-offset-4 inline-flex items-center gap-1">
                Register as Teacher &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
