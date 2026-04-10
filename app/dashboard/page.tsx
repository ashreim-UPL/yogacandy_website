"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "@/app/context/LocationContext";
import { allStyles, type YogaStyle } from "@/app/data/styles";
import { getArticlesForCountry, type Article } from "@/app/data/articles";
import {
  getEventsForLocation,
  getEventsForLocationFromDataset,
  mapSupabaseEventRow,
  type EventListing,
  type SupabaseEventRow,
} from "@/app/data/events";
import {
  AI_CLOUD_MODEL_OPTIONS,
  buildAIContextSummary,
  defaultAIUserSettings,
  normalizeAIUserSettings,
  type AIUserSettings,
} from "@/lib/aiContext";

type DashboardProfile = {
  id: string;
  full_name: string | null;
  role: string | null;
  level: string | null;
  yoga_goals: string[] | null;
  preferred_styles: string[] | null;
  country_code: string | null;
  city: string | null;
  bio: string | null;
  website_url: string | null;
  instagram_handle: string | null;
  onboarding_complete: boolean | null;
};

function scoreStyle(style: YogaStyle, profile: DashboardProfile | null, settings: AIUserSettings) {
  let score = 0;
  const goals = new Set([...(profile?.yoga_goals ?? []), settings.primaryGoal].filter(Boolean));
  const preferred = new Set((profile?.preferred_styles ?? []).map((item) => item.toLowerCase()));
  const physical = settings.physicalConsideration;
  const level = (profile?.level ?? "beginner").toLowerCase();

  if (preferred.has(style.slug) || preferred.has(style.name.toLowerCase())) score += 9;

  if (goals.has("flexibility")) score += style.scores.flexibility * 3;
  if (goals.has("strength")) score += style.scores.strength * 3;
  if (goals.has("stress") || goals.has("sleep")) score += style.scores.breath * 2 + style.scores.mind * 2;
  if (goals.has("spiritual")) score += style.scores.mind * 3;
  if (goals.has("community")) score += style.scores.mind + style.scores.breath;
  if (goals.has("injury")) score += style.scores.mind + style.scores.flexibility * 2;
  if (goals.has("weight")) score += style.scores.strength + style.scores.flexibility;

  if (level === "beginner") {
    if (style.level.includes("Advanced")) score -= 6;
    if (style.level.includes("Intermediate")) score -= 2;
  }

  if (level === "intermediate") {
    if (style.level.includes("Advanced")) score -= 1;
    if (style.level.includes("All Levels")) score += 1;
  }

  if (level === "teacher") score += style.scores.mind + style.scores.balance;

  if (physical !== "none") {
    if (["iyengar", "restorative", "yin-yoga", "hatha", "viniyoga"].includes(style.slug)) score += 7;
    if (["ashtanga", "power-yoga", "bikram-hot-yoga"].includes(style.slug)) score -= 3;
  }

  if (settings.recommendationMode === "deterministic") {
    score += 1;
  }

  return score;
}

function getRecommendationReason(style: YogaStyle, profile: DashboardProfile | null, settings: AIUserSettings) {
  const reasons: string[] = [];
  const goals = new Set([...(profile?.yoga_goals ?? []), settings.primaryGoal].filter(Boolean));
  const preferred = new Set((profile?.preferred_styles ?? []).map((item) => item.toLowerCase()));
  const physical = settings.physicalConsideration;

  if (preferred.has(style.slug) || preferred.has(style.name.toLowerCase())) reasons.push("matches your saved style preference");
  if (goals.has("stress") && ["yin-yoga", "restorative", "kundalini"].includes(style.slug)) reasons.push("supports a calmer practice");
  if (goals.has("flexibility") && ["yin-yoga", "hatha", "iyengar"].includes(style.slug)) reasons.push("builds flexibility safely");
  if (goals.has("strength") && ["ashtanga", "power-yoga"].includes(style.slug)) reasons.push("fits a stronger practice");
  if (physical !== "none" && ["iyengar", "restorative", "yin-yoga"].includes(style.slug)) reasons.push("works well around body considerations");
  if (reasons.length === 0) reasons.push("balances your goals and current profile");
  return reasons.slice(0, 2).join(" and ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatList(items: string[] | null | undefined) {
  if (!items?.length) return "Not set";
  return items.join(", ");
}

export default function DashboardPage() {
  const router = useRouter();
  const { location } = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [aiSettings, setAiSettings] = useState<AIUserSettings>(defaultAIUserSettings());
  const [liveEvents, setLiveEvents] = useState<EventListing[]>([]);
  const [liveFeedStatus, setLiveFeedStatus] = useState<"loading" | "loaded" | "empty">("loading");

  useEffect(() => {
    let cancelled = false;
    let subscription: { unsubscribe: () => void } | null = null;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session?.user) {
        router.replace("/auth/signup?next=/dashboard");
        return;
      }

      setAiSettings(normalizeAIUserSettings(session.user.user_metadata));

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select(
          "id,full_name,role,level,yoga_goals,preferred_styles,country_code,city,bio,website_url,instagram_handle,onboarding_complete",
        )
        .eq("id", session.user.id)
        .maybeSingle();

      if (!cancelled) {
        setProfile((profileData as DashboardProfile | null) ?? null);
        setLoading(false);
      }
    };

    void load();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/auth/signup?next=/dashboard");
        return;
      }

      void (async () => {
        setAiSettings(normalizeAIUserSettings(session.user.user_metadata));
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select(
            "id,full_name,role,level,yoga_goals,preferred_styles,country_code,city,bio,website_url,instagram_handle,onboarding_complete",
          )
          .eq("id", session.user.id)
          .maybeSingle();

        if (!cancelled) {
          setProfile((profileData as DashboardProfile | null) ?? null);
        }
      })();
    });
    subscription = data.subscription;

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id,title,event_date,format,city,country,country_code,price,description,source_name,tags")
        .order("event_date", { ascending: true });

      if (cancelled) return;

      if (error || !data) {
        setLiveEvents([]);
        setLiveFeedStatus("empty");
        return;
      }

      const rows = data as SupabaseEventRow[];
      const mapped = rows.map(mapSupabaseEventRow);
      setLiveEvents(mapped);
      setLiveFeedStatus(mapped.length > 0 ? "loaded" : "empty");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const dashboardCountry = location?.countryCode ?? profile?.country_code ?? undefined;

  const recommendationContext = buildAIContextSummary(
    profile
      ? {
          fullName: profile.full_name ?? undefined,
          role: profile.role ?? undefined,
          level: profile.level ?? undefined,
          yogaGoals: profile.yoga_goals ?? [],
          preferredStyles: profile.preferred_styles ?? [],
          city: profile.city ?? undefined,
          country: undefined,
          countryCode: profile.country_code ?? undefined,
          bio: profile.bio ?? undefined,
        }
      : null,
    location
      ? {
          city: location.city,
          country: location.country,
          countryCode: location.countryCode,
        }
      : null,
    aiSettings,
    {
      pathname: "/dashboard",
      siteSignals: ["Dashboard", "Personalized recommendations", "Profile overview"],
    },
  );

  const topStyles = useMemo(() => {
    return [...allStyles]
      .map((style) => ({ style, score: scoreStyle(style, profile, aiSettings) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => ({
        ...item.style,
        reason: getRecommendationReason(item.style, profile, aiSettings),
      }));
  }, [profile, aiSettings]);

  const recommendedArticles = useMemo(() => {
    return getArticlesForCountry(dashboardCountry ?? "GL", 3);
  }, [dashboardCountry]);

  const recommendedEvents =
    liveEvents.length > 0
      ? getEventsForLocationFromDataset(liveEvents, dashboardCountry, 3)
      : getEventsForLocation(dashboardCountry, 3);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
              Personal Dashboard
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome back"}
            </h1>
            <p className="text-gray-600 mt-3 max-w-2xl">
              Your profile, preferences, and recommended content are gathered here so you can start with one overview instead of hopping between pages.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/profile" className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50">
              Edit Profile
            </Link>
            <Link href="/styles" className="rounded-full bg-black text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800">
              Explore Styles
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <section className="xl:col-span-2 bg-black text-white rounded-3xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">Your snapshot</p>
                <h2 className="text-3xl font-bold mb-3">{profile?.onboarding_complete ? "Profile complete" : "Profile still needs a few details"}</h2>
                <p className="text-white/70 leading-relaxed">
                  {profile?.bio || "Use this dashboard to keep your profile, preferences, and recommendations aligned."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 min-w-[220px]">
                <p className="text-xs uppercase tracking-widest text-white/50">AI Mode</p>
                <p className="font-semibold">{recommendationContext.settingsSummary}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Profile Details</p>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">Role:</span> <span className="font-semibold capitalize">{profile?.role ?? "Not set"}</span></div>
              <div><span className="text-gray-400">Level:</span> <span className="font-semibold capitalize">{profile?.level ?? "Not set"}</span></div>
              <div><span className="text-gray-400">Location:</span> <span className="font-semibold">{profile?.city ? `${profile.city}${profile.country_code ? `, ${profile.country_code}` : ""}` : "Not set"}</span></div>
              <div><span className="text-gray-400">Goals:</span> <span className="font-semibold">{formatList(profile?.yoga_goals)}</span></div>
              <div><span className="text-gray-400">Styles:</span> <span className="font-semibold">{formatList(profile?.preferred_styles)}</span></div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Preferences</p>
                <h2 className="text-2xl font-bold">AI Settings</h2>
              </div>
              <Link href="/profile" className="text-sm font-semibold text-blue-600 hover:underline">
                Adjust
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Provider</p>
                <p className="font-semibold capitalize">{aiSettings.providerPreference}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Cloud model</p>
                <p className="font-semibold">
                  {AI_CLOUD_MODEL_OPTIONS.find((option) => option.value === aiSettings.cloudModelId)?.label ?? aiSettings.cloudModelId}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Response style</p>
                <p className="font-semibold capitalize">{aiSettings.responseStyle}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Recommendation mode</p>
                <p className="font-semibold capitalize">{aiSettings.recommendationMode}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Recommended</p>
                <h2 className="text-2xl font-bold">Yoga Styles</h2>
              </div>
              <Link href="/styles" className="text-sm font-semibold text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {topStyles.map((style) => (
                <Link
                  key={style.slug}
                  href={`/styles/${style.slug}`}
                  className="block rounded-2xl border border-gray-100 bg-gray-50 p-4 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{style.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{style.tagline}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
                      {style.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{style.reason}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Recommended</p>
                <h2 className="text-2xl font-bold">Content to read</h2>
              </div>
              <Link href="/articles" className="text-sm font-semibold text-blue-600 hover:underline">
                All reads
              </Link>
            </div>
            <div className="space-y-4">
              {recommendedArticles.map((article: Article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="block rounded-2xl border border-gray-100 bg-gray-50 p-4 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{article.readMin} min read</span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug">{article.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Recommended</p>
                <h2 className="text-2xl font-bold">Events nearby</h2>
              </div>
              <Link href="/events" className="text-sm font-semibold text-blue-600 hover:underline">
                Open events
              </Link>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {liveFeedStatus === "loaded"
                ? "Live event feed loaded from Supabase."
                : liveFeedStatus === "empty"
                  ? "No live Eventbrite rows found yet, so we are showing the curated fallback list."
                  : "Checking the live event feed..."}
            </p>
            <div className="space-y-4">
              {recommendedEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      {event.format}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{event.description}</p>
                  <p className="text-sm text-gray-700 mt-3">{event.city}, {event.country}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2">Live context</p>
              <h2 className="text-2xl font-bold mb-2">Your dashboard context is ready for chat</h2>
              <p className="text-white/80 text-sm leading-relaxed">{recommendationContext.settingsSummary}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/profile" className="rounded-full bg-white text-blue-700 px-5 py-2.5 text-sm font-semibold">
                Edit profile
              </Link>
              <Link href="/community" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold">
                Community hub
              </Link>
              <Link href="/events" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold">
                Browse events
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
