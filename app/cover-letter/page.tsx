"use client";

import { useState } from "react";
import Link from "next/link";

export default function CoverLetterPage() {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [letter, setLetter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLetter("");

    const res = await fetch("/api/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, title, jobDescription }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setLetter(data.letter);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-lg font-semibold">Cover Letter Generator</h1>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          Back to dashboard
        </Link>
      </div>

      <form onSubmit={handleGenerate} className="mt-6 flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            placeholder="Role title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <textarea
          required
          rows={10}
          placeholder="Paste the job description here…"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {error && (
          <p className="text-sm text-danger">
            {error}{" "}
            {error.includes("Settings") && (
              <Link href="/settings" className="underline">
                Go to Settings
              </Link>
            )}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
        >
          {loading ? "Generating…" : "Generate cover letter"}
        </button>
      </form>

      {letter && (
        <section className="mt-6 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Draft</h2>
            <button onClick={handleCopy} className="text-sm text-accent hover:underline">
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{letter}</p>
        </section>
      )}
    </main>
  );
}
