'use client';

import { useState } from 'react';
import { allStyles, type YogaStyle } from '@/app/data/styles';

// ── Chrome AI Prompt API (experimental, Chrome 127+) ──────────────────────────
declare global {
  interface Window {
    ai?: {
      languageModel?: {
        create(opts?: { systemPrompt?: string }): Promise<{
          prompt(text: string): Promise<string>;
          destroy(): void;
        }>;
        capabilities?(): Promise<{ available: string }>;
      };
    };
  }
}

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

// ── Rule-based scoring ────────────────────────────────────────────────────────
function scoreStyleRuleBased(style: YogaStyle, answers: Record<string, string>): number {
  let score = 0;
  const s = style.scores;

  // goal
  if (answers.goal === 'flexibility') score += s.flexibility * 2;
  if (answers.goal === 'strength') score += s.strength * 2;
  if (answers.goal === 'stress' || answers.goal === 'spiritual') score += s.mind * 2 + s.breath;
  if (answers.goal === 'weight') score += s.strength + s.flexibility;

  // activity level — penalise advanced styles for sedentary users
  if (answers.activity === 'sedentary' && style.level.includes('Advanced')) score -= 6;
  if (answers.activity === 'very_active' && style.level === 'Beginner') score -= 3;

  // health
  if (answers.health === 'back' || answers.health === 'recovery') {
    if (['iyengar', 'viniyoga', 'restorative', 'yin-yoga'].includes(style.slug)) score += 8;
    if (['ashtanga', 'power-yoga'].includes(style.slug)) score -= 6;
  }
  if (answers.health === 'anxiety') score += s.mind + s.breath;

  // time commitment
  if (answers.time === 'short' && style.slug === 'bikram-hot-yoga') score -= 4; // 90-min fixed
  if (answers.time === 'long') score += s.strength;

  // vibe
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
async function getAIRecommendation(answers: Record<string, string>): Promise<string[] | null> {
  try {
    const cap = await window.ai?.languageModel?.capabilities?.();
    if (!cap || cap.available === 'no') return null;

    const session = await window.ai!.languageModel!.create({
      systemPrompt: `You are a knowledgeable yoga advisor. You must respond ONLY with a JSON array of exactly 3 yoga style slugs chosen from this list: ${allStyles.map((s) => s.slug).join(', ')}. No other text.`,
    });

    const prefs = Object.entries(answers)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    const raw = await session.prompt(`User preferences — ${prefs}. Return the 3 best-matching yoga style slugs as a JSON array.`);
    session.destroy();

    const parsed = JSON.parse(raw.trim());
    if (Array.isArray(parsed) && parsed.every((s) => typeof s === 'string')) return parsed;
    return null;
  } catch {
    return null;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StyleRecommender() {
  const [step, setStep] = useState(0); // 0 = intro, 1..N = questions, N+1 = result
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<YogaStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedAI, setUsedAI] = useState(false);

  const totalSteps = QUESTIONS.length;
  const currentQ = QUESTIONS[step - 1];
  const isDone = step > totalSteps;

  async function handleAnswer(value: string) {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (step === totalSteps) {
      setLoading(true);
      // Try on-device AI first
      const aiSlugs = await getAIRecommendation(newAnswers);
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
      // Fallback: rule-based
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

  // ── Intro ──
  if (step === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center">
        <div className="text-4xl mb-4">🧘</div>
        <h2 className="text-2xl font-bold mb-2">Find Your Perfect Style</h2>
        <p className="text-blue-100 mb-6 max-w-sm mx-auto text-sm leading-relaxed">
          Answer 5 quick questions and our{' '}
          {typeof window !== 'undefined' && window.ai?.languageModel
            ? 'on-device AI'
            : 'smart engine'}{' '}
          will match you with the ideal yoga style.
        </p>
        <button
          onClick={() => setStep(1)}
          className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
        >
          Start Quiz →
        </button>
      </div>
    );
  }

  // ── Loading ──
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

  // ── Results ──
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

  // ── Question ──
  const progress = ((step - 1) / totalSteps) * 100;
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      {/* Progress bar */}
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
