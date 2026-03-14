"use strict";(()=>{var e={};e.id=832,e.ids=[832],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},2048:e=>{e.exports=require("fs")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},6119:e=>{e.exports=require("perf_hooks")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},1796:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>A,patchFetch:()=>h,requestAsyncStorage:()=>u,routeModule:()=>d,serverHooks:()=>E,staticGenerationAsyncStorage:()=>T});var r={};i.r(r),i.d(r,{POST:()=>p});var a=i(9303),s=i(8716),o=i(9230),c=i(7070),n=i(9487);let l=["site:vercel.app openclaw","openclaw bot project","built with openclaw","openclaw.ai project","openclaw app"];async function p(e){if(await (0,n.x)(),"Bearer clawpages-cron-001"!==e.headers.get("authorization"))return c.NextResponse.json({error:"Unauthorized"},{status:401});let t=[...l].sort(()=>Math.random()-.5).slice(0,3),i=0,r=0,a=[];for(let e of t)try{let t=await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(e)}&count=10`,{headers:{"X-Subscription-Token":"BSAerSnv5c4X4VwYxrxeUjjJnLFwRMi",Accept:"application/json"}});if(!t.ok)continue;let s=await t.json(),o=s.web?.results||[];for(let e of(i+=o.length,o)){let t=e.url;if(!t||(await (0,n.Z)`SELECT id FROM cp_listings WHERE url = ${t}`).length>0)continue;let i=e.title||t,s=e.description||"An OpenClaw project discovered by PhillyBot.",o=function(e,t){let i=`${e} ${t}`.toLowerCase();return i.includes("bot")||i.includes("social")||i.includes("feed")?"social":i.includes("game")||i.includes("play")||i.includes("pixel")?"games":i.includes("ai")||i.includes("gpt")||i.includes("llm")||i.includes("agent")?"ai":i.includes("art")||i.includes("music")||i.includes("creative")||i.includes("design")?"creative":i.includes("community")||i.includes("forum")||i.includes("directory")?"community":i.includes("tool")||i.includes("util")||i.includes("dev")||i.includes("api")?"tools":"personal"}(i,s);try{let e=await (0,n.Z)`
            INSERT INTO cp_listings (name, url, description, category, tags, submitted_by, is_active)
            VALUES (${i}, ${t}, ${s}, ${o}, ARRAY['openclaw', 'discovered'], 'phillybot', true)
            RETURNING *
          `;r++,a.push(e[0])}catch{}}await (0,n.Z)`
        INSERT INTO cp_search_log (query, results_found, new_added)
        VALUES (${e}, ${o.length}, ${r})
      `}catch{}let s=null;if(a.length>0){let e=a[Math.floor(Math.random()*a.length)];try{await (0,n.Z)`
        INSERT INTO cp_daily_picks (listing_id, pick_date, reason)
        VALUES (${e.id}, CURRENT_DATE, ${"Freshly discovered by PhillyBot's daily crawl!"})
        ON CONFLICT (pick_date) DO NOTHING
      `,s=e}catch{}}else{let e=await (0,n.Z)`
      SELECT * FROM cp_listings WHERE featured = true AND is_active = true ORDER BY RANDOM() LIMIT 1
    `;if(e[0])try{await (0,n.Z)`
          INSERT INTO cp_daily_picks (listing_id, pick_date, reason)
          VALUES (${e[0].id}, CURRENT_DATE, ${"A featured OpenClaw classic worth revisiting!"})
          ON CONFLICT (pick_date) DO NOTHING
        `,s=e[0]}catch{}}return c.NextResponse.json({searched:i,new:r,pick:s})}let d=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/cron/discover/route",pathname:"/api/cron/discover",filename:"route",bundlePath:"app/api/cron/discover/route"},resolvedPagePath:"/Users/philbot/Projects/clawpages/app/api/cron/discover/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:u,staticGenerationAsyncStorage:T,serverHooks:E}=d,A="/api/cron/discover/route";function h(){return(0,o.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:T})}},9487:(e,t,i)=>{i.d(t,{Z:()=>a,x:()=>s});let r=(0,i(8937).Z)(process.env.DATABASE_URL,{ssl:"require"}),a=r;async function s(){await r`
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
    `}}};var t=require("../../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),r=t.X(0,[276,937,972],()=>i(1796));module.exports=r})();