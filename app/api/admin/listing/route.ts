import { NextRequest, NextResponse } from "next/server";
import sql, { ensureTables } from "@/lib/db";
import { categoryList } from "@/lib/categories";

export async function POST(req: NextRequest) {
  await ensureTables();

  const auth = req.headers.get("authorization");
  if (auth !== "Bearer clawpages-admin-001") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");

  // Approve/reject actions
  if (action && id) {
    const listingId = parseInt(id, 10);
    if (action === "approve") {
      await sql`UPDATE cp_listings SET is_active = true, submitted_by = 'phillybot' WHERE id = ${listingId}`;
      return NextResponse.json({ ok: true });
    } else if (action === "reject") {
      await sql`DELETE FROM cp_listings WHERE id = ${listingId}`;
      return NextResponse.json({ ok: true });
    }
  }

  // Direct add
  const body = await req.json();
  const { name, url, description, category, tags, featured } = body;

  if (!name || !url || !description || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!categoryList.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const result = await sql`
      INSERT INTO cp_listings (name, url, description, category, tags, featured, submitted_by, is_active)
      VALUES (${name}, ${url}, ${description}, ${category}, ${tags || []}, ${featured || false}, 'phillybot', true)
      RETURNING id
    `;
    return NextResponse.json({ ok: true, id: result[0].id });
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json({ error: "URL already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add listing" }, { status: 500 });
  }
}
