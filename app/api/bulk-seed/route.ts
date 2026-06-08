import { getDb } from '@/lib/db';
import { contests } from '@/db/schema';
import { worldCupContests } from '@/lib/world-cup-contests';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    return NextResponse.json({ error: 'No database configured' }, { status: 503 });
  }

  try {
    const db = getDb();

    // Check existing count
    const existing = await db.select().from(contests);

    console.log(`Database has ${existing.length} contests. Adding ${worldCupContests.length} new ones...`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const contest of worldCupContests) {
      try {
        await db.insert(contests).values({
          id: uuidv4(),
          title: contest.title,
          description: contest.description,
          source: contest.source,
          sourceUrl: 'https://worldcup.fifa.com', // Default FIFA URL
          contestType: 'sweepstakes',
          hasAMOE: true,
          amoeMethod: contest.amoeMethod,
          physicalRequirements: contest.physicalRequirements,
          prizeDescription: contest.prizeDescription,
          estimatedValue: contest.estimatedValue,
          endDate: contest.endDate,
          startDate: new Date(),
          eligibility: 'US and International residents',
          relatedEvent: 'worldcup',
          verified: true,
          verificationScore: '0.90',
          metadata: {
            organization: contest.organization,
            researchedAt: new Date().toISOString(),
            source: 'agent_researched',
          },
        });
        addedCount++;
      } catch (error) {
        skippedCount++;
        console.warn(`Skipped ${contest.title}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return NextResponse.json({
      success: true,
      added: addedCount,
      skipped: skippedCount,
      total: worldCupContests.length,
      message: `Added ${addedCount} World Cup contests to database`,
    });
  } catch (error) {
    console.error('Bulk seed error:', error);
    return NextResponse.json(
      { error: 'Failed to bulk seed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
