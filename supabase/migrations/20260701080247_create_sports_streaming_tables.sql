
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='announcements' AND policyname='select_announcements') THEN
    CREATE POLICY "select_announcements" ON announcements FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='announcements' AND policyname='insert_announcements') THEN
    CREATE POLICY "insert_announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='announcements' AND policyname='update_announcements') THEN
    CREATE POLICY "update_announcements" ON announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='announcements' AND policyname='delete_announcements') THEN
    CREATE POLICY "delete_announcements" ON announcements FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_a text NOT NULL,
  team_b text NOT NULL,
  team_a_flag text,
  team_b_flag text,
  sport text NOT NULL DEFAULT 'Football',
  league text,
  match_time timestamptz,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('live', 'upcoming', 'finished')),
  score_a int DEFAULT 0,
  score_b int DEFAULT 0,
  thumbnail text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matches' AND policyname='select_matches') THEN
    CREATE POLICY "select_matches" ON matches FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matches' AND policyname='insert_matches') THEN
    CREATE POLICY "insert_matches" ON matches FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matches' AND policyname='update_matches') THEN
    CREATE POLICY "update_matches" ON matches FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matches' AND policyname='delete_matches') THEN
    CREATE POLICY "delete_matches" ON matches FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  server_name text NOT NULL,
  stream_url text NOT NULL,
  quality text DEFAULT 'HD',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE streams ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='streams' AND policyname='select_streams') THEN
    CREATE POLICY "select_streams" ON streams FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='streams' AND policyname='insert_streams') THEN
    CREATE POLICY "insert_streams" ON streams FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='streams' AND policyname='update_streams') THEN
    CREATE POLICY "update_streams" ON streams FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='streams' AND policyname='delete_streams') THEN
    CREATE POLICY "delete_streams" ON streams FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
