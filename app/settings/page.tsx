"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, WatchlistCompany } from "@/lib/types";
import { TrashIcon, PlusIcon } from "@/components/icons";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [companies, setCompanies] = useState<WatchlistCompany[]>([]);
  const [newCompany, setNewCompany] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/watchlist").then((r) => r.json()),
    ]).then(([s, c]) => {
      setSettings(s);
      setCompanies(c);
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeText: settings.resumeText,
        linkedinUrl: settings.linkedinUrl,
        resumeDocUrl: settings.resumeDocUrl,
      }),
    });
    setSettings(await res.json());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!newCompany.trim()) return;
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCompany.trim() }),
    });
    if (res.ok) {
      const created = await res.json();
      setCompanies((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCompany("");
    }
  }

  async function handleDeleteCompany(id: string) {
    await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading || !settings) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">Loading…</div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-lg font-semibold">Settings</h1>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          Back to dashboard
        </Link>
      </div>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-semibold">Quick Links</h2>
          <p className="mt-1 text-sm text-muted">
            These power the Quick Links section on the dashboard.
          </p>
          <label className="mt-4 block text-sm font-medium">
            LinkedIn Inbox URL
            <input
              type="url"
              placeholder="https://www.linkedin.com/messaging/"
              value={settings.linkedinUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Resume Google Doc URL
            <input
              type="url"
              placeholder="https://docs.google.com/document/d/..."
              value={settings.resumeDocUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, resumeDocUrl: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-semibold">Resume Text</h2>
          <p className="mt-1 text-sm text-muted">
            Paste your resume once — the Cover Letter Generator reuses it every time.
          </p>
          <textarea
            rows={10}
            placeholder="Paste your resume text here…"
            value={settings.resumeText ?? ""}
            onChange={(e) => setSettings({ ...settings, resumeText: e.target.value })}
            className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
          >
            Save Settings
          </button>
          {saved && <span className="text-sm text-success">Saved.</span>}
        </div>
      </form>

      <section className="mt-8 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-semibold">Company Watchlist</h2>
        <p className="mt-1 text-sm text-muted">
          Companies you especially want to hear from. In Phase 2 these will help auto-match new
          role postings.
        </p>
        <form onSubmit={handleAddCompany} className="mt-4 flex gap-2">
          <input
            placeholder="Company name"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
          >
            <PlusIcon /> Add
          </button>
        </form>
        <ul className="mt-4 flex flex-wrap gap-2">
          {companies.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm"
            >
              {c.name}
              <button
                onClick={() => handleDeleteCompany(c.id)}
                aria-label={`Remove ${c.name}`}
                className="text-muted hover:text-danger"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
          {companies.length === 0 && (
            <li className="text-sm text-muted">No companies on the watchlist yet.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
