import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/lib/session";

function passwordsMatch(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = process.env.APP_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "Server is misconfigured: APP_PASSWORD is not set." },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || !passwordsMatch(password, expected)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ ok: true });
}
