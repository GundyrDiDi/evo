<script lang="ts" setup generic="D extends string|number">
const props = defineProps<{
  enums: Record<D, {
    value: D,
    label?: string
  }>,
  asArray?: boolean,
  edit: boolean,
  readonly?: boolean
  max?: number,
}>()

defineEmits<{ (e: 'change', v): void }>()

const model = defineModel<D | D[] | null>()

const showModel = computed(() => {
  if (!model.value) return ''
  return Array.isArray(model.value) ? model.value?.map(v => props.enums[v].label).join() : props.enums[model.value]
})
</script>

<template>
  <template v-if="edit">
    <u-select-menu v-model="model" value-key="value" :multiple="asArray" :items="<any>_values(enums)" v-bind="$attrs" />
  </template>
  <div v-else>
    {{ showModel }}
  </div>
</template>

<style lang="scss" scoped></style>
