<script lang="ts" setup>

const editNewRow = useLocalStorage('editNewRow_GameDTO', useGameDTODefault())

const [loading, withLoading] = useLoading()

const { data, refresh } = await useAsyncData(withLoading(async () => {
  // const {data}=await client.rpc('',{})`
  const { data } = await selectTable('game[]').order('created_at', { ascending: false })
  return data?.map(v => injectGameRow(v)) ?? []
}), {
  server: false,
  // immediate: false
})

const { upsertGame } = useGameZod()

const handleCreate = withLoading(async (row: GameDTO) => {
  console.log(row)

  row.alias = row.alias && _unique_trim(row.alias)
  // row.complete_time = row.complete_time && _iso(row.complete_time)

  const { data, error } = upsertGame.safeParse(row)
  console.log(data, error)
  if (data) {
    await upsertTable('game', data)
    refresh()
    editNewRow.value = useGameDTODefault()
  }
})

const handleUpdate = useDebounceFn(withLoading(async (row: GameDTO) => {
  console.log(row)
  if (row === editNewRow.value) return
  const { data, error } = upsertGame.safeParse(row)
  console.log(data, error)
  if (data) {
    console.log('updateData', data)
    // await upsertTable('game', data)
    // refresh()
  }
}), 300)

const handleDelete = useDebounceFn(withLoading(async (row: GameDTO) => {

}), 300)

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

// const channel = useChannel({
//   name: 'table_change',
//   table: 'game',
//   filter: (user) => `user_id=eq.${user.value?.id}`,
//   callback(payload) {
//     console.log(payload)
//   }
// })

const update = (row: GameDTO) => {
  if (row == editNewRow.value) return
  console.log('update data')
}

const sortBy = useLocalStorage('sortBy', '')

// 记录修改过的数据

// 筛选、手势、pwa、定时同步

onMounted(() => {
  $fetch(`https://oapi.dingtalk.com/robot/send?access_token=7b331e469e897f8fb26930fb09797a5e0760f83612e03979cfa5d3c8b1ce7599`, {
    method: 'post',
    // body: { text: { content: 'so far just found 1 bug ' }, msgtype: 'text' }
    // body: { text: { content: 'A new day with 2 bugs. well done bro,well done' }, msgtype: 'text' }
    // body: { text: { content: 'A new day with no bugs. wait,should I check it again' }, msgtype: 'text' }
  })
})
</script>

<template>
  <div class=" flex p-4 justify-between">
    <u-button color="primary" variant="outline" icon="i-heroicons-bars-arrow-down"></u-button>
    <u-button color="primary" variant="outline" icon="i-heroicons-cog-6-tooth"></u-button>
  </div>
  <div class=" flex flex-col px-4">
    <Cell v-for="v in data" :model-value="v" @update="update(v)" />
  </div>
</template>

<style lang="scss" scoped></style>
