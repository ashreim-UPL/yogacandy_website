"use client";
import { useState } from "react";
import type { Metadata } from "next";

// Note: metadata export is handled via a separate server component pattern;
// since this page is client-side, SEO tags are set via layout metadata defaults.

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Opens mailto as a lightweight contact method for a static site
    const mailto = `mailto:hello@yogacandy.info?subject=${encodeURIComponent(form.subject || "YogaCandy Enquiry")}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;
    window.location.href = mailto;
    setSubmitted(true);
  }

  const topics = [
    { icon: "🧘", label: "General Enquiry" },
    { icon: "🏫", label: "Studio Partnership" },
    { icon: "👩‍🏫", label: "Teacher / Trainer Listing" },
    { icon: "📰", label: "Press & Media" },
    { icon: "🐛", label: "Bug Report" },
    { icon: "🔒", label: "Privacy / Data Request" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-4">
          Contact Us
        </span>
        <h1 className="text-4xl font-extrabold mb-4">Get in Touch</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Whether you&apos;re a studio owner, teacher, journalist, or practitioner — we&apos;d love to hear from you.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div>
          <h2 className="text-2xl font-bold mb-6">How can we help?</h2>
          <div className="space-y-4 mb-10">
            {topics.map((t) => (
              <div key={t.label} className="flex items-center gap-3 text-gray-700">
                <span className="text-xl">{t.icon}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <p className="font-bold text-gray-800 mb-1">Email</p>
              <a href="mailto:hello@yogacandy.info" className="text-purple-600 hover:underline">
                hello@yogacandy.info
              </a>
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-1">Privacy / Data Requests</p>
              <a href="mailto:privacy@yogacandy.info" className="text-purple-600 hover:underline">
                privacy@yogacandy.info
              </a>
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-1">Instagram</p>
              <a
                href="https://instagram.com/yogacandyae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                @yogacandyae
              </a>
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-1">Based in</p>
              <p>Dubai, United Arab Emirates 🇦🇪</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Your email app should open!</h3>
              <p className="text-gray-600 text-sm">
                If it didn&apos;t, email us directly at{" "}
                <a href="mailto:hello@yogacandy.info" className="text-purple-600 hover:underline">
                  hello@yogacandy.info
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                >
                  <option value="">Select a topic…</option>
                  {topics.map((t) => (
                    <option key={t.label} value={t.label}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  placeholder="Tell us how we can help…"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Send Message →
              </button>
              <p className="text-xs text-gray-400 text-center">
                This opens your email client. We reply within 2 business days.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
