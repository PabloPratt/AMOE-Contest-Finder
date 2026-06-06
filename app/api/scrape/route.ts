import { scoutContestSource, analyzeContestRules } from "@/lib/agents/contest-scout";
import { getDb } from "@/lib/db";
import { contests, scrapeLogs } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const contestSources = [
  "sweepstakestoday.com",
  "contestgirl.com",
  "sweepstakes.com",
  "onlinecrossing.com",
];

interface ScrapedContest {
  title?: string;
  description?: string;
  sourceUrl?: string;
  contestType?: string;
  hasAMOE?: boolean;
  amoeMethod?: string;
  physicalRequirements?: string;
  prizeDescription?: string;
  estimatedValue?: number | string;
  startDate?: string;
  endDate?: string;
  eligibility?: string;
  rules?: string;
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();
  const source = body.source || "sweepstakestoday.com";
  const query = body.query || "world cup AMOE sweepstakes";

  const logId = uuidv4();

  try {
    const scrapedContests = await scoutContestSource(source, query);

    let addedCount = 0;

    for (const contest of scrapedContests) {
      if (!contest.title || !contest.endDate || !contest.prizeDescription) {
        continue;
      }

      let analysis = {
        hasAMOE: true,
        amoeMethod: contest.amoeMethod || "",
        physicalRequirements: contest.physicalRequirements || "",
        estimatedValue: contest.estimatedValue,
        verificationScore: 0.8,
      };

      if (contest.rules) {
        analysis = await analyzeContestRules(contest.title, contest.rules);
      }

      if (!analysis.hasAMOE) continue;

      const contestId = uuidv4();
      const endDate = new Date(contest.endDate);

      await db.insert(contests).values({
        id: contestId,
        title: contest.title,
        description: contest.description || "",
        source: source,
        sourceUrl: contest.sourceUrl || "",
        contestType: contest.contestType || "sweepstakes",
        hasAMOE: analysis.hasAMOE,
        amoeMethod: analysis.amoeMethod,
        physicalRequirements: analysis.physicalRequirements,
        prizeDescription: contest.prizeDescription,
        estimatedValue: analysis.estimatedValue
          ? String(analysis.estimatedValue)
          : undefined,
        endDate: endDate,
        startDate: contest.startDate ? new Date(contest.startDate) : undefined,
        eligibility: contest.eligibility,
        rules: contest.rules,
        relatedEvent: query.includes("world cup") ? "worldcup" : "general",
        verified: false,
        verificationScore: String(analysis.verificationScore),
        metadata: {
          originalSource: source,
          scrapedAt: new Date().toISOString(),
        },
      }).catch((e) => {
        // Handle unique constraint violations silently
        if (!e.message.includes("unique")) throw e;
      });

      addedCount++;
    }

    await db.insert(scrapeLogs).values({
      id: logId,
      source: source,
      status: scrapedContests.length > 0 ? "success" : "partial",
      contestsFound: scrapedContests.length,
      contestsAdded: addedCount,
    });

    return NextResponse.json({
      success: true,
      contestsFound: scrapedContests.length,
      contestsAdded: addedCount,
      logId: logId,
    });
  } catch (error) {
    console.error("Scraping error:", error);

    await db.insert(scrapeLogs).values({
      id: logId,
      source: source,
      status: "failed",
      contestsFound: 0,
      contestsAdded: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "Scraping failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
