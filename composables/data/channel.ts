const useTableChannel = (_opts: {
  table: string;
  readonly callback: () => void;
  filter?: string;
  event?: string;
  schema?: "public";
}) => {
  const client = useSupabaseClient<Database>();

  const opts = reactive({
    event: "*",
    schema: "public",
    ..._opts,
  }) as any;

  let channel = client.channel(`${_randomId()}_table_channel`);
  channel.on("postgres_changes", opts, opts.callback).subscribe();

  const on = (_callback) => {
    channel.on("postgres_changes", opts, _callback);
  };
  const clear = () => {
    channel.unsubscribe();
    client.removeChannel(channel);
  };
  watch(opts, () => {
    clear();
    channel = client.channel(`${_randomId()}_table_channel`);
    channel.on("postgres_changes", opts, opts.callback).subscribe();
  });

  onUnmounted(clear);

  return {
    opts,
    channel,
    on,
    clear,
  };
};

export const useReferUser = <T, K extends string>(
  fn: (user: Ref<{ id: string } | null>, reset?: boolean) => T,
  keyName: K
) => {
  const user = useSupabaseUser();
  const ref: { [k in K]: T } = {} as any;
  watch(user, () => {
    ref[keyName] = fn(user, true);
  });
  ref[keyName] = fn(user);
  return ref;
};

type PostgresOption = {
  table: string;
  filter?: string;
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  schema?: "public";
};

// broadcast
export const useBroadcast = () => {};

// presence
export const usePresence = () => {};

// 监听表变化 postgres_changes
export const useChannel = (
  _opts: { name: string; callback: (payload) => void } & PostgresOption
) => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const { name, callback, ...opt } = {
    event: "*",
    schema: "public",
    ..._opts,
  };

  let channel: ReturnType<typeof client.channel>;

  let listeners = new Set<(payload) => void>([callback]);

  const option = reactive(opt);

  const init = () => {
    const key = `client_${user.value?.id ?? `visitor_${_randomId}`}`;
    channel = client.channel(name, {
      config: {
        presence: {
          key,
        },
      },
    });
    channel.on("postgres_changes", option as any, (payload) => {
      listeners.forEach((callback) => callback(payload));
    });
  };

  const clear = async () => {
    await channel.unsubscribe();
    listeners.clear();
    client.removeChannel(channel);
  };
  const addListener = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  init();
  const reconnect = async () => {
    await clear();
    init();
    channel.subscribe();
  };
  watch(option, reconnect);

  onMounted(() => {
    channel.subscribe(console.log);
  });

  onUnmounted(clear);

  return {
    option,
    addListener,
    clear,
    reconnect,
  };
};

// 公共channel方式，保持只有一个channel长期存在的场景
export const useChannelStore = defineStore("channel", () => {
  const ref = useReferUser((user, reset) => {
    const client = useSupabaseClient<Database>();
    if (reset) {
      ref.channel.unsubscribe();
      client.removeChannel(ref.channel);
    }
    const key = `client_${user.value?.id ?? `visitor_${_randomId}`}`;
    const channel = client.channel("table_change_1", {
      config: {
        presence: {
          key,
        },
      },
    });
    // import.meta.client && channel.subscribe(console.log);
    return channel;
  }, "channel");

  const listeners: Record<string, ((payload) => void) | undefined> = {};

  const on = (
    _opts: {
      id: string;
      readonly callback: (payload) => void;
    } & PostgresOption
  ) => {
    const { callback, id, ...opts } = {
      event: "*",
      schema: "public",
      ..._opts,
    };
    if (!listeners[id]) {
      ref.channel.on("postgres_changes", opts as any, (payload) => {
        listeners[id]?.(payload);
      });
    }
    listeners[id] = callback;

    const clear = () => {
      listeners[id] = undefined;
    };
    onUnmounted(clear);
  };
  return {
    ref,
    listeners,
    on,
  };
});
