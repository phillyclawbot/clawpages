"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Listing {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pending, setPending] = useState<Listing[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const k = params.get("key") || "";
    if (k === "clawpages-admin-001") {
      setKey(k);
      setAuthed(true);
      loadPending(k);
    }
  }, []);

  async function loadPending(adminKey: string) {
    const res = await fetch(`/api/listings?pending=true`, {
      headers: { Authorization: `Bearer ${adminKey}` },
    });
    if (res.ok) {
      const data = await res.json();
      setPending(data);
    }
  }

  async function handleAction(id: number, action: "approve" | "reject") {
    const endpoint = action === "approve" ? "approve" : "reject";
    const res = await fetch(`/api/admin/listing?action=${endpoint}&id=${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.ok) {
      setMessage(`Listing ${id} ${action}d.`);
      setPending((prev) => prev.filter((l) => l.id !== id));
    }
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const k = form.get("key") as string;
    if (k === "clawpages-admin-001") {
      setKey(k);
      setAuthed(true);
      loadPending(k);
    } else {
      setMessage("Invalid key.");
    }
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-12 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">🔒 Admin</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <input name="key" type="password" placeholder="Admin Key" className="w-full border-2 border-[#E0C000] rounded px-3 py-2" />
          <button type="submit" className="category-btn px-6 py-2 rounded w-full text-sm">Login</button>
        </form>
        {message && <p className="mt-3 text-red-600 font-bold">{message}</p>}
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="text-sm text-[#666] hover:underline">&larr; Back to ClawPages</Link>

      <h1 className="font-serif text-4xl font-bold mt-4 mb-2">Admin Panel</h1>
      <p className="text-[#666] mb-6">Review pending submissions</p>
      <div className="dotted-sep mb-6" />

      {message && <p className="mb-4 font-bold text-green-700">{message}</p>}

      {pending.length === 0 ? (
        <p className="text-[#666] italic">No pending listings to review.</p>
      ) : (
        <div className="space-y-4">
          {pending.map((listing) => (
            <div key={listing.id} className="yellow-card p-4">
              <h3 className="font-serif font-bold text-lg">{listing.name}</h3>
              <p className="font-mono text-xs text-[#666]">{listing.url}</p>
              <p className="text-sm mt-1">{listing.description}</p>
              <p className="text-xs text-[#666] mt-1">Category: {listing.category} &middot; Tags: {(listing.tags || []).join(", ")}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleAction(listing.id, "approve")} className="category-btn px-4 py-1 rounded text-xs">
                  Approve
                </button>
                <button onClick={() => handleAction(listing.id, "reject")} className="bg-red-100 border-2 border-red-300 px-4 py-1 rounded text-xs font-bold text-red-700 hover:bg-red-200">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
