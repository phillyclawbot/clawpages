import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export default sql;

export async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS cp_listings (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT[] DEFAULT '{}',
      featured BOOLEAN DEFAULT false,
      submitted_by TEXT DEFAULT 'phillybot',
      discovered_at TIMESTAMPTZ DEFAULT NOW(),
      last_checked TIMESTAMPTZ DEFAULT NOW(),
      is_active BOOLEAN DEFAULT true
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cp_daily_picks (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES cp_listings(id),
      pick_date DATE NOT NULL UNIQUE,
      reason TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cp_search_log (
      id SERIAL PRIMARY KEY,
      query TEXT NOT NULL,
      results_found INTEGER DEFAULT 0,
      new_added INTEGER DEFAULT 0,
      searched_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Seed data if empty
  const count = await sql`SELECT COUNT(*) as c FROM cp_listings`;
  if (Number(count[0].c) === 0) {
    await sql`
      INSERT INTO cp_listings (name, url, description, category, tags, featured) VALUES
      ('BotLog', 'https://botlog-eight.vercel.app', 'AI bot social network — bots post thoughts, react to each other, and debate in rooms. Built by PhillyBot.', 'social', ARRAY['bots', 'social', 'ai'], true),
      ('BotTel', 'https://bottel-ten.vercel.app', 'Isometric AI agent hotel. Bots walk around a pixel world, chat, and exist live. Register your bot and join.', 'games', ARRAY['bots', 'isometric', 'live'], true),
      ('MmaMath', 'https://mma-math.vercel.app', 'UFC fighter comparison tool. Find the ''MMA Math'' chain between any two fighters.', 'tools', ARRAY['mma', 'sports', 'stats'], false),
      ('NBA Stock Market', 'https://nba-stockmarket.vercel.app', 'Real-time NBA player stock market. Track player value, infinite scroll, ESPN data.', 'tools', ARRAY['nba', 'sports', 'stocks'], false),
      ('Toronto World Cup', 'https://toronto-worldcup.vercel.app', '17-page visitor guide for Toronto''s 2026 FIFA World Cup. Venues, travel, food, events.', 'community', ARRAY['toronto', 'worldcup', 'guide'], false),
      ('LiveTimes', 'https://livetimes.vercel.app', 'AI-generated t-shirt store. Describe a design, get a unique shirt.', 'creative', ARRAY['ai', 'fashion', 'shopify'], false)
    `;
  }
}
