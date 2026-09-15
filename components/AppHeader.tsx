"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshIcon } from "@/components/icons";

interface Props {
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function AppHeader({ onRefresh, refreshing }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <Link href="/" className="text-lg font-semibold">
        Job Search Dashboard
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/settings" className="text-muted hover:text-foreground">
          Settings
        </Link>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh dashboard data"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-muted hover:border-accent hover:text-accent disabled:opacity-60"
          >
            <RefreshIcon spinning={refreshing} /> Refresh
          </button>
        )}
        <button onClick={handleLogout} className="text-muted hover:text-foreground">
          Log out
        </button>
      </nav>
    </header>
  );
}
