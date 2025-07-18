import { ACheck, AHeart, ATagModal } from "#components";
import type { TableColumn } from "@nuxt/ui";

export type GameDTO = Tables<"game">;

export type PartGameDTO = Partial<GameDTO>;

const {
  game: {
    name,
    alias,
    platform,
    tags,
    extra,
    remark,
    heart,
    status,
    complete_time,
    judgment,
    owned,
  },
} = Columns;

export const useGameDTODefault = () => {
  const d: Pick<GameDTO, "edition" | "status" | "platform"> = {
    platform: "pc",
    edition: "standard",
    status: "not_started",
  };
  return d as PartGameDTO;
};

export const useGameColumn = <T = any>() =>
  [
    name,
    alias,
    {
      ...tags,
      component: ATagModal,
    },
    platform,
    {
      ...heart,
      component: AHeart,
    },
    {
      ...owned,
      component: ACheck,
    },
    status,
    complete_time,
    judgment,
    extra,
  ].map((v) => {
    const t: TableColumn<T> & { id: string; component?: Component } = {
      id: v.name,
      accessorKey: v.name,
      header: v["label"] ?? v.name,
      meta: {
        class: {
          th: " text-center min-w-32",
          td: " text-center p-0 ",
        },
      },
    };
    return { ...t, ...v };
  });

type GameRPC = {
  get_game_with_tags: GameDTO;
};
