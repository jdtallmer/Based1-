import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sweepGhostedApplications } from "@/lib/ghost-sweep";

export async function GET() {
  await sweepGhostedApplications();

  const applications = await prisma.application.findMany({
    orderBy: { appliedDate: "desc" },
  });

  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { company, title, link, status, appliedDate } = body;

  if (!company || !title || !link) {
    return NextResponse.json(
      { error: "company, title, and link are required." },
      { status: 400 }
    );
  }

  const application = await prisma.application.create({
    data: {
      company,
      title,
      link,
      status: status ?? "APPLIED",
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      lastActivity: new Date(),
    },
  });

  return NextResponse.json(application, { status: 201 });
}
