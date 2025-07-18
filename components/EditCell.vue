<script lang="ts" setup generic="D extends Object">
const [model] = defineModel<any>({ required: true })

const props = defineProps<{ type: Column_Type, data: D, readonly?: boolean, always?: boolean }>()

const emits = defineEmits<{ (e: 'update', row: D): void, (e: 'change', model): void }>()

const cType = useColumnType(() => props.type)

const [isEdit, toggle] = useToggle(!!props.always)

const cell = useOutClick(_ => {
  if (props.always) return
  requestAnimationFrame(() => {
    if (isEdit.value) {
      toggle()
      update()
    }
  })
})

const update = () => {
  emits('update', props.data)
}

watch(model, (v) => {
  emits('change', v)
})

</script>

<template>
  <div ref="cell" class=" relative z-1" @click="always || toggle()">
    <e-select v-if="cType.enums" v-model="model" :readonly="readonly" :edit="isEdit" :enums="cType.enums"
      :default-open="always ? false : true"></e-select>
    <e-date v-else-if="cType.valueType === 'date'" v-model="model" v-bind="cType" :readonly="readonly" :edit="isEdit"
      :default-open="always ? false : true"></e-date>
    <e-text v-else-if="cType.valueType === 'string'" v-model="model" v-bind="cType" :readonly="readonly"
      :edit="isEdit"></e-text>
  </div>
</template>

<style lang="scss" scoped></style>
