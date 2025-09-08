import z, { ZodAny, ZodObject } from "zod";

export const useGameColumn = () => Columns.game;

export type GameColumns = Pick<
  Required<Columns_Type["game"]>,
  keyof typeof Columns.game
>;

//
export const useGameDTODefault = () => {
  const d: Partial<GameDTO> = {
    name: "",
    platform: ["pc"],
    edition: "standard",
    status: "not_start",
    owned: false,
  };
  return d as GameDTO;
};

export type GameDTO = Tables<"game"> & {};

export const before_play_status = [
  null,
  "not_published",
  "not_start",
  "look_forward",
] as Enums<"complete_status">[];

// const played = ['abandon', 'finished', 'mastery'] as Enums<'complete_status'>[]

export const injectGameRow = (data: Tables<"game">) => {
  // 添加计算字段
  return Object.assign(data, {});
};

const partialZod = <
  U extends z.ZodObject,
  K extends keyof U["shape"],
  I extends "invert" | ""
>(
  zod: U,
  partProps: K[] = Object.values(zod) as K[],
  invert: I = "" as I
) => {
  if (invert === "invert") {
    return partialZod(
      zod,
      Object.keys(zod.shape).filter((v: any) => !partProps.includes(v))
    );
  }
  const optional = partProps.reduce((a, k: any) => {
    return {
      [k]: zod.shape[k].nullish(),
      ...a,
    };
  }, {});
  return zod.extend(optional) as z.ZodObject<{
    [P in keyof U["shape"]]: typeof invert extends "invert"
      ? P extends K
        ? U["shape"][P]
        : z.ZodOptional<z.ZodNullable<U["shape"][P]>>
      : P extends K
      ? z.ZodOptional<z.ZodNullable<U["shape"][P]>>
      : U["shape"][P];
  }>;
};

const pickZod = <
  U extends z.ZodObject,
  K extends keyof U["shape"],
  I extends "invert" | ""
>(
  zod: U,
  filter: K[] = [],
  invert: I = "" as I
) => {
  const shape = _pick(
    zod.shape as any,
    invert
      ? (Object.keys(zod.shape).filter((v: any) => !filter.includes(v)) as any)
      : filter
  );
  type C = typeof invert extends "invert" ? Exclude<keyof U["shape"], K> : K;
  return z.object(shape) as z.ZodObject<{
    [P in C]: U["shape"][P];
  }>;
};

// 校验和数据的类型定义是分开的
const defineZod = <
  T extends Table_Name,
  U extends { [P in keyof Tables<T>]?: any }
>(
  a: T,
  o: U
) => z.object(o);

// 查询,提交的过滤和校验
export const useGameZod = defineStore("game_zod", () => {
  //
  const allGame = defineZod("game", {
    alias: z.array(z.string().trim().min(1)),
    finish_date: z.iso.date(),
    publish_date: z.iso.date(),
    edition: z.enum(Constants.public.Enums.edition),
    dlc_associated_game: z.number(),
    id: z.int().readonly(),
    judgment: z.string(),
    name: z.string().trim().min(1),
    owned: z.boolean(),
    platform: z.array(z.enum(Constants.public.Enums.platform)),
    remark: z.string(),
    series: z.string(),
    status: z.enum(Constants.public.Enums.complete_status),
    tier: z.string(),
    user_id: z.string(),
    play_time: z.number(),
    tags: z.array(z.string()),
  });

  const insertGame = partialZod(
    pickZod(allGame, ["id"], "invert"),
    ["name"],
    "invert"
  );

  // const { data, error } = insertGame.safeParse({ name: " 1", alias: [" cc"] });
  // console.log(data, error);
  //
  const upsertGame = partialZod(allGame, ["id", "name"], "invert");
  //
  return {
    insertGame,
    upsertGame,
  };
});

type GameRPC = {
  get_game_with_tags: GameDTO;
};
