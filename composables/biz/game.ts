import { ATagModal } from "#components";
import type { TableColumn } from "@nuxt/ui";

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

export type GameDTO = Pick<
    Tables<"game">,
    | "id"
    | "name"
    | "alias"
    | "platform"
    | "tags"
    | "extra"
    | "remark"
    | "heart"
    | "status"
    | "complete_time"
    | "judgment"
    | "owned"
    | "user_id"
  >;

export const game_column = [
  name,
  alias,
  {
    ...tags,
    component: ATagModal,
  },
  platform,
  heart,
  owned,
  status,
  complete_time,
  judgment,
].map((v) => {
  const t: TableColumn<GameDTO> & { id: string; component?: Component } = {
    id: v.name,
    accessorKey: v.name,
    header: "label" in v ? v.label : v.name,
    meta: {
      class: {
        th: " text-center min-w-32",
        td: " text-center p-0 ",
      },
    },
  };
  return {
    ...v,
    ...t,
  };
});