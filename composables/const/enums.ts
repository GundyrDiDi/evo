export type EnumMap = Database["public"]["Enums"];

type Config<Enum extends string | number> = {
  [P in Enum]: {
    value: P;
    label: string;
  };
};

export type EnumData = {
  [P in keyof EnumMap]: Config<EnumMap[P]>;
};

const setKeyInConfig = <T extends Object>(o: T, str = "value") => {
  Object.keys(o).forEach((k) => {
    o[k as keyof T] = {
      [str]: k,
      ...o[k as keyof T],
    };
  });
  return o;
};

export const enumData = {
  complete_status: setKeyInConfig({
    running: {
      label: "正在玩",
    },
    completed: {
      label: "完成",
    },
    abandoned: {
      label: "放弃",
    },
    frozen: {
      label: "之后再玩",
    },
    not_started: {
      label: "还没开始",
    },
    not_published: {
      label: "还没发行",
    },
  }),
  platform: setKeyInConfig({
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
  }),
} as EnumData;

export const enum_complete_status = Object.values(enumData.complete_status);

export const enum_platform = Object.values(enumData.complete_status);

export const useEnumData = <T extends keyof EnumData>(t: T) => {
  return Object.values(enumData[t]) as RecordValue<EnumData[T]>[];
};