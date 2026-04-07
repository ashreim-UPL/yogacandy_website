import ChatWidget from "@/components/ChatWidget";

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
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Modern Yoga for a <span className="text-blue-600">Mindful Life.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Discover your perfect yoga style with AI-powered recommendations and join a community dedicated to wellness and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                Find Your Style
              </button>
              <button className="border-2 border-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                Explore Classes
              </button>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-orange-50 rounded-full blur-3xl opacity-50" />
      </section>

      {/* Yoga Wheel Section Teaser */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">The Yoga Wheel</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            Our unique approach to classifying yoga styles across 5 core areas: Flexibility, Strength, Balance, Breath, and Mind.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {['Flexibility', 'Strength', 'Balance', 'Breath', 'Mind'].map((area) => (
              <div key={area} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-sm uppercase tracking-wider">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Styles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Styles</h2>
              <p className="text-gray-600">Explore the diversity of yoga practice.</p>
            </div>
            <a href="/styles" className="text-blue-600 font-bold hover:underline">View All Styles &rarr;</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStyles.map((style) => (
              <div key={style.name} className={`p-8 rounded-3xl border ${style.color} transition-all hover:scale-[1.02]`}>
                <h3 className="text-2xl font-bold mb-4">{style.name}</h3>
                <p className="mb-6 opacity-90">{style.description}</p>
                <div className="flex flex-wrap gap-2">
                  {style.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-widest bg-white/50 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
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
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10 w-full sm:w-64 text-left">
              <h3 className="font-bold text-xl mb-2 text-white">For Students</h3>
              <p className="text-sm text-gray-400 mb-4">Find teachers, events, and your perfect flow.</p>
              <button className="text-blue-400 font-bold text-sm hover:underline underline-offset-4">Register as Student &rarr;</button>
            </div>
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10 w-full sm:w-64 text-left">
              <h3 className="font-bold text-xl mb-2 text-white">For Teachers</h3>
              <p className="text-sm text-gray-400 mb-4">List your classes, events, and reach more students.</p>
              <button className="text-blue-400 font-bold text-sm hover:underline underline-offset-4">Register as Teacher &rarr;</button>
            </div>
          </div>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
}
