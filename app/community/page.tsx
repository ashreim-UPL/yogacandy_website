export default function CommunityPage() {
  return (
    <div className="py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold mb-4">YogaCandy Community</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join a global network of students and teachers. Share your journey, find events, and grow together.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Registration Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Join the Movement</h2>
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4">I am a Teacher</h3>
                <p className="text-gray-500 mb-6 text-sm">List your classes, manage your schedule, and connect with students looking for your expertise.</p>
                <form className="space-y-4">
                  <input type="text" placeholder="Full Name" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                  <input type="email" placeholder="Email Address" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                  <input type="text" placeholder="Specialization (e.g. Ashtanga, Vinyasa)" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                  <button className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all uppercase tracking-widest text-xs">
                    Apply as Teacher
                  </button>
                </form>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4">I am a Student</h3>
                <p className="text-gray-500 mb-6 text-sm">Find your perfect flow, track your progress, and get AI-powered recommendations.</p>
                <form className="space-y-4">
                  <input type="text" placeholder="Full Name" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                  <input type="email" placeholder="Email Address" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                  <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">
                    Sign Up as Student
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <button className="text-sm font-bold text-blue-600 hover:underline">View Calendar</button>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  title: "Summer Solstice Flow",
                  date: "June 21, 2026",
                  location: "Central Park, NY",
                  category: "Workshop",
                  price: "Free"
                },
                {
                  title: "Deep Yin & Meditation",
                  date: "June 25, 2026",
                  location: "Virtual / Zoom",
                  category: "Online Class",
                  price: "$15"
                },
                {
                  title: "Ashtanga Masterclass",
                  date: "July 02, 2026",
                  location: "Downtown Studio",
                  category: "Intensive",
                  price: "$45"
                }
              ].map((event) => (
                <div key={event.title} className="group cursor-pointer">
                  <div className="flex gap-6 items-start p-6 rounded-3xl bg-gray-50 border border-transparent group-hover:bg-white group-hover:border-gray-100 group-hover:shadow-md transition-all">
                    <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] uppercase font-bold text-gray-400">June</span>
                      <span className="text-xl font-bold leading-tight">21</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{event.title}</h4>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{event.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{event.location}</p>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{event.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
