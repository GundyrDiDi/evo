<script lang="ts" setup generic="Type extends EnumValueType,K extends keyof RowGameList, D extends RowGameList">

const props = defineProps<{ type?: Type, id?: K, component?: any, enums?: any, isCreate: boolean, data: D }>()

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
        <template v-if="component">
          <component :is="component" v-model="model"></component>
        </template>
        <template v-else-if="type === 'text'">
          <u-input v-model="model" />
        </template>
        <template v-else-if="type === 'text_list'">
          <a-text-list class=" flex flex-col gap-2" v-model="model" />
        </template>
        <template v-else-if="type === 'enum'">
          <u-select-menu v-model="model" :default-open="isEdit" value-key="value" :items="_values(enums!)"
            class=" min-w-24" />
        </template>
      </div>
      <div v-else class=" cursor-pointer p-4" @click="toggle(true)">
        <template v-if="component">
          <component :is="component" v-model="model"></component>
        </template>
        <template v-else-if="type === 'text'">
          {{ model }}
        </template>
        <template v-else-if="type === 'text_list'">
          {{ model?.join(',') }}
        </template>
        <template v-else-if="type === 'enum'">
          {{ enums[model].label }}
        </template>
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped></style>
