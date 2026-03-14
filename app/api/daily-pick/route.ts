export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import sql, { ensureTables } from "@/lib/db";

export async function GET() {
  await ensureTables();

  const pick = await sql`
    SELECT dp.*, l.name, l.url, l.description, l.category, l.tags
    FROM cp_daily_picks dp
    JOIN cp_listings l ON dp.listing_id = l.id
    WHERE dp.pick_date = CURRENT_DATE
    LIMIT 1
  `;

  if (pick[0]) {
    return NextResponse.json(pick[0]);
  }

  // Fallback to most recent featured listing
  const featured = await sql`
    SELECT * FROM cp_listings WHERE featured = true AND is_active = true ORDER BY discovered_at DESC LIMIT 1
  `;

  if (featured[0]) {
    return NextResponse.json({ ...featured[0], reason: "A featured OpenClaw project worth checking out!" });
  }

  return NextResponse.json(null);
}
