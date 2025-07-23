<script lang="ts" setup>
type CellType = 'text' | 'date' | 'enum'

const props = defineProps<{ readonly?: boolean, always?: boolean, type?: CellType, asArray?: boolean, enums?: Record<string, any> }>()

const emits = defineEmits<{ (e: 'update', val): void }>()

// 注意：值可以是数组
const [model] = defineModel<any>({ required: true })

const { copy, sync } = useCopy(model)

const [isEdit, toggle] = useToggle(props.always)

const cell = useOutClick(_ => {
  if (props.always) return
  requestAnimationFrame(() => {
    if (isEdit.value) {
      toggle()
      emits('update', copy.value)
    }
  })
})

watch(copy, (v) => {
  // 绕过update，直接修改model
  props.always && sync()
}, { deep: true })

</script>

<template>
  <div ref="cell" class=" relative z-1 p-2" @click="always || toggle()">
    <e-select class=" min-w-24" v-if="enums" v-model="copy" :readonly="readonly" :edit="isEdit" :enums="enums"
      :asArray="asArray" :default-open="always ? false : true"></e-select>
    <e-text v-else v-model="copy" :readonly="readonly" :edit="isEdit" :asArray="asArray"></e-text>
  </div>
</template>

<style lang="scss" scoped></style>