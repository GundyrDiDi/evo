export type GameDTO = Tables<"game">;

export type GameInsertDTO = TablesInsert<"game">;

export const useGameColumn = () => Columns.game;

export type GameColumns = Pick<
  Required<Columns_Type["game"]>,
  keyof typeof Columns.game
>;

// 
export const useGameDTODefault = () => {
  const d: Partial<GameDTO> = {
    name: "",
    platform: ["pc"],
    edition: "standard",
    status: "not_started",
  };
  return d as GameDTO;
};

type GameRPC = {
  get_game_with_tags: GameDTO;
};

// 提交更新前的校验

// 查询的校验
