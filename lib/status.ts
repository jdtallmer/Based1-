import { ApplicationStatus } from "@prisma/client";

export const GHOST_AFTER_DAYS = 14;

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  RESPONDED: "Responded",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
};

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  APPLIED: "bg-info-bg text-info",
  RESPONDED: "bg-warning-bg text-warning",
  INTERVIEW_SCHEDULED: "bg-success-bg text-success",
  OFFER: "bg-success-bg text-success",
  REJECTED: "bg-danger-bg text-danger",
  GHOSTED: "bg-border text-muted",
};

export const ARCHIVING_STATUSES: ApplicationStatus[] = ["REJECTED", "GHOSTED"];

export const ALL_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "RESPONDED",
  "INTERVIEW_SCHEDULED",
  "OFFER",
  "REJECTED",
  "GHOSTED",
];
