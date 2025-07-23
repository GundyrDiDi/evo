export type GameDTO = Tables<"game">;

export type PartGameDTO = Partial<GameDTO>;

export const useGameColumn = () => Columns.game;

export type GameColumns = Pick<
  Required<Columns_Type["game"]>,
  keyof typeof Columns.game
>;

export const useGameDTODefault = () => {
  const d: Pick<GameDTO, "edition" | "status" | "platform"> = {
    platform: "pc",
    edition: "standard",
    status: "not_started",
  };
  return d as PartGameDTO;
};

type GameRPC = {
  get_game_with_tags: GameDTO;
};
