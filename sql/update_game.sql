CREATE OR REPLACE PROCEDURE update_game_tags(
  in_game_name TEXT,
  in_updated_tags JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- 验证JSON输入是否为数组
  IF jsonb_typeof(in_updated_tags) <> 'array' THEN
    RAISE EXCEPTION '参数必须是JSON数组';
  END IF;

  -- 开始事务
  BEGIN
    -- 1. 插入新标签（忽略已存在的主键冲突）
    INSERT INTO _link_game_tag (game_name, game_tag)
    SELECT in_game_name, tag_value
    FROM jsonb_array_elements_text(in_updated_tags) AS tags(tag_value)
    ON CONFLICT (game_name, game_tag) DO NOTHING;

    -- 2. 删除不存在于新标签列表中的旧标签
    DELETE FROM _link_game_tag AS lgt
    WHERE lgt.game_name = in_game_name
      AND lgt.game_tag NOT IN (
        SELECT tag_value
        FROM jsonb_array_elements_text(in_updated_tags) AS tags(tag_value)
      );

    -- 提交事务
    COMMIT;
    
  EXCEPTION
    WHEN others THEN
      -- 如果发生任何异常，回滚事务并重新抛出异常
      ROLLBACK;
      RAISE EXCEPTION '标签更新失败：%', SQLERRM;
  END;
END;
$$;

update_game_tags(
    'test_game', 
    '["action", "strategy", "simulation"]'::jsonb
);