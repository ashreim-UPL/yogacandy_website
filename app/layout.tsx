import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YogaCandy AI - Modern Yoga Community",
  description: "Experience the future of yoga with AI-powered recommendations, community events, and teacher registration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black font-sans">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="YogaCandy Logo" className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">YogaCandy</span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-medium">
              <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
              <a href="/styles" className="hover:text-blue-600 transition-colors">Yoga Styles</a>
              <a href="/community" className="hover:text-blue-600 transition-colors">Community</a>
              <a href="#ai-assistant" className="hover:text-blue-600 transition-colors">AI Assistant</a>
            </nav>
            <div className="flex gap-4">
              <button className="text-sm font-medium hover:text-blue-600">Login</button>
              <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="border-t bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.svg" alt="YogaCandy Logo" className="h-6 w-6" />
                <span className="font-bold text-lg">YogaCandy</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs">
                Empowering your yoga journey through AI-driven insights and a vibrant community.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/styles" className="hover:text-black">Yoga Styles</a></li>
                <li><a href="/community" className="hover:text-black">Events</a></li>
                <li><a href="/community" className="hover:text-black">For Teachers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="https://instagram.com/yogacandy" className="hover:text-black">Instagram</a></li>
                <li><a href="#" className="hover:text-black">Contact Us</a></li>
                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} YogaCandy. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
