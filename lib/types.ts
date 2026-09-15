import { ApplicationStatus } from "@prisma/client";

export interface Application {
  id: string;
  company: string;
  title: string;
  link: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastActivity: string;
  archived: boolean;
  notes: string | null;
}

export interface NewRole {
  id: string;
  company: string;
  title: string;
  postedDate: string;
  link: string;
  jobId: string | null;
  notes: string | null;
}

export interface WatchlistCompany {
  id: string;
  name: string;
}

export interface Settings {
  id: string;
  resumeText: string | null;
  linkedinUrl: string | null;
  resumeDocUrl: string | null;
}
