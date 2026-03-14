"use strict";(()=>{var e={};e.id=70,e.ids=[70],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},2048:e=>{e.exports=require("fs")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},6119:e=>{e.exports=require("perf_hooks")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},224:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>d,patchFetch:()=>A,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>T,staticGenerationAsyncStorage:()=>u});var s={};r.r(s),r.d(s,{GET:()=>E});var i=r(9303),a=r(8716),o=r(9230),n=r(7070),p=r(9487);async function E(e){let t;await (0,p.x)();let{searchParams:r}=new URL(e.url),s=r.get("category"),i=r.get("featured");if("true"===r.get("pending")){if("Bearer clawpages-admin-001"!==e.headers.get("authorization"))return n.NextResponse.json({error:"Unauthorized"},{status:401});let t=await (0,p.Z)`
      SELECT * FROM cp_listings WHERE submitted_by = 'user' AND is_active = false ORDER BY discovered_at DESC
    `;return n.NextResponse.json(t)}return t=s&&"true"===i?await (0,p.Z)`SELECT * FROM cp_listings WHERE is_active = true AND category = ${s} AND featured = true ORDER BY discovered_at DESC`:s?await (0,p.Z)`SELECT * FROM cp_listings WHERE is_active = true AND category = ${s} ORDER BY discovered_at DESC`:"true"===i?await (0,p.Z)`SELECT * FROM cp_listings WHERE is_active = true AND featured = true ORDER BY discovered_at DESC`:await (0,p.Z)`SELECT * FROM cp_listings WHERE is_active = true ORDER BY discovered_at DESC`,n.NextResponse.json(t)}let c=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/listings/route",pathname:"/api/listings",filename:"route",bundlePath:"app/api/listings/route"},resolvedPagePath:"/Users/philbot/Projects/clawpages/app/api/listings/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:l,staticGenerationAsyncStorage:u,serverHooks:T}=c,d="/api/listings/route";function A(){return(0,o.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:u})}},9487:(e,t,r)=>{r.d(t,{Z:()=>i,x:()=>a});let s=(0,r(8937).Z)(process.env.DATABASE_URL,{ssl:"require"}),i=s;async function a(){await s`
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
  `,await s`
    CREATE TABLE IF NOT EXISTS cp_daily_picks (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES cp_listings(id),
      pick_date DATE NOT NULL UNIQUE,
      reason TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `,await s`
    CREATE TABLE IF NOT EXISTS cp_search_log (
      id SERIAL PRIMARY KEY,
      query TEXT NOT NULL,
      results_found INTEGER DEFAULT 0,
      new_added INTEGER DEFAULT 0,
      searched_at TIMESTAMPTZ DEFAULT NOW()
    )
  `,0===Number((await s`SELECT COUNT(*) as c FROM cp_listings`)[0].c)&&await s`
      INSERT INTO cp_listings (name, url, description, category, tags, featured) VALUES
      ('BotLog', 'https://botlog-eight.vercel.app', 'AI bot social network — bots post thoughts, react to each other, and debate in rooms. Built by PhillyBot.', 'social', ARRAY['bots', 'social', 'ai'], true),
      ('BotTel', 'https://bottel-ten.vercel.app', 'Isometric AI agent hotel. Bots walk around a pixel world, chat, and exist live. Register your bot and join.', 'games', ARRAY['bots', 'isometric', 'live'], true),
      ('MmaMath', 'https://mma-math.vercel.app', 'UFC fighter comparison tool. Find the ''MMA Math'' chain between any two fighters.', 'tools', ARRAY['mma', 'sports', 'stats'], false),
      ('NBA Stock Market', 'https://nba-stockmarket.vercel.app', 'Real-time NBA player stock market. Track player value, infinite scroll, ESPN data.', 'tools', ARRAY['nba', 'sports', 'stocks'], false),
      ('Toronto World Cup', 'https://toronto-worldcup.vercel.app', '17-page visitor guide for Toronto''s 2026 FIFA World Cup. Venues, travel, food, events.', 'community', ARRAY['toronto', 'worldcup', 'guide'], false),
      ('LiveTimes', 'https://livetimes.vercel.app', 'AI-generated t-shirt store. Describe a design, get a unique shirt.', 'creative', ARRAY['ai', 'fashion', 'shopify'], false)
    `}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,937,972],()=>r(224));module.exports=s})();