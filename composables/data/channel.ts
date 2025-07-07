// 创建Supabase客户端实例
// 使用Supabase的channel方法创建一个频道
// 订阅特定表的变化
// 在变化事件中，检查变化的记录是否属于当前用户
// 如果是，则触发刷新操作（例如，重新获取数据或通知UI刷新）

const useTableChannel = () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const createChannel = () => {
    let key = user.value?.id ?? "visitor";
    return client.channel("table_channel", {
      config: {
        presence: { key },
      },
    });
  };
  let channel = createChannel();

  watch(user, () => {
    client.removeChannel(channel);
    channel = createChannel();
  });
};

export const useTableChannelStore = defineStore("table_channel", () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  // console.log('user.value?.id',user.value?.id)
  // const channelCallbackMap = new Map<Table_Name, Set<any>>();

  const channel = client.channel("table_channel");
  channel.on("postgres_changes", { event: "*", schema: "public" }, (e) => {
    // e.table
  });

  client.removeChannel(channel);

  // const c = computed(() => {
  //   const key = user.value?.id ?? "visitor";
  //   const channel=client.channel('')
  // });
  // // client.removeChannel('')

  // watch(user,()=>{
  //   c
  // })

  // const channel = client.channel(`table_channel`, {
  //   config: {
  //     presence: {
  //       key,
  //     },
  //   },
  // });
  // const map = new Map();

  // channel.on(
  //   "postgres_changes",
  //   {
  //     event: "*",
  //     schema: "public",
  //     table: "game",
  //     filter: `user_id=eq.${key}`,
  //   },
  //   (e) => {
  //     console.log("connect");
  //     console.log(e);
  //   }
  // );
  // .subscribe((e)=>{
  //   console.log(e)
  //   console.log('subscribed')
  // });

  return {};
  //
  // return channel
  //   .on(
  //     "postgres_changes",
  //     {
  //       event: "*",
  //       schema: "public",
  //       table: "game",
  //       filter: `user_id=eq.${id}`,
  //     },
  //     (e) => {
  //       console.log(e);
  //     }
  //   )
  //   .subscribe();
});

export const useTableChange = () => {
  const channel = useTableChannelStore();
  // channel.subscribe
};

// export const use
