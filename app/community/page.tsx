import InstagramFeed from "@/components/InstagramFeed";

function parseEventDate(dateStr: string): { month: string; day: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { month: "???", day: "??" };
  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
  };
}

export default function CommunityPage() {
  const events = [
    {
      title: "Summer Solstice Flow",
      date: "June 21, 2026",
      location: "Central Park, NY",
      category: "Workshop",
      price: "Free",
      priceColor: "bg-green-100 text-green-700",
    },
    {
      title: "Deep Yin & Meditation",
      date: "June 25, 2026",
      location: "Virtual / Zoom",
      category: "Online Class",
      price: "$15",
      priceColor: "bg-blue-100 text-blue-700",
    },
    {
      title: "Ashtanga Masterclass",
      date: "July 02, 2026",
      location: "Downtown Studio",
      category: "Intensive",
      price: "$45",
      priceColor: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
            Community Hub
          </span>
          <h1 className="text-4xl font-extrabold mb-4">YogaCandy Community</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join a global network of students and teachers. Share your journey, find events, and grow together.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <section>
            <h2 className="text-3xl font-bold mb-8">Join the Movement</h2>
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧑‍🏫</span>
                  <h3 className="text-xl font-bold">I am a Teacher</h3>
                </div>
                <p className="text-gray-500 mb-6 text-sm">
                  List your classes, manage your schedule, and connect with students looking for your expertise.
                </p>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                  />
                  <input
                    type="text"
                    placeholder="Specialization (e.g. Ashtanga, Vinyasa)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all uppercase tracking-widest text-xs"
                  >
                    Apply as Teacher
                  </button>
                </form>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧘</span>
                  <h3 className="text-xl font-bold">I am a Student</h3>
                </div>
                <p className="text-gray-500 mb-6 text-sm">
                  Find your perfect flow, track your progress, and get AI-powered recommendations.
                </p>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
                  >
                    Sign Up as Student
                  </button>
                </form>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <button className="text-sm font-bold text-blue-600 hover:underline underline-offset-4">
                View Calendar
              </button>
            </div>

            <div className="space-y-4">
              {events.map((event) => {
                const { month, day } = parseEventDate(event.date);
                return (
                  <div key={event.title} className="group cursor-pointer">
                    <div className="flex gap-5 items-start p-6 rounded-3xl bg-gray-50 border border-transparent group-hover:bg-white group-hover:border-gray-100 group-hover:shadow-md transition-all">
                      <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center flex-shrink-0">
                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">{month}</span>
                        <span className="text-xl font-bold leading-snug">{day}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors leading-tight">
                            {event.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex-shrink-0 ${event.priceColor}`}
                          >
                            {event.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{event.location}</p>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 rounded-3xl bg-blue-50 border border-blue-100 text-center">
              <p className="text-sm text-blue-700 font-medium mb-3">Are you a teacher with an event to share?</p>
              <button className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Submit Your Event
              </button>
            </div>
          </section>
        </div>

        <div className="mt-16">
          <InstagramFeed />
        </div>
      </div>
    </div>
  );
}
