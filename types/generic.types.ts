export type RecordValue<T> = T[keyof T];

export type Affix<T extends string, U extends string> = `${T}_${U}`;

export type Flat<T> = { [P in keyof T]: T[P] };

export type UnionToIntersection<T> = (
  T extends any ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Tree<T, K extends string = "children"> = T & { [P in K]?: T[] };

type FindEnumKey<_, T = Exclude<_, null>, U = Database["public"]["Enums"]> = {
  [P in keyof U]: U[P] extends T ? (T extends U[P] ? P : never) : never;
}[keyof U];

type EnumValues<T> = [T] extends [Enum_Name]
  ? T extends never
    ? {}
    : { enum_name: T }
  : {};

// type test1 = EnumValues<FindEnumKey<Tables<"game">["platform"]>>;
