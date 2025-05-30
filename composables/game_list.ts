import { ATagModal } from "#components"
import type { TableColumn } from "@nuxt/ui";

export const gameColumnMap = useGameList(
  {
    name: {},
    alias: {},
    tags: {
      component: ATagModal,
    },
    status: {},
    complete_time: {},
    heart: {},
    platform: {},
    judgment: {},
    remark: {},
  },
  (k, v) => {
    const t: TableColumn<RowGameList> & {
      component?: any;
      id: typeof k;
    } = {
      id: k,
      accessorKey: k,
      header: v.label,
      meta: {
        class: {
          th: " text-center min-w-32",
          td: " text-center p-0 ",
        },
      },
    };
    return t;
  }
);
