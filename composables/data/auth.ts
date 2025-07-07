import type { Database } from "~~/types/database.types";

// store中的值，在使用时尽量做到响应性，考虑某些值的依赖链路很长，可能做不到，那么针对这些值变化时可以重新挂载组件

export const useAboutUser = () => {
  // 
  const client=useSupabaseClient()
  console.log(client)
};
