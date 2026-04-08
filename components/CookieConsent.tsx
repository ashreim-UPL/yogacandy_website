"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if consent hasn't been recorded yet
    if (!localStorage.getItem("cookie_consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900">🍪 We use cookies</span>{" "}
          to personalise content and ads (via Google AdSense), provide social media features, and analyse traffic.
          By clicking <strong>Accept</strong> you consent to our use of cookies.{" "}
          <Link href="/privacy" className="text-purple-600 hover:underline font-medium">
            Learn more
          </Link>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-5 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
