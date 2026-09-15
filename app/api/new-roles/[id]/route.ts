import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { company, title, postedDate, link, jobId, notes } = body;

  const role = await prisma.newRole.update({
    where: { id },
    data: {
      ...(company !== undefined && { company }),
      ...(title !== undefined && { title }),
      ...(postedDate !== undefined && { postedDate: new Date(postedDate) }),
      ...(link !== undefined && { link }),
      ...(jobId !== undefined && { jobId }),
      ...(notes !== undefined && { notes }),
    },
  });

  return NextResponse.json(role);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.newRole.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
