export type Enum_Name = keyof Database["public"]["Enums"];

// 通用枚举定义
export type Enum_Value<P = string> = {
  value: P;
  label?: string;
};

export type Enum_Data<T extends Enum_Name> = {
  [P in Enums<T>]: Enum_Value<P>;
};

const defineEnum = <
  E extends Enum_Name,
  C extends { [P in Enums<E>]: Omit<Enum_Value<P>, "value"> }
>(
  e: E,
  c: C
) => {
  let s = {};
  Object.keys(c).forEach((p) => {
    s[p] = {
      ...c[p],
      value: p,
    };
  });
  return s as { [P in Enums<E>]: Enum_Value<P> & C[P] };
};

let complete_status = defineEnum("complete_status", {
  not_published: {
    label: "还没发行",
  },
  not_started: {
    label: "还没开始",
  },
  look_forward: {
    label: "🌟",
  },
  running: {
    label: "正在玩",
  },
  abandoned: {
    label: "放弃",
  },
  set_aside: {
    label: "之后再玩",
  },
  completed: {
    label: "完成",
  },
  mastery: {
    label: "精进",
  },
});

let platform = defineEnum("platform", {
  pc: {
    label: "PC",
  },
  ps: {
    label: "PS",
  },
  xbox: {
    label: "Xbox",
  },
  ns: {
    label: "NS",
  },
});

let edition = defineEnum("edition", {
  standard: {
    label: "标准版",
  },
  complete: {
    label: "完全版",
  },
  deluxe: {
    label: "豪华版",
  },
});

export const Enum = {
  complete_status,
  platform,
  edition,
} as const;

export type Enums_Type = {
  [P in Enum_Name]: Enum_Data<P>;
};
