// 将database的ts定义转化成js的类型变量
export type Table_Name = keyof Database["public"]["Tables"];

export type Base_Type =
  | "string"
  | "number"
  | "enum"
  | "bool"
  | "date"
  | "object";

export type Value_Type = Base_Type | Enum_Name;

export type Column_Type = Value_Type | `${Value_Type}[]`;

const defineTypes = <T>(tables: {
  [P in Table_Name]: {
    [K in keyof Tables<P>]?: T;
  };
}) => tables;

export const column_type = defineTypes<Column_Type>({
  game: {
    id: "number",
    alias: "string[]",
    tags: "object[]",
    platform: "platform",
    edition: "edition",
    status: "complete_status",
    heart: "bool",
    extra: "bool",
    owned: "bool",
  },
  game_tag: {
    id: "number",
  },
  _relations_dlc: {
    id: "number",
  },
  _relations_game_tag: {
    id: "number",
  },
  _relations_tag: {
    id: "number",
  },
});

export const defineColumn = <
  E extends Table_Name,
  K extends keyof Tables<E>,
  C extends { [P in K]?: unknown },
  T = Tables<E>
>(
  e: E,
  c: C,
  ct = column_type[e]
) => {
  // value一般用于筛选项的定义
  type Value<T> = null extends T ? { value?: Exclude<T, null> } : { value: T };

  Object.keys(c).forEach((p) => {
    c[p].name = p;
    const type: Column_Type = ct[p] ?? "string";
    c[p]._type = type;
  });
  return c as {
    [P in keyof C]: {
      name: P;
      _type: Column_Type;
    } & Value<P extends keyof T ? T[P] : never> &
      C[P];
  };
};

export type CType = {
  valueType: Value_Type;
  asArray: boolean;
  enums?: Enum_Data;
};
// 工具函数
export const parseType = (ct: Column_Type) => {
  const valueType = ct.replace(/\[\]$/, "");
  return {
    valueType,
    asArray: /\[\]$/.test(ct),
    enums: Enum[valueType],
  } as CType;
};

//
export const useColumnType = (getCt: () => Column_Type) => {
  const cType = computed(() => parseType(getCt()));
  return cType;
};
