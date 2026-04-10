"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { allStyles, type YogaStyle } from '@/app/data/styles';
import {
  createBuiltInLanguageModelSession,
  getBuiltInLanguageModelAvailability,
} from '@/lib/browserLanguageModel';
import {
  buildAIContextSummary,
  buildStyleRecommendationPrompt,
  defaultAIUserSettings,
  normalizeAIUserSettings,
  type AIUserSettings,
} from '@/lib/aiContext';
import { normalizeProfileFromMetadata } from '@/lib/profile';

// ── Questionnaire ─────────────────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'goal',
    text: 'What is your primary goal?',
    options: [
      { label: 'Get flexible', value: 'flexibility' },
      { label: 'Build strength', value: 'strength' },
      { label: 'Reduce stress', value: 'stress' },
      { label: 'Spiritual growth', value: 'spiritual' },
      { label: 'Lose weight', value: 'weight' },
    ],
  },
  {
    id: 'activity',
    text: 'How active are you right now?',
    options: [
      { label: 'Mostly sedentary', value: 'sedentary' },
      { label: 'Lightly active', value: 'light' },
      { label: 'Moderately active', value: 'moderate' },
      { label: 'Very active', value: 'very_active' },
    ],
  },
  {
    id: 'health',
    text: 'Any physical considerations?',
    options: [
      { label: 'None — I feel great', value: 'none' },
      { label: 'Back or spine issues', value: 'back' },
      { label: 'Joint pain', value: 'joints' },
      { label: 'Recovering from injury', value: 'recovery' },
      { label: 'Managing anxiety or stress', value: 'anxiety' },
    ],
  },
  {
    id: 'time',
    text: 'How long per session can you commit?',
    options: [
      { label: '20–30 minutes', value: 'short' },
      { label: '45–60 minutes', value: 'medium' },
      { label: '90+ minutes', value: 'long' },
    ],
  },
  {
    id: 'vibe',
    text: 'What atmosphere appeals to you?',
    options: [
      { label: 'Energetic & dynamic', value: 'dynamic' },
      { label: 'Calm & meditative', value: 'calm' },
      { label: 'Precise & technical', value: 'technical' },
      { label: 'Spiritual & chanting', value: 'spiritual' },
      { label: 'Hot & sweaty', value: 'hot' },
    ],
  },
];

interface UserProfileSnapshot {
  fullName?: string | null;
  role?: string | null;
  level?: string | null;
  yogaGoals?: string[] | null;
  preferredStyles?: string[] | null;
  city?: string | null;
  country?: string | null;
  countryCode?: string | null;
}

// ── Rule-based scoring ────────────────────────────────────────────────────────
function scoreStyleRuleBased(style: YogaStyle, answers: Record<string, string>): number {
  let score = 0;
  const s = style.scores;

  if (answers.goal === 'flexibility') score += s.flexibility * 2;
  if (answers.goal === 'strength') score += s.strength * 2;
  if (answers.goal === 'stress' || answers.goal === 'spiritual') score += s.mind * 2 + s.breath;
  if (answers.goal === 'weight') score += s.strength + s.flexibility;

  if (answers.activity === 'sedentary' && style.level.includes('Advanced')) score -= 6;
  if (answers.activity === 'very_active' && style.level === 'Beginner') score -= 3;

  if (answers.health === 'back' || answers.health === 'recovery') {
    if (['iyengar', 'viniyoga', 'restorative', 'yin-yoga'].includes(style.slug)) score += 8;
    if (['ashtanga', 'power-yoga'].includes(style.slug)) score -= 6;
  }
  if (answers.health === 'anxiety') score += s.mind + s.breath;

  if (answers.time === 'short' && style.slug === 'bikram-hot-yoga') score -= 4;
  if (answers.time === 'long') score += s.strength;

  if (answers.vibe === 'dynamic') score += s.strength + s.flexibility;
  if (answers.vibe === 'calm') score += s.mind + s.breath;
  if (answers.vibe === 'technical' && style.slug === 'iyengar') score += 6;
  if (answers.vibe === 'spiritual') score += s.mind * 2;
  if (answers.vibe === 'hot' && style.slug === 'bikram-hot-yoga') score += 10;

  return score;
}

function getTopStyles(answers: Record<string, string>, count = 3): YogaStyle[] {
  return [...allStyles]
    .map((s) => ({ style: s, score: scoreStyleRuleBased(s, answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.style);
}

// ── Chrome AI ─────────────────────────────────────────────────────────────────
async function getAIRecommendation(args: {
  answers: Record<string, string>;
  profile: UserProfileSnapshot | null;
  settings: AIUserSettings;
}): Promise<string[] | null> {
  const { answers, profile, settings } = args;

  if (settings.recommendationMode === 'deterministic') {
    return null;
  }

  try {
    const availability = await getBuiltInLanguageModelAvailability();
    if (availability === 'unavailable') return null;

    const systemPrompt = buildStyleRecommendationPrompt({
      profile,
      location: profile
        ? {
            city: profile.city ?? undefined,
            country: profile.country ?? undefined,
            countryCode: profile.countryCode ?? undefined,
          }
        : null,
      settings,
      page: {
        pathname: '/styles',
        siteSignals: ['Yoga styles catalog', 'Style recommender'],
      },
      answers,
      allowedSlugs: allStyles.map((s) => s.slug),
    });

    const session = await createBuiltInLanguageModelSession({
      systemPrompt,
    });

    try {
      const prefs = Object.entries(answers)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

      const raw = await session.prompt(`Rank the 3 best matching yoga style slugs for: ${prefs}`);

      const parsed = JSON.parse(raw.trim());
      if (Array.isArray(parsed) && parsed.every((s) => typeof s === 'string')) return parsed;
      return null;
    } finally {
      session.destroy();
    }
  } catch {
    return null;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StyleRecommender() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<YogaStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedAI, setUsedAI] = useState(false);
  const [hasOnDeviceAI, setHasOnDeviceAI] = useState(false);
  const [profile, setProfile] = useState<UserProfileSnapshot | null>(null);
  const [aiSettings, setAiSettings] = useState<AIUserSettings>(defaultAIUserSettings());

  const totalSteps = QUESTIONS.length;
  const currentQ = QUESTIONS[step - 1];
  const isDone = step > totalSteps;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const availability = await getBuiltInLanguageModelAvailability();
      if (!cancelled) setHasOnDeviceAI(availability !== 'unavailable');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const contextSummary = buildAIContextSummary(
    profile
      ? {
          fullName: profile.fullName ?? undefined,
          role: profile.role ?? undefined,
          level: profile.level ?? undefined,
          yogaGoals: profile.yogaGoals ?? [],
          preferredStyles: profile.preferredStyles ?? [],
          city: profile.city ?? undefined,
          country: profile.country ?? undefined,
          countryCode: profile.countryCode ?? undefined,
        }
      : null,
    null,
    aiSettings,
    {
      pathname: '/styles',
      siteSignals: ['Yoga styles catalog', 'Style recommender'],
    },
  );

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session?.user) return;

      if (!cancelled) {
        setAiSettings(normalizeAIUserSettings(session.user.user_metadata));
        const profileMetadata = normalizeProfileFromMetadata(session.user.user_metadata);
        setProfile({
          fullName: profileMetadata.full_name ?? undefined,
          role: profileMetadata.role ?? undefined,
          level: profileMetadata.level ?? undefined,
          yogaGoals: profileMetadata.yoga_goals ?? [],
          preferredStyles: profileMetadata.preferred_styles ?? [],
          city: profileMetadata.city ?? undefined,
          country: undefined,
          countryCode: profileMetadata.country_code ?? undefined,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAnswer(value: string) {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (step === totalSteps) {
      setLoading(true);
      const aiSlugs = await getAIRecommendation({
        answers: newAnswers,
        profile,
        settings: aiSettings,
      });
      if (aiSlugs) {
        const aiStyles = aiSlugs
          .map((slug) => allStyles.find((s) => s.slug === slug))
          .filter(Boolean) as YogaStyle[];
        if (aiStyles.length >= 2) {
          setResults(aiStyles);
          setUsedAI(true);
          setStep(totalSteps + 1);
          setLoading(false);
          return;
        }
      }
      setResults(getTopStyles(newAnswers));
      setLoading(false);
    }
    setStep(step + 1);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResults([]);
    setUsedAI(false);
    setLoading(false);
  }

  if (step === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center">
        <div className="text-4xl mb-4">🧘</div>
        <h2 className="text-2xl font-bold mb-2">Find Your Perfect Style</h2>
        <p className="text-blue-100 mb-6 max-w-sm mx-auto text-sm leading-relaxed">
          Answer 5 quick questions and our{' '}
          {hasOnDeviceAI ? 'on-device AI' : 'smart engine'}{' '}
          will match you with the ideal yoga style.
        </p>
        <div className="mb-6 rounded-2xl bg-white/10 border border-white/20 p-4 text-left text-xs text-blue-50">
          <p className="font-semibold mb-1">Live context</p>
          <p className="opacity-90">{contextSummary.profileSummary}</p>
          <p className="mt-1 opacity-80">{contextSummary.settingsSummary}</p>
        </div>
        <button
          onClick={() => setStep(1)}
          className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
        >
          Start Quiz →
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
        <div className="flex justify-center gap-1 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-gray-500 text-sm">Analysing your preferences…</p>
      </div>
    );
  }

  if (isDone && results.length > 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Your Top Matches</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {usedAI ? '✨ Powered by on-device AI' : 'Based on your preferences'}
            </p>
          </div>
          <button onClick={reset} className="text-xs text-blue-600 hover:underline">
            Retake quiz
          </button>
        </div>
        <div className="space-y-4">
          {results.map((style, i) => (
            <a
              key={style.slug}
              href={`/styles/${style.slug}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                {style.icon}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  {i === 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Best Match
                    </span>
                  )}
                  <span className="font-bold text-sm group-hover:text-blue-600 transition-colors">
                    {style.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{style.tagline}</p>
              </div>
              <span className="text-blue-600 text-sm flex-shrink-0">→</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  const progress = ((step - 1) / totalSteps) * 100;
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <div className="h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-2">
        Question {step} of {totalSteps}
      </p>
      <h3 className="text-lg font-bold mb-6">{currentQ.text}</h3>

      <div className="space-y-2">
        {currentQ.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleAnswer(opt.value)}
            className="w-full text-left px-5 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-medium"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {step > 1 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-4 text-xs text-gray-400 hover:text-gray-600"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
