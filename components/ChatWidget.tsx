"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLocation } from "@/app/context/LocationContext";
import {
  canUseBuiltInLanguageModel,
  createBuiltInLanguageModelSession,
} from "@/lib/browserLanguageModel";
import { normalizeProfileFromMetadata } from "@/lib/profile";
import {
  AI_PROVIDER_OPTIONS,
  AI_CLOUD_MODEL_OPTIONS,
  buildAIContextSummary,
  buildGroundedChatPrompt,
  defaultAIUserSettings,
  normalizeAIUserSettings,
  type AIUserSettings,
  type AIProviderPreference,
} from "@/lib/aiContext";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Message {
  role: "assistant" | "user";
  content: string;
}

type Provider = "chrome-ai" | "gemini" | "openai" | "fallback";

function getProviderPriority(preference: AIProviderPreference): Provider[] {
  if (preference === "on-device") return ["chrome-ai"];
  if (preference === "gemini") return ["gemini"];
  if (preference === "openai") return ["openai"];
  return ["chrome-ai", "gemini", "openai"];
}

function getPageSignals(pathname: string) {
  const signals = ["YogaCandy site"];
  if (pathname === "/") signals.push("Home page");
  if (pathname.startsWith("/styles")) signals.push("Yoga styles catalog");
  if (pathname.startsWith("/events")) signals.push("Events listing");
  if (pathname.startsWith("/profile")) signals.push("User profile");
  if (pathname.startsWith("/community")) signals.push("Community area");
  return signals;
}

async function askChromeAI(prompt: string, systemPrompt: string): Promise<string> {
  const session = await createBuiltInLanguageModelSession({
    systemPrompt,
  });

  try {
    const reply = await session.prompt(prompt);
    return reply.trim() || "I couldn't generate a reply.";
  } finally {
    session.destroy();
  }
}

async function askGemini(messages: Message[], systemPrompt: string, modelId: string): Promise<string> {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  // Use v1 unless you specifically need v1beta-only experimental features.
  const url = `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${key}`;

  const contents = [
    ...messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "No response.";
}

async function askOpenAI(messages: Message[], systemPrompt: string): Promise<string> {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "No response.";
}

async function getReply(
  userMessage: string,
  history: Message[],
  providerPreference: AIProviderPreference,
  systemPrompt: string,
  cloudModelId: string,
): Promise<{ reply: string; usedProvider: Provider }> {
  const allMessages: Message[] = [...history, { role: "user", content: userMessage }];
  const providerOrder = getProviderPriority(providerPreference);
  const chromeAvailable = await canUseBuiltInLanguageModel();
  const explicitPreference = providerPreference !== "auto";

  for (const candidate of providerOrder) {
    try {
      if (candidate === "chrome-ai" && chromeAvailable) {
        return { reply: await askChromeAI(userMessage, systemPrompt), usedProvider: "chrome-ai" };
      }
      if (candidate === "gemini" && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        return { reply: await askGemini(allMessages, systemPrompt, cloudModelId), usedProvider: "gemini" };
      }
      if (candidate === "openai" && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        return { reply: await askOpenAI(allMessages, systemPrompt), usedProvider: "openai" };
      }
    } catch (err) {
      console.warn(`[ChatWidget] Provider "${candidate}" failed:`, err);
      if (explicitPreference) break;
    }
  }

  if (explicitPreference) {
    if (providerPreference === "on-device") {
      return {
        reply:
          "Quick take: On-device AI is unavailable here.\nWhy it fits: Your browser needs Chrome built-in AI support.\nNext step: Switch to Auto or use a cloud model.",
        usedProvider: "fallback",
      };
    }

    const configuredLabel = providerPreference === "gemini" ? "Gemini" : "OpenAI";
    return {
      reply:
        `Quick take: ${configuredLabel} is not ready right now.\nWhy it fits: The selected provider needs a valid API key and a supported model.\nNext step: Switch to Auto or pick a model your key can access.`,
      usedProvider: "fallback",
    };
  }

  return {
    reply:
      "Quick take: I’m not connected to an AI model yet.\nWhy it fits: Add a Gemini, Gemma, or OpenAI key, or enable on-device AI.\nNext step: Open AI Context and choose a provider.",
    usedProvider: "fallback",
  };
}

function getProviderSetupHint(provider: Provider): string | null {
  if (provider === "chrome-ai") return null;
  if (provider === "gemini") return null;
  if (provider === "openai") return null;

  const hasGeminiKey = Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const hasOpenAIKey = Boolean(process.env.NEXT_PUBLIC_OPENAI_API_KEY);

  if (hasGeminiKey || hasOpenAIKey) {
    return "The configured key could not be used in this browser session.";
  }

  return "Build-time env vars are missing. Set NEXT_PUBLIC_GEMINI_API_KEY or NEXT_PUBLIC_OPENAI_API_KEY in GitHub Actions and redeploy.";
}

function formatAssistantContent(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+\.\s*/, "").replace(/^[-*]\s*/, ""));

  return lines;
}

/* ─── YogaCandy logo avatar ──────────────────────────────────────────────── */
function YCAvatar({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="16" fill="#2563EB" />
      {/* Lotus petals */}
      <ellipse cx="16" cy="12" rx="3" ry="5" fill="white" opacity="0.9" transform="rotate(0 16 16)" />
      <ellipse cx="16" cy="12" rx="3" ry="5" fill="white" opacity="0.7" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="12" rx="3" ry="5" fill="white" opacity="0.7" transform="rotate(-60 16 16)" />
      <ellipse cx="16" cy="12" rx="3" ry="5" fill="white" opacity="0.5" transform="rotate(120 16 16)" />
      <ellipse cx="16" cy="12" rx="3" ry="5" fill="white" opacity="0.5" transform="rotate(-120 16 16)" />
      <ellipse cx="16" cy="12" rx="3" ry="5" fill="white" opacity="0.4" transform="rotate(180 16 16)" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="3" fill="white" />
    </svg>
  );
}

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

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function ChatWidget() {
  const pathname = usePathname();
  const { location } = useLocation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the YogaCandy Assistant. Ask me anything about yoga styles, finding classes, or building your practice. 🌿",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSettings, setAiSettings] = useState<AIUserSettings>(defaultAIUserSettings());
  const [profileSnapshot, setProfileSnapshot] = useState<UserProfileSnapshot | null>(null);
  const [provider, setProvider] = useState<Provider>("fallback");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: { unsubscribe: () => void } | null = null;

    const loadUserContext = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session?.user) {
        if (!cancelled) {
          setAiSettings(defaultAIUserSettings());
          setProfileSnapshot(null);
        }
        return;
      }

      const settings = normalizeAIUserSettings(session.user.user_metadata);
      if (!cancelled) setAiSettings(settings);

      if (!cancelled) {
        const profileMetadata = normalizeProfileFromMetadata(session.user.user_metadata);
        setProfileSnapshot({
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
    };

    void loadUserContext();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setAiSettings(defaultAIUserSettings());
        setProfileSnapshot(null);
        return;
      }

      void (async () => {
        const settings = normalizeAIUserSettings(session.user.user_metadata);
        if (!cancelled) setAiSettings(settings);

        if (!cancelled) {
          const profileMetadata = normalizeProfileFromMetadata(session.user.user_metadata);
          setProfileSnapshot({
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
    });
    subscription = data.subscription;

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const chromeAvailable = await canUseBuiltInLanguageModel();
      const providerOrder = getProviderPriority(aiSettings.providerPreference);
      const nextProvider = providerOrder.find((candidate) => {
        if (candidate === "chrome-ai") return chromeAvailable;
        if (candidate === "gemini") return Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        if (candidate === "openai") return Boolean(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
        return false;
      });

      if (!cancelled) {
        if (aiSettings.providerPreference === "auto") {
          setProvider(nextProvider ?? "fallback");
        } else {
          setProvider(nextProvider ?? "fallback");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [aiSettings.providerPreference]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    const updatedHistory = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);

    const systemPrompt = buildGroundedChatPrompt({
      profile: profileSnapshot
        ? {
            fullName: profileSnapshot.fullName ?? undefined,
            role: profileSnapshot.role ?? undefined,
            level: profileSnapshot.level ?? undefined,
            yogaGoals: profileSnapshot.yogaGoals ?? [],
            preferredStyles: profileSnapshot.preferredStyles ?? [],
            city: profileSnapshot.city ?? undefined,
            country: profileSnapshot.country ?? undefined,
            countryCode: profileSnapshot.countryCode ?? undefined,
          }
        : null,
      location: location
        ? {
            city: location.city,
            country: location.country,
            countryCode: location.countryCode,
          }
        : null,
      settings: aiSettings,
      page: {
        pathname,
        siteSignals: getPageSignals(pathname),
      },
      modelId: aiSettings.cloudModelId,
    });

    const { reply, usedProvider } = await getReply(
      userMessage,
      messages,
      aiSettings.providerPreference,
      systemPrompt,
      aiSettings.cloudModelId,
    );

    if (usedProvider !== provider) setProvider(usedProvider);

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setIsLoading(false);
  };

  const providerDotColor: Record<Provider, string> = {
    "chrome-ai": "bg-green-400",
    gemini: "bg-blue-400",
    openai: "bg-emerald-400",
    fallback: "bg-yellow-400",
  };

  const contextSummary = buildAIContextSummary(
    profileSnapshot
      ? {
          fullName: profileSnapshot.fullName ?? undefined,
          role: profileSnapshot.role ?? undefined,
          level: profileSnapshot.level ?? undefined,
          yogaGoals: profileSnapshot.yogaGoals ?? [],
          preferredStyles: profileSnapshot.preferredStyles ?? [],
          city: profileSnapshot.city ?? undefined,
          country: profileSnapshot.country ?? undefined,
          countryCode: profileSnapshot.countryCode ?? undefined,
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
      pathname,
      siteSignals: getPageSignals(pathname),
    },
  );
  const selectedModelLabel =
    AI_CLOUD_MODEL_OPTIONS.find((option) => option.value === aiSettings.cloudModelId)?.label ?? aiSettings.cloudModelId;
  const providerLabel =
    provider === "chrome-ai"
      ? "On-device AI · Gemini Nano"
      : provider === "gemini"
        ? `Gemini API · ${selectedModelLabel}`
        : provider === "openai"
          ? "OpenAI API"
          : "AI unavailable";

  return (
    <div id="ai-assistant" className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div
          className="bg-white border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            width: "min(92vw, 34rem)",
            height: "min(88vh, 52rem)",
            minWidth: "20rem",
            minHeight: "28rem",
            resize: "both",
          }}
        >
          <div className="bg-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <YCAvatar size={36} />
              <div>
                <h3 className="font-bold text-sm">YogaCandy Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${providerDotColor[provider]}`} />
                  <p className="text-[10px] text-gray-400">{providerLabel}</p>
                </div>
                {provider === "fallback" && (
                  <p className="mt-1 text-[10px] text-gray-500 max-w-[220px] leading-snug">
                    {getProviderSetupHint(provider)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="border-b border-gray-200 bg-gray-50 p-3 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-gray-700">AI Context</p>
                <p className="text-[10px] text-gray-500">Brief, grounded, profile-aware responses</p>
              </div>
              <button
                type="button"
                onClick={() => setConfigOpen((open) => !open)}
                className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 hover:border-black hover:text-black"
              >
                {configOpen ? "Hide settings" : "Show settings"}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-gray-500">
              <span className="font-semibold">Model: {selectedModelLabel}</span>
              <span className="truncate text-right">Active: {providerLabel}</span>
            </div>

            {configOpen && (
              <>
                <div className="mt-3 grid gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Provider</label>
                    <select
                      value={aiSettings.providerPreference}
                      onChange={(e) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          providerPreference: e.target.value as AIProviderPreference,
                        }))
                      }
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-700 focus:outline-none focus:border-black"
                      aria-label="Select AI provider preference"
                    >
                      {AI_PROVIDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Cloud model</label>
                    <select
                      value={aiSettings.cloudModelId}
                      onChange={(e) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          cloudModelId: e.target.value as AIUserSettings["cloudModelId"],
                        }))
                      }
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-700 focus:outline-none focus:border-black"
                      aria-label="Select cloud model"
                    >
                      {AI_CLOUD_MODEL_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-gray-200 bg-white px-2 py-1.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Profile</p>
                    <p className="text-[11px] text-gray-700 truncate">{contextSummary.profileSummary}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-2 py-1.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Location</p>
                    <p className="text-[11px] text-gray-700 truncate">{contextSummary.locationSummary}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-2 py-1.5 col-span-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Settings</p>
                    <p className="text-[11px] text-gray-700 leading-snug">{contextSummary.settingsSummary}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 flex-1 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm shadow-sm max-w-[85%] leading-relaxed whitespace-pre-line ${
                  msg.role === "assistant"
                    ? "bg-white border text-gray-700 self-start rounded-tl-none"
                    : "bg-black text-white self-end rounded-tr-none"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="space-y-2">
                    {formatAssistantContent(msg.content).map((line, index) => {
                      const match = line.match(/^(Quick take|Why it fits|Next step)\s*:\s*(.*)$/i);
                      if (match) {
                        return (
                          <div key={index} className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                              {match[1]}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed">{match[2] || '—'}</p>
                          </div>
                        );
                      }

                      return (
                        <p key={index} className="text-sm leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border p-3 rounded-xl rounded-tl-none shadow-sm self-start flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleChat} className="p-4 border-t flex gap-2 bg-white">
            <input
              className="flex-grow border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300"
              aria-label="Send"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all group flex items-center gap-2"
          aria-label="Open YogaCandy AI chat"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-medium text-sm">
            Ask YogaCandy AI
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
