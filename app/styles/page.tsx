const levelColors: Record<string, string> = {
  "Beginner": "bg-green-50 text-green-700 border-green-200",
  "All Levels": "bg-blue-50 text-blue-700 border-blue-200",
  "Intermediate": "bg-orange-50 text-orange-700 border-orange-200",
  "Intermediate/Advanced": "bg-red-50 text-red-700 border-red-200",
  "Advanced": "bg-red-50 text-red-700 border-red-200",
};

const styleIcons: Record<string, string> = {
  "Ashtanga": "🔥",
  "Bikram / Hot Yoga": "🌡️",
  "Iyengar": "🎯",
  "Jivamukti": "🕉️",
  "Kundalini": "⚡",
  "Yin Yoga": "🌙",
  "Power Yoga": "💪",
  "Restorative": "🌿",
  "Viniyoga": "🩺",
  "Suspension (SWING)": "🪁",
};

export default function StylesPage() {
  const allStyles = [
    {
      name: "Ashtanga",
      description: "A fast-paced, intense, flowing style of yoga founded by Pattabhi Jois. A set series of poses is performed, always in the same order. Physically demanding due to constant movement.",
      focus: "Endurance & Discipline",
      level: "Intermediate/Advanced"
    },
    {
      name: "Bikram / Hot Yoga",
      description: "Classes taught in a room heated to 95 to 104 degrees. The heat facilitates loosening of tight muscles and profuse sweating. Usually a set series of 26 poses.",
      focus: "Detox & Flexibility",
      level: "All Levels"
    },
    {
      name: "Iyengar",
      description: "Based on the teachings of B.K.S Iyengar, emphasizing alignment and the use of props like blankets, blocks, and straps to assist students in mastering proper form.",
      focus: "Precision & Alignment",
      level: "All Levels"
    },
    {
      name: "Jivamukti",
      description: "Emerging in the 1980s, combining the rigor of Ashtanga with chanting, meditation, and spiritual teachings. Physically intense and often themed.",
      focus: "Spiritual & Physical",
      level: "Intermediate"
    },
    {
      name: "Kundalini",
      description: "Emphasis on breath in conjunction with physical movement, aiming to free energy in the lower body and move it upwards through the chakras.",
      focus: "Energy & Breathwork",
      level: "All Levels"
    },
    {
      name: "Yin Yoga",
      description: "Focuses on stretching connective tissue, particularly around the joints. Poses are held for several minutes to prepare the body for long meditation.",
      focus: "Connective Tissue & Mind",
      level: "All Levels"
    },
    {
      name: "Power Yoga",
      description: "A vigorous vinyasa flow influenced by Ashtanga but with more variation in sequencing. Accessible yet physically challenging.",
      focus: "Strength & Flow",
      level: "Intermediate"
    },
    {
      name: "Restorative",
      description: "Uses props to support the body as it relaxes into poses for several minutes. Encourages passive stretching and deep relaxation.",
      focus: "Recovery & Relaxation",
      level: "Beginner"
    },
    {
      name: "Viniyoga",
      description: "An individualized approach that suits each student's unique stage of life and health. Highly adaptable to personal needs.",
      focus: "Therapeutic & Adaptive",
      level: "All Levels"
    },
    {
      name: "Suspension (SWING)",
      description: "Yoga practice using silk swings or hammocks to support the body in inversions and deep stretches.",
      focus: "Decompression & Play",
      level: "All Levels"
    }
  ];

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
            const icon = styleIcons[style.name] ?? "🧘";
            return (
              <div
                key={style.name}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={style.name}>{icon}</span>
                    <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{style.name}</h2>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider flex-shrink-0 ${levelColor}`}>
                    {style.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {style.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Focus:</span>
                  <span className="text-xs font-bold text-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg">
                    {style.focus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
