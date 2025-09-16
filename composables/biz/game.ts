import z, { ZodAny, ZodObject } from "zod";

export type GameDTO = Tables<"game"> & {};

export const useGameColumn = () => Columns.game;

export type GameColumns = Pick<
  Required<Columns_Type["game"]>,
  keyof typeof Columns.game
>;

export const injectGameRow = (data: GameDTO) => {
  // 添加计算字段
  return Object.assign(data, {});
};

//
export const useGame = defineStore("game_table", () => {
  const useGameColumn = () => Columns.game;

  // zod schema
  const { insertGame, updateGame, filterGame } = useGameZod();

  // 返回 {筛选项，搜索查询条件}
  const useFilter = () => {
    //
  };

  const query = async (params) => {
    // todo:处理条件
    const { error } = filterGame.safeParse(params);
    // const {data}=await client.rpc('',{})`
    const { data } = await selectTable("game[]")
      .order("created_at", {
        ascending: false,
      })
    return data?.map((v) => injectGameRow(v)) ?? [];
  };

  const upsert = async (row: GameDTO, type: "create" | "update" = "create") => {
    const zod = type === "create" ? insertGame : updateGame;
    const { data, error } = zod.safeParse(row);
    if (error) {
      alert(error);
      return { data, error };
    } else {
      const res = await upsertTable("game", data);
      return res;
    }
  };

  return {
    insertGame,
    updateGame,
    filterGame,
    query,
    upsert,
    useFilter,
    useGameColumn,
  };
});

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

const partialZod = <
  U extends z.ZodObject,
  K extends keyof U["shape"],
  I extends "invert" | ""
>(
  zod: U,
  partProps: K[] = Object.keys(zod.shape) as K[],
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

// 查询，新增，更新的过滤和校验，并修改转换 比如 trim()
export const useGameZod = defineStore("game_zod", () => {
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

  const filterGame = partialZod(allGame);

  const insertGame = partialZod(
    pickZod(allGame, ["id"], "invert"),
    ["name"],
    "invert"
  );

  const updateGame = partialZod(allGame, ["id", "name"], "invert");

  // const { data, error } = insertGame.safeParse({ name: " 1", alias: [" cc"] });
  // console.log(data, error);

  return {
    filterGame,
    insertGame,
    updateGame,
  };
});

/**
 *
 */
type GameRPC = {
  get_game_with_tags: GameDTO;
};
