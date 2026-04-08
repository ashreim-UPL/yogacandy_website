export interface FocusScores {
  flexibility: number;
  strength: number;
  balance: number;
  breath: number;
  mind: number;
}

export interface CountryPopularity {
  country: string;
  flag: string;
  level: "high" | "medium" | "low";
}

export interface TrainingCenter {
  name: string;
  location: string;
  type: "practice" | "teacher-training" | "both";
}

export interface StyleImage {
  id: string;       // Unsplash photo ID
  alt: string;      // descriptive alt text
  credit: string;   // photographer name from Unsplash
}

export interface YogaStyle {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  history: string;
  focus: string;
  level: string;
  icon: string;
  gradient: string;
  accentColor: string;
  scores: FocusScores;
  scoreDescriptions: Record<keyof FocusScores, string>;
  origin: { founder: string; year: string; place: string };
  benefits: string[];
  practiceCenters: TrainingCenter[];
  teacherTraining: TrainingCenter[];
  countryPopularity: CountryPopularity[];
  images: StyleImage[];
}

export const allStyles: YogaStyle[] = [
  {
    slug: "ashtanga",
    name: "Ashtanga",
    tagline: "A rigorous, structured practice with roots in ancient India.",
    description:
      "Ashtanga Yoga is a dynamic, physically demanding style that links breath with movement through a fixed sequence of postures. Each pose is held for five breaths before moving to the next, creating internal heat and promoting purification of the body and mind.",
    history:
      "Ashtanga Yoga was systematized and popularized by K. Pattabhi Jois in Mysore, India during the 1940s, drawing from the ancient text Yoga Korunta attributed to Vamana Rishi. Jois taught thousands of Western students from the 1970s onward, and his Mysore school (KPJAYI) became the definitive source. The self-practice ('Mysore style') format became globally influential, as did the led Primary Series classes.",
    focus: "Endurance & Discipline",
    level: "Intermediate/Advanced",
    icon: "🔥",
    gradient: "from-orange-500 to-red-600",
    accentColor: "orange",
    scores: { flexibility: 4, strength: 5, balance: 4, breath: 4, mind: 3 },
    scoreDescriptions: {
      flexibility: "Advanced postures demand significant hip, hamstring and spinal flexibility built progressively over years.",
      strength: "Constant vinyasa transitions, arm balances and jump-throughs demand exceptional full-body strength.",
      balance: "Standing sequences and arm balance postures require refined proprioception and stability.",
      breath: "The Ujjayi breath is the backbone of the practice — each movement is synchronized with inhalation or exhalation.",
      mind: "The fixed sequence reduces mental decision-making, creating a moving meditation once internalized.",
    },
    origin: { founder: "K. Pattabhi Jois", year: "1940s", place: "Mysore, India" },
    benefits: [
      "Builds exceptional physical strength and stamina",
      "Detoxifies the body through sweat and internal heat",
      "Develops deep body awareness over time",
      "Creates a sustainable daily self-practice",
      "Promotes mental focus through repetitive structure",
    ],
    practiceCenters: [
      { name: "KPJAYI — Shri K. Pattabhi Jois Ashtanga Yoga Institute", location: "Mysore, India", type: "both" },
      { name: "Ashtanga Yoga London", location: "London, UK", type: "both" },
      { name: "Eddie Stern Ashtanga Yoga", location: "New York, USA", type: "both" },
      { name: "Purple Valley Yoga", location: "Goa, India", type: "both" },
    ],
    teacherTraining: [
      { name: "KPJAYI Authorization Programme", location: "Mysore, India", type: "teacher-training" },
      { name: "Ashtanga Yoga Research Institute", location: "Various locations", type: "teacher-training" },
      { name: "David Swenson Teacher Training", location: "USA & International", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "India", flag: "🇮🇳", level: "high" },
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "United Kingdom", flag: "🇬🇧", level: "high" },
      { country: "Australia", flag: "🇦🇺", level: "high" },
      { country: "Germany", flag: "🇩🇪", level: "medium" },
      { country: "Japan", flag: "🇯🇵", level: "medium" },
      { country: "Brazil", flag: "🇧🇷", level: "medium" },
      { country: "France", flag: "🇫🇷", level: "low" },
    ],
    images: [
      { id: "1575052814086-f385e2e2ad1b", alt: "Ashtanga yoga class in Mysore style", credit: "Conscious Design" },
      { id: "1599901860904-17e6ed7083a0", alt: "Dynamic vinyasa flow practice outdoors", credit: "Kike Vega" },
      { id: "1544367567-0f2fcb009e0b", alt: "Ashtanga sun salutation sequence", credit: "kike vega" },
    ],
  },
  {
    slug: "bikram-hot-yoga",
    name: "Bikram / Hot Yoga",
    tagline: "26 postures, 40°C heat, and total transformation.",
    description:
      "Bikram Yoga consists of a fixed sequence of 26 postures and 2 breathing exercises performed over 90 minutes in a room heated to 95–104°F (35–40°C). The heat promotes muscle flexibility, deep stretching and profuse sweating to flush toxins.",
    history:
      "Bikram Choudhury developed his sequence in India and brought it to the United States in the early 1970s, opening his first studio in Beverly Hills. It rapidly became one of the most commercially successful yoga styles in the West. Following controversies around Choudhury in the 2010s, many studios rebranded as simply 'Hot Yoga' while retaining the same 26-posture sequence or variations of it.",
    focus: "Detox & Flexibility",
    level: "All Levels",
    icon: "🌡️",
    gradient: "from-red-500 to-orange-400",
    accentColor: "red",
    scores: { flexibility: 5, strength: 3, balance: 3, breath: 3, mind: 2 },
    scoreDescriptions: {
      flexibility: "The heat dramatically increases muscle and connective tissue pliability, enabling far deeper stretching than in normal conditions.",
      strength: "Many of the 26 postures engage core and leg muscles isometrically, building functional endurance strength.",
      balance: "Standing series includes challenging one-leg balance postures that develop proprioception.",
      breath: "Two specific pranayama exercises bookend the practice; the heat also teaches conscious breath regulation.",
      mind: "The repetitive fixed sequence lowers cognitive load, but the heat environment is mentally challenging to endure.",
    },
    origin: { founder: "Bikram Choudhury", year: "1970s", place: "Beverly Hills, USA" },
    benefits: [
      "Exceptional gains in full-body flexibility",
      "Cardiovascular conditioning from sustained effort in heat",
      "Deep tissue detoxification through profuse sweating",
      "Builds mental resilience and heat tolerance",
      "Suitable for rehabilitation and injury recovery",
    ],
    practiceCenters: [
      { name: "Bikram Yoga NYC", location: "New York, USA", type: "both" },
      { name: "Hot Yoga Society", location: "London, UK", type: "practice" },
      { name: "Modo Yoga (Hot Yoga variant)", location: "Canada & International", type: "both" },
      { name: "Bikram's Yoga College of India", location: "Los Angeles, USA", type: "both" },
    ],
    teacherTraining: [
      { name: "Bikram Yoga Teacher Training", location: "Los Angeles, USA", type: "teacher-training" },
      { name: "Barkan Method Hot Yoga TT", location: "Florida, USA", type: "teacher-training" },
      { name: "Modo Yoga Teacher Training", location: "Canada", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "Canada", flag: "🇨🇦", level: "high" },
      { country: "Australia", flag: "🇦🇺", level: "high" },
      { country: "United Kingdom", flag: "🇬🇧", level: "medium" },
      { country: "Germany", flag: "🇩🇪", level: "medium" },
      { country: "Singapore", flag: "🇸🇬", level: "medium" },
      { country: "India", flag: "🇮🇳", level: "low" },
      { country: "Japan", flag: "🇯🇵", level: "low" },
    ],
    images: [
      { id: "1588286840104-8957b019727f", alt: "Hot yoga practice in a heated studio", credit: "Yoga Photographer" },
      { id: "1552196563-55cd4e45efb3", alt: "Deep flexibility stretch in hot yoga", credit: "Form" },
      { id: "1518611012118-696072aa579a", alt: "Bikram yoga standing sequence", credit: "Dane Wetton" },
    ],
  },
  {
    slug: "iyengar",
    name: "Iyengar",
    tagline: "The science of alignment — precision as the path to liberation.",
    description:
      "Iyengar Yoga emphasizes meticulous anatomical alignment in each posture, using props such as blocks, blankets, straps and chairs to allow practitioners of all abilities to access poses safely. Postures are held for longer periods than in flow styles, building deep body awareness.",
    history:
      "B.K.S. Iyengar (1918–2014) developed this approach over decades in Pune, India, publishing the landmark book 'Light on Yoga' in 1966 — still considered the definitive anatomical reference for yoga postures. Iyengar's work made yoga accessible to people with injuries, disabilities and limited flexibility. His Ramamani Iyengar Memorial Yoga Institute (RIMYI) in Pune remains the certification authority.",
    focus: "Precision & Alignment",
    level: "All Levels",
    icon: "🎯",
    gradient: "from-blue-600 to-indigo-700",
    accentColor: "blue",
    scores: { flexibility: 4, strength: 3, balance: 5, breath: 3, mind: 4 },
    scoreDescriptions: {
      flexibility: "Props help practitioners access full range of motion safely; long holds develop genuine flexibility.",
      strength: "Active engagement of supporting muscles in held postures builds functional stability and strength.",
      balance: "Iyengar's emphasis on alignment makes balance work extremely refined and precise.",
      breath: "Pranayama is taught as a separate, advanced practice after solid asana foundation is established.",
      mind: "The intense focus on anatomical detail requires deep concentration and mindful body scanning.",
    },
    origin: { founder: "B.K.S. Iyengar", year: "1960s", place: "Pune, India" },
    benefits: [
      "Safe for beginners, injured practitioners and older adults",
      "Develops exceptional postural awareness",
      "Therapeutic applications for many physical conditions",
      "Builds a methodical, intelligent approach to the body",
      "Lifelong practice with clear developmental stages",
    ],
    practiceCenters: [
      { name: "RIMYI — Ramamani Iyengar Memorial Yoga Institute", location: "Pune, India", type: "both" },
      { name: "Iyengar Yoga Institute of New York", location: "New York, USA", type: "both" },
      { name: "Iyengar Yoga (London)", location: "London, UK", type: "both" },
      { name: "BKS Iyengar Yoga Association of Australia", location: "Australia", type: "both" },
    ],
    teacherTraining: [
      { name: "RIMYI Intensive Programme", location: "Pune, India", type: "teacher-training" },
      { name: "IYA UK Certification", location: "United Kingdom", type: "teacher-training" },
      { name: "IYNAUS Certified Teacher Programme", location: "USA", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "India", flag: "🇮🇳", level: "high" },
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "United Kingdom", flag: "🇬🇧", level: "high" },
      { country: "France", flag: "🇫🇷", level: "high" },
      { country: "Australia", flag: "🇦🇺", level: "medium" },
      { country: "Switzerland", flag: "🇨🇭", level: "medium" },
      { country: "Germany", flag: "🇩🇪", level: "medium" },
      { country: "Israel", flag: "🇮🇱", level: "medium" },
    ],
    images: [
      { id: "1510894347713-fc3ed6fdf539", alt: "Iyengar yoga with blocks and props", credit: "Annie Spratt" },
      { id: "1574680178789-2d0a4f4a7e29", alt: "Precise alignment work in Iyengar yoga", credit: "Conscious Design" },
      { id: "1593811167562-9cef47bfc4d7", alt: "Iyengar yoga restorative with bolster", credit: "Kike Vega" },
    ],
  },
  {
    slug: "jivamukti",
    name: "Jivamukti",
    tagline: "Where physical practice meets philosophy, music and activism.",
    description:
      "Jivamukti Yoga is a physically vigorous and spiritually-oriented style that integrates chanting, meditation, scripture reading and music with a challenging vinyasa practice. Each class follows a monthly focus theme drawn from yogic philosophy.",
    history:
      "Jivamukti was founded in New York City in 1984 by Sharon Gannon and David Life. Drawing from Ashtanga Vinyasa, their method added layers of Sanskrit chanting, yogic philosophy, music, and ethical veganism. The original Jivamukti Yoga School in Manhattan became a cultural landmark before closing in 2019, but the method continues globally through certified teachers.",
    focus: "Spiritual & Physical",
    level: "Intermediate",
    icon: "🕉️",
    gradient: "from-purple-600 to-violet-700",
    accentColor: "purple",
    scores: { flexibility: 3, strength: 3, balance: 3, breath: 4, mind: 5 },
    scoreDescriptions: {
      flexibility: "Vinyasa-based sequences develop functional flexibility with philosophical context.",
      strength: "Dynamic flows build practical strength, though not the primary focus.",
      balance: "Balance postures are included within sequences but not specially emphasized.",
      breath: "Breath is linked carefully to movement; pranayama and chanting develop conscious respiratory control.",
      mind: "Philosophy, music, chanting and ethical teaching make this the most spiritually rich yoga style.",
    },
    origin: { founder: "Sharon Gannon & David Life", year: "1984", place: "New York City, USA" },
    benefits: [
      "Deep integration of yoga philosophy into daily life",
      "Vibrant community and spiritual support",
      "Develops ethical sensitivity and compassion",
      "Creative, music-infused classes keep practice fresh",
      "Strong intellectual and spiritual curriculum",
    ],
    practiceCenters: [
      { name: "Jivamukti Yoga Berlin", location: "Berlin, Germany", type: "both" },
      { name: "Jivamukti Yoga London", location: "London, UK", type: "practice" },
      { name: "Various certified studios worldwide", location: "Global", type: "practice" },
    ],
    teacherTraining: [
      { name: "Jivamukti 800-Hour Teacher Training", location: "International locations", type: "teacher-training" },
      { name: "Jivamukti Advanced Intensives", location: "Europe & USA", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "Germany", flag: "🇩🇪", level: "high" },
      { country: "United Kingdom", flag: "🇬🇧", level: "medium" },
      { country: "Australia", flag: "🇦🇺", level: "medium" },
      { country: "France", flag: "🇫🇷", level: "low" },
      { country: "Italy", flag: "🇮🇹", level: "low" },
      { country: "India", flag: "🇮🇳", level: "low" },
      { country: "Canada", flag: "🇨🇦", level: "low" },
    ],
    images: [
      { id: "1506126613408-eca07ce68773", alt: "Jivamukti yoga spiritual meditation practice", credit: "Jared Rice" },
      { id: "1545389336-cf090694435e", alt: "Group chanting and yoga practice", credit: "Conscious Design" },
      { id: "1531501410720-c8d437636169", alt: "Flowing vinyasa in Jivamukti class", credit: "Form" },
    ],
  },
  {
    slug: "kundalini",
    name: "Kundalini",
    tagline: "Awaken dormant energy through breath, movement and mantra.",
    description:
      "Kundalini Yoga combines dynamic breathwork (pranayama), repetitive movements (kriyas), mantra chanting, mudras and meditation to awaken and move energy through the body's chakra system. Classes are intense, rhythmic and often deeply transformative.",
    history:
      "Rooted in ancient tantric and Sikh traditions, Kundalini Yoga was brought to the West in 1969 by Yogi Bhajan (Harbhajan Singh Khalsa), who controversially broke with the tradition of teaching it only in secret. He founded 3HO (Healthy, Happy, Holy Organization) which spread the practice globally. The style is closely associated with white clothing, turbans, and Sikh-influenced mantras.",
    focus: "Energy & Breathwork",
    level: "All Levels",
    icon: "⚡",
    gradient: "from-yellow-500 to-orange-500",
    accentColor: "yellow",
    scores: { flexibility: 2, strength: 2, balance: 2, breath: 5, mind: 5 },
    scoreDescriptions: {
      flexibility: "Physical flexibility is not a primary goal; gentle movement serves the energy work.",
      strength: "Repetitive kriya exercises build endurance but physical strength is secondary.",
      balance: "Some kriyas include balance elements, but this is not a core focus.",
      breath: "Breath of Fire, long deep breathing and specific pranayamas are the heart of Kundalini practice.",
      mind: "Mantra, meditation and altered states of consciousness make this one of the most mentally transformative styles.",
    },
    origin: { founder: "Yogi Bhajan", year: "1969", place: "Los Angeles, USA" },
    benefits: [
      "Rapid stress reduction and nervous system regulation",
      "Builds energetic sensitivity and body awareness",
      "Powerful tool for addiction recovery and trauma healing",
      "Develops daily meditation habits",
      "Community and devotional practice",
    ],
    practiceCenters: [
      { name: "3HO Kundalini Yoga Centers", location: "Worldwide", type: "both" },
      { name: "Kundalini Yoga East", location: "New York, USA", type: "both" },
      { name: "The Kundalini Yoga Studio", location: "London, UK", type: "practice" },
      { name: "KRI — Kundalini Research Institute", location: "New Mexico, USA", type: "both" },
    ],
    teacherTraining: [
      { name: "KRI Level 1 Teacher Training (200hr)", location: "Global — 3HO Certified Centers", type: "teacher-training" },
      { name: "KRI Level 2 Practitioner Training", location: "Various countries", type: "teacher-training" },
      { name: "Sat Nam Rasayan Healing Training", location: "International", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "Mexico", flag: "🇲🇽", level: "high" },
      { country: "Germany", flag: "🇩🇪", level: "medium" },
      { country: "Spain", flag: "🇪🇸", level: "medium" },
      { country: "France", flag: "🇫🇷", level: "medium" },
      { country: "Canada", flag: "🇨🇦", level: "medium" },
      { country: "India", flag: "🇮🇳", level: "low" },
      { country: "UK", flag: "🇬🇧", level: "low" },
    ],
    images: [
      { id: "1447452001526-f3af25d3ebbb", alt: "Kundalini yoga meditation and breathwork", credit: "Jared Rice" },
      { id: "1601925260368-ae2f83cf8b7f", alt: "Kundalini kriya practice with arm movements", credit: "Conscious Design" },
      { id: "1506126613408-eca07ce68773", alt: "Deep meditative state in Kundalini yoga", credit: "Jared Rice" },
    ],
  },
  {
    slug: "yin-yoga",
    name: "Yin Yoga",
    tagline: "Stillness, surrender and deep tissue release.",
    description:
      "Yin Yoga targets the deep connective tissues — fascia, ligaments, tendons and joint capsules — through long, passive holds lasting 3–10 minutes per posture. It is the polar opposite of yang styles: quiet, still, introspective and profoundly restorative.",
    history:
      "Yin Yoga was developed in the late 1970s by martial arts expert and Taoist yoga teacher Paulie Zink, and further developed and popularized by Paul Grilley and Sarah Powers in the 1990s. Influenced by Chinese medicine meridian theory and Taoist philosophy, it arrived as a necessary counterbalance to the rise of vigorous vinyasa yoga in the West.",
    focus: "Connective Tissue & Mind",
    level: "All Levels",
    icon: "🌙",
    gradient: "from-indigo-600 to-purple-700",
    accentColor: "indigo",
    scores: { flexibility: 5, strength: 1, balance: 2, breath: 3, mind: 5 },
    scoreDescriptions: {
      flexibility: "Long passive holds are the most effective method for remodelling connective tissue and increasing range of motion.",
      strength: "Muscles are intentionally relaxed; this is not a strength practice.",
      balance: "Floor-based postures make balance largely irrelevant, though some seated poses challenge stability.",
      breath: "Breath awareness during long holds is essential for navigating sensation and staying present.",
      mind: "Sitting with discomfort for extended periods is deeply meditative and develops extraordinary mental resilience.",
    },
    origin: { founder: "Paulie Zink / Paul Grilley", year: "1970s–1990s", place: "USA" },
    benefits: [
      "Significantly increases joint range of motion over time",
      "Releases chronic fascial tension and compression",
      "Balances the nervous system and reduces anxiety",
      "Complements all athletic and yang yoga practices",
      "Powerful preparation for seated meditation",
    ],
    practiceCenters: [
      { name: "YinSights Yoga (Bernie Clark)", location: "Vancouver, Canada", type: "both" },
      { name: "Sarah Powers Insight Yoga Institute", location: "USA", type: "both" },
      { name: "Yin Yoga classes — most modern yoga studios", location: "Worldwide", type: "practice" },
    ],
    teacherTraining: [
      { name: "Paul Grilley Yin Yoga Teacher Training", location: "USA & International", type: "teacher-training" },
      { name: "YinSights Yin Yoga Training (Bernie Clark)", location: "Canada & Online", type: "teacher-training" },
      { name: "Sarah Powers Yin/Yang Immersion", location: "International", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "Canada", flag: "🇨🇦", level: "high" },
      { country: "Australia", flag: "🇦🇺", level: "high" },
      { country: "United Kingdom", flag: "🇬🇧", level: "high" },
      { country: "Netherlands", flag: "🇳🇱", level: "high" },
      { country: "Germany", flag: "🇩🇪", level: "medium" },
      { country: "Sweden", flag: "🇸🇪", level: "medium" },
      { country: "Japan", flag: "🇯🇵", level: "medium" },
    ],
    images: [
      { id: "1552196563-55cd4e45efb3", alt: "Yin yoga deep hip-opening pose on the floor", credit: "Form" },
      { id: "1544367567-0f2fcb009e0b", alt: "Passive yin yoga pose held in stillness", credit: "Kike Vega" },
      { id: "1510894347713-fc3ed6fdf539", alt: "Yin yoga forward fold with long hold", credit: "Annie Spratt" },
    ],
  },
  {
    slug: "power-yoga",
    name: "Power Yoga",
    tagline: "Strength, sweat and flow — yoga meets the gym.",
    description:
      "Power Yoga is a vigorous, fitness-oriented vinyasa style influenced by Ashtanga but without a fixed sequence. Classes are physically demanding, fast-paced and varied, making it highly accessible to gym-goers and athletes seeking both strength and flexibility.",
    history:
      "Power Yoga emerged in the early 1990s in the United States, pioneered by Beryl Bender Birch on the East Coast and Bryan Kest on the West Coast — both Ashtanga-trained teachers who adapted the practice to make it more accessible and fitness-focused for Western students. The term was popularized by fitness media and quickly spread globally.",
    focus: "Strength & Flow",
    level: "Intermediate",
    icon: "💪",
    gradient: "from-gray-700 to-gray-900",
    accentColor: "gray",
    scores: { flexibility: 3, strength: 5, balance: 4, breath: 3, mind: 2 },
    scoreDescriptions: {
      flexibility: "Dynamic stretching within flows develops practical working flexibility.",
      strength: "High-repetition sequences, arm balances and holds build muscular endurance and real strength.",
      balance: "Athletic balance postures (warriors, lunges, arm balances) are core to the practice.",
      breath: "Breath is synchronized with movement but approached practically rather than spiritually.",
      mind: "Focus is primarily physical; the style is intentionally accessible and less philosophical.",
    },
    origin: { founder: "Beryl Bender Birch / Bryan Kest", year: "1990s", place: "USA" },
    benefits: [
      "Excellent for athletes as cross-training",
      "Builds functional full-body strength",
      "Improves cardiovascular fitness",
      "Accessible entry point to yoga for gym-goers",
      "High calorie burn and body composition benefits",
    ],
    practiceCenters: [
      { name: "Bryan Kest's Power Yoga Santa Monica", location: "California, USA", type: "both" },
      { name: "Power Yoga — CorePower Yoga (chain)", location: "USA — 200+ locations", type: "practice" },
      { name: "Virgin Active Yoga classes", location: "UK, South Africa & International", type: "practice" },
    ],
    teacherTraining: [
      { name: "CorePower Yoga Teacher Training (200hr)", location: "USA", type: "teacher-training" },
      { name: "Bryan Kest Teacher Training", location: "Los Angeles, USA", type: "teacher-training" },
      { name: "Power Yoga Canada Teacher Training", location: "Canada", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "Canada", flag: "🇨🇦", level: "high" },
      { country: "Australia", flag: "🇦🇺", level: "high" },
      { country: "United Kingdom", flag: "🇬🇧", level: "high" },
      { country: "South Africa", flag: "🇿🇦", level: "medium" },
      { country: "Brazil", flag: "🇧🇷", level: "medium" },
      { country: "Germany", flag: "🇩🇪", level: "medium" },
      { country: "UAE", flag: "🇦🇪", level: "medium" },
    ],
    images: [
      { id: "1575052814086-f385e2e2ad1b", alt: "Power yoga arm balance and strength pose", credit: "Conscious Design" },
      { id: "1593811167562-9cef47bfc4d7", alt: "Athletic power yoga flow sequence", credit: "Kike Vega" },
      { id: "1599901860904-17e6ed7083a0", alt: "Vigorous power yoga outdoor practice", credit: "Kike Vega" },
    ],
  },
  {
    slug: "restorative",
    name: "Restorative",
    tagline: "The art of doing nothing — and healing completely.",
    description:
      "Restorative Yoga uses props to fully support the body in passive postures held for 5–20 minutes, activating the parasympathetic nervous system and encouraging complete physical and mental release. It is medicine for the modern overstimulated body.",
    history:
      "Restorative Yoga grew from B.K.S. Iyengar's therapeutic use of props, further developed by his student Judith Hanson Lasater from the 1970s. Lasater's book 'Relax and Renew' (1995) became the definitive text. The style gained mainstream popularity in the 2000s as burnout, chronic stress and sleep disorders became global health crises.",
    focus: "Recovery & Relaxation",
    level: "Beginner",
    icon: "🌿",
    gradient: "from-green-500 to-teal-600",
    accentColor: "green",
    scores: { flexibility: 3, strength: 1, balance: 1, breath: 4, mind: 5 },
    scoreDescriptions: {
      flexibility: "Passive supported stretches gently increase flexibility over time without effort.",
      strength: "No muscular engagement is required; this is complete rest.",
      balance: "All poses are on the floor with full prop support; balance is irrelevant.",
      breath: "Diaphragmatic breathing and breath awareness are central to inducing deep relaxation.",
      mind: "Activating the parasympathetic nervous system creates profound mental stillness and emotional release.",
    },
    origin: { founder: "Judith Hanson Lasater", year: "1970s", place: "USA" },
    benefits: [
      "Directly counteracts chronic stress and burnout",
      "Dramatically improves sleep quality",
      "Supports recovery from illness or injury",
      "Reduces inflammation in the body",
      "Accessible to everyone regardless of fitness level",
    ],
    practiceCenters: [
      { name: "Piedmont Yoga (Judith Lasater)", location: "San Francisco, USA", type: "both" },
      { name: "Most yoga studios — Restorative classes", location: "Worldwide", type: "practice" },
      { name: "Hospitals and wellness clinics", location: "Global", type: "practice" },
    ],
    teacherTraining: [
      { name: "Judith Hanson Lasater Restorative Training", location: "USA & International", type: "teacher-training" },
      { name: "Yoga Nidra & Restorative Combined Training", location: "Various", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "United Kingdom", flag: "🇬🇧", level: "high" },
      { country: "Australia", flag: "🇦🇺", level: "high" },
      { country: "Canada", flag: "🇨🇦", level: "high" },
      { country: "Netherlands", flag: "🇳🇱", level: "medium" },
      { country: "Scandinavia", flag: "🇸🇪", level: "medium" },
      { country: "Germany", flag: "🇩🇪", level: "medium" },
      { country: "Japan", flag: "🇯🇵", level: "medium" },
    ],
    images: [
      { id: "1545389336-cf090694435e", alt: "Restorative yoga with bolster support", credit: "Conscious Design" },
      { id: "1531501410720-c8d437636169", alt: "Supported restorative yoga pose at rest", credit: "Form" },
      { id: "1574680178789-2d0a4f4a7e29", alt: "Deeply relaxed restorative yoga pose", credit: "Conscious Design" },
    ],
  },
  {
    slug: "viniyoga",
    name: "Viniyoga",
    tagline: "Yoga adapted to the individual — not the other way around.",
    description:
      "Viniyoga is a highly individualized approach that adapts postures, breath and practice duration to suit each student's unique constitution, age, health condition and life stage. It is fundamentally therapeutic and personal, rejecting a one-size-fits-all approach.",
    history:
      "Viniyoga derives from the teachings of T. Krishnamacharya in Chennai, India, and was systematized by his son T.K.V. Desikachar who coined the term. Desikachar's book 'The Heart of Yoga' (1995) outlined the philosophy. Gary Kraftsow brought Viniyoga to the USA, where it became particularly influential in therapeutic and medical yoga settings.",
    focus: "Therapeutic & Adaptive",
    level: "All Levels",
    icon: "🩺",
    gradient: "from-teal-500 to-cyan-600",
    accentColor: "teal",
    scores: { flexibility: 3, strength: 2, balance: 3, breath: 5, mind: 4 },
    scoreDescriptions: {
      flexibility: "Flexibility work is tailored to individual anatomy and goals rather than pursued as a universal aim.",
      strength: "Strength is developed as needed for each student's condition and life context.",
      balance: "Balance is addressed therapeutically — improved as part of overall wellbeing.",
      breath: "Breath is the primary tool; the ratio of inhale, exhale and retention is precisely adapted for each person.",
      mind: "Integrates yoga philosophy, mantra and meditation as part of a complete personal practice.",
    },
    origin: { founder: "T.K.V. Desikachar", year: "1970s–1980s", place: "Chennai, India" },
    benefits: [
      "Safely adapted for injury, illness or special needs",
      "Creates a truly personal yoga practice",
      "Addresses specific health conditions therapeutically",
      "Integrates all eight limbs of yoga naturally",
      "Excellent for aging populations",
    ],
    practiceCenters: [
      { name: "Krishnamacharya Yoga Mandiram", location: "Chennai, India", type: "both" },
      { name: "American Viniyoga Institute", location: "USA", type: "both" },
      { name: "Viniyoga therapists worldwide", location: "International", type: "practice" },
    ],
    teacherTraining: [
      { name: "KYM Viniyoga Therapy Training", location: "Chennai, India", type: "teacher-training" },
      { name: "American Viniyoga Institute 500hr Training", location: "USA", type: "teacher-training" },
      { name: "Viniyoga Europe Teacher Training", location: "Europe", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "India", flag: "🇮🇳", level: "high" },
      { country: "United States", flag: "🇺🇸", level: "medium" },
      { country: "France", flag: "🇫🇷", level: "medium" },
      { country: "Germany", flag: "🇩🇪", level: "medium" },
      { country: "United Kingdom", flag: "🇬🇧", level: "low" },
      { country: "Australia", flag: "🇦🇺", level: "low" },
      { country: "Japan", flag: "🇯🇵", level: "low" },
      { country: "Brazil", flag: "🇧🇷", level: "low" },
    ],
    images: [
      { id: "1506126613408-eca07ce68773", alt: "Viniyoga individualised therapeutic practice", credit: "Jared Rice" },
      { id: "1447452001526-f3af25d3ebbb", alt: "Gentle adaptive yoga for all bodies", credit: "Jared Rice" },
      { id: "1552196563-55cd4e45efb3", alt: "Therapeutic yoga pose with mindful breath", credit: "Form" },
    ],
  },
  {
    slug: "suspension-swing",
    name: "Suspension (SWING)",
    tagline: "Defy gravity — inversions, decompression and playful exploration.",
    description:
      "Suspension Yoga uses silk hammocks or swings to support the body in inversions, aerial postures and deep spinal decompression. It makes inversions accessible to all levels while adding a playful, circus-inspired dimension to yoga practice.",
    level: "All Levels",
    focus: "Decompression & Play",
    icon: "🪁",
    gradient: "from-sky-500 to-blue-600",
    accentColor: "sky",
    history:
      "Aerial yoga and suspension practices emerged in the early 2000s in the USA, most notably through Christopher Harrison's AntiGravity Fitness system (1991, originally for Broadway performers) and the later aerial yoga adaptation. It spread rapidly across Southeast Asia, the UAE and Europe in the 2010s, becoming especially popular in boutique wellness studios.",
    scores: { flexibility: 4, strength: 3, balance: 5, breath: 3, mind: 3 },
    scoreDescriptions: {
      flexibility: "Gravity-assisted inversions and supported stretches enable exceptionally deep spinal and hip opening.",
      strength: "Supporting body weight in the hammock and transitioning between postures requires arm and core strength.",
      balance: "Three-dimensional movement in a suspended hammock develops extraordinary spatial awareness and balance.",
      breath: "Inverted positions shift breathing patterns; breath awareness in unfamiliar orientations deepens practice.",
      mind: "Overcoming fear of inversion and exploring playful movement builds confidence and mental openness.",
    },
    origin: { founder: "Christopher Harrison (AntiGravity)", year: "2000s", place: "New York, USA" },
    benefits: [
      "Spinal decompression — relief for disc and back conditions",
      "Makes inversions safe and accessible for all levels",
      "Joyful, playful practice that increases motivation",
      "Develops unique spatial body awareness",
      "Strong community appeal and photogenic practice",
    ],
    practiceCenters: [
      { name: "AntiGravity Fitness (official)", location: "USA & International", type: "both" },
      { name: "Aerial Yoga studios", location: "Worldwide", type: "practice" },
      { name: "Flying Fantastic", location: "London, UK", type: "practice" },
    ],
    teacherTraining: [
      { name: "AntiGravity Fitness Teacher Training", location: "USA & International", type: "teacher-training" },
      { name: "Aerial Yoga Teacher Training (Yoga Alliance)", location: "Global", type: "teacher-training" },
      { name: "YogaFly Teacher Training", location: "Spain & Europe", type: "teacher-training" },
    ],
    countryPopularity: [
      { country: "United States", flag: "🇺🇸", level: "high" },
      { country: "China", flag: "🇨🇳", level: "high" },
      { country: "UAE", flag: "🇦🇪", level: "high" },
      { country: "Spain", flag: "🇪🇸", level: "high" },
      { country: "Thailand", flag: "🇹🇭", level: "medium" },
      { country: "Brazil", flag: "🇧🇷", level: "medium" },
      { country: "United Kingdom", flag: "🇬🇧", level: "medium" },
      { country: "Australia", flag: "🇦🇺", level: "low" },
    ],
    images: [
      { id: "1549476464-37392f717d84", alt: "Aerial yoga hammock inversion pose", credit: "Unsplash" },
      { id: "1601925260368-ae2f83cf8b7f", alt: "Suspension yoga swing backbend", credit: "Conscious Design" },
      { id: "1588286840104-8957b019727f", alt: "Aerial yoga flow in silk hammock", credit: "Unsplash" },
    ],
  },
];

export function getStyleBySlug(slug: string): YogaStyle | undefined {
  return allStyles.find((s) => s.slug === slug);
}
