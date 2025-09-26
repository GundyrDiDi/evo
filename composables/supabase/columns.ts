export type Table_Name = keyof Database["public"]["Tables"];

// value一般用于筛选项的定义
type Value<T> = null extends T ? { value?: Exclude<T, null> } : { value: T };

// 通用列字段定义,遵循database转成的ts定义有哪些关联值，暂不增加多余的信息
export type Column_Value<T, P extends keyof T> = {
  name: P;
  label?: string;
  asArray?: boolean;
  // enums?: Valueof<Enums_Type>;
  // primaryKey?: boolean; 提交校验
  // filter?: (a: any) => T[P];
} & Value<T[P]>;

export type Column_Data<T extends Table_Name> = {
  [P in keyof Tables<T>]?: Column_Value<Tables<T>, P>;
};

export const typeGame = <
  K extends keyof Tables<"game">,
  R extends { [P in K]?: unknown }
>(
  r: R
) => r;

export const defineColumn = <
  E extends Table_Name,
  K extends keyof Tables<E>,
  C extends {
    [P in K]?: Omit<Column_Value<Tables<E>, P>, "value" | "name">;
  },
  T = Tables<E>
>(
  e: E,
  c: C
) => {
  Object.keys(c).forEach((p) => {
    c[p].name = p;
  });
  return c as {
    [P in keyof C]: P extends keyof T ? Column_Value<T, P> & C[P] : never;
  };
};

const game = defineColumn("game", {
  id: {},
  created_at: {
    label: "添加时间",
  },
  name: {
    label: "游戏名",
  },
  alias: {
    label: "别名",
    asArray: true,
  },
  platform: {
    label: "平台",
    enums: Enum.platform,
    asArray: true,
  },
  tags: {
    label: "标签",
    asArray: true,
  },
  series: {
    label: "系列",
  },
  dlc_associated_game: {
    label: "DLC本体",
  },
  remark: {
    label: "其他",
  },
  judgment: {
    label: "评价",
  },
  status: {
    label: "状态",
    enums: Enum.complete_status,
  },
  edition: {
    label: "版本",
    enums: Enum.edition,
  },
  publish_date: {
    label: "发售日",
  },
  finish_date: {
    label: "完成日期",
  },
  play_time: {
    label: "游戏时长",
  },
  owned: {
    label: "已拥有",
    map: {
      0: { label: "未购买", value: true },
      1: { label: "已购买", value: false },
    },
  },
  tier: {
    label: "等级",
    enums: Enum.tier,
  },
});

const game_tag = defineColumn("game_tag", {
  id: {},
  name: {
    label: "标签名",
  },
});

const _relations_tag = defineColumn("_relations_tag", {
  parent_id: {},
  child_id: {},
});

const _relations_dlc = defineColumn("_relations_dlc", {
  original_id: {},
  dlc_id: {},
});

const _relations_game_tag = defineColumn("_relations_game_tag", {
  game_id: {},
  tag_id: {},
});

export const Columns = {
  game,
  game_tag,
  _relations_dlc,
  _relations_tag,
  _relations_game_tag,
};

export type Columns_Type = {
  [P in Table_Name]: Column_Data<P>;
};

// 这里的类型定义用于逻辑，不应该在组件中使用业务的类型定义，保证组件的通用性
