<script lang="ts" setup>
const editNewRow = useLocalStorage('editNewRow', {} as GameDTO)

let mock = { name: 'ff7', alias: ['c'], complete_time: '2022', heart: false, judgment: '⭕️', remark: '', status: 'abandoned', tags: ['rpg', 'jrpg'], platform: 'ns', id: 1, user_id: '' } as GameDTO

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const columns = game_column

const [loading, withLoading] = useLoading()

const { data } = await useAsyncData('game-list', withLoading(async () => {
  const { data } = await client.from('game').select('*').eq('user_id', user.value!.id).order('created_at')
  // const {data}=await client.rpc('',{})
  return (data?.length ? data : [mock]) as GameDTO[]
}))

onMounted(async () => {
  // const { data } = await client.from('game').select('*').eq('user_id', user.value!.id).order('created_at')
})

const handleCreate = withLoading(async (row: GameDTO) => {
  // editNewRow.value = {}
  // row && data.value?.push(row)
})

const handleUpdate = withLoading(async (row: GameDTO) => {
  // await client.from('game_list').update(row).match({ id: row.id })
})

// const channel = useChannel({
//   name: 'table_change',
//   table: 'game',
//   filter: (user) => `user_id=eq.${user.value?.id}`,
//   callback(payload) {
//     console.log(payload)
//   }
// })

const a = useRouteQuery({
  a: Number,
  b: Number,
  f: 2,
  h: [1]
})

onMounted(() => {
  console.log(a.state)
  setTimeout(() => {
    pushQuery({ a: Math.random(),b:100 })
  }, 1000)
  // console.log(a.state)
  // console.log(useRoute().query)
  // fromRawQuery()
})

</script>

<template>
  <ASearch></ASearch>
  {{ a.state }}
  <!-- <UTable :class="['w-full', loading && 'pointer-events-none']" :data="data?.concat(editNewRow)" :columns="columns"
    :loading="loading">
    <template v-for="c in columns" #[`${c.id}-cell`]="{ row }">
      <EditCell v-model="row.original[c.id!]" :type="c._type" :data="row.original"
        :isCreate="row.original === editNewRow" @create="handleCreate" @update="handleUpdate" />
    </template>
</UTable> -->
</template>

<style lang="scss" scoped></style>
