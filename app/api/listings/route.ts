import { NextRequest, NextResponse } from "next/server";
import sql, { ensureTables } from "@/lib/db";

export async function GET(req: NextRequest) {
  await ensureTables();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const pending = searchParams.get("pending");

  // Admin-only: get pending listings
  if (pending === "true") {
    const auth = req.headers.get("authorization");
    if (auth !== "Bearer clawpages-admin-001") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const results = await sql`
      SELECT * FROM cp_listings WHERE submitted_by = 'user' AND is_active = false ORDER BY discovered_at DESC
    `;
    return NextResponse.json(results);
  }

  let results;
  if (category && featured === "true") {
    results = await sql`SELECT * FROM cp_listings WHERE is_active = true AND category = ${category} AND featured = true ORDER BY discovered_at DESC`;
  } else if (category) {
    results = await sql`SELECT * FROM cp_listings WHERE is_active = true AND category = ${category} ORDER BY discovered_at DESC`;
  } else if (featured === "true") {
    results = await sql`SELECT * FROM cp_listings WHERE is_active = true AND featured = true ORDER BY discovered_at DESC`;
  } else {
    results = await sql`SELECT * FROM cp_listings WHERE is_active = true ORDER BY discovered_at DESC`;
  }

  return NextResponse.json(results);
}
