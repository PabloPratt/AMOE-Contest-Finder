import { getDb } from "@/lib/db";
import { contests, userApplications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface ApplicationRequest {
  contestId: string;
  email: string;
  name: string;
  automate?: boolean;
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body: ApplicationRequest = await request.json();
  const { contestId, email, name, automate } = body;

  try {
    const contest = await db
      .select()
      .from(contests)
      .where(eq(contests.id, contestId))
      .limit(1);

    if (!contest || contest.length === 0) {
      return NextResponse.json(
        { error: "Contest not found" },
        { status: 404 }
      );
    }

    const contestData = contest[0];
    const appId = uuidv4();

    let automationDetails = null;

    if (automate && contestData.physicalRequirements) {
      const automationPrompt = `Generate detailed step-by-step instructions for entering the following contest:

Contest: ${contestData.title}
Prize: ${contestData.prizeDescription}
Rules: ${contestData.rules}
Physical Requirements: ${contestData.physicalRequirements}
AMOE Method: ${contestData.amoeMethod}

Please provide:
1. Exact steps to complete the entry
2. Required documents or information
3. Mailing address (if applicable)
4. What to include in a letter (if mail-in)
5. Deadline and confirmation methods

Format as a clear, actionable checklist.`;

      const response = await client.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: automationPrompt,
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === "text");
      if (textContent && textContent.type === "text") {
        automationDetails = {
          instructions: textContent.text,
          generatedAt: new Date().toISOString(),
          contestTitle: contestData.title,
        };
      }
    }

    await db.insert(userApplications).values({
      id: appId,
      contestId: contestId,
      status: automate ? "submitted" : "pending",
      confirmationDetails: automationDetails,
    });

    return NextResponse.json(
      {
        success: true,
        applicationId: appId,
        message: automate
          ? "Application automation generated successfully"
          : "Application recorded",
        contest: {
          title: contestData.title,
          endDate: contestData.endDate,
          physicalRequirements: contestData.physicalRequirements,
        },
        automationInstructions: automationDetails,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json(
      { error: "Failed to process application", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
