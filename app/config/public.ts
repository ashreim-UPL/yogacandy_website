export interface InstagramPostLink {
  id: string;
  label: string;
  url: string;
}

function normalizeUrl(value: string | undefined, fallback = "") {
  const trimmed = value?.trim();
  return trimmed && /^https?:\/\//i.test(trimmed) ? trimmed : fallback;
}

export function isInstagramPostUrl(url: string) {
  return /^https:\/\/(www\.)?instagram\.com\/(p|reel)\//i.test(url);
}

const instagramProfileUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL,
  "https://instagram.com/yogacandyae",
);

const instagramPosts: InstagramPostLink[] = [
  {
    id: "post-1",
    label: "Latest Post",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_1),
  },
  {
    id: "post-2",
    label: "Community Reel",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_2),
  },
  {
    id: "post-3",
    label: "Studio Feature",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_3),
  },
  {
    id: "post-4",
    label: "Practice Clip",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_4),
  },
  {
    id: "post-5",
    label: "Teacher Highlight",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_5),
  },
  {
    id: "post-6",
    label: "Community Moment",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_6),
  },
].filter((post) => Boolean(post.url));

export const publicSiteConfig = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  googleMapsLanguage: process.env.NEXT_PUBLIC_GOOGLE_MAPS_LANGUAGE?.trim() ?? "en-US",
  googleMapsRegion: process.env.NEXT_PUBLIC_GOOGLE_MAPS_REGION?.trim() ?? "US",
  instagramProfileUrl,
  instagramPosts,
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() ?? "ca-pub-6414589325394911",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim() ?? "",
};
