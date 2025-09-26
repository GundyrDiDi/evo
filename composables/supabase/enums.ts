export type Enum_Name = keyof Database["public"]["Enums"];

// 通用枚举定义
export type Enum_Value<P = string> = {
  value: P;
  label?: string;
  icon?: string;
  color?: string;
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
    icon: "⏰",
  },
  not_start: {
    label: "还没开始",
    icon: "📋",
  },
  look_forward: {
    label: "相当期待",
    icon: "🌟",
  },
  running: {
    label: "正在玩",
    icon: "🎮",
  },
  abandon: {
    label: "放弃",
    icon: "🗑️",
  },
  set_aside: {
    label: "之后再玩",
    icon: "⌛️",
  },
  finish: {
    label: "通关",
    icon: "🏆",
  },
  mastery: {
    label: "修炼",
    icon: "💪",
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

// tier等级更多是基于在同一类型游戏中的表现，比如
// S为独一无二(比如个人年度)的作品，A为佳作，B为平庸，C以下为不值得玩，D则表示对精神造成创伤
// 同等级中“+”代表存在差距但不大(比如S与A+的差距比A+与A的差距会大得多)，更多是个人喜好，或者品味
let tier = defineEnum("g_tier", {
  "S+": {
    color: "#FF5252",
  },
  S: {
    color: "#FF6E6E",
  },
  "A+": {
    color: "#FF8A65",
  },
  A: {
    color: "#FFB74D",
  },
  "B+": {
    color: "#A5D6A7",
  },
  B: {
    color: "#66BB6A",
  },
  C: {
    color: "#64B5F6",
  },
  D: {
    color: "#BA68C8",
  },
});

export const Enum = {
  complete_status,
  platform,
  edition,
  tier,
} as const;

//
export type Enums_Type = {
  [P in Enum_Name]: Enum_Data<P>;
};

export const _Enums = Constants.public.Enums;
