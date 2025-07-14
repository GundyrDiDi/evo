export const useRouteQuery = <
  T extends Record<
    string,
    | orArray<StringConstructor | string | NumberConstructor | number>
    | boolean
    | BooleanConstructor
  >
>(
  defineState: T,
  mode: "sync" | "up_stream" | "down_stream" | "no_stream" = "sync"
) => {
  type State<T> = {
    [P in keyof T]: T[P] extends (...r: any[]) => infer R
      ? R | undefined
      : T[P] extends ((...r: any[]) => infer R)[]
      ? R[] | undefined
      : T[P];
  };
  // 为array的querykey
  const arrayFlags = new Set<keyof T>();
  const typeDef = {} as Record<keyof T, (raw) => unknown>;
  const defaultState = {} as State<T>;

  const typeofFn = {
    number: Number,
    string: String,
    boolean: Boolean,
  };

  Object.entries(defineState).forEach(([_k, defineVal]) => {
    const k = _k as keyof T;
    if (Array.isArray(defineVal)) {
      arrayFlags.add(k);
      defineVal = defineVal[0];
    }
    // 类型转换函数
    typeDef[k] = typeofFn[typeof defineVal] ?? defineVal;
    // 默认值
    defaultState[k] = (
      typeof defineVal === "function" ? undefined : defineState[k]
    ) as any;
  });

  const state = reactive(_clone(defaultState));
  const _state = state as State<T>;
  const router = useRouter();

  const same = (a, b) => {
    const _a = Array.isArray(a) ? a.join() : a;
    const _b = Array.isArray(b) ? b.join() : b;
    return _a === _b;
  };

  const reset = (...names: (keyof T)[]) => {
    const default_state = _clone(defaultState);
    const keys = names.length ? names : Object.keys(default_state);
    keys.forEach((k: keyof T) => {
      _state[k] = default_state[k];
    });
  };

  const fromRouteQuery = () => {
    // 当路由更新时，是否要重置state然后再赋值，保持和url同步
    reset();
    const query = filterQuery(useRoute().query);
    Object.keys(query).forEach((k: keyof T) => {
      if (k in _state) {
        if (typeof query[k] === "string") {
          // 由于array是引用类型，需要对比是否和state中的值一致
          if (arrayFlags.has(k)) {
            if (same(query[k], _state[k])) return;
            try {
              _state[k] = query[k].split(",").map((v) => typeDef[k](v)) as any;
            } catch (err) {}
            return;
          }
        }
        // 因为可以任意输入query，有可能类型转换失败
        try {
          _state[k] = typeDef[k](query[k]) as any;
        } catch (err) {}
      }
    });
  };

  fromRouteQuery();

  const pushQueryState = (a) => {
    // 要获取所有的query，因为有将routeQuery的值清空的情况
    const queryState = _clone(defaultState);
    Object.keys(queryState).forEach((k: keyof T) => {
      const default_val = queryState[k];
      const val = _state[k];
      const isArray = arrayFlags.has(k);
      // 由于array是引用类型，需要对比是否和default_state中的值一致
      if (isArray ? same(default_val, val) : default_val === val) return;
      queryState[k] = val;
    });
    pushQuery(queryState);
  };

  let run = _lock(20);
  if (["sync", "up_stream"].includes(mode)) {
    watch(router.currentRoute, run(fromRouteQuery));
  }
  if (["sync", "down_stream"].includes(mode)) {
    watch(state, run(pushQueryState));
  }

  return {
    state,
    fromRouteQuery,
    pushQueryState,
    reset,
  };
};

export const filterQuery = (raw_query) => {
  const query = { ...raw_query };
  Object.keys(query).forEach((key) => {
    if (query[key] === "") {
      delete query[key];
    }
  });
  return query;
};

// 修改RouteQuery，如果是需要删除的query值需要传key,值为undefined
export const pushQuery = (queryState) => {
  const query = { ...useRoute().query };
  Object.keys(queryState).forEach((key) => {
    let val = queryState[key];
    // 非string都转string, 比如 0=>"0" true=>"true" []=>"" null|undefined=>""
    if (typeof val !== "string") {
      val = queryState[key]?.toString() ?? "";
    }
    // 空数组、空字符串、false的情况，在当前的query内去除
    if (["", "false"].includes(val)) {
      delete query[key];
    } else {
      query[key] = val;
    }
  });
  useRouter().push({ query });
};

// params必定是string类型
export const useRouteParams = (key: string) => {
  const router = useRouter();
  const name = useRoute().name;
  const params = computed({
    get() {
      return router.currentRoute.value.params[key];
    },
    set(val: string | string[]) {
      const route = {...useRoute()};
      if (route.name !== name) return;
      route.params[key] = val;
      router.push(route);
    },
  });
  return params;
};
