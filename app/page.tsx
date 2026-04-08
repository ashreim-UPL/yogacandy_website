import ChatWidget from "@/components/ChatWidget";
import InstagramFeed from "@/components/InstagramFeed";

const wheelAreas = [
  {
    label: "Flexibility",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    label: "Strength",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: "Balance",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    label: "Breath",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    label: "Mind",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

export default function Home() {
  const featuredStyles = [
    {
      name: "Ashtanga",
      description: "A fast-paced, intense, flowing style of yoga that follows a set series of poses.",
      tags: ["Intense", "Flow", "Physical"],
      color: "bg-orange-50 text-orange-700 border-orange-200"
    },
    {
      name: "Yin Yoga",
      description: "Focuses on stretching connective tissue by holding specific poses for several minutes.",
      tags: ["Relaxing", "Deep Stretch", "Meditation"],
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      name: "Iyengar",
      description: "Emphasizes precision and alignment, often using props like blocks and straps.",
      tags: ["Alignment", "Props", "Detail"],
      color: "bg-blue-50 text-blue-700 border-blue-200"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center lg:text-left lg:max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6 border border-blue-100">
              AI-Powered Yoga Platform
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Modern Yoga for a{" "}
              <span className="text-blue-600">Mindful Life.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Discover your perfect yoga style with AI-powered recommendations and join a community dedicated to wellness and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/styles"
                className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl text-center"
              >
                Find Your Style
              </a>
              <a
                href="/community"
                className="border-2 border-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all text-center"
              >
                Explore Classes
              </a>
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      </section>

      {/* Stats Bar */}
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

      {/* Yoga Wheel Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">The Yoga Wheel</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            Our unique approach to classifying yoga styles across 5 core areas: Flexibility, Strength, Balance, Breath, and Mind.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {wheelAreas.map((area) => (
              <div
                key={area.label}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 flex flex-col items-center transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-full mb-4 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {area.icon}
                </div>
                <span className="font-bold text-sm uppercase tracking-wider">{area.label}</span>
              </div>
            ))}
          </div>

          <a href="/styles" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline underline-offset-4">
            Explore all styles &rarr;
          </a>
        </div>
      </section>

      {/* Featured Styles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Styles</h2>
              <p className="text-gray-600">Explore the diversity of yoga practice.</p>
            </div>
            <a href="/styles" className="text-blue-600 font-bold hover:underline underline-offset-4">
              View All &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStyles.map((style) => (
              <a
                key={style.name}
                href="/styles"
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
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA */}
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
              <a href="/community" className="text-blue-400 font-bold text-sm hover:underline underline-offset-4 inline-flex items-center gap-1">
                Register as Student &rarr;
              </a>
            </div>
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10 w-full sm:w-72 text-left hover:bg-white/15 transition-colors">
              <h3 className="font-bold text-xl mb-2 text-white">For Teachers</h3>
              <p className="text-sm text-gray-400 mb-6">List your classes, events, and reach more students.</p>
              <a href="/community" className="text-blue-400 font-bold text-sm hover:underline underline-offset-4 inline-flex items-center gap-1">
                Register as Teacher &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      <InstagramFeed />

      <ChatWidget />
    </div>
  );
}
