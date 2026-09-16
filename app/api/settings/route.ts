import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { resumeText, linkedinUrl, resumeDocUrl } = body;

  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {
      ...(resumeText !== undefined && { resumeText }),
      ...(linkedinUrl !== undefined && { linkedinUrl }),
      ...(resumeDocUrl !== undefined && { resumeDocUrl }),
    },
    create: {
      id: "singleton",
      resumeText,
      linkedinUrl,
      resumeDocUrl,
    },
  });

  return NextResponse.json(settings);
}
