export type RowGameList = Tables<"game_list">;

export type RowGameTags = Tables<"game_tags">;

export type RowEvo = RowGameList | RowGameTags;

export type EnumValueType =
  | "number"
  | "text"
  | "bool"
  | "date"
  | "enum"
  | "json"
  | "text_list";

type Config<Row extends RowEvo> = {
  [P in keyof Row]: {
    label: string;
    readonly?: boolean;
    value?: Exclude<Row[P], null>;
    type?: EnumValueType;
    enums?: Record<string, { value: string; label: string }>;
  };
};

export const game_list: Config<RowGameList> = {
  id: {
    label: "id",
    readonly: true,
  },
  user_id: {
    label: "user_id",
    readonly: true,
  },
  created_at: {
    label: "创建时间",
    readonly: true,
  },
  name: {
    label: "名称",
  },
  alias: {
    label: "别名",
    type: "text_list",
  },
  heart: {
    label: "红心",
    type: "bool",
  },
  judgment: {
    label: "评价",
  },
  platform: {
    label: "平台",
    type: "enum",
    enums: enumData["platform"],
  },
  remark: {
    label: "其他信息",
  },
  tags: {
    label: "标签",
    type: "text_list",
  },
  complete_time: {
    label: "完成时间",
    type: "date",
  },
  status: {
    label: "状态",
    type: "enum",
    enums: enumData["complete_status"],
  },
  game_type: {
    label: "",
    type: "enum",
    enums: enumData["game_type"],
  },
};

export const game_tags: Config<RowGameTags> = {
  id: {
    label: "",
  },
  created_at: {
    label: "",
  },
  name: {
    label: "标签",
  },
  parents: {
    label: "父级",
  },
  children: {
    label: "子级",
  },
};

const useRow = <T extends Config<RowEvo>>(row: T) => {
  return function <
    Merge extends { [P in keyof T]?: any },
    Key extends keyof Merge,
    Key2 extends keyof T,
    Convert extends <K extends Key>(
      k: K,
      v: K extends Key2 ? Merge[K] & T[K] : K extends Key ? Merge[K] : never
    ) => any
  >(merge: Merge, convert: Convert) {
    Object.keys(merge).forEach((v) => {
      const k = v as Key & Key2;
      merge[k] = {
        ...row[k],
        ...merge[k],
        ...convert(k, {
          ...row[k],
          ...merge[k],
        }),
      };
    });
    return merge as {
      [P in Key]: ReturnType<Convert> & T[P extends Key2 ? P : Key2];
    };
  };
};

export const useGameList = useRow(game_list);

export const useGameTags = useRow(game_tags);
