// 将database的ts定义转化成js的类型变量

export type Table_Name = keyof Database["public"]["Tables"];

export type Base_Type = "string" | "number" | "bool" | "date" | "object";

const defineTypes = <T>(tables: {
  [P in Table_Name]: {
    [K in keyof Tables<P>]?: T;
  };
}) => tables;

export type Value_Type = Base_Type | Enum_Name;

export type Column_Type = Value_Type | `${Value_Type}[]`;

export const parseType = (ct: Column_Type) => {
  return {
    type: ct.replace(/\[\]$/, "") as Value_Type,
    asArray: /\[\]$/.test(ct),
  };
};

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
  Object.keys(c).forEach((p) => {
    c[p].name = p;
    const type: Column_Type = ct[p] ?? "string";
    c[p]._type = type;
  });
  return c as {
    [P in K & keyof C]: {
      name: P;
      value?: P extends keyof T ? Exclude<T[P], null> : never;
      _type: Column_Type;
    } & C[P];
  };
};
