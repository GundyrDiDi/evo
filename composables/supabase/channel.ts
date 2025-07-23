// 维护一个当前所有注册的通道数，监测安全
export const channelStore = defineStore("channelStore", () => {
  const client = useSupabaseClient<Database>();
  type Channel = ReturnType<typeof client.channel> & {
    remove: () => Promise<void>;
  };
  const map = new Map<Symbol, Channel>();
  const create = (name, opt) => {
    if (map.size > 10) console.warn("当前通道数已超过10个");
    const channel = client.channel(name, opt);
    const key = Symbol();
    map.set(
      key,
      Object.assign(channel, {
        async remove() {
          const status = await channel.unsubscribe();
          console.log(status);
          client.removeChannel(channel);
          map.delete(key);
        },
      })
    );
    return channel as Channel;
  };

  const getAllChannel = () => [...map.values()];

  const clear = () => {
    map.forEach((channel) => {
      channel.remove();
    });
    map.clear();
  };

  return {
    create,
    getAllChannel,
    clear,
  };
});

type PostgresOption = {
  table: Table_Name;
  filter?: string | ((user: ReturnType<typeof useSupabaseUser>) => string);
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  schema?: "public";
};

// broadcast
export const useBroadcast = () => {};

// presence
export const usePresence = () => {};

// 监听表变化 postgres_changes，转为响应式
export const useChannel = (
  _opts: { name: string; callback?: (payload) => void } & PostgresOption
) => {
  const user = useSupabaseUser();
  const { name, callback, filter, ...opt } = {
    event: "*",
    schema: "public",
    ..._opts,
  };

  const store = channelStore();
  let channel: ReturnType<typeof store.create>;

  let listeners = new Set<(payload) => void>([]);
  callback && listeners.add(callback);

  const computedFilter = computed(() => {
    return typeof filter === "function" ? filter(user) : filter;
  });

  const init = () => {
    const key = `client_${user.value?.id ?? `visitor_${_randomId}`}`;
    channel = store.create(name, {
      config: {
        presence: {
          key,
        },
      },
    });
    channel.on(
      "postgres_changes",
      { ...opt, filter: computedFilter.value } as any,
      (payload) => {
        listeners.forEach((callback) => callback(payload));
      }
    );
    // import.meta.client && channel.subscribe(console.log);
  };
  init();

  const unsubscribe = async () => {
    await channel.remove();
  };

  const addListener = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  const reconnect = async () => {
    await unsubscribe();
    init();
  };
  watch([user, computedFilter], reconnect);

  const close = async () => {
    await unsubscribe();
    listeners.clear();
  };
  onUnmounted(close);

  return {
    addListener,
    reconnect,
    close,
  };
};

// 全局使用的channel，维护listener列表，注意：监听参数是不可变的，所以需要吗，还是就封装逻辑就好
export const useGameListChannel = defineStore("", () => {
  // const channel=useChannel({})
});

// // 公共channel方式，保持只有一个channel长期存在的场景
// export const useChannelStore = defineStore("channel", () => {
//   const ref = useReferUser((user, reset) => {
//     const client = useSupabaseClient<Database>();
//     if (reset) {
//       ref.channel.unsubscribe();
//       client.removeChannel(ref.channel);
//     }
//     const key = `client_${user.value?.id ?? `visitor_${_randomId}`}`;
//     const channel = client.channel("table_change_1", {
//       config: {
//         presence: {
//           key,
//         },
//       },
//     });
//     // import.meta.client && channel.subscribe(console.log);
//     return channel;
//   }, "channel");

//   const listeners: Record<string, ((payload) => void) | undefined> = {};

//   const on = (
//     _opts: {
//       id: string;
//       readonly callback: (payload) => void;
//     } & PostgresOption
//   ) => {
//     const { callback, id, ...opts } = {
//       event: "*",
//       schema: "public",
//       ..._opts,
//     };
//     if (!listeners[id]) {
//       ref.channel.on("postgres_changes", opts as any, (payload) => {
//         listeners[id]?.(payload);
//       });
//     }
//     listeners[id] = callback;

//     const clear = () => {
//       listeners[id] = undefined;
//     };
//     onUnmounted(clear);
//   };
//   return {
//     ref,
//     listeners,
//     on,
//   };
// });
