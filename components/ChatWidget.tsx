"use client";
import { useState } from "react";

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("Hi! I'm AJ. How can I help with your yoga journey today?");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResponse("Thinking...");
    try {
      const res = await fetch("http://yogacandy.info:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResponse(data.message);
    } catch (err) {
      setResponse("Error connecting to AI Engine. Please try again later.");
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div id="ai-assistant" className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white border rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col transition-all duration-300">
          <div className="bg-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">AJ</div>
              <div>
                <h3 className="font-bold text-sm">YogaCandy Assistant</h3>
                <p className="text-[10px] text-gray-400">Online & Ready</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            <div className="bg-white p-3 rounded-lg border text-sm text-gray-700 shadow-sm self-start max-w-[85%]">
              {response}
            </div>
          </div>
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
              disabled={isLoading}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-400"
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
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-medium">Chat with AJ</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
