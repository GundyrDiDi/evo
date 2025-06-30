import type { Database } from "~~/types/database.types";

export const useAboutUser = () => {
  // 
  const client=useSupabaseClient()
  console.log(client)
};
