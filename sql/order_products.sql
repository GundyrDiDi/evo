CREATE OR REPLACE PROCEDURE update_order(
  order_id UUID,
  updated_items JSONB -- 格式: [{"product_id": "xxx", "quantity": 2}, ...]
)
LANGUAGE plpgsql  -- 使用PL/pgSQL语言
AS $$
DECLARE
  old_total DECIMAL(10,2);  -- 用于存储原订单总金额
  new_total DECIMAL(10,2) := 0;  -- 用于计算新订单总金额，初始化为0
  item RECORD;  -- 用于循环处理新商品项的记录
  old_item RECORD;  -- 用于循环处理原订单商品的记录
  stock_adjustment INTEGER;  -- 未使用，可以删除
BEGIN
  -- 开始事务（在存储过程中，我们使用BEGIN...EXCEPTION块来捕获异常并回滚）
  BEGIN
    -- 1. 锁定订单记录，防止其他事务同时修改
    PERFORM 1 FROM orders WHERE id = order_id FOR UPDATE;
    
    -- 锁定所有涉及的商品（包括原订单中的商品和更新后的商品）
    PERFORM 1 FROM products
    WHERE id IN (
      -- 原订单中的商品ID
      SELECT product_id FROM order_products WHERE order_id = update_order.order_id
      UNION
      -- 新订单中的商品ID（从传入的JSONB中提取）
      SELECT (item->>'product_id')::UUID
      FROM jsonb_array_elements(updated_items) item
    )
    FOR UPDATE;  -- 行级锁，直到事务结束释放

    -- 2. 获取原订单的总金额写入 old_total
    SELECT total_amount INTO old_total FROM orders WHERE id = order_id;

    -- 3. 计算新订单的总金额：遍历更新后的商品列表，计算每个商品（当前价格*数量）的总和，写入 new_total
    SELECT SUM(p.price * i.quantity) INTO new_total
    FROM jsonb_to_recordset(updated_items) AS i(product_id UUID, quantity INT)
    JOIN products p ON p.id = i.product_id;

    -- 4. 处理库存调整
    -- 4.1 恢复原订单中所有商品的库存（因为订单修改，原商品被移除或数量减少，所以先加回库存）
    FOR old_item IN SELECT * FROM order_products WHERE order_id = update_order.order_id
    LOOP
      UPDATE products
      SET stock = stock + old_item.quantity  -- 将原购买数量加回到库存
      WHERE id = old_item.product_id;
    END LOOP;

    -- 4.2 更新新商品库存（即根据更新后的订单扣除库存）
    FOR item IN SELECT * FROM jsonb_to_recordset(updated_items) 
                AS x(product_id UUID, quantity INT)
    LOOP
      -- 检查库存：如果当前库存小于要购买的数量，则抛出异常
      IF (SELECT stock FROM products WHERE id = item.product_id) < item.quantity THEN
        RAISE EXCEPTION '商品库存不足: %', item.product_id;
      END IF;
      
      -- 减少库存：扣除新订单中该商品的数量
      UPDATE products
      SET stock = stock - item.quantity
      WHERE id = item.product_id;
    END LOOP;

    -- 5. 更新订单商品明细
    -- 5.1 删除原订单中的所有商品记录
    DELETE FROM order_products WHERE order_id = update_order.order_id;
    
    -- 5.2 插入新的商品记录（使用当前价格）
    INSERT INTO order_products (order_id, product_id, quantity, price_at_purchase)
    SELECT 
      order_id,
      (item->>'product_id')::UUID,
      (item->>'quantity')::INT,
      p.price  -- 使用当前价格
    FROM jsonb_array_elements(updated_items) item
    JOIN products p ON p.id = (item->>'product_id')::UUID;

    -- 6. 更新订单信息：设置新的总金额和更新时间
    UPDATE orders
    SET 
      total_amount = new_total,
      updated_at = NOW()
    WHERE id = order_id;

    -- 提交事务（如果没有异常，则提交）
    COMMIT;
  EXCEPTION
    -- 如果发生任何异常，回滚事务并重新抛出异常
    WHEN others THEN
      ROLLBACK;
      RAISE;
  END;
END;
$$;