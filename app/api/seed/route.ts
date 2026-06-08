import { getDb } from '@/lib/db';
import { contests } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const sampleContests = [
  {
    title: 'FIFA World Cup 2026 Official Sweepstakes',
    description: 'Win official FIFA World Cup merchandise and tickets',
    source: 'fifa.com',
    sourceUrl: 'https://fifa.com/worldcup/sweepstakes',
    contestType: 'sweepstakes',
    hasAMOE: true,
    amoeMethod: 'Mail in official entry form with proof of purchase or hand-written request',
    physicalRequirements: 'Mail completed entry form to FIFA, PO Box 12345, New York, NY 10001',
    prizeDescription: 'Official FIFA World Cup merchandise pack, limited edition apparel, and tournament tickets',
    estimatedValue: '5000',
    endDate: new Date('2026-12-31'),
    startDate: new Date('2026-06-01'),
    eligibility: 'US residents, 18+, void where prohibited',
    relatedEvent: 'worldcup',
    verified: true,
    verificationScore: '0.95',
  },
  {
    title: 'World Cup Fan Experience Sweepstakes',
    description: 'Win trip to World Cup matches and VIP experiences',
    source: 'worldcupofficial.com',
    sourceUrl: 'https://worldcupofficial.com/sweepstakes',
    contestType: 'sweepstakes',
    hasAMOE: true,
    amoeMethod: 'No purchase necessary - submit entry form online or mail-in',
    physicalRequirements: 'Can enter online via website or mail postcard with name/contact',
    prizeDescription: 'All-expense paid trip for 2 to World Cup match, hotel, meals, VIP experiences',
    estimatedValue: '25000',
    endDate: new Date('2026-11-15'),
    startDate: new Date('2026-05-01'),
    eligibility: 'US residents, Canada, Mexico, 21+',
    relatedEvent: 'worldcup',
    verified: true,
    verificationScore: '0.92',
  },
  {
    title: 'Coca-Cola World Cup Campaign',
    description: 'Win World Cup merchandise and stadium experiences',
    source: 'coca-cola.com',
    sourceUrl: 'https://coca-cola.com/worldcup',
    contestType: 'sweepstakes',
    hasAMOE: true,
    amoeMethod: 'Purchase Coca-Cola product OR enter without purchase by mail-in entry',
    physicalRequirements: 'Mail entry to Coca-Cola Sweepstakes, PO Box 54321, Atlanta, GA 30303',
    prizeDescription: 'Weekly prizes of World Cup merchandise, grand prize World Cup experience',
    estimatedValue: '15000',
    endDate: new Date('2026-10-31'),
    startDate: new Date('2026-06-15'),
    eligibility: 'US and Puerto Rico residents, 18+',
    relatedEvent: 'worldcup',
    verified: true,
    verificationScore: '0.88',
  },
];

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    return NextResponse.json({ skipped: true });
  }

  try {
    const db = getDb();

    // Check if contests already exist
    const existing = await db
      .select()
      .from(contests)
      .limit(1);

    if (existing.length === 0) {
      // Add sample contests
      for (const contest of sampleContests) {
        await db.insert(contests).values({
          id: uuidv4(),
          ...contest,
        });
      }

      return NextResponse.json({ seeded: true, count: sampleContests.length });
    }

    return NextResponse.json({ seeded: false, reason: 'Database already has contests' });
  } catch (error) {
    console.error('Error seeding:', error);
    return NextResponse.json({ seeded: false, error: 'Seed failed' });
  }
}
