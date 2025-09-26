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
export const useGame = () => {
  const gameColumns = Columns.game;

  // zod schema
  const { insertGame, updateGame } = useGameZod();

  // 排序
  const useSort = () => {
    const default_sort = "created_at,desc";

    const sort = useLocalStorage("sort_column", () => default_sort);

    const sortAscends = typeGame({
      created_at: "created_at,desc",
      name: "name,asc",
      tier: "tier,asc",
      platform: "platform,asc",
      play_time: "play_time,desc",
      finish_date: "finish_date,desc,first",
      publish_date: "publish_date,desc,first",
    });

    const sort_options = Object.entries(sortAscends).map(([k, v]) => ({
      value: v,
      text: gameColumns[k].label,
    }));

    const sort_params = computed(() => {
      const [name, ascending, nullsFirst] = (sort.value || default_sort).split(
        ","
      );
      return [
        name as keyof GameDTO,
        {
          ascending: ascending === "asc",
          nullsFirst: !!nullsFirst,
          referencedTable: null,
        },
      ] as const;
    });

    return {
      sort_options,
      sort_params,
      sort,
    };
  };

  // 筛选 将查询条件转化成sql查询语句 查询范式
  const useFilter = (key?: string) => {
    const filterSchema = z.object({
      name_or_alias: z.string().trim(),
      finish_date_range: z
        .string()
        .trim()
        .refine(
          (val) => {
            if (val === "") return true; // 允许空字符串
            // 检查是否为纯数字
            if (!/^\d+$/.test(val)) return false;
            // 检查长度：1-2位数字或6位数字
            if (![1, 2, 4, 6].includes(val.length)) return false;
            // 对于1-2位数字，验证月份范围(1-12)
            if (val.length <= 2) {
              const month = parseInt(val, 10);
              return month >= 1 && month <= 12;
            }
            if (val.length === 4) return true;
            // 对于6位数字，验证月份部分(最后两位)范围(01-12)
            if (val.length === 6) {
              const monthPart = val.substring(4);
              const month = parseInt(monthPart, 10);
              return month >= 1 && month <= 12;
            }
            return false;
          },
          {
            message:
              "必须是空字符串、月份(1-12)或年月格式(YYYYMM，其中MM必须是01-12)",
          }
        ),
      status: z.array(z.enum(_Enums.complete_status)),
      tiers: z.array(z.enum(_Enums.g_tier)),
      platforms: z.array(z.enum(_Enums.platform)),
      only_owned_or_not: z.boolean().nullish(),
      play_time_range: z.array(z.string().regex(/^\d*$/).optional()).max(2),
      tags: z.array(z.number()),
      series: z.string().trim(),
    });

    type Filter = z.infer<typeof filterSchema>;

    const _filter = reactive<Filter>({
      name_or_alias: "",
      finish_date_range: "",
      status: [],
      tiers: [],
      platforms: [],
      only_owned_or_not: null,
      play_time_range: [],
      tags: [],
      series: "",
    });

    const _builder = selectTable("game[]");
    type Builder = typeof _builder;

    const chains: {
      [k in keyof Filter]: (sql: Builder, v: Filter[k]) => Builder;
    } = {
      name_or_alias(sql, str) {
        return sql.or(`name.ilike.%${str}%,alias.cs.{${str}}`);
      },
      finish_date_range(sql, str) {
        const year =
          str.length >= 4 ? str.slice(0, 4) : new Date().getFullYear();
        const month = str.length >= 4 ? str.slice(4, 6) : str;
        const start_date = dayjs(year + month);
        const end_date = dayjs(year + month)
          .add(1, month ? "month" : "year")
          .add(-1, "day");
        return sql
          .gte("finish_date", start_date.format("YYYY-MM-DD"))
          .lte("finish_date", end_date.format("YYYY-MM-DD"));
      },
      status(sql, list) {
        return sql.in("status", list);
      },
      only_owned_or_not(sql, bool) {
        return bool ? sql.eq("owned", true) : sql.neq("owned", true);
      },
      play_time_range(sql, range) {
        const [min, max] = range;
        if (min) sql = sql.gte("play_time", min);
        if (max) sql = sql.or(`play_time.lt.${max},play_time.is.null`);
        return sql;
      },
      tiers(sql, list) {
        return sql.in("tier", list);
      },
      platforms(sql, list) {
        return sql.overlaps("platform", list);
      },
      series(sql, str) {
        return sql.ilike("series", `%${str}%`);
      },
      tags(sql, list) {
        // todo
        return sql.contains("tags", list);
      },
    };

    const labels: { name: keyof Filter; label?: string }[] = [
      { name: "name_or_alias", label: "名称" },
      { name: "tags", label: "标签" },
      { name: "status", label: "状态" },
      { name: "tiers", label: "等级" },
      //
      { name: "finish_date_range", label: "时间跨度" },
      { name: "play_time_range", label: "时长" },
      {
        name: "only_owned_or_not",
        label: "是否购买",
      },
      { name: "platforms", label: "平台" },
      { name: "series", label: "系列" },
    ];

    // type ComponentState = {
    //   map?: <T extends object>() => Map<any, any>;
    // };
    // 字段类型，展示状态，比如输入or展示，这些和组件的关系
    // 字段可能是普通类型，也可能是枚举，还可能关联别的数据
    // 考虑懒引用
    // 自定义组件

    const query_labels = computed(() => {
      return labels.filter((v) => !isEmpty(filter.value[v.name]));
    });

    // 正常情况下 空数组，空字符串，null，undefined都等于空值
    const isEmpty = (v) => {
      return typeof v !== "number" && typeof v !== "boolean" && !v?.length;
    };

    const filter = key ? useState(key, () => _filter) : ref(_filter);

    const chain = <T>(sql: T) => {
      // 校验filter参数
      const { data, error } = filterSchema.safeParse(filter.value);
      error && alert("条件错误" + error.message);
      if (!data) return sql;
      //
      let r = sql;
      for (let k in data) {
        const v = data[k];
        if (!isEmpty(v)) {
          r = chains[k](r, v);
        }
      }
      return r;
    };

    return {
      filter,
      labels,
      query_labels,
      // 传给supabase使用的链式条件
      chain,
    };
  };

  type QueryParams = {
    order?: readonly [keyof GameDTO, any];
    chain?: <T>(sql: T) => T;
  };

  const query = async ({ order, chain }: QueryParams) => {
    // todo:处理条件
    let req = selectTable("game[]");
    if (chain) {
      req = chain(req);
    }
    if (order) {
      req = req.order(...order);
    }
    const { data } = await req.order("status");
    return data?.map((v) => injectGameRow(v)) ?? [];
  };

  const upsert = async (row: GameDTO, type: "create" | "update" = "create") => {
    const zod = type === "create" ? insertGame : updateGame;
    const { data, error } = zod.safeParse(row);
    if (error) {
      alert(error);
      return { data, error };
    } else {
      const res = await upsertTable("game", { ...data });
      return res;
    }
  };

  return {
    columns: gameColumns,
    insertGame,
    updateGame,
    query,
    upsert,
    useSort,
    useFilter,
  };
};

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
    platform: z.array(z.enum(_Enums.platform)),
    remark: z.string(),
    series: z.string(),
    status: z.enum(_Enums.complete_status),
    tier: z.enum(_Enums.g_tier),
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

// 适合使用数据库存储过程（RPC）的情况：​​
// 1.对性能要求极高的场景（如金融交易系统）
// 2.数据量非常大，需要尽量减少数据传输
// 3.已有成熟的数据库函数库
// 4.需要数据库层面的强一致性事务
/**
 * 查询还是不要使用rpc，写入时看情况才使用，方便回滚
 *
 *
 */
type GameRPC = {
  get_game_with_tags: GameDTO;
};
