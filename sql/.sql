-- 添加标签
INSERT INTO tags (name) 
VALUES 
  ('银河城'),
  ('arpg'),
  ('act'),
  ('style act'),
  ('回合制'),
  ('avg')
ON CONFLICT (name) DO NOTHING; 

-- 关联标签列表
