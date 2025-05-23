export type RowGameList = Tables<"game_list">;

export type RowGameTags = Tables<"game_tags">;

export type RowEvo = RowGameList | RowGameTags;

export type Affix<T extends string, U extends string> = `${T}_${U}`;

export type EnumValueType =
  | "number"
  | "text"
  | "text_list"
  | "bool"
  | "date"
  | "json"
  | keyof EnumMap;

type Config<Row extends RowEvo> = {
  [P in keyof Row]: {
    label: string;
    readonly?: boolean;
    value?: Exclude<Row[P], null>;
    type?: EnumValueType;
    foregin?: any;
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
    type: "platform",
    foregin: enumData['platform']
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
    type: "complete_status",
    foregin: enumData['complete_status']
  },
};

export const game_tags: Config<RowGameTags> = {
  id: {
    label: "",
  },
  created_at: {
    label: "",
  },
  tag: {
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
      v: K extends Key2 ? Merge[K] & T[K] : never
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
