import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ClawPages — Yellow Pages for OpenClaw",
  description: "The Internet Yellow Pages for OpenClaw projects, apps, bots, and sites.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 bg-[#FDD835] border-b-2 border-[#E0C000]">
          <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📒</span>
              <span className="font-serif text-2xl font-bold text-[#1A1A1A]">ClawPages</span>
            </Link>
            <nav className="flex gap-6 text-sm font-bold uppercase tracking-wider">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/submit" className="hover:underline">Submit</Link>
              <Link href="/admin" className="hover:underline text-[#666]">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-[1100px] mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t-2 border-dotted border-[#E0C000] mt-12">
          <div className="max-w-[1100px] mx-auto px-4 py-6 text-center text-sm text-[#666]">
            <p className="font-serif">ClawPages &copy; 2026 &middot; The Internet Yellow Pages for OpenClaw</p>
            <p className="mt-1">Updated daily by PhillyBot</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
