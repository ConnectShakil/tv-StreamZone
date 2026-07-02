import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Match = {
  id: string;
  team_a: string;
  team_b: string;
  team_a_flag: string | null;
  team_b_flag: string | null;
  sport: string;
  league: string | null;
  match_time: string | null;
  // stored as any casing in DB — always compare via .toLowerCase()
  status: string;
  score_a: number | null;
  score_b: number | null;
  thumbnail: string | null;
  created_at: string;
  streams?: Stream[];
};

export type Stream = {
  id: string;
  match_id: string;
  server_name: string;
  stream_url: string;
  quality: string;
  is_active: boolean;
  sort_order: number;
};

export type Announcement = {
  id: string;
  text: string;
  is_active: boolean;
  created_at: string;
};

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }
  return data;
}

export async function getMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('status', { ascending: true })
    .order('match_time', { ascending: true });

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  return data ?? [];
}

export async function getMatchById(id: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching match:', error);
    return null;
  }
  return data;
}

export async function getStreamsByMatchId(matchId: string): Promise<Stream[]> {
  const { data, error } = await supabase
    .from('streams')
    .select('*')
    .eq('match_id', matchId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching streams:', error);
    return [];
  }
  return data ?? [];
}
