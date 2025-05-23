import type { TableColumn } from "@nuxt/ui";

export const gameColumnMap = useGameList(
  {
    name: {},
    alias: {},
    tags: {},
    status: {},
    complete_time: {},
    heart: {},
    platform: {},
    judgment: {},
    remark: {},
  },
  (k, v) => {
    const t: TableColumn<RowGameList> & { id: typeof k } = {
      id: k,
      accessorKey: k,
      header: v.label,
      meta: {
        class: {
          th: " text-center",
          td: " text-center p-0",
        },
      },
    };
    return t;
  }
);