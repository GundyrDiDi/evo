<script lang="ts" setup generic="T extends ValueType,D extends DataGameList">

const props = defineProps<{ type?: T, id?: any, isCreate: boolean }>()

const emits = defineEmits<{ (e: 'update' | 'create', row?: D): void }>()

const [data] = defineModel<any>({ required: true })

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const [isEdit, toggle] = useToggle(false)

const type = computed(v => props.type ?? ValueType.text)

const cell = useOutClick(async _ => {
  if (isEdit.value) {
    await update()
    toggle()
  }
})

const update = async() => {
  const key = props.id
  const { id } = data.value as D
  if (props.type === ValueType.textList) {
    data.value[key] = [...new Set(data.value[key].split(','))].join(',')
  }
  if (id === 1000) {
    await client.from('game-list').update(_pick(data.value, props.id)).match({ id })
    emits('update', data.value)
  } else {
    // client.from
    emits('create', data.value)
  }
}
</script>

<template>
  <client-only>
    <div ref="cell" class=" p-4">
      <div v-if="isEdit || isCreate">
        <template v-if="type === ValueType.text">
          <u-input v-model="data[id]" />
        </template>
        <template v-if="type === ValueType.textList">
          <a-text-list class=" flex flex-col gap-2" v-model="data[id]" />
        </template>
      </div>
      <div v-else @click="toggle()" class=" cursor-pointer">
        {{ data[id] }}
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped></style>
