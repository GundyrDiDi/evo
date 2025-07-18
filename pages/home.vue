<script lang="ts" setup>
import { UButton } from '#components'
import type { TableColumn } from '@nuxt/ui'

const editNewRow = useLocalStorage('editNewRow_GameDTO', useGameDTODefault())

const [loading, withLoading] = useLoading()

const { data } = await useAsyncData(withLoading(async () => {
  // const {data}=await client.rpc('',{})
  const { data } = await selectTable('game[]')
  console.log(data)
  return data ?? []
}), {
  server: false,
  immediate: false
})

const withNewRowData = computed(() => (data.value ?? []).concat(editNewRow.value as any))

const columns = useGameColumn<GameDTO>()

const action: TableColumn<GameDTO> = {
  accessorKey: 'action',
  header: '',
  cell({ row }) {
    const isCreate = row.original === editNewRow.value
    return h(UButton, { disabled: loading.value, onClick: () => isCreate ? handleCreate(row.original) : handleDelete(row.original) }, isCreate ? 'Create' : 'Delete')
  }
}

const handleCreate = withLoading(async (row: PartGameDTO) => {
  await _wait(1000)
  editNewRow.value = useGameDTODefault()
})

const handleUpdate = useDebounceFn(withLoading(async (row: GameDTO) => {
  console.log(row)
  // await client.from('game_list').update(row).match({ id: row.id })
}), 300)

const handleDelete = withLoading(async (row: GameDTO) => {

})

// const channel = useChannel({
//   name: 'table_change',
//   table: 'game',
//   filter: (user) => `user_id=eq.${user.value?.id}`,
//   callback(payload) {
//     console.log(payload)
//   }
// })

onMounted(async () => {
  // const { data } = await client.from('game').select('*').eq('user_id', user.value!.id).order('created_at')
})

</script>

<template>
  <ASearch></ASearch>
  <UTable :class="[' max-w-[1000px]', loading && 'pointer-events-none']" :data="withNewRowData"
    :columns="[action].concat(columns)" :loading="loading">
    <template v-for="c in columns" #[`${c.id}-cell`]="{ row }">
      <component v-if="c.component" v-model="row.original[c.id]" :data="row.original" :is="c.component"
        @update="handleUpdate" />
      <EditCell v-else v-model="row.original[c.id]" :data="row.original" :type="c._type"
        :always="row.original === editNewRow" @update="handleUpdate" />
    </template>
  </UTable>
</template>

<style lang="scss" scoped></style>
