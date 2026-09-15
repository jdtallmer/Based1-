import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.watchlistCompany.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(companies);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }

  const company = await prisma.watchlistCompany
    .create({ data: { name: name.trim() } })
    .catch(() => null);

  if (!company) {
    return NextResponse.json({ error: "That company is already on the watchlist." }, { status: 409 });
  }

  return NextResponse.json(company, { status: 201 });
}
