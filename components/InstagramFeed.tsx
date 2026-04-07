'use client';

import { isInstagramPostUrl, publicSiteConfig } from '@/app/config/public';
import { useEffect, useRef } from 'react';

const configuredPosts = publicSiteConfig.instagramPosts.filter((post) => isInstagramPostUrl(post.url));
const ACCOUNT = 'yogacandyae';
const PROFILE_URL = publicSiteConfig.instagramProfileUrl;

function EmbedPost({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Re-process embeds after mount (Instagram embed.js may already be loaded)
    if (typeof window !== 'undefined' && (window as { instgrm?: { Embeds?: { process(): void } } }).instgrm?.Embeds) {
      (window as { instgrm?: { Embeds?: { process(): void } } }).instgrm!.Embeds!.process();
    }
  }, []);

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ maxWidth: '100%', minWidth: '280px', width: '100%' }}
      />
    </div>
  );
}

export default function InstagramFeed() {
  // Load Instagram embed script once
  useEffect(() => {
    if (document.getElementById('instagram-embed-script')) return;
    const script = document.createElement('script');
    script.id = 'instagram-embed-script';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const hasPosts = configuredPosts.length > 0;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-3 border border-pink-100">
              Instagram
            </span>
            <h2 className="text-3xl font-bold">@{ACCOUNT}</h2>
            <p className="text-gray-500 mt-1 text-sm">Follow us for daily yoga inspiration.</p>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Follow on Instagram
          </a>
        </div>

        {hasPosts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {configuredPosts.map((post) => (
              <EmbedPost key={post.id} url={post.url} />
            ))}
          </div>
        ) : (
          // Placeholder grid until post URLs are added
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <a
                key={i}
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 border border-pink-100 flex flex-col items-center justify-center gap-2 hover:opacity-80 transition-opacity group"
              >
                <svg className="w-8 h-8 text-pink-400 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-xs text-pink-500 font-medium">View post</span>
              </a>
            ))}
            <p className="col-span-full text-center text-xs text-gray-400 mt-2">
              Add real post URLs via{' '}
              <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_INSTAGRAM_POST_URL_1..6</code>{' '}
              to display live embeds.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
