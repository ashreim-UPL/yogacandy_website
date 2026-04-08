"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/styles", label: "Yoga Styles" },
  { href: "/community", label: "Community" },
  { href: "/#ai-assistant", label: "AI Assistant" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = usePathname();

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  return (
    <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <img src="/yogacandy-banner.svg" alt="YogaCandy" className="h-10 group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors relative py-1 ${
                isActive(href)
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full"
                  : "hover:text-blue-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium hover:text-blue-600 transition-colors">Login</button>
          <Link
            href="/community"
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Join Community
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`py-3 px-2 rounded-lg transition-colors ${
                  isActive(href) ? "text-blue-600 bg-blue-50" : "hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="border-t mt-2 pt-4 flex flex-col gap-2">
              <button className="text-left py-2 px-2 font-medium hover:text-blue-600 transition-colors">
                Login
              </button>
              <Link
                href="/community"
                className="bg-black text-white px-4 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Community
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
