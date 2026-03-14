import Link from "next/link";
import { notFound } from "next/navigation";
import sql, { ensureTables } from "@/lib/db";
import { categories, Category } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  await ensureTables();

  const slug = params.slug as Category;
  const cat = categories[slug];
  if (!cat) notFound();

  const listings = await sql`
    SELECT * FROM cp_listings
    WHERE category = ${slug} AND is_active = true
    ORDER BY featured DESC, discovered_at DESC
  `;

  return (
    <div>
      <Link href="/" className="text-sm text-[#666] hover:underline">&larr; Back to ClawPages</Link>

      <div className="mt-4 mb-8">
        <h1 className="font-serif text-4xl font-bold">
          <span className="mr-2">{cat.icon}</span>{cat.label}
        </h1>
        <p className="text-[#666] mt-1">{cat.description}</p>
        <div className="dotted-sep mt-4" />
      </div>

      {listings.length === 0 ? (
        <p className="text-[#666] italic">No listings in this category yet. <Link href="/submit" className="underline">Submit one!</Link></p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="yellow-card p-4 hover:shadow-md transition-shadow">
              {listing.featured && <span className="text-xs font-bold text-[#FF8F00]">⭐ FEATURED</span>}
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
      )}
    </div>
  );
}
