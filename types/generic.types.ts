export type RecordValue<T>=T[keyof T]

export type Affix<T extends string, U extends string> = `${T}_${U}`;