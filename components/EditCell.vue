<script lang="ts" setup>
const props = defineProps<{ readonly?: boolean, always?: boolean, asArray?: boolean, enums?: Record<string, any> }>()

const emits = defineEmits<{ (e: 'update', val): void }>()

// 注意：值可以是数组
const [model] = defineModel<any>({ required: true })

const [isEdit, toggle] = useToggle(props.always)

const cell = useOutClick(_ => {
  if (props.always) return
  requestAnimationFrame(() => {
    if (isEdit.value) {
      toggle(false)
      emits('update', model)
    }
  })
})

</script>

<template>
  <div ref="cell" class=" relative z-1 p-2" @click="isEdit || toggle(true)">
    <!-- <e-select class=" min-w-24" v-if="enums" v-model="model" :readonly="readonly" :edit="isEdit" :enums="enums"
      :asArray="asArray" :default-open="always ? false : true"></e-select>
    <e-text v-else v-model="model" :readonly="readonly" :edit="isEdit" :asArray="asArray"></e-text> -->
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>