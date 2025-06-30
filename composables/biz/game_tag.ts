const {
  game_tag: { id, name },
} = Columns;

export type GameTag = Pick<Tables<"game_tag">, "id" | "name"> & {
  children?: GameTag[];
};

export const useTags = () => {
  // const client=useSupabase()

  // const list=useAsyncData('game_tag_list',()=>{
      
  // })
};
