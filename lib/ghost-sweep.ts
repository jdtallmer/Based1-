import { prisma } from "@/lib/prisma";
import { GHOST_AFTER_DAYS } from "@/lib/status";

/**
 * Phase 1 has no background jobs, so the 14-day ghost check runs inline on
 * every applications read instead — cheap for a single-user dataset and
 * keeps "no reply after N days" accurate without extra infra.
 */
export async function sweepGhostedApplications() {
  const cutoff = new Date(Date.now() - GHOST_AFTER_DAYS * 24 * 60 * 60 * 1000);

  await prisma.application.updateMany({
    where: {
      status: "APPLIED",
      lastActivity: { lt: cutoff },
    },
    data: {
      status: "GHOSTED",
      archived: true,
    },
  });
}
