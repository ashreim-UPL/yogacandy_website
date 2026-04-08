export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readMin: number;
  publishedAt: string; // ISO date string
  /** ISO-3166-1 alpha-2 country codes, or 'global' for worldwide articles */
  regions: string[];
  styleSlug?: string; // links to a yoga style detail page
  externalUrl?: string; // optional link to full article
}

export const allArticles: Article[] = [
  // ── Global ──────────────────────────────────────────────────────────────────
  {
    id: 'beginners-guide',
    title: '8 Things Every Yoga Beginner Should Know',
    excerpt:
      'Starting yoga can feel overwhelming — here are the eight concepts that will make your first six months smoother, safer, and more enjoyable.',
    category: 'Beginners',
    readMin: 6,
    publishedAt: '2025-11-01',
    regions: ['global'],
  },
  {
    id: 'yoga-wheel-explained',
    title: 'What Is the YogaCandy Wheel?',
    excerpt:
      'Our five-axis Yoga Wheel scores flexibility, strength, balance, breath, and mind. Here is how we calculate each score and how to use it to choose your practice.',
    category: 'Platform',
    readMin: 4,
    publishedAt: '2025-10-15',
    regions: ['global'],
  },
  {
    id: 'morning-vs-evening',
    title: 'Morning vs Evening Yoga: Which Is Right for You?',
    excerpt:
      'Science says both work. But the type of practice, your goals, and your lifestyle all influence which time of day will yield the biggest benefit.',
    category: 'Lifestyle',
    readMin: 5,
    publishedAt: '2025-12-03',
    regions: ['global'],
  },
  {
    id: 'on-device-ai-yoga',
    title: 'How On-Device AI Recommends Your Yoga Style',
    excerpt:
      'YogaCandy uses your browser\'s built-in AI — no data sent to a server — to match your health goals, activity level, and lifestyle to the ideal practice.',
    category: 'Technology',
    readMin: 3,
    publishedAt: '2026-01-10',
    regions: ['global'],
  },

  // ── UAE / Middle East ────────────────────────────────────────────────────────
  {
    id: 'yoga-dubai-2026',
    title: 'Dubai\'s Best Yoga Studios in 2026',
    excerpt:
      'From Jumeirah Beach to Downtown, Dubai\'s wellness scene has exploded. We rank the top studios for every style — from sunrise Ashtanga to rooftop Yin.',
    category: 'Local Guide',
    readMin: 7,
    publishedAt: '2026-01-20',
    regions: ['AE'],
  },
  {
    id: 'ramadan-yoga',
    title: 'Practising Yoga During Ramadan: A Gentle Guide',
    excerpt:
      'Adjusting your practice for the fasting month. Which styles work best, when to practise, and how to maintain energy while honouring Ramadan.',
    category: 'Lifestyle',
    readMin: 5,
    publishedAt: '2026-02-14',
    regions: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
  },
  {
    id: 'outdoor-yoga-uae',
    title: 'The Best Spots for Outdoor Yoga in the UAE',
    excerpt:
      'Corniche Abu Dhabi, Al Qudra Lake, and Hatta Dam — we explore the most scenic outdoor yoga spots across the Emirates.',
    category: 'Local Guide',
    readMin: 4,
    publishedAt: '2025-11-30',
    regions: ['AE'],
  },

  // ── United States ───────────────────────────────────────────────────────────
  {
    id: 'ashtanga-mysore-usa',
    title: 'Where to Find Authentic Mysore Ashtanga in the US',
    excerpt:
      'KPJAYI-authorised teachers are scattered across North America. Here is a curated list of studios offering the traditional self-practice format.',
    category: 'Local Guide',
    readMin: 6,
    publishedAt: '2025-09-12',
    regions: ['US'],
    styleSlug: 'ashtanga',
  },
  {
    id: 'power-yoga-fitness',
    title: 'Power Yoga vs the Gym: What the Science Says',
    excerpt:
      'A growing body of research compares strength gains, calorie burn, and injury rates between Power Yoga and conventional gym training.',
    category: 'Research',
    readMin: 8,
    publishedAt: '2025-10-22',
    regions: ['US', 'CA', 'AU', 'GB'],
    styleSlug: 'power-yoga',
  },

  // ── United Kingdom ───────────────────────────────────────────────────────────
  {
    id: 'iyengar-london',
    title: 'London\'s Finest Iyengar Centres',
    excerpt:
      'B.K.S. Iyengar\'s precision-based method has a devoted following in the UK. We profile the leading centres and what makes each one special.',
    category: 'Local Guide',
    readMin: 5,
    publishedAt: '2025-08-18',
    regions: ['GB'],
    styleSlug: 'iyengar',
  },

  // ── India ────────────────────────────────────────────────────────────────────
  {
    id: 'mysore-pilgrim',
    title: 'A Practitioner\'s Guide to Mysore, India',
    excerpt:
      'Visiting the birthplace of modern yoga — the KPJAYI institute, surrounding ashrams, and tips for making the most of a yoga pilgrimage.',
    category: 'Travel',
    readMin: 9,
    publishedAt: '2025-07-04',
    regions: ['IN'],
    styleSlug: 'ashtanga',
  },

  // ── Australia ────────────────────────────────────────────────────────────────
  {
    id: 'yoga-festivals-au',
    title: 'Top Yoga Festivals in Australia 2026',
    excerpt:
      'Byron Bay Yoga Festival, Wanderlust Melbourne, and more — the complete guide to Australia\'s outdoor yoga events calendar.',
    category: 'Events',
    readMin: 4,
    publishedAt: '2026-01-05',
    regions: ['AU'],
  },

  // ── Germany ──────────────────────────────────────────────────────────────────
  {
    id: 'yoga-berlin',
    title: 'Berlin\'s Yoga Scene: What to Expect in 2026',
    excerpt:
      'Berlin has one of Europe\'s most diverse yoga communities. From Kundalini collectives in Mitte to hot yoga in Prenzlauer Berg.',
    category: 'Local Guide',
    readMin: 5,
    publishedAt: '2025-12-15',
    regions: ['DE'],
  },
];

/** Return articles relevant to a given ISO-3166-1 alpha-2 country code, always including global articles. */
export function getArticlesForCountry(countryCode: string, limit = 6): Article[] {
  const code = countryCode.toUpperCase();
  const relevant = allArticles.filter(
    (a) => a.regions.includes('global') || a.regions.includes(code),
  );
  // Sort: regional first, then global, both newest first
  return relevant
    .sort((a, b) => {
      const aRegional = a.regions.includes(code) ? 1 : 0;
      const bRegional = b.regions.includes(code) ? 1 : 0;
      if (aRegional !== bRegional) return bRegional - aRegional;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((article) => article.id === slug);
}
