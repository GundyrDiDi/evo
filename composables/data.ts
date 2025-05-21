import type { TableColumn } from "@nuxt/ui";

export type DataGameList = Tables<"game-list">;

export enum ValueType {
  text,
  textList,
  bool,
  enum,
  date,
}

export type DefineData<
  T,
  U extends {
    [P in keyof T]?: any;
  } & { _?: any } = {}
> = {
  [P in keyof T]: {
    label: string;
    value?: Exclude<T[P], null>;
  } & (U[P] extends undefined ? U["_"] : U[P] & U["_"]);
};

export const BaseGameList: DefineData<
  DataGameList,
  { _: { type?: ValueType; readonly?: boolean } }
> = {
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
    type: ValueType.textList,
  },
  heart: {
    label: "红心",
    type: ValueType.bool,
  },
  judgment: {
    label: "评价",
  },
  platform: {
    label: "平台",
    type: ValueType.enum,
  },
  remark: {
    label: "其他信息",
  },
  tags: {
    label: "标签",
  },
  complete_time: {
    label: "完成时间",
    type: ValueType.date,
  },
  status: {
    label: "状态",
    type: ValueType.enum,
  },
};

export const EnumCompleteStatus: Record<
  Enums<"complete_status">,
  { label: string }
> = {
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
};

export const EnumPlatForm: Record<Enums<"platform">, { label: string }> = {
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
};

const useBase = (<T extends Object>(base: T) => {
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
        ...base[k],
        ...merge[k],
        ...convert(k, {
          ...base[k],
          ...merge[k],
        }),
      };
    });
    return merge as {
      [P in Key]: ReturnType<Convert> & T[P extends Key2 ? P : Key2];
    };
  };
})(BaseGameList);

export const gameColumnMap = useBase(
  {
    name: {},
    alias: {},
    tags: {},
    status: {},
    complete_time: {},
    heart: {},
    platform: {},
    judgment: {},
    remark: {},
  },
  (k, v) => {
    const t: TableColumn<DataGameList> = {
      id: k,
      accessorKey: k,
      header: v.label,
      meta: {
        class: {
          th: " text-center",
          td: " text-center p-0",
        },
      },
    };
    return t;
  }
);
