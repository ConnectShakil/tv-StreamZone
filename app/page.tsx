export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@supabase/supabase-js';
import { getActiveAnnouncement, type Match } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';

export default async function Page() {
  // Use service role key on the server to bypass RLS and guarantee all rows are returned
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const [matchResult, announcement] = await Promise.all([
    supabase
      .from('matches')
      .select('*, streams(*)')
      .order('created_at', { ascending: true }),
    getActiveAnnouncement(),
  ]);

  if (matchResult.error) {
    console.error('[page] Supabase error:', matchResult.error);
  }

  const matches = (matchResult.data ?? []) as Match[];

  console.log('Fetched Matches Count:', matches?.length);
  console.log('Matches Data:', JSON.stringify(matches, null, 2));

  return <HomeClient initialMatches={matches} initialAnnouncement={announcement} />;
}
