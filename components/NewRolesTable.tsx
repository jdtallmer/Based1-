"use client";

import { useState } from "react";
import { NewRole } from "@/lib/types";
import { ExternalLinkIcon, PlusIcon, TrashIcon } from "@/components/icons";

interface Props {
  roles: NewRole[];
  onCreate: (data: {
    company: string;
    title: string;
    postedDate: string;
    link: string;
    jobId?: string;
  }) => Promise<{ duplicate?: boolean }>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = { company: "", title: "", postedDate: "", link: "", jobId: "" };

export function NewRolesTable({ roles, onCreate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.title || !form.link || !form.postedDate) return;
    setSaving(true);
    const result = await onCreate(form);
    setSaving(false);
    setForm(emptyForm);
    if (result.duplicate) {
      setNotice("That role was already on the list (same company, title, and job ID).");
      setTimeout(() => setNotice(null), 4000);
    } else {
      setShowForm(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="font-semibold">New Roles</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
        >
          <PlusIcon /> Add role
        </button>
      </div>

      {notice && <p className="px-4 pt-3 text-sm text-warning">{notice}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 border-b border-border p-4">
          <input
            required
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="min-w-[9rem] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            required
            placeholder="Role title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="min-w-[9rem] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            required
            type="date"
            value={form.postedDate}
            onChange={(e) => setForm({ ...form, postedDate: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            required
            type="url"
            placeholder="https://... posting link"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="min-w-[12rem] flex-[2] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            placeholder="Job ID (optional)"
            value={form.jobId}
            onChange={(e) => setForm({ ...form, jobId: e.target.value })}
            className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="px-4 py-2 font-medium">Company</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Posted</th>
              <th className="px-4 py-2 font-medium">Link</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No new roles yet. Add ones you find, or check your Company Watchlist in Settings.
                </td>
              </tr>
            )}
            {roles.map((role) => (
              <tr key={role.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{role.company}</td>
                <td className="px-4 py-3">{role.title}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(role.postedDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={role.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    View <ExternalLinkIcon />
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(role.id)}
                    aria-label="Delete role"
                    className="text-muted hover:text-danger"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
