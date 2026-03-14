"use strict";(()=>{var e={};e.id=125,e.ids=[125],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},2048:e=>{e.exports=require("fs")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},6119:e=>{e.exports=require("perf_hooks")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},5477:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>A,patchFetch:()=>m,requestAsyncStorage:()=>d,routeModule:()=>u,serverHooks:()=>E,staticGenerationAsyncStorage:()=>T});var s={};i.r(s),i.d(s,{POST:()=>p});var r=i(9303),o=i(8716),a=i(9230),n=i(7070),l=i(9487),c=i(5218);async function p(e){if(await (0,l.x)(),"Bearer clawpages-admin-001"!==e.headers.get("authorization"))return n.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:t}=new URL(e.url),i=t.get("action"),s=t.get("id");if(i&&s){let e=parseInt(s,10);if("approve"===i)return await (0,l.Z)`UPDATE cp_listings SET is_active = true, submitted_by = 'phillybot' WHERE id = ${e}`,n.NextResponse.json({ok:!0});if("reject"===i)return await (0,l.Z)`DELETE FROM cp_listings WHERE id = ${e}`,n.NextResponse.json({ok:!0})}let{name:r,url:o,description:a,category:p,tags:u,featured:d}=await e.json();if(!r||!o||!a||!p)return n.NextResponse.json({error:"Missing required fields"},{status:400});if(!c.w.includes(p))return n.NextResponse.json({error:"Invalid category"},{status:400});try{let e=await (0,l.Z)`
      INSERT INTO cp_listings (name, url, description, category, tags, featured, submitted_by, is_active)
      VALUES (${r}, ${o}, ${a}, ${p}, ${u||[]}, ${d||!1}, 'phillybot', true)
      RETURNING id
    `;return n.NextResponse.json({ok:!0,id:e[0].id})}catch(e){if("23505"===e.code)return n.NextResponse.json({error:"URL already exists"},{status:409});return n.NextResponse.json({error:"Failed to add listing"},{status:500})}}let u=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/listing/route",pathname:"/api/admin/listing",filename:"route",bundlePath:"app/api/admin/listing/route"},resolvedPagePath:"/Users/philbot/Projects/clawpages/app/api/admin/listing/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:T,serverHooks:E}=u,A="/api/admin/listing/route";function m(){return(0,a.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:T})}},5218:(e,t,i)=>{i.d(t,{b:()=>s,w:()=>r});let s={social:{label:"Social",color:"#FF8F00",icon:"\uD83D\uDDE3️",description:"Social platforms, feeds, bots"},tools:{label:"Tools",color:"#F57F17",icon:"\uD83D\uDD27",description:"Utilities, dev tools, productivity"},games:{label:"Games",color:"#E65100",icon:"\uD83C\uDFAE",description:"Games, interactive experiences"},ai:{label:"AI",color:"#FF6F00",icon:"\uD83E\uDD16",description:"AI experiments, demos"},creative:{label:"Creative",color:"#EF6C00",icon:"\uD83C\uDFA8",description:"Art, music, writing"},community:{label:"Community",color:"#F9A825",icon:"\uD83C\uDFD8️",description:"Forums, directories, hubs"},personal:{label:"Personal",color:"#FFB300",icon:"\uD83D\uDC64",description:"Personal sites, bots, projects"}},r=Object.keys(s)},9487:(e,t,i)=>{i.d(t,{Z:()=>r,x:()=>o});let s=(0,i(8937).Z)(process.env.DATABASE_URL,{ssl:"require"}),r=s;async function o(){await s`
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
    `}}};var t=require("../../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),s=t.X(0,[276,937,972],()=>i(5477));module.exports=s})();