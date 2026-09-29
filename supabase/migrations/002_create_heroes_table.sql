CREATE TABLE IF NOT EXISTS heroes (
  id BIGSERIAL PRIMARY KEY,
  img TEXT NOT NULL,
  kicker TEXT NOT NULL,
  title TEXT NOT NULL,
  sub TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Heroes are readable by everyone" ON heroes FOR SELECT USING (true);
CREATE POLICY "Heroes can be inserted by users" ON heroes FOR INSERT WITH CHECK (true);
CREATE POLICY "Heroes can be updated by users" ON heroes FOR UPDATE USING (true);
CREATE POLICY "Heroes can be deleted by users" ON heroes FOR DELETE USING (true);

INSERT INTO heroes (img, kicker, title, sub, sort_order) VALUES
('/images/hero.jpg', 'Sigiriya • Cultural Triangle', 'The Island of Endless Wonder', 'Ancient fortresses, misty tea hills, wild safaris and golden beaches — all in one magical island.', 0),
('/images/dest-ella.jpg', 'Ella • Hill Country', 'Ride the Most Beautiful Railway on Earth', 'Cross the Nine Arch Bridge and wind through emerald tea estates on an unforgettable train journey.', 1),
('/images/dest-mirissa.jpg', 'Mirissa • South Coast', 'Turquoise Seas & Coconut Dreams', 'Whale watching, surfing and barefoot sunsets on the palm-fringed shores of the south coast.', 2),
('/images/dest-yala.jpg', 'Yala • Wild South', 'Meet Leopards & Gentle Giants', 'Game drives through untamed wilderness with expert trackers and luxury 4x4 safaris.', 3);
