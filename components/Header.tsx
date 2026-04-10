"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/");
  }

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  const avatarLetter = user?.user_metadata?.full_name?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase()
    ?? "?";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/styles", label: "Yoga Styles" },
    { href: "/events", label: "Events" },
    { href: "/community", label: "Community" },
  ];

  return (
    <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center group">
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

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 group"
                aria-label="User menu"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  {avatarLetter}
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user.user_metadata?.full_name ?? user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    <span>👤</span> My Profile
                  </Link>
                  <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    <span>🏠</span> Dashboard
                  </Link>
                  <Link href="/events" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    <span>📅</span> My Events
                  </Link>
                  {user.user_metadata?.role === "teacher" && (
                    <Link href="/admin/events" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                      <span>🛠️</span> Manage Events
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signup?mode=login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Join Community
              </Link>
            </>
          )}
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
              {user ? (
                <>
                  <div className="px-2 py-2 text-sm text-gray-500">
                    Signed in as <span className="font-medium text-black">{user.user_metadata?.full_name ?? user.email}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 px-2 text-sm hover:text-blue-600">
                    🏠 Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="py-2 px-2 text-sm hover:text-blue-600">
                    👤 My Profile
                  </Link>
                  <button onClick={handleSignOut} className="text-left py-2 px-2 text-sm text-red-600 hover:text-red-800">
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signup?mode=login" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 px-2 font-medium hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-black text-white px-4 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Community
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
