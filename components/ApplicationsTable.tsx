"use client";

import { useState } from "react";
import { Application } from "@/lib/types";
import { ALL_STATUSES, STATUS_LABELS, STATUS_STYLES } from "@/lib/status";
import { ApplicationStatus } from "@prisma/client";
import { ExternalLinkIcon, PlusIcon, TrashIcon } from "@/components/icons";

interface Props {
  applications: Application[];
  onCreate: (data: { company: string; title: string; link: string }) => Promise<void>;
  onUpdateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = { company: "", title: "", link: "" };

export function ApplicationsTable({ applications, onCreate, onUpdateStatus, onDelete }: Props) {
  const [showArchived, setShowArchived] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const visible = applications.filter((a) => showArchived || !a.archived);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.title || !form.link) return;
    setSaving(true);
    await onCreate(form);
    setSaving(false);
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="font-semibold">Applications</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived (rejected / ghosted)
          </label>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
          >
            <PlusIcon /> Add application
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 border-b border-border p-4">
          <input
            required
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="min-w-[10rem] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            required
            placeholder="Role title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="min-w-[10rem] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            required
            type="url"
            placeholder="https://... application link"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="min-w-[14rem] flex-[2] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
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
              <th className="px-4 py-2 font-medium">Link</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No applications yet. Add one to get started.
                </td>
              </tr>
            )}
            {visible.map((app) => (
              <tr key={app.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{app.company}</td>
                <td className="px-4 py-3">{app.title}</td>
                <td className="px-4 py-3">
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    View <ExternalLinkIcon />
                  </a>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[app.status]}`}
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(app.id)}
                    aria-label="Delete application"
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
