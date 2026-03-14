import Link from "next/link";
import { notFound } from "next/navigation";
import sql, { ensureTables } from "@/lib/db";
import { categories, Category } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: { id: string } }) {
  await ensureTables();

  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const results = await sql`SELECT * FROM cp_listings WHERE id = ${id} AND is_active = true`;
  const listing = results[0];
  if (!listing) notFound();

  const cat = categories[listing.category as Category];

  return (
    <div>
      <Link href="/" className="text-sm text-[#666] hover:underline">&larr; Back to ClawPages</Link>

      <div className="mt-6 bg-white border-2 border-[#FDD835] rounded-lg p-8 shadow-md max-w-2xl">
        {listing.featured && (
          <span className="inline-block mb-2 text-sm font-bold text-[#FF8F00]">⭐ Featured Listing</span>
        )}
        <h1 className="font-serif text-4xl font-bold">{listing.name}</h1>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-[#666] hover:underline block mt-1"
        >
          {listing.url}
        </a>

        <p className="mt-4 text-lg leading-relaxed">{listing.description}</p>

        <div className="mt-4 flex items-center gap-3">
          {cat && (
            <Link
              href={`/category/${listing.category}`}
              className="category-btn px-3 py-1 rounded text-xs"
            >
              {cat.icon} {cat.label}
            </Link>
          )}
          <div className="flex gap-1 flex-wrap">
            {(listing.tags || []).map((tag: string) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-[#666]">
          Discovered {new Date(listing.discovered_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 category-btn px-6 py-3 rounded text-sm"
        >
          Visit Site &rarr;
        </a>
      </div>
    </div>
  );
}
