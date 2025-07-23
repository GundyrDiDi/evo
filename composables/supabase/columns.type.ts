// 将database的ts定义转化成js的类型变量
// 不可行，存在真实的值并不是声明的类型的情况，并且在使用中没有意思

// export type Base_Type =
//   | "string"
//   | "number"
//   | "enum"
//   | "bool"
//   | "date"
//   | "object";

// export type Value_Type = Base_Type | Enum_Name;

// export type Column_Type = Value_Type | `${Value_Type}[]`;

// const defineTypes = <T>(tables: {
//   [P in Table_Name]: {
//     [K in keyof Tables<P>]?: T;
//   };
// }) => tables;

// export const column_type = defineTypes<Column_Type>({
//   game: {
//     id: "number",
//     alias: "string[]",
//     tags: "object[]",
//     platform: "platform",
//     edition: "edition",
//     status: "complete_status",
//     heart: "bool",
//     extra: "bool",
//     owned: "bool",
//   },
//   game_tag: {
//     id: "number",
//   },
//   _relations_dlc: {
//     id: "number",
//   },
//   _relations_game_tag: {
//     id: "number",
//   },
//   _relations_tag: {
//     id: "number",
//   },
// });

// export type CType = {
//   valueType: Value_Type;
//   asArray: boolean;
//   enums?: Enum_Data;
// };
// // 工具函数
// export const parseType = (ct: Column_Type) => {
//   const valueType = ct.replace(/\[\]$/, "");
//   return {
//     valueType,
//     asArray: /\[\]$/.test(ct),
//     enums: Enum[valueType],
//   } as CType;
// };

// //
// export const useColumnType = (getCt: () => Column_Type) => {
//   const cType = computed(() => parseType(getCt()));
//   return cType;
// };
