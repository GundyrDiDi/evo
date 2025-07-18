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

-- 复制一条数据


-- 关联标签列表
CREATE OR REPLACE FUNCTION get_orders_with_tags(user_id uuid)
RETURNS TABLE (
  id uuid, 
  user_id uuid, 
  amount numeric,
  created_at timestamp,
  tags jsonb
) 
LANGUAGE SQL
AS $$
  SELECT 
      orders.id,
      orders.user_id,
      orders.amount,
      orders.created_at,
      COALESCE(
          JSONB_AGG(JSONB_BUILD_OBJECT('id', tags.id, 'name', tags.name, 'color', tags.color)) 
          FILTER (WHERE tags.id IS NOT NULL),
          '[]'::jsonb
      ) AS tags
  FROM orders
  LEFT JOIN order_tags ON order_tags.order_id = orders.id
  LEFT JOIN tags ON order_tags.tag_id = tags.id
  WHERE orders.user_id = $1
  GROUP BY orders.id;
$$;