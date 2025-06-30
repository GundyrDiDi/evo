// 创建Supabase客户端实例
// 使用Supabase的channel方法创建一个频道
// 订阅特定表的变化
// 在变化事件中，检查变化的记录是否属于当前用户
// 如果是，则触发刷新操作（例如，重新获取数据或通知UI刷新）

export const useUserChannel = defineStore("user_channel", () => {
  // const client = useSupabaseClient<Database>();
  // const user = useSupabaseUser()!;
  // if (!user.value) return;

  // const id = user.value.id;
  // const channel = client.channel(`user:${id}`, {
  //   config: {
  //     presence: {
  //       key: user.value.id,
  //     },
  //   },
  // });
  const b=ref()

  const a = (fn) => {
    // channel.subscribe(fn);
    // return () => channel.unsubscribe(fn);
  };
  
  return {
    a,
    b
  };
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

// export const use
