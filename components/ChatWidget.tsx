"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

function supportsOnDeviceAI() {
  return typeof window !== "undefined" && Boolean(window.ai?.languageModel?.create);
}

async function generateOnDeviceReply(prompt: string) {
  if (!supportsOnDeviceAI()) {
    return {
      reply:
        "On-device AI is not available in this browser yet. This chat will switch to Gemini Nano when supported, and we will connect a hosted LLM later.",
      usedAI: false,
    };
  }

  try {
    const session = await window.ai!.languageModel!.create({
      systemPrompt:
        "You are YogaCandy's yoga assistant. Reply briefly, clearly, and safely. Focus on yoga, wellness, class selection, and general guidance. Do not claim to be a medical professional. If the user asks for something you cannot do locally, say that on-device AI is limited and offer a short practical alternative.",
    });

    const reply = await session.prompt(
      `User message: ${prompt}\n\nRespond in 2-5 sentences. If useful, include one follow-up question.`,
    );
    session.destroy();

    return { reply: reply.trim() || "I could not generate a response.", usedAI: true };
  } catch {
    return {
      reply:
        "I could not use the on-device model right now. Gemini Nano is only available in supported Chrome builds, so I can keep answers simple until a hosted LLM is connected.",
      usedAI: false,
    };
  }
}

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm AJ. I can answer with on-device AI when Gemini Nano is available. If not, I’ll tell you and keep things simple for now.",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAiAvailable(supportsOnDeviceAI());
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    const { reply } = await generateOnDeviceReply(userMessage);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setIsLoading(false);
  };

  return (
    <div id="ai-assistant" className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white border rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">
                AJ
              </div>
              <div>
                <h3 className="font-bold text-sm">YogaCandy Assistant</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <p className="text-[10px] text-gray-400">
                    {aiAvailable ? "On-device AI ready" : "Gemini Nano unavailable"}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages */}
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
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleChat} className="p-4 border-t flex gap-2 bg-white">
            <input
              className="flex-grow border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all group flex items-center gap-2"
          aria-label="Open chat"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-medium">
            Chat with AJ
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
