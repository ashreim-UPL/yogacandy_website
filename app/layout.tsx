import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { LocationProvider } from "@/app/context/LocationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://yogacandy.info';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'YogaCandy — AI-Powered Yoga Community',
    template: '%s — YogaCandy',
  },
  description:
    'Discover your perfect yoga style with AI-powered recommendations. Find local studios, explore 10+ yoga styles, join a global community of students and teachers.',
  keywords: ['yoga', 'yoga styles', 'yoga community', 'teacher training', 'AI yoga', 'yoga near me', 'YogaCandy'],
  authors: [{ name: 'YogaCandy' }],
  creator: 'YogaCandy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'YogaCandy',
    title: 'YogaCandy — AI-Powered Yoga Community',
    description: 'Find your perfect yoga style with AI. Explore studios, events, and teacher training near you.',
    images: [{ url: '/yogacandy-banner.svg', width: 1200, height: 630, alt: 'YogaCandy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YogaCandy — AI-Powered Yoga Community',
    description: 'Find your perfect yoga style with AI. Explore studios, events, and teacher training near you.',
    images: ['/yogacandy-banner.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: BASE_URL },
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
        <LocationProvider>
          <Header />
          <main className="flex-grow">{children}</main>

          <footer className="border-t bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="mb-4">
                  <img src="/yogacandy-banner.svg" alt="YogaCandy" className="h-8" />
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
                  <li><a href="/auth/signup" className="hover:text-black">For Teachers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-4">Connect</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="https://instagram.com/yogacandyae" className="hover:text-black">Instagram</a></li>
                  <li><a href="#" className="hover:text-black">Contact Us</a></li>
                  <li><a href="/privacy" className="hover:text-black">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} YogaCandy. All rights reserved.
            </div>
          </footer>
        </LocationProvider>
      </body>
    </html>
  );
}
