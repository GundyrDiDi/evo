<script lang="ts" setup>

const editNewRow = useLocalStorage('editNewRow', {} as RowGameList)

let mock: RowGameList = { name: 'ff7', alias: ['c'], complete_time: '2022', heart: false, judgment: '⭕️', remark: '', status: 'abandoned', tags: null, platform: 'ns', id: 1, created_at: '', user_id: '' }

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const columns = Object.values(gameColumnMap)

const [loading, loadingHook] = useLoading()

const { data } = await useAsyncData<RowGameList[]>('game-list', loadingHook(async () => {
  const { data } = await client.from('game_list').select('*').eq('user_id', user.value!.id).order('created_at')
  return data?.length ? data : [mock]
}))

const handleCreate = loadingHook(async (row: RowGameList) => {
  editNewRow.value = {} as RowGameList
  row && data.value?.push(row)  
})

const handleUpdate = loadingHook(async (row: RowGameList) => {
  await client.from('game_list').update(row).match({ id: row.id })
})

</script>

<template>
  <ASearch></ASearch>
  <UTable :class="['w-full', loading && 'pointer-events-none']" :data="data?.concat(editNewRow)" :columns="columns"
    :loading="loading">
    <template v-for="c in columns" #[`${c.id}-cell`]="{ row }">
      <EditCell v-model="row.original[c.id]" v-bind="c" :data="row.original" :isCreate="row.original === editNewRow"
        @create="handleCreate" @update="handleUpdate" />
    </template>
  </UTable>
</template>

<style lang="scss" scoped></style>
