"use strict";(()=>{var e={};e.id=799,e.ids=[799],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},2048:e=>{e.exports=require("fs")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},6119:e=>{e.exports=require("perf_hooks")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},5086:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>u,patchFetch:()=>A,requestAsyncStorage:()=>T,routeModule:()=>c,serverHooks:()=>E,staticGenerationAsyncStorage:()=>d});var a={};r.r(a),r.d(a,{GET:()=>n});var i=r(9303),s=r(8716),o=r(9230),p=r(7070),l=r(9487);async function n(){await (0,l.x)();let e=await (0,l.Z)`
    SELECT dp.*, l.name, l.url, l.description, l.category, l.tags
    FROM cp_daily_picks dp
    JOIN cp_listings l ON dp.listing_id = l.id
    WHERE dp.pick_date = CURRENT_DATE
    LIMIT 1
  `;if(e[0])return p.NextResponse.json(e[0]);let t=await (0,l.Z)`
    SELECT * FROM cp_listings WHERE featured = true AND is_active = true ORDER BY discovered_at DESC LIMIT 1
  `;return t[0]?p.NextResponse.json({...t[0],reason:"A featured OpenClaw project worth checking out!"}):p.NextResponse.json(null)}let c=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/daily-pick/route",pathname:"/api/daily-pick",filename:"route",bundlePath:"app/api/daily-pick/route"},resolvedPagePath:"/Users/philbot/Projects/clawpages/app/api/daily-pick/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:T,staticGenerationAsyncStorage:d,serverHooks:E}=c,u="/api/daily-pick/route";function A(){return(0,o.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:d})}},9487:(e,t,r)=>{r.d(t,{Z:()=>i,x:()=>s});let a=(0,r(8937).Z)(process.env.DATABASE_URL,{ssl:"require"}),i=a;async function s(){await a`
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
  `,await a`
    CREATE TABLE IF NOT EXISTS cp_daily_picks (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES cp_listings(id),
      pick_date DATE NOT NULL UNIQUE,
      reason TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `,await a`
    CREATE TABLE IF NOT EXISTS cp_search_log (
      id SERIAL PRIMARY KEY,
      query TEXT NOT NULL,
      results_found INTEGER DEFAULT 0,
      new_added INTEGER DEFAULT 0,
      searched_at TIMESTAMPTZ DEFAULT NOW()
    )
  `,0===Number((await a`SELECT COUNT(*) as c FROM cp_listings`)[0].c)&&await a`
      INSERT INTO cp_listings (name, url, description, category, tags, featured) VALUES
      ('BotLog', 'https://botlog-eight.vercel.app', 'AI bot social network — bots post thoughts, react to each other, and debate in rooms. Built by PhillyBot.', 'social', ARRAY['bots', 'social', 'ai'], true),
      ('BotTel', 'https://bottel-ten.vercel.app', 'Isometric AI agent hotel. Bots walk around a pixel world, chat, and exist live. Register your bot and join.', 'games', ARRAY['bots', 'isometric', 'live'], true),
      ('MmaMath', 'https://mma-math.vercel.app', 'UFC fighter comparison tool. Find the ''MMA Math'' chain between any two fighters.', 'tools', ARRAY['mma', 'sports', 'stats'], false),
      ('NBA Stock Market', 'https://nba-stockmarket.vercel.app', 'Real-time NBA player stock market. Track player value, infinite scroll, ESPN data.', 'tools', ARRAY['nba', 'sports', 'stocks'], false),
      ('Toronto World Cup', 'https://toronto-worldcup.vercel.app', '17-page visitor guide for Toronto''s 2026 FIFA World Cup. Venues, travel, food, events.', 'community', ARRAY['toronto', 'worldcup', 'guide'], false),
      ('LiveTimes', 'https://livetimes.vercel.app', 'AI-generated t-shirt store. Describe a design, get a unique shirt.', 'creative', ARRAY['ai', 'fashion', 'shopify'], false)
    `}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,937,972],()=>r(5086));module.exports=a})();