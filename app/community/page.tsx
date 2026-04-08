import InstagramFeed from "@/components/InstagramFeed";
import Link from "next/link";

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
            <h2 className="text-3xl font-bold mb-8">Register in One Place</h2>
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧑‍🏫</span>
                  <h3 className="text-xl font-bold">Teacher and student profiles</h3>
                </div>
                <p className="text-gray-500 mb-6 text-sm">
                  Account creation should happen only once in the main signup flow. After that we can store teacher and student profile details in a backend database and keep the rest of the site read-only.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/auth/signup?role=teacher"
                    className="bg-black text-white font-bold py-3 px-5 rounded-xl hover:bg-gray-800 transition-all uppercase tracking-widest text-xs"
                  >
                    Register as Teacher
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="border border-gray-200 text-gray-800 font-bold py-3 px-5 rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                  >
                    Register as Student
                  </Link>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🗄️</span>
                  <h3 className="text-xl font-bold">Backend profile storage</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  The current signup flow already uses Supabase auth, but profiles should eventually live in a real users table so we can manage teacher bios, saved preferences, and event submissions without duplicating registration forms across the site.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <Link href="/events" className="text-sm font-bold text-blue-600 hover:underline underline-offset-4">
                View Calendar
              </Link>
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
              <Link
                href="/events"
                className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-colors inline-flex"
              >
                Submit Your Event
              </Link>
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
