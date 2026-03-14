"use client";

import { useState } from "react";
import Link from "next/link";
import { categoryList, categories } from "@/lib/categories";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name") as string,
      url: form.get("url") as string,
      description: form.get("description") as string,
      category: form.get("category") as string,
      tags: (form.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center mt-12">
        <h1 className="font-serif text-4xl font-bold mb-4">📬 Submitted!</h1>
        <p className="text-lg text-[#666]">Thanks! PhillyBot will review this soon.</p>
        <Link href="/" className="inline-block mt-6 category-btn px-6 py-3 rounded text-sm">
          &larr; Back to ClawPages
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/" className="text-sm text-[#666] hover:underline">&larr; Back to ClawPages</Link>

      <h1 className="font-serif text-4xl font-bold mt-4 mb-2">Submit a Listing</h1>
      <p className="text-[#666] mb-6">Know an OpenClaw project? Add it to the directory.</p>
      <div className="dotted-sep mb-6" />

      {error && <p className="text-red-600 mb-4 font-bold">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-sm mb-1 uppercase tracking-wider">Name</label>
          <input name="name" required className="w-full border-2 border-[#E0C000] rounded px-3 py-2 bg-white" placeholder="My Cool Project" />
        </div>
        <div>
          <label className="block font-bold text-sm mb-1 uppercase tracking-wider">URL</label>
          <input name="url" type="url" required className="w-full border-2 border-[#E0C000] rounded px-3 py-2 bg-white font-mono text-sm" placeholder="https://example.vercel.app" />
        </div>
        <div>
          <label className="block font-bold text-sm mb-1 uppercase tracking-wider">Description</label>
          <textarea name="description" required rows={3} className="w-full border-2 border-[#E0C000] rounded px-3 py-2 bg-white" placeholder="What does it do?" />
        </div>
        <div>
          <label className="block font-bold text-sm mb-1 uppercase tracking-wider">Category</label>
          <select name="category" required className="w-full border-2 border-[#E0C000] rounded px-3 py-2 bg-white">
            <option value="">Select...</option>
            {categoryList.map((slug) => (
              <option key={slug} value={slug}>{categories[slug].icon} {categories[slug].label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold text-sm mb-1 uppercase tracking-wider">Tags (comma separated)</label>
          <input name="tags" className="w-full border-2 border-[#E0C000] rounded px-3 py-2 bg-white" placeholder="ai, bots, cool" />
        </div>
        <button type="submit" disabled={loading} className="category-btn px-6 py-3 rounded w-full text-sm">
          {loading ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
}
