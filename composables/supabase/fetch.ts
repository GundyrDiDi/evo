const handleResponse = (res) => {
  // console.log("handleResponse");
  // console.log(res);
  return res;
};

const withResponse = <T extends { then: Function }>(t: T) =>
  new Proxy(t, {
    get(t, p) {
      if (p === "then") {
        return (...res) => t.then(handleResponse).then(...res);
      }
      return t[p];
    },
  });

// 标准表操作

export const selectTable = <T extends Table_Name, U extends string>(
  schema: `${T}${`[${U}]`}`
) => {
  const match = schema.match(/^(.+?)\[(.*)\]$/);
  if (!match) throw new Error("fetch table error");
  const client = useSupabaseClient();
  const name = match[1] as T;
  const columns = (match[2] || "*") as U extends "" ? "*" : U;
  return withResponse(client.from(name).select(columns));
};

export const upsertTable = () => {};

export const deleteTable = () => {};

/**
 * Call a Postgres function
 * You can call Postgres functions as Remote Procedure Calls, logic in your database that you can execute from anywhere.
 * Functions are useful when the logic rarely changes—like for password resets and updates.
 */
export const fetchRPC = () => {
  const client = useSupabaseClient();
  // return client.rpc()
};

/**
 * edge function
 */
export const fetchServe = <T>() => {
  const a = $fetch("/api/count");
};

/**
 * storage
 */
export const oss = () => {};

/**
 * @deprecated 理论上，表应开启RLS，在这种策略下客户端仅能获取到自己的用户数据，无需传入 eq('user_id',user.value.id)；
 * 而只有在管理员的后台才需要添加筛选项；基于此，filterUser是一个不应该使用的函数
 * @param getData
 * @returns
 */
export const filterUser = <T>(getData: T) => {
  const user = useSupabaseUser();
  return (getData as any).eq("user_id", user.value?.id) as T;
};
