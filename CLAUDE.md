# ClawPages — Yellow Pages for OpenClaw Projects

## What It Is
A daily-updated directory of cool OpenClaw apps, bots, and sites on the internet.
Retro yellow pages aesthetic — warm yellows, bold typography, printed-almanac feel.
Updates daily via a cron job that web-searches for new OpenClaw projects.

## Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Neon Postgres for the directory DB
- No auth needed — read-only public site + API key protected admin endpoints

## DB Connection
DATABASE_URL=postgresql://neondb_owner:npg_64ErozpWTVNn@ep-mute-sound-aifuoc9x-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

Table prefix: `cp_` (clawpages)

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS cp_listings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,   -- see categories below
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  submitted_by TEXT DEFAULT 'phillybot',
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS cp_daily_picks (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES cp_listings(id),
  pick_date DATE NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cp_search_log (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  results_found INTEGER DEFAULT 0,
  new_added INTEGER DEFAULT 0,
  searched_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Categories
- `social` — social platforms, feeds, bots
- `tools` — utilities, dev tools, productivity
- `games` — games, interactive experiences
- `ai` — AI experiments, demos
- `creative` — art, music, writing
- `community` — forums, directories, hubs
- `personal` — personal sites, bots, projects

## Pages

### Home `/`
- Big retro yellow header: "ClawPages" with tagline "The Internet Yellow Pages for OpenClaw"
- Today's Pick (from cp_daily_picks) — featured listing of the day with reason
- Category grid (7 categories as big yellow buttons)
- Recent Additions — last 10 listings added, sorted by discovered_at DESC
- Stats bar: "X listings across Y categories, updated daily"
- Retro aesthetic: warm #FDD835 yellow, #1a1a1a text, bold serif headings, dotted separators

### Category `/category/[slug]`  
- Lists all active listings in that category
- Sorted by featured first, then newest
- Each listing card: name (bold), url (gray), description, tags as badges

### Listing `/listing/[id]`
- Full listing detail page
- Name, URL (clickable), description, category, tags, when discovered
- "Visit Site →" CTA button

### Submit `/submit`
- Simple form: name, url, description, category, tags (comma separated)
- POST to /api/submit (no auth, anyone can submit)
- After submit: "Thanks! PhillyBot will review this soon."

### Admin `/admin`
- Protected by ADMIN_KEY query param (use "clawpages-admin-001")
- Shows pending/unreviewed (submitted_by = 'user') listings
- Approve/reject buttons

## API Endpoints

### GET /api/listings
Returns all active listings. Optional ?category= filter. Optional ?featured=true.

### POST /api/submit
Public. Body: { name, url, description, category, tags[] }
Sets submitted_by = 'user', is_active = false (needs review).
Returns { ok: true, id }

### POST /api/admin/listing
Protected (Authorization: Bearer clawpages-admin-001)
Body: { name, url, description, category, tags[], featured }
Adds directly as active (submitted_by = 'phillybot').

### GET /api/daily-pick
Returns today's daily pick (from cp_daily_picks for today's date).
If none exists yet, returns the most recent featured listing.

### POST /api/cron/discover
Protected (Authorization: Bearer clawpages-cron-001)
This is the daily discovery endpoint. It:
1. Searches the web for OpenClaw projects (use a hardcoded list of search queries)
2. For each result, checks if URL already exists in DB
3. Adds new ones as listings (submitted_by = 'phillybot', is_active = true)
4. Picks a daily highlight and inserts into cp_daily_picks for today
5. Returns { searched: N, new: N, pick: listing }

For the web search: use fetch() to call https://api.search.brave.com/res/v1/web/search
with header X-Subscription-Token: BSAerSnv5c4X4VwYxrxeUjjJnLFwRMi
Queries to search (rotate through, do 2-3 per day):
- "site:vercel.app openclaw"  
- "openclaw bot project"
- "built with openclaw"
- "openclaw.ai project"
- "openclaw app"

Parse results: each hit has url, title, description. Try to detect category from description/title.

## Design System

### Colors
- Background: #FFFDE7 (warm cream yellow)
- Primary: #FDD835 (bold yellow)
- Dark: #1A1A1A
- Gray: #666666
- Border: #E0C000
- Card bg: #FFFFFF
- Category colors: each category gets a distinct warm accent

### Typography
- Headings: Georgia or serif (bold, big, almanac-feel)  
- Body: system-ui
- URLs: monospace, gray
- Category labels: ALL CAPS, letter-spaced

### Components
- Listing Card: white card, left yellow border accent, name bold, url monospace gray, description, tags as small yellow pill badges
- Category Button: bold, yellow bg, dark text, thick border
- Today's Pick: large featured card with star ⭐ and reason text
- Stats Bar: gray bar with numbers, like "📋 47 listings · 7 categories · Updated daily"

### Layout
- Max width 1100px, centered
- 3-column listing grid on desktop, 1-column on mobile
- Sticky header with site name + nav links

## Seed Data (insert these on first run in ensureTables)

Insert these listings if cp_listings is empty:

1. name: "BotLog", url: "https://botlog-eight.vercel.app", description: "AI bot social network — bots post thoughts, react to each other, and debate in rooms. Built by PhillyBot.", category: "social", tags: ["bots", "social", "ai"], featured: true

2. name: "BotTel", url: "https://bottel-ten.vercel.app", description: "Isometric AI agent hotel. Bots walk around a pixel world, chat, and exist live. Register your bot and join.", category: "games", tags: ["bots", "isometric", "live"], featured: true

3. name: "MmaMath", url: "https://mma-math.vercel.app", description: "UFC fighter comparison tool. Find the 'MMA Math' chain between any two fighters.", category: "tools", tags: ["mma", "sports", "stats"], featured: false

4. name: "NBA Stock Market", url: "https://nba-stockmarket.vercel.app", description: "Real-time NBA player stock market. Track player value, infinite scroll, ESPN data.", category: "tools", tags: ["nba", "sports", "stocks"], featured: false

5. name: "Toronto World Cup", url: "https://toronto-worldcup.vercel.app", description: "17-page visitor guide for Toronto's 2026 FIFA World Cup. Venues, travel, food, events.", category: "community", tags: ["toronto", "worldcup", "guide"], featured: false

6. name: "LiveTimes", url: "https://livetimes.vercel.app", description: "AI-generated t-shirt store. Describe a design, get a unique shirt.", category: "creative", tags: ["ai", "fashion", "shopify"], featured: false

## Config
- next.config.mjs: set eslint.ignoreDuringBuilds: true
- .env.local: DATABASE_URL (already set), ADMIN_KEY=clawpages-admin-001, CRON_KEY=clawpages-cron-001

## File Structure
```
app/
  page.tsx                    — home page
  category/[slug]/page.tsx    — category listings
  listing/[id]/page.tsx       — single listing detail
  submit/page.tsx             — public submission form
  admin/page.tsx              — admin panel
  api/
    listings/route.ts         — GET listings
    submit/route.ts           — POST new submission
    admin/listing/route.ts    — POST add listing (protected)
    daily-pick/route.ts       — GET today's pick
    cron/discover/route.ts    — POST daily discovery job
lib/
  db.ts                       — postgres connection
  categories.ts               — category definitions + colors
```

Commit when done with message: "feat: ClawPages — OpenClaw yellow pages directory"
When done: openclaw system event --text "Done: ClawPages built — yellow pages for OpenClaw projects" --mode now
