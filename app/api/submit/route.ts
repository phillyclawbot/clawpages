export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import sql, { ensureTables } from "@/lib/db";
import { categoryList } from "@/lib/categories";

export async function POST(req: NextRequest) {
  await ensureTables();

  const body = await req.json();
  const { name, url, description, category, tags } = body;

  if (!name || !url || !description || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!categoryList.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const result = await sql`
      INSERT INTO cp_listings (name, url, description, category, tags, submitted_by, is_active)
      VALUES (${name}, ${url}, ${description}, ${category}, ${tags || []}, 'user', false)
      RETURNING id
    `;
    return NextResponse.json({ ok: true, id: result[0].id });
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json({ error: "URL already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
