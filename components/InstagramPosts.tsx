import { isInstagramPostUrl, publicSiteConfig } from "@/app/config/public";

const configuredPosts = publicSiteConfig.instagramPosts.filter((post) => isInstagramPostUrl(post.url));

export default function InstagramPosts() {
  if (configuredPosts.length === 0) {
    return (
      <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-orange-50 p-8">
        <div className="flex items-center justify-between gap-4 flex-col sm:flex-row sm:items-end">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-600 bg-white/80 px-3 py-1 rounded-full mb-4 border border-pink-100">
              Instagram
            </span>
            <h2 className="text-3xl font-bold mb-2">Recent Posts</h2>
            <p className="text-gray-600 max-w-2xl">
              Add `NEXT_PUBLIC_INSTAGRAM_POST_URL_1..3` to surface real Instagram post or reel URLs here.
            </p>
          </div>
          <a
            href={publicSiteConfig.instagramProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors"
          >
            Open Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-orange-50 p-8">
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row sm:items-end mb-8">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-600 bg-white/80 px-3 py-1 rounded-full mb-4 border border-pink-100">
            Instagram
          </span>
          <h2 className="text-3xl font-bold mb-2">Recent Posts</h2>
          <p className="text-gray-600 max-w-2xl">
            Real post URLs are now driven from public config instead of hardcoded placeholders.
          </p>
        </div>
        <a
          href={publicSiteConfig.instagramProfileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-pink-700 hover:underline underline-offset-4"
        >
          Follow @yogacandy
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {configuredPosts.map((post, index) => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl bg-white/80 p-6 border border-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 mb-5 flex items-end p-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">
                Post {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-lg">{post.label}</div>
                <div className="text-sm text-gray-500">Open on Instagram</div>
              </div>
              <span className="text-pink-600 font-bold group-hover:translate-x-1 transition-transform">↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
