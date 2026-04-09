"use client";
import { useState, useRef, useEffect } from "react";
import {
  canUseBuiltInLanguageModel,
  createBuiltInLanguageModelSession,
} from "@/lib/browserLanguageModel";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Message {
  role: "assistant" | "user";
  content: string;
}

type Provider = "chrome-ai" | "gemini" | "openai" | "fallback";

const SYSTEM_PROMPT =
  "You are the YogaCandy AI assistant. Answer briefly (2–5 sentences), clearly, and safely. " +
  "Focus on yoga styles, wellness, class selection, and general guidance. " +
  "Never give medical advice. If unsure, suggest speaking with a qualified teacher.";

async function askChromeAI(prompt: string): Promise<string> {
  const session = await createBuiltInLanguageModelSession({
    systemPrompt: SYSTEM_PROMPT,
  });

  try {
    const reply = await session.prompt(`${prompt}\n\nIf helpful, end with one follow-up question.`);
    return reply.trim() || "I couldn't generate a reply.";
  } finally {
    session.destroy();
  }
}

async function askGemini(messages: Message[]): Promise<string> {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

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
        parts: [{ text: SYSTEM_PROMPT }],
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

async function askOpenAI(messages: Message[]): Promise<string> {
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
        { role: "system", content: SYSTEM_PROMPT },
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
  provider: Provider,
): Promise<{ reply: string; usedProvider: Provider }> {
  const allMessages: Message[] = [...history, { role: "user", content: userMessage }];

  try {
    if (provider === "fallback") {
      if (await canUseBuiltInLanguageModel()) {
        return { reply: await askChromeAI(userMessage), usedProvider: "chrome-ai" };
      }
      if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        return { reply: await askGemini(allMessages), usedProvider: "gemini" };
      }
      if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        return { reply: await askOpenAI(allMessages), usedProvider: "openai" };
      }
    }

    if (provider === "chrome-ai") {
      return { reply: await askChromeAI(userMessage), usedProvider: "chrome-ai" };
    }
    if (provider === "gemini") {
      return { reply: await askGemini(allMessages), usedProvider: "gemini" };
    }
    if (provider === "openai") {
      return { reply: await askOpenAI(allMessages), usedProvider: "openai" };
    }
  } catch (err) {
    console.warn(`[ChatWidget] Provider "${provider}" failed:`, err);
    if (provider === "chrome-ai") {
      if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        try {
          return { reply: await askGemini(allMessages), usedProvider: "gemini" };
        } catch (fallbackErr) {
          console.warn("[ChatWidget] Gemini fallback also failed:", fallbackErr);
        }
      }
      if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        try {
          return { reply: await askOpenAI(allMessages), usedProvider: "openai" };
        } catch (fallbackErr) {
          console.warn("[ChatWidget] OpenAI fallback also failed:", fallbackErr);
        }
      }
    }
  }

  return {
    reply:
      "I'm not connected to an AI model right now. Please add a Gemini or OpenAI API key to enable chat — see the setup guide in /docs/ai-chat-setup.md.",
    usedProvider: "fallback",
  };
}

/* ─── Provider labels ────────────────────────────────────────────────────── */
const PROVIDER_LABELS: Record<Provider, string> = {
  "chrome-ai": "On-device AI · Gemini Nano",
  gemini: "Gemini AI",
  openai: "ChatGPT · GPT-4o mini",
  fallback: "AI not configured",
};

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

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the YogaCandy Assistant. Ask me anything about yoga styles, finding classes, or building your practice. 🌿",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>("fallback");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (await canUseBuiltInLanguageModel()) {
        if (!cancelled) setProvider("chrome-ai");
        return;
      }

      if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        if (!cancelled) setProvider("gemini");
        return;
      }

      if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        if (!cancelled) setProvider("openai");
        return;
      }

      if (!cancelled) setProvider("fallback");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

    const { reply, usedProvider } = await getReply(userMessage, messages, provider);

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

  return (
    <div id="ai-assistant" className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white border rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col">
          <div className="bg-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <YCAvatar size={36} />
              <div>
                <h3 className="font-bold text-sm">YogaCandy Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${providerDotColor[provider]}`} />
                  <p className="text-[10px] text-gray-400">{PROVIDER_LABELS[provider]}</p>
                </div>
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

          <div className="p-4 h-72 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm shadow-sm max-w-[85%] leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white border text-gray-700 self-start rounded-tl-none"
                    : "bg-black text-white self-end rounded-tr-none"
                }`}
              >
                {msg.content}
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
