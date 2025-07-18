export type Enum_Name = keyof Database["public"]["Enums"];

// 通用枚举定义
export type Enum_Data<T extends Enum_Name = Enum_Name> = {
  [P in Enums<T>]: {
    value: P;
    label?: string;
  };
};

const defineEnum = <
  E extends Enum_Name,
  C extends { [P in Enums<E>]: unknown }
>(
  e: E,
  c: C
) => {
  Object.keys(c).forEach((p) => {
    c[p].value = p;
  });
  return c as { [P in Enums<E>]: { value: P } & C[P] };
};

let complete_status = defineEnum("complete_status", {
  running: {
    label: "正在玩",
  },
  completed: {
    label: "完成",
  },
  abandoned: {
    label: "放弃",
  },
  set_aside: {
    label: "之后再玩",
  },
  not_started: {
    label: "还没开始",
  },
  not_published: {
    label: "还没发行",
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
