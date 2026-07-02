import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.nextUrl.searchParams.get('cron_secret') === secret) return true;
  if (req.headers.get('authorization') === `Bearer ${secret}`) return true;
  return false;
}

const SEED_MATCHES = [
  {
    team_a: 'Brazil',
    team_b: 'Japan',
    team_a_flag: 'BR',
    team_b_flag: 'JP',
    sport: 'Football',
    league: 'International Friendly',
    status: 'live',
  },
  {
    team_a: 'Bangladesh',
    team_b: 'India',
    team_a_flag: null,
    team_b_flag: 'IN',
    sport: 'Cricket',
    league: 'Asia Cup 2026',
    status: 'live',
  },
];

const SEED_CHANNELS = [
  { team_a: 'T Sports',    team_b: '', sport: 'tv', league: 'Live TV', status: 'live' },
  { team_a: 'Star Sports', team_b: '', sport: 'tv', league: 'Live TV', status: 'live' },
  { team_a: 'GTV',         team_b: '', sport: 'tv', league: 'Live TV', status: 'live' },
];

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const inserted: string[] = [];
  const skipped: string[] = [];

  for (const seed of [...SEED_MATCHES, ...SEED_CHANNELS]) {
    const { data: existing } = await supabaseAdmin
      .from('matches')
      .select('id')
      .eq('team_a', seed.team_a)
      .eq('sport', seed.sport)
      .maybeSingle();

    if (existing) {
      skipped.push(seed.team_a);
      continue;
    }

    const { error } = await supabaseAdmin.from('matches').insert(seed);
    if (error) {
      return NextResponse.json(
        { error: error.message, context: `Failed to insert: ${seed.team_a}` },
        { status: 500 }
      );
    }
    inserted.push(seed.team_a);
  }

  return NextResponse.json({
    message: 'Seed completed successfully.',
    inserted,
    skipped,
    total: inserted.length + skipped.length,
  });
}
