import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ARCHIVING_STATUSES } from "@/lib/status";
import { ApplicationStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { company, title, link, status, notes } = body;

  const data: {
    company?: string;
    title?: string;
    link?: string;
    notes?: string;
    status?: ApplicationStatus;
    lastActivity?: Date;
    archived?: boolean;
  } = {};

  if (company !== undefined) data.company = company;
  if (title !== undefined) data.title = title;
  if (link !== undefined) data.link = link;
  if (notes !== undefined) data.notes = notes;

  if (status !== undefined) {
    data.status = status;
    data.lastActivity = new Date();
    data.archived = ARCHIVING_STATUSES.includes(status);
  }

  const application = await prisma.application.update({
    where: { id },
    data,
  });

  return NextResponse.json(application);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.application.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
