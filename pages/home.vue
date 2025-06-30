<script lang="ts" setup>

const editNewRow = useLocalStorage('editNewRow', {} as GameDTO)

let mock = { name: 'ff7', alias: ['c'], complete_time: '2022', heart: false, judgment: '⭕️', remark: '', status: 'abandoned', tags: ['rpg', 'jrpg'], platform: 'ns', id: 1, user_id: '' } as GameDTO

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const channel=useUserChannel()
console.log('aaaaaaaaa')
// console.log(channel.b)
channel.a(()=>{})

const columns = game_column

const [loading, loadingHook] = useLoading()

const { data } = await useAsyncData('game-list', loadingHook(async () => {
  const { data } = await client.from('game').select('*').eq('user_id', user.value!.id).order('created_at')
  // const {data}=await client.rpc('',{})
  return (data?.length ? data : [mock]) as GameDTO[]
}))

onMounted(async () => {
  const { data } = await client.from('game').select('*').eq('user_id', user.value!.id).order('created_at')
})

const handleCreate = loadingHook(async (row: GameDTO) => {
  // editNewRow.value = {}
  // row && data.value?.push(row)
})

const handleUpdate = loadingHook(async (row: GameDTO) => {
  // await client.from('game_list').update(row).match({ id: row.id })
})

</script>

<template>
  <ASearch></ASearch>
  <UTable :class="['w-full', loading && 'pointer-events-none']" :data="data?.concat(editNewRow)" :columns="columns"
    :loading="loading">
    <template v-for="c in columns" #[`${c.id}-cell`]="{ row }">
      <EditCell v-model="row.original[c.id!]" :type="c._type" :data="row.original" :isCreate="row.original === editNewRow"
        @create="handleCreate" @update="handleUpdate" />
    </template>
  </UTable>
</template>

<style lang="scss" scoped></style>
