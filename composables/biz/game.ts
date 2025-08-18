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
    status: "not_started",
  };
  return d as GameDTO;
};

export type GameDTO = Tables<"game"> & {
  cpt_date: string | null;
};

export const injectGameRow = (data: Tables<"game">) => {
  // complete_time 转成 iso 格式
  data.complete_time = data.complete_time && _iso(data.complete_time);
  const cpt_date = data.complete_time
    ? dayjs(data.complete_time).format("MM/YY")
    : null;
  // 添加计算字段
  return Object.assign(data, { cpt_date });
};

// 校验和数据的类型定义是分开的
const defineGameZod = <U extends { [P in keyof GameDTO]?: any }>(o: U) =>
  z.object(o);

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

// 查询,提交的校验
export const useGameZod = defineStore("game_zod", () => {
  //
  const allGame = defineGameZod({
    alias: z.array(z.string()),
    complete_time: z.iso.datetime(),
    edition: z.enum(Constants.public.Enums.edition),
    extra: z.boolean(),
    id: z.int().readonly(),
    judgment: z.string(),
    name: z.string(),
    owned: z.boolean(),
    platform: z.array(z.enum(Constants.public.Enums.platform)),
    remark: z.string(),
    series: z.string(),
    status: z.enum(Constants.public.Enums.complete_status),
    tier: z.string(),
    user_id: z.string(),
  });

  const upsertGame = partialZod(
    pickZod(allGame, ["id"], "invert"),
    ["name"],
    "invert"
  );
  //
  return {
    upsertGame,
  };
});

type GameRPC = {
  get_game_with_tags: GameDTO;
};
