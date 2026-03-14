import Link from "next/link";
import sql, { ensureTables } from "@/lib/db";
import { categories, categoryList } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensureTables();

  const listings = await sql`
    SELECT * FROM cp_listings WHERE is_active = true ORDER BY discovered_at DESC LIMIT 10
  `;

  const dailyPick = await sql`
    SELECT dp.*, l.name, l.url, l.description, l.category, l.tags
    FROM cp_daily_picks dp
    JOIN cp_listings l ON dp.listing_id = l.id
    WHERE dp.pick_date = CURRENT_DATE
    LIMIT 1
  `;

  let pick = dailyPick[0];
  if (!pick) {
    const featured = await sql`
      SELECT *, NULL as reason FROM cp_listings WHERE featured = true AND is_active = true ORDER BY discovered_at DESC LIMIT 1
    `;
    if (featured[0]) {
      pick = { ...featured[0], reason: "A featured OpenClaw project worth checking out!" };
    }
  }

  const stats = await sql`
    SELECT COUNT(*) as total, COUNT(DISTINCT category) as cats FROM cp_listings WHERE is_active = true
  `;

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-3">📒 ClawPages</h1>
        <p className="text-xl text-[#666] font-serif italic">The Internet Yellow Pages for OpenClaw</p>
        <div className="dotted-sep mt-6 mx-auto max-w-md" />
      </div>

      {/* Today's Pick */}
      {pick && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold mb-4">⭐ Today&apos;s Pick</h2>
          <div className="bg-white border-2 border-[#FDD835] rounded-lg p-6 shadow-md">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold">{pick.name}</h3>
                <a href={pick.url} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-[#666] hover:underline">
                  {pick.url}
                </a>
                <p className="mt-2 text-[#1A1A1A]">{pick.description}</p>
                {pick.reason && (
                  <p className="mt-2 italic text-[#666]">&ldquo;{pick.reason}&rdquo;</p>
                )}
                <div className="flex gap-2 mt-3">
                  {(pick.tags || []).map((tag: string) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
              <a
                href={pick.url}
                target="_blank"
                rel="noopener noreferrer"
                className="category-btn px-5 py-2 rounded text-sm whitespace-nowrap"
              >
                Visit Site &rarr;
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Category Grid */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryList.map((slug) => {
            const cat = categories[slug];
            return (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className="category-btn px-4 py-4 rounded text-center text-sm"
              >
                <span className="text-2xl block mb-1">{cat.icon}</span>
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="dotted-sep mb-8" />

      {/* Recent Additions */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold mb-4">Recent Additions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="yellow-card p-4 hover:shadow-md transition-shadow">
              <h3 className="font-serif font-bold text-lg">{listing.name}</h3>
              <p className="font-mono text-xs text-[#666] truncate">{listing.url}</p>
              <p className="text-sm mt-2 text-[#1A1A1A] line-clamp-2">{listing.description}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {(listing.tags || []).map((tag: string) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-[#f5f0d0] rounded p-3 text-center text-sm text-[#666] font-bold">
        📋 {stats[0].total} listings &middot; {stats[0].cats} categories &middot; Updated daily
      </div>
    </div>
  );
}
