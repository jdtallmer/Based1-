import { Application } from "@/lib/types";

function isInterviewOrBeyond(status: Application["status"]) {
  return status === "INTERVIEW_SCHEDULED" || status === "OFFER";
}

export function MetricsBar({ applications }: { applications: Application[] }) {
  const submitted = applications.length;
  const interviews = applications.filter((a) => isInterviewOrBeyond(a.status)).length;
  const active = applications.filter((a) => !a.archived).length;

  const metrics = [
    { label: "Applications Submitted", value: submitted },
    { label: "Interviews", value: interviews },
    { label: "Active Applications", value: active },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">{m.label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{m.value}</p>
        </div>
      ))}
    </div>
  );
}
