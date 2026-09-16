import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const { jobDescription, company, title } = await request.json();

  if (!jobDescription || typeof jobDescription !== "string") {
    return NextResponse.json({ error: "jobDescription is required." }, { status: 400 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  const resumeText = settings?.resumeText;

  if (!resumeText) {
    return NextResponse.json(
      { error: "Add your resume text in Settings before generating a cover letter." },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: `Write a tailored, professional cover letter for this job application.

${company ? `Company: ${company}\n` : ""}${title ? `Role: ${title}\n` : ""}
Job description:
"""
${jobDescription}
"""

Candidate's resume:
"""
${resumeText}
"""

Write a concise cover letter (3-4 short paragraphs) that connects the candidate's real experience from the resume to the specific requirements in the job description. Do not invent experience that isn't in the resume. Return only the letter text, no preamble or explanation.`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  const letter = textBlock && textBlock.type === "text" ? textBlock.text : "";

  return NextResponse.json({ letter });
}
