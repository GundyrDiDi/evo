<script lang="ts" setup>

const [loading, withLoading] = useLoading()

const { data, refresh } = await useAsyncData(withLoading(async () => {
  // const {data}=await client.rpc('',{})`
  const { data } = await selectTable('game[]').order('created_at', { ascending: false })
  return data?.map(v => injectGameRow(v)) ?? []
}), {
  default: () => <GameDTO[]>[],
  server: false,
  // immediate:false,
})

const { insertGame, upsertGame } = useGameZod()

const handleUpsert = useDebounceFn(withLoading(async (row: GameDTO, type: 'create' | 'update' = 'create') => {
  console.log({ ...row })
  const zod = type === 'create' ? insertGame : upsertGame
  const { data: params, error } = zod.safeParse(row)
  if (params) {
    const { data: row, error } = await upsertTable('game', params)
    // 
    if (type === 'create' && row) data.value?.unshift(row)
    error && alert(error.message)
  } else {
    alert(error)
  }
}), 300)

const handleUpdate = (row: GameDTO) => handleUpsert(row, 'update')

const handleDelete = useDebounceFn(withLoading(async (row: GameDTO) => {

}), 300)

const { list, containerProps, wrapperProps } = useVirtualList(
  data,
  {
    itemHeight: 44,
  },
)

// pwa、定时同步,记录修改过的数据
// 总数 虚拟列表 按钮拖动 ✅
// 手势 筛选 自定义保存筛选 
// 术语表 同义词集合 自动填写“系列字段” 合并dlc按钮
</script>

<template>
  <div class=" h-screen flex flex-col" v-bind="containerProps">
    <AppHeader />
    <div class=" flex-1 flex flex-col px-4" v-bind="wrapperProps">
      <Cell v-for="v in list" :key="v.data.id" :cell_key="v.data.id" :model-value="v.data" @update="handleUpdate" />
    </div>
    <Plus @commit="handleUpsert"></Plus>
    <AppFooter>
      <div class=" flex justify-end text-xs text-gray-400 font-[500]">
        {{ data?.length }} records
      </div>
    </AppFooter>
  </div>
</template>

<style lang="scss" scoped></style>







<!-- <script lang="ts">
 // 钉钉 openAPI
 onMounted(() => {
  $fetch(`https://oapi.dingtalk.com/robot/send?access_token=7b331e469e897f8fb26930fb09797a5e0760f83612e03979cfa5d3c8b1ce7599`, {
    method: 'post',
    // body: { text: { content: 'so far just found 1 bug ' }, msgtype: 'text' }
    // body: { text: { content: 'A new day with 2 bugs. well done bro,well done' }, msgtype: 'text' }
    // body: { text: { content: 'A new day with no bugs. wait,should I check it again' }, msgtype: 'text' }
  })
})
// pc表格
// const { name, alias, tags, series, platform, owned, edition, status, complete_time, judgment, extra } = useGameColumn()

// const columns = [
//   name,
//   alias,
//   tags,
//   platform,
//   owned,
//   series,
//   edition,
//   status,
//   complete_time,
//   judgment,
//   extra,
// ].map((v) => {
//   const t: TableColumn<GameDTO> & { meta: Valueof<GameColumns> } = {
//     id: v.name,
//     accessorKey: v.name,
//     header: v.label,
//     meta: {
//       class: {
//         th: " text-center min-w-32",
//         td: " text-center p-0 ",
//       },
//       ...v
//     },
//   }
//   return t
// })
// const action: TableColumn<GameDTO> = {
//   accessorKey: 'action',
//   header: '',
//   cell({ row }) {
//     const isCreate = row.original === editNewRow.value
//     return h(UButton, {
//       disabled: loading.value,
//       onClick: () => isCreate ? handleCreate(row.original) : handleDelete(row.original)
//     }, isCreate ? 'Create' : 'Delete')
//   }
// }
// 实时更新
// const channel = useChannel({
//   name: 'table_change',
//   table: 'game',
//   filter: (user) => `user_id=eq.${user.value?.id}`,
//   callback(payload) {
//     console.log(payload)
//   }
// })
</script> -->