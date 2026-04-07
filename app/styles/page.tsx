import { allStyles } from "@/app/data/styles";

const levelColors: Record<string, string> = {
  "Beginner": "bg-green-50 text-green-700 border-green-200",
  "All Levels": "bg-blue-50 text-blue-700 border-blue-200",
  "Intermediate": "bg-orange-50 text-orange-700 border-orange-200",
  "Intermediate/Advanced": "bg-red-50 text-red-700 border-red-200",
  "Advanced": "bg-red-50 text-red-700 border-red-200",
};

export default function StylesPage() {
  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
            {allStyles.length} Styles
          </span>
          <h1 className="text-4xl font-extrabold mb-4">Yoga Styles Directory</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From the intensity of Ashtanga to the meditative stillness of Yin, find the practice that resonates with your soul.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allStyles.map((style) => {
            const levelColor = levelColors[style.level] ?? "bg-gray-50 text-gray-700 border-gray-200";
            return (
              <a
                key={style.slug}
                href={`/styles/${style.slug}`}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{style.icon}</span>
                    <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{style.name}</h2>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider flex-shrink-0 ${levelColor}`}>
                    {style.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{style.description}</p>

                {/* Mini score bars */}
                <div className="grid grid-cols-5 gap-1 mb-4">
                  {(["flexibility", "strength", "balance", "breath", "mind"] as const).map((key) => (
                    <div key={key} className="flex flex-col items-center gap-1">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(style.scores[key] / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] uppercase text-gray-400 tracking-wider font-medium">{key.slice(0, 3)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg">
                    {style.focus}
                  </span>
                  <span className="text-blue-600 text-sm font-bold group-hover:underline underline-offset-4">
                    View Details →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
