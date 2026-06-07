import { getDb } from "@/lib/db";
import { contests } from "@/db/schema";
import { desc, lt, gt, and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = getDb();
  const searchParams = request.nextUrl.searchParams;

  const sortBy = searchParams.get("sortBy") || "endDate"; // 'endDate', 'value'
  const relatedEvent = searchParams.get("event") || "worldcup";
  const limit = parseInt(searchParams.get("limit") || "50");
  const skipExpired = searchParams.get("skipExpired") !== "false";

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([], { status: 200 });
    }

    const conditions = [
      eq(contests.hasAMOE, true),
      eq(contests.relatedEvent, relatedEvent),
    ];

    if (skipExpired) {
      conditions.push(gt(contests.endDate, new Date()));
    }

    let baseQuery = db
      .select()
      .from(contests)
      .where(and(...conditions));

    const finalQuery = sortBy === "value"
      ? baseQuery.orderBy(desc(contests.estimatedValue)).limit(limit)
      : baseQuery.orderBy(contests.endDate).limit(limit);

    const result = await finalQuery;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching contests:", error);
    return NextResponse.json([], { status: 200 });
  }
}
