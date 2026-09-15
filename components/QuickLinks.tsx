import Link from "next/link";
import { Settings } from "@/lib/types";
import { ExternalLinkIcon } from "@/components/icons";

export function QuickLinks({ settings }: { settings: Settings | null }) {
  const links = [
    {
      label: "LinkedIn Inbox",
      href: settings?.linkedinUrl,
      fallback: "Add your LinkedIn inbox URL in Settings",
    },
    {
      label: "Resume (Google Doc)",
      href: settings?.resumeDocUrl,
      fallback: "Add your resume doc URL in Settings",
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 font-semibold">Quick Links</h2>
      <div className="flex flex-wrap gap-3">
        {links.map((l) =>
          l.href ? (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:border-accent hover:text-accent"
            >
              {l.label} <ExternalLinkIcon />
            </a>
          ) : (
            <Link
              key={l.label}
              href="/settings"
              className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted hover:border-accent hover:text-accent"
            >
              {l.label}: {l.fallback}
            </Link>
          )
        )}
        <Link
          href="/cover-letter"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:border-accent hover:text-accent"
        >
          Cover Letter Generator
        </Link>
      </div>
    </section>
  );
}
