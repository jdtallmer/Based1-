import type { SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  cookieName: "job_dashboard_session",
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};
