<script lang="ts" setup>
import { ClientOnly, UButton } from '#components'
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

const withNewRowData = computed(() => (data.value ?? []).concat(editNewRow.value))

const handleCreate = withLoading(async (row: GameInsertDTO) => {
  // await _wait(1000)
  console.log(row)
  if (!row.name) return
  if (row.alias) {
    row.alias = alias.filter(row.alias)
  }
  await upsertTable('game', row)
  // editNewRow.value = useGameDTODefault()
})

const handleUpdate = useDebounceFn(withLoading(async (row: GameDTO) => {
  console.log(row)
  if (row === editNewRow.value) return
  // await client.from('game_list').update(row).match({ id: row.id })
}), 300)

const handleDelete = useDebounceFn(withLoading(async (row: GameDTO) => {

}), 300)

const set = <K extends keyof GameDTO>(row: GameDTO, key: K, val: GameDTO[K]) => {
  if (row === editNewRow.value) {
    row[key] = val
  } else {
    return handleUpdate({ ...row, [key]: val })
  }
}

const { name, alias, tags, platform, owned, edition, status, complete_time, judgment, extra } = useGameColumn()

const columns = [
  name,
  alias,
  tags,
  platform,
  owned,
  edition,
  status,
  complete_time,
  judgment,
  extra,
].map((v) => {
  const t: TableColumn<GameDTO> & { meta: Valueof<GameColumns> } = {
    id: v.name,
    accessorKey: v.name,
    header: v.label,
    meta: {
      class: {
        th: " text-center min-w-32",
        td: " text-center p-0 ",
      },
      ...v
    },
  }
  return t
})

const action: TableColumn<GameDTO> = {
  accessorKey: 'action',
  header: '',
  cell({ row }) {
    const isCreate = row.original === editNewRow.value
    return h(UButton, {
      disabled: loading.value,
      onClick: () => isCreate ? handleCreate(row.original) : handleDelete(row.original)
    }, isCreate ? 'Create' : 'Delete')
  }
}

// const channel = useChannel({
//   name: 'table_change',
//   table: 'game',
//   filter: (user) => `user_id=eq.${user.value?.id}`,
//   callback(payload) {
//     console.log(payload)
//   }
// })

</script>

<template>
  <ASearch></ASearch>
  <ClientOnly>
    <UTable :class="[' max-w-[1000px]', loading && 'pointer-events-none']" :data="withNewRowData"
      :columns="[action].concat(columns)" :loading="loading">
      <template v-for="{ meta, id } in columns" #[`${id}-cell`]="{ row: { original, index } }">
        <ATagModal v-if="meta.name === 'tags'" />
        <ACheck v-else-if="meta.name === 'owned'" :model-value="original.owned"
          @change="set(original, 'owned', $event)" />
        <!-- EditCell存在两种状态，展示和编辑 -->
        <EditCell v-else v-model="original[meta.name]" v-bind="_pick(meta, ['enums', 'asArray'])"
          :always="original === editNewRow"
          @update="set(original, meta.name, meta.filter ? meta.filter($event) : $event)" />
      </template>
    </UTable>
  </ClientOnly>
</template>

<style lang="scss" scoped></style>
