import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const roles = await prisma.newRole.findMany({
    orderBy: { postedDate: "desc" },
  });
  return NextResponse.json(roles);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { company, title, postedDate, link, jobId, notes } = body;

  if (!company || !title || !link || !postedDate) {
    return NextResponse.json(
      { error: "company, title, link, and postedDate are required." },
      { status: 400 }
    );
  }

  // Same company + title + jobId (including two entries with no jobId at all)
  // is treated as the same posting; a different jobId is a distinct opening
  // for the same role (e.g. re-posted or a second req).
  const existing = await prisma.newRole.findFirst({
    where: {
      company: { equals: company },
      title: { equals: title },
      jobId: jobId || null,
    },
  });

  if (existing) {
    return NextResponse.json({ ...existing, duplicate: true }, { status: 200 });
  }

  const role = await prisma.newRole.create({
    data: {
      company,
      title,
      postedDate: new Date(postedDate),
      link,
      jobId: jobId || null,
      notes,
    },
  });

  return NextResponse.json(role, { status: 201 });
}
