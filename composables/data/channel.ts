// 维护一个当前所有注册的通道数，监测安全
export const channelStore = defineStore("channelStore", () => {
  const map = new Map();
  return {
    map,
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
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const { name, callback, filter, ...opt } = {
    event: "*",
    schema: "public",
    ..._opts,
  };

  let channel: ReturnType<typeof client.channel>;

  let listeners = new Set<(payload) => void>([]);
  callback && listeners.add(callback);

  const computedFilter = computed(() => {
    return typeof filter === "function" ? filter(user) : filter;
  });

  const init = () => {
    const key = `client_${user.value?.id ?? `visitor_${_randomId}`}`;
    channel = client.channel(name, {
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
    await channel.unsubscribe();
    client.removeChannel(channel);
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
