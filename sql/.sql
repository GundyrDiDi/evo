INSERT INTO tags (name) 
VALUES 
  ('银河城'),
  ('arpg'),
  ('act'),
  ('style act'),
  ('回合制'),
  ('avg')
ON CONFLICT (name) DO NOTHING; 
