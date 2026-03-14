"use strict";(()=>{var e={};e.id=499,e.ids=[499],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},2048:e=>{e.exports=require("fs")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},6119:e=>{e.exports=require("perf_hooks")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},1656:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>A,patchFetch:()=>m,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>E,staticGenerationAsyncStorage:()=>T});var r={};s.r(r),s.d(r,{POST:()=>u});var o=s(9303),i=s(8716),a=s(9230),n=s(7070),l=s(9487),c=s(5218);async function u(e){await (0,l.x)();let{name:t,url:s,description:r,category:o,tags:i}=await e.json();if(!t||!s||!r||!o)return n.NextResponse.json({error:"Missing required fields"},{status:400});if(!c.w.includes(o))return n.NextResponse.json({error:"Invalid category"},{status:400});try{let e=await (0,l.Z)`
      INSERT INTO cp_listings (name, url, description, category, tags, submitted_by, is_active)
      VALUES (${t}, ${s}, ${r}, ${o}, ${i||[]}, 'user', false)
      RETURNING id
    `;return n.NextResponse.json({ok:!0,id:e[0].id})}catch(e){if("23505"===e.code)return n.NextResponse.json({error:"URL already exists"},{status:409});return n.NextResponse.json({error:"Failed to submit"},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/submit/route",pathname:"/api/submit",filename:"route",bundlePath:"app/api/submit/route"},resolvedPagePath:"/Users/philbot/Projects/clawpages/app/api/submit/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:d,staticGenerationAsyncStorage:T,serverHooks:E}=p,A="/api/submit/route";function m(){return(0,a.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:T})}},5218:(e,t,s)=>{s.d(t,{b:()=>r,w:()=>o});let r={social:{label:"Social",color:"#FF8F00",icon:"\uD83D\uDDE3️",description:"Social platforms, feeds, bots"},tools:{label:"Tools",color:"#F57F17",icon:"\uD83D\uDD27",description:"Utilities, dev tools, productivity"},games:{label:"Games",color:"#E65100",icon:"\uD83C\uDFAE",description:"Games, interactive experiences"},ai:{label:"AI",color:"#FF6F00",icon:"\uD83E\uDD16",description:"AI experiments, demos"},creative:{label:"Creative",color:"#EF6C00",icon:"\uD83C\uDFA8",description:"Art, music, writing"},community:{label:"Community",color:"#F9A825",icon:"\uD83C\uDFD8️",description:"Forums, directories, hubs"},personal:{label:"Personal",color:"#FFB300",icon:"\uD83D\uDC64",description:"Personal sites, bots, projects"}},o=Object.keys(r)},9487:(e,t,s)=>{s.d(t,{Z:()=>o,x:()=>i});let r=(0,s(8937).Z)(process.env.DATABASE_URL,{ssl:"require"}),o=r;async function i(){await r`
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
  `,await r`
    CREATE TABLE IF NOT EXISTS cp_daily_picks (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES cp_listings(id),
      pick_date DATE NOT NULL UNIQUE,
      reason TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `,await r`
    CREATE TABLE IF NOT EXISTS cp_search_log (
      id SERIAL PRIMARY KEY,
      query TEXT NOT NULL,
      results_found INTEGER DEFAULT 0,
      new_added INTEGER DEFAULT 0,
      searched_at TIMESTAMPTZ DEFAULT NOW()
    )
  `,0===Number((await r`SELECT COUNT(*) as c FROM cp_listings`)[0].c)&&await r`
      INSERT INTO cp_listings (name, url, description, category, tags, featured) VALUES
      ('BotLog', 'https://botlog-eight.vercel.app', 'AI bot social network — bots post thoughts, react to each other, and debate in rooms. Built by PhillyBot.', 'social', ARRAY['bots', 'social', 'ai'], true),
      ('BotTel', 'https://bottel-ten.vercel.app', 'Isometric AI agent hotel. Bots walk around a pixel world, chat, and exist live. Register your bot and join.', 'games', ARRAY['bots', 'isometric', 'live'], true),
      ('MmaMath', 'https://mma-math.vercel.app', 'UFC fighter comparison tool. Find the ''MMA Math'' chain between any two fighters.', 'tools', ARRAY['mma', 'sports', 'stats'], false),
      ('NBA Stock Market', 'https://nba-stockmarket.vercel.app', 'Real-time NBA player stock market. Track player value, infinite scroll, ESPN data.', 'tools', ARRAY['nba', 'sports', 'stocks'], false),
      ('Toronto World Cup', 'https://toronto-worldcup.vercel.app', '17-page visitor guide for Toronto''s 2026 FIFA World Cup. Venues, travel, food, events.', 'community', ARRAY['toronto', 'worldcup', 'guide'], false),
      ('LiveTimes', 'https://livetimes.vercel.app', 'AI-generated t-shirt store. Describe a design, get a unique shirt.', 'creative', ARRAY['ai', 'fashion', 'shopify'], false)
    `}}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[276,937,972],()=>s(1656));module.exports=r})();