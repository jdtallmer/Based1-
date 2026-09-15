"use client";

import { useCallback, useEffect, useState } from "react";
import { Application, NewRole, Settings } from "@/lib/types";
import { ApplicationStatus } from "@prisma/client";
import { AppHeader } from "@/components/AppHeader";
import { MetricsBar } from "@/components/MetricsBar";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { NewRolesTable } from "@/components/NewRolesTable";
import { QuickLinks } from "@/components/QuickLinks";

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [newRoles, setNewRoles] = useState<NewRole[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = useCallback(async () => {
    const [appsRes, rolesRes, settingsRes] = await Promise.all([
      fetch("/api/applications"),
      fetch("/api/new-roles"),
      fetch("/api/settings"),
    ]);
    setApplications(await appsRes.json());
    setNewRoles(await rolesRes.json());
    setSettings(await settingsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    // Phase 1 has no data-fetching library (SWR/React Query) in scope;
    // fetching dashboard data once on mount is intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, [loadAll]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }

  async function handleCreateApplication(data: { company: string; title: string; link: string }) {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const created = await res.json();
    setApplications((prev) => [created, ...prev]);
  }

  async function handleUpdateStatus(id: string, status: ApplicationStatus) {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function handleDeleteApplication(id: string) {
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleCreateRole(data: {
    company: string;
    title: string;
    postedDate: string;
    link: string;
    jobId?: string;
  }) {
    const res = await fetch("/api/new-roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const created = await res.json();
    if (!created.duplicate) {
      setNewRoles((prev) => [created, ...prev]);
    }
    return { duplicate: Boolean(created.duplicate) };
  }

  async function handleDeleteRole(id: string) {
    await fetch(`/api/new-roles/${id}`, { method: "DELETE" });
    setNewRoles((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Loading dashboard…
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <AppHeader onRefresh={handleRefresh} refreshing={refreshing} />

      <div className="mt-6 flex flex-col gap-6">
        <MetricsBar applications={applications} />
        <QuickLinks settings={settings} />
        <ApplicationsTable
          applications={applications}
          onCreate={handleCreateApplication}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteApplication}
        />
        <NewRolesTable roles={newRoles} onCreate={handleCreateRole} onDelete={handleDeleteRole} />
      </div>
    </main>
  );
}
