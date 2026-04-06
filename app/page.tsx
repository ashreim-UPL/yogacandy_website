"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("Waiting for AJ...");

  const handleChat = async () => {
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
      setResponse("Error connecting to AI Engine.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black">
      <h1 className="text-4xl font-bold mb-8">YogaCandy AI</h1>
      <div className="w-full max-w-md border p-6 rounded-lg shadow-lg">
        <p className="mb-4 text-gray-600">{response}</p>
        <input 
          className="w-full border p-2 mb-4 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button 
          onClick={handleChat}
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
        >
          Send to Agent
        </button>
      </div>
    </main>
  );
}