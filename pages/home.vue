<script lang="ts" setup>
import { gameColumnMap, type DataGameList } from '~/composables/data'

const editNewRow = useLocalStorage('editNewRow', {} as DataGameList)

const handleCreated = (row?: DataGameList) => {
  editNewRow.value = {} as DataGameList
  row && data.value?.push(row)
}

let mock: DataGameList = { name: 'ff7', alias: 'c', complete_time: '2022', heart: false, judgment: '⭕️', remark: '', status: 'abandoned', tags: '', platform: 'ns', id: 1, created_at: '', user_id: '' }

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { data } = await useAsyncData<DataGameList[]>('game-list', async () => {
  const { data } = await client.from('game-list').select('*').eq('user_id', user.value!.id).order('created_at')
  return data?.length ? data : [mock]
})

const columns = Object.values(gameColumnMap)


</script>

<template>
  <ASearch></ASearch>
  <UTable class=" w-full " :data="data?.concat(editNewRow)" :columns="columns" :loading="true">
    <template v-for="c in columns" #[`${c.id}-cell`]="{ row }">
      <EditCell v-model="row.original" v-bind="c" :isCreate="row.original === editNewRow" @create="handleCreated" />
    </template>
  </UTable>
</template>

<style lang="scss" scoped></style>
