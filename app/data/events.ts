export interface EventListing {
  id: string;
  title: string;
  date: string;
  format: 'Online' | 'In person' | 'Hybrid';
  city: string;
  country: string;
  countryCode: string;
  price: string;
  description: string;
  source: string;
  tags: string[];
}

export interface SupabaseEventRow {
  id: string;
  title: string;
  event_date: string;
  format: 'Online' | 'In person' | 'Hybrid' | string;
  city: string | null;
  country: string | null;
  country_code: string | null;
  price: string | null;
  description: string | null;
  source_name: string | null;
  tags: string[] | null;
}

export const aggregationWorkflow = [
  {
    title: 'Detect location',
    body: 'Use browser or manual location to determine the country and city bucket to query.',
  },
  {
    title: 'Collect sources',
    body: 'Pull from approved event feeds, studio calendars, and teacher submissions that are relevant to that location.',
  },
  {
    title: 'Normalize and dedupe',
    body: 'Convert everything into one event schema, remove duplicates, and score event quality.',
  },
  {
    title: 'Store by region',
    body: 'Persist events by country and city so the same-location audience can reuse the curated list quickly.',
  },
];

const allEvents: EventListing[] = [
  {
    id: 'dubai-sunrise-vinyasa',
    title: 'Sunrise Vinyasa on the Creek',
    date: '2026-05-10',
    format: 'In person',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    price: 'AED 90',
    description: 'A gentle sunrise class with mobility work and breath-led flow.',
    source: 'Curated studio calendar',
    tags: ['Vinyasa', 'Sunrise', 'Local'],
  },
  {
    id: 'london-yin-evening',
    title: 'London Yin & Sound Bath',
    date: '2026-05-14',
    format: 'In person',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    price: '£18',
    description: 'An evening reset with long holds, props, and guided relaxation.',
    source: 'Teacher submission',
    tags: ['Yin', 'Recovery', 'Wellness'],
  },
  {
    id: 'nyc-ashtanga-open',
    title: 'New York Ashtanga Open Practice',
    date: '2026-05-17',
    format: 'In person',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    price: '$25',
    description: 'A self-practice session for Mysore-style practitioners and visitors.',
    source: 'Partner studio feed',
    tags: ['Ashtanga', 'Mysore', 'Local'],
  },
  {
    id: 'berlin-breathwork-online',
    title: 'Berlin Breathwork for Busy Weeks',
    date: '2026-05-20',
    format: 'Online',
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    price: 'Free',
    description: 'A short online session designed for remote workers and city life.',
    source: 'Event API',
    tags: ['Breathwork', 'Online', 'Free'],
  },
  {
    id: 'global-yoga-nidra',
    title: 'Global Yoga Nidra Reset',
    date: '2026-05-12',
    format: 'Online',
    city: 'Online',
    country: 'Global',
    countryCode: 'GL',
    price: 'Free',
    description: 'A universally accessible rest practice suitable for any time zone.',
    source: 'YogaCandy editorial curation',
    tags: ['Yoga Nidra', 'Global', 'On-demand'],
  },
];

function matchesLocation(event: EventListing, countryCode?: string) {
  if (!countryCode) return event.countryCode === 'GL' || event.format === 'Online';
  return event.countryCode === 'GL' || event.format === 'Online' || event.countryCode === countryCode.toUpperCase();
}

export function getEventsForLocationFromDataset(events: EventListing[], countryCode?: string, limit = 6): EventListing[] {
  return events
    .filter((event) => matchesLocation(event, countryCode))
    .sort((a, b) => {
      const aLocal = countryCode && a.countryCode === countryCode.toUpperCase() ? 1 : 0;
      const bLocal = countryCode && b.countryCode === countryCode.toUpperCase() ? 1 : 0;
      if (aLocal !== bLocal) return bLocal - aLocal;
      if (a.format !== b.format) return a.format === 'Online' ? 1 : -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .slice(0, limit);
}

export function getEventsForLocation(countryCode?: string, limit = 6): EventListing[] {
  return getEventsForLocationFromDataset(allEvents, countryCode, limit);
}

export function mapSupabaseEventRow(row: SupabaseEventRow): EventListing {
  return {
    id: row.id,
    title: row.title,
    date: row.event_date,
    format: row.format === 'Hybrid' ? 'Hybrid' : row.format === 'Online' ? 'Online' : 'In person',
    city: row.city ?? 'Online',
    country: row.country ?? 'Global',
    countryCode: row.country_code ?? 'GL',
    price: row.price ?? 'Free',
    description: row.description ?? '',
    source: row.source_name ?? 'Event API',
    tags: row.tags ?? [],
  };
}

export function getAllEvents() {
  return [...allEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
