<script lang="ts" setup generic="Type extends EnumValueType,K extends keyof RowGameList, D extends RowGameList">
import type { RecordValue } from '~/types/generic.types'

const props = defineProps<{ type?: Type, id?: K, foregin?: any, isCreate: boolean, data: D }>()

const emits = defineEmits<{ (e: 'update' | 'create', row: D): void }>()

const [model] = defineModel<any>({ required: true })

const [isEdit, toggle] = useToggle(false)

const type = computed<EnumValueType>(v => props.type ?? 'text')

const cell = useOutClick(_ => {
  requestAnimationFrame(() => {
    if (isEdit.value) {
      toggle()
      update()
    }
  })
})

const update = async () => {
  if (props.type === 'text_list') {
    model.value = _unique(model.value as string[])
  }
  if (props.data.id === 1000) {
    emits('update', props.data)
  } else {
    // emits('create', props.data)
  }
}

</script>

<template>
  <client-only>
    <div ref="cell" class=" relative z-1">
      <div v-if="isEdit || isCreate" class=" p-4">
        <template v-if="type === 'text'">
          <u-input v-model="model" />
        </template>
        <template v-if="type === 'text_list'">
          <a-text-list class=" flex flex-col gap-2" v-model="model" />
        </template>
        <template v-if="type in enumData">
          <u-select-menu v-model="model" :open="isEdit" value-key="value" :items="_values(foregin)" class=" w-48" />
        </template>
      </div>
      <div v-else class=" cursor-pointer p-4" @click="toggle(true)">
        <template v-if="type === 'text'">
          {{ model }}
        </template>
        <template v-if="type === 'text_list'">
          {{ model?.join(',') }}
        </template>
        <template v-if="type in enumData">
          {{ foregin[model].label }}
        </template>
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped></style>
