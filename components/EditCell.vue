<script lang="ts" setup generic="D extends Object">

const props = defineProps<{ type: Column_Type, readonly?: boolean, component?: any, isCreate: boolean, data: D }>()

const emits = defineEmits<{ (e: 'update' | 'create', row: D): void }>()

const [model] = defineModel<any>({ required: true })

const [isEdit, toggle] = useToggle(false)

const asArray = computed(() => parseType(props.type).asArray)

const enumData = computed(() => props.type in Enum ? Enum[props.type as Enum_Name] : undefined)

const cell = useOutClick(_ => {
  requestAnimationFrame(() => {
    if (isEdit.value) {
      toggle()
      update()
    }
  })
})

const update = async () => {
  if (asArray.value) {
    model.value = _unique(model.value)
  }
  if (props.data['id'] === 1000) {
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
        <template v-else-if="enumData">
          <u-select-menu v-model="model" :default-open="isEdit" value-key="value" :items="_values(enumData)"
            class=" min-w-24" />
        </template>
        <template v-else-if="type === 'string'">
          <u-input v-model="model" />
        </template>
        <template v-else-if="type === 'string[]'">
          <a-text-list class=" flex flex-col gap-2" v-model="model" />
        </template>
      </div>
      <div v-else class=" cursor-pointer p-4" @click="toggle(true)">
        <template v-if="component">
          <component :is="component" v-model="model"></component>
        </template>
        <template v-else-if="enumData">
          {{ enumData[model].label }}
        </template>
        <template v-else-if="type === 'string'">
          {{ model }}
        </template>
        <template v-else-if="type === 'string[]'">
          {{ model?.join(',') }}
        </template>
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped></style>
