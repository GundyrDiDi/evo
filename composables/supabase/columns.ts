const game = defineColumn("game", {
  id: {},
  name: {
    label: "游戏名",
  },
  alias: {
    label: "别名",
    filter: (val) => _unique(val),
  },
  platform: {
    label: "平台",
  },
  tags: {
    label: "标签",
  },
  series: {
    label: "系列",
  },
  extra: {
    label: "DLC",
  },
  remark: {
    label: "其他",
  },
  user_id: {},
  heart: {
    label: "星标",
  },
  judgment: {
    label: "评价",
  },
  status: {
    label: "游玩状态",
  },
  complete_time: {
    label: "完成时间",
  },
  owned: {
    label: "已购买",
  },
});

const game_tag = defineColumn("game_tag", {
  id: {},
  name: {
    label: "标签名",
  },
});

const _relations_tag = defineColumn("_relations_tag", {
  parent_id: {},
  child_id: {},
});

const _relations_dlc = defineColumn("_relations_dlc", {
  original_id: {},
  dlc_id: {},
});

const _relations_game_tag = defineColumn("_relations_game_tag", {
  game_id: {},
  tag_id: {},
});

export const Columns = {
  game,
  game_tag,
  _relations_dlc,
  _relations_tag,
  _relations_game_tag,
};
