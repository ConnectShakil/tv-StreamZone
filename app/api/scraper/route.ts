import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ---------- Config ----------

const BD_SOURCES = [
  'https://raw.githubusercontent.com/abusaeeidx/Mrgify-BDIX-IPTV/main/bdix.m3u',
  'https://raw.githubusercontent.com/byte-capsule/BDIX-IPTV/main/bdix.m3u',
  'https://raw.githubusercontent.com/Nusab19/BDIX-IPTV/main/bdix.m3u',
];
const BD_KEYWORDS = [
  't sports', 'gtv', 'maasranga', 'somoy', 'jamuna', 'star sports',
  'sony ten', 'btv', 'channel i', 'rtv', 'nagorik', 'banglavision',
];
const BD_PRIORITY = ['t sports', 'gtv', 'jamuna'];

const INT_SOURCE = 'https://iptv-org.github.io/iptv/categories/sports.m3u';
const INT_KEYWORDS = [
  'fifa', 'world cup', 'football', 'cricket', 'espn', 'sport',
  'eurosport', 'dazn', 'fox sports', 'beinsport',
];
const INT_PRIORITY: string[] = [];

const SERVERS_PER_MATCH = 5;
const QUALITY_MAP: Record<number, string> = {
  0: 'FHD',
  1: 'HD',
  2: 'SD',
  3: 'Backup 1',
  4: 'Backup 2',
};

// ---------- Types ----------

type ScrapedStream = {
  match_id: string;
  server_name: string;
  stream_url: string;
  quality: string;
  is_active: boolean;
  sort_order: number;
};

type M3UEntry = { name: string; url: string };

// ---------- Helpers ----------

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.get('authorization') === `Bearer ${secret}`) return true;
  if (req.nextUrl.searchParams.get('cron_secret') === secret) return true;
  return false;
}

function parseM3U(text: string): M3UEntry[] {
  const entries: M3UEntry[] = [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let pendingName = '';
  for (const line of lines) {
    if (line.startsWith('#EXTINF')) {
      const commaIdx = line.lastIndexOf(',');
      pendingName = commaIdx !== -1 ? line.slice(commaIdx + 1).trim() : '';
    } else if (/^https?:\/\//i.test(line)) {
      entries.push({ name: pendingName, url: line });
      pendingName = '';
    }
  }
  return entries;
}

function filterByKeywords(
  entries: M3UEntry[],
  keywords: string[],
  priority: string[]
): string[] {
  const matched = entries.filter((e) =>
    keywords.some((kw) => e.name.toLowerCase().includes(kw))
  );
  const hi = matched.filter((e) => priority.some((p) => e.name.toLowerCase().includes(p)));
  const lo = matched.filter((e) => !priority.some((p) => e.name.toLowerCase().includes(p)));
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const e of [...hi, ...lo]) {
    if (!seen.has(e.url)) { seen.add(e.url); urls.push(e.url); }
  }
  return urls;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchM3U(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'StreamZone-Scraper/1.0' },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.text();
}

// ---------- Route ----------

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing Supabase env vars' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // ---- 1. Fetch all BD sources + International source in parallel ----
  const allRequests = [
    ...BD_SOURCES.map((url) => ({ label: `BD:${url.split('/').at(-2)}`, url, isBD: true })),
    { label: 'International Sports', url: INT_SOURCE, isBD: false },
  ];

  const results = await Promise.allSettled(
    allRequests.map(({ url }) => fetchM3U(url))
  );

  const diagnostics: Record<string, unknown> = {};
  const bdEntries: M3UEntry[] = [];
  const intEntries: M3UEntry[] = [];

  results.forEach((result, i) => {
    const { label, isBD } = allRequests[i];
    if (result.status === 'rejected') {
      console.error(`[scraper] ${label} failed:`, result.reason);
      diagnostics[label] = { error: String(result.reason) };
      return;
    }
    const entries = parseM3U(result.value);
    diagnostics[label] = { total: entries.length };
    if (isBD) {
      bdEntries.push(...entries);
    } else {
      intEntries.push(...entries);
    }
  });

  // ---- 2. Filter each pool by keywords (BD heavily prioritises T Sports, GTV, Jamuna) ----
  const bdUrls = filterByKeywords(bdEntries, BD_KEYWORDS, BD_PRIORITY);
  const intUrls = filterByKeywords(intEntries, INT_KEYWORDS, INT_PRIORITY);

  console.log(`[scraper] BD matched: ${bdUrls.length}, International matched: ${intUrls.length}`);
  diagnostics['_summary'] = { bd_matched: bdUrls.length, int_matched: intUrls.length };

  // ---- 3. Merge: BD first (already priority-sorted), then shuffled international ----
  const combinedUrls = [...bdUrls, ...shuffle(intUrls)];

  if (combinedUrls.length === 0) {
    return NextResponse.json({
      message: 'No matching stream URLs found across all sources.',
      diagnostics,
      scraped: 0,
      upserted: 0,
    });
  }

  console.log(`[scraper] Combined pool: ${combinedUrls.length} URLs`);

  // ---- 4. Fetch live matches ----
  const { data: liveMatches, error: matchErr } = await supabaseAdmin
    .from('matches')
    .select('id, team_a, team_b')
    .eq('status', 'live')
    .order('created_at', { ascending: true });

  if (matchErr) {
    return NextResponse.json({ error: matchErr.message }, { status: 500 });
  }
  if (!liveMatches || liveMatches.length === 0) {
    return NextResponse.json({
      message: 'No live matches to assign streams to.',
      diagnostics,
      scraped: combinedUrls.length,
      upserted: 0,
    });
  }

  // ---- 5. Build upsert rows (round-robin, up to SERVERS_PER_MATCH per match) ----
  const needed = liveMatches.length * SERVERS_PER_MATCH;
  const pool = combinedUrls.slice(0, needed);

  const rows: ScrapedStream[] = pool.map((url, idx) => {
    const matchIndex = idx % liveMatches.length;
    const slot = Math.floor(idx / liveMatches.length) % SERVERS_PER_MATCH;
    return {
      match_id: liveMatches[matchIndex].id,
      server_name: `Server ${slot + 1}`,
      stream_url: url,
      quality: QUALITY_MAP[slot] ?? 'Backup 2',
      is_active: true,
      sort_order: slot + 1,
    };
  });

  // ---- 6. Upsert ----
  const { error: upsertErr, count } = await supabaseAdmin
    .from('streams')
    .upsert(rows, { onConflict: 'match_id,server_name', count: 'exact' });

  if (upsertErr) {
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Scrape completed successfully.',
    diagnostics,
    scraped: combinedUrls.length,
    assigned: rows.length,
    upserted: count ?? rows.length,
    matches_updated: liveMatches.length,
    servers_per_match: SERVERS_PER_MATCH,
    sample_urls: combinedUrls.slice(0, 10),
  });
}
