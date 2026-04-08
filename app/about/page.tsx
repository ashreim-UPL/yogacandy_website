import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About YogaCandy — Our Mission & Story",
  description:
    "YogaCandy is an AI-powered yoga discovery platform helping practitioners worldwide find their perfect style, connect with studios, and grow their practice.",
  alternates: { canonical: "https://yogacandy.info/about" },
};

const team = [
  {
    name: "YogaCandy Team",
    role: "Founders & Yoga Practitioners",
    bio: "We are a team of yoga practitioners, teachers, and technologists based in the UAE with a shared passion for making yoga accessible to everyone — regardless of experience, location, or background. Between us we have practised Ashtanga, Yin, Kundalini, and Aerial yoga across studios in Dubai, London, New York, and Bali.",
    avatar: "🧘",
  },
];

const values = [
  {
    icon: "🌍",
    title: "Accessible to All",
    body: "Yoga is for every body. We surface styles suited to beginners, seasoned practitioners, those with injuries, and everyone in between.",
  },
  {
    icon: "🤖",
    title: "AI-Guided Discovery",
    body: "Our on-device AI recommender matches you to a yoga style based on your goals, fitness level, and lifestyle — privately, without sending your data anywhere.",
  },
  {
    icon: "🏫",
    title: "Community First",
    body: "We spotlight independent studios, grassroots events, and teacher training programmes — not just global chains. Local communities are the heart of yoga.",
  },
  {
    icon: "📚",
    title: "Evidence-Informed",
    body: "Every style profile is researched from primary sources — lineage histories, training organisations, and peer-reviewed wellness literature.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-4">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Making yoga discovery <span className="text-purple-600">personal</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            YogaCandy started from a simple frustration: with hundreds of yoga styles and thousands of studios,
            finding the right practice felt overwhelming. We built the platform we wish had existed when we started our own journeys.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe the right yoga practice can genuinely change a life — improving physical health,
              reducing stress, and building community. But the wrong entry point can put people off forever.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              YogaCandy uses AI to match each practitioner with the style that fits their goals, body,
              and schedule — then connects them with local studios, global training centres, and a
              community of teachers and students.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are based in the UAE and particularly focused on growing the yoga community across
              the Middle East and South Asia, while serving practitioners worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "19+", label: "Yoga Styles Profiled" },
              { stat: "50+", label: "Training Centres Listed" },
              { stat: "🌍", label: "Global Community" },
              { stat: "Free", label: "Always Free to Explore" },
            ].map((item) => (
              <div key={item.label} className="bg-purple-50 rounded-2xl p-6 text-center">
                <div className="text-3xl font-extrabold text-purple-700 mb-1">{item.stat}</div>
                <div className="text-xs text-gray-500 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-10 text-center">Who We Are</h2>
        {team.map((member) => (
          <div key={member.name} className="flex gap-6 items-start bg-purple-50 rounded-2xl p-8">
            <div className="text-5xl">{member.avatar}</div>
            <div>
              <h3 className="font-bold text-xl mb-1">{member.name}</h3>
              <p className="text-purple-600 text-sm font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 leading-relaxed">{member.bio}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to find your practice?</h2>
        <p className="text-white/80 mb-8">Explore 19 yoga styles or let our AI match you in 2 minutes.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/styles" className="bg-white text-purple-700 font-bold px-6 py-3 rounded-full hover:bg-purple-50 transition-colors">
            Browse Styles
          </Link>
          <Link href="/contact" className="border border-white/50 text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
