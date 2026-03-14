export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import sql, { ensureTables } from "@/lib/db";

const SEARCH_QUERIES = [
  "site:vercel.app openclaw",
  "openclaw bot project",
  "built with openclaw",
  "openclaw.ai project",
  "openclaw app",
];

const BRAVE_TOKEN = "BSAerSnv5c4X4VwYxrxeUjjJnLFwRMi";

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("bot") || text.includes("social") || text.includes("feed")) return "social";
  if (text.includes("game") || text.includes("play") || text.includes("pixel")) return "games";
  if (text.includes("ai") || text.includes("gpt") || text.includes("llm") || text.includes("agent")) return "ai";
  if (text.includes("art") || text.includes("music") || text.includes("creative") || text.includes("design")) return "creative";
  if (text.includes("community") || text.includes("forum") || text.includes("directory")) return "community";
  if (text.includes("tool") || text.includes("util") || text.includes("dev") || text.includes("api")) return "tools";
  return "personal";
}

export async function POST(req: NextRequest) {
  await ensureTables();

  const auth = req.headers.get("authorization");
  if (auth !== "Bearer clawpages-cron-001") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Pick 2-3 random queries
  const shuffled = [...SEARCH_QUERIES].sort(() => Math.random() - 0.5);
  const queries = shuffled.slice(0, 3);

  let totalResults = 0;
  let newAdded = 0;
  const newListings: any[] = [];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
        { headers: { "X-Subscription-Token": BRAVE_TOKEN, Accept: "application/json" } }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const results = data.web?.results || [];
      totalResults += results.length;

      for (const r of results) {
        const url = r.url;
        if (!url) continue;

        // Check if already exists
        const existing = await sql`SELECT id FROM cp_listings WHERE url = ${url}`;
        if (existing.length > 0) continue;

        const name = r.title || url;
        const description = r.description || "An OpenClaw project discovered by PhillyBot.";
        const category = detectCategory(name, description);

        try {
          const inserted = await sql`
            INSERT INTO cp_listings (name, url, description, category, tags, submitted_by, is_active)
            VALUES (${name}, ${url}, ${description}, ${category}, ARRAY['openclaw', 'discovered'], 'phillybot', true)
            RETURNING *
          `;
          newAdded++;
          newListings.push(inserted[0]);
        } catch {
          // Skip duplicates or errors
        }
      }

      // Log search
      await sql`
        INSERT INTO cp_search_log (query, results_found, new_added)
        VALUES (${query}, ${results.length}, ${newAdded})
      `;
    } catch {
      // Skip failed searches
    }
  }

  // Pick daily highlight
  let pick = null;
  if (newListings.length > 0) {
    const chosen = newListings[Math.floor(Math.random() * newListings.length)];
    try {
      await sql`
        INSERT INTO cp_daily_picks (listing_id, pick_date, reason)
        VALUES (${chosen.id}, CURRENT_DATE, ${"Freshly discovered by PhillyBot's daily crawl!"})
        ON CONFLICT (pick_date) DO NOTHING
      `;
      pick = chosen;
    } catch {
      // Already have a pick for today
    }
  } else {
    // Pick from existing featured if no new listings
    const featured = await sql`
      SELECT * FROM cp_listings WHERE featured = true AND is_active = true ORDER BY RANDOM() LIMIT 1
    `;
    if (featured[0]) {
      try {
        await sql`
          INSERT INTO cp_daily_picks (listing_id, pick_date, reason)
          VALUES (${featured[0].id}, CURRENT_DATE, ${"A featured OpenClaw classic worth revisiting!"})
          ON CONFLICT (pick_date) DO NOTHING
        `;
        pick = featured[0];
      } catch {
        // Already have a pick
      }
    }
  }

  return NextResponse.json({ searched: totalResults, new: newAdded, pick });
}
