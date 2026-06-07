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
    let query = db
      .select()
      .from(contests)
      .where(
        and(
          eq(contests.hasAMOE, true),
          eq(contests.relatedEvent, relatedEvent),
          skipExpired ? gt(contests.endDate, new Date()) : undefined
        )
      );

    if (sortBy === "value") {
      query = query.orderBy(desc(contests.estimatedValue));
    } else {
      query = query.orderBy(contests.endDate);
    }

    const result = await query.limit(limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching contests:", error);
    return NextResponse.json(
      { error: "Failed to fetch contests" },
      { status: 500 }
    );
  }
}
