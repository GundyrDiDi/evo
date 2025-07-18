<script lang="ts" setup>
const props = defineProps<{
  enums: Enum_Data
  edit: boolean,
  readonly?: boolean
  max?: number,
}>()

defineEmits<{ (e: 'change', v): void }>()

const model = defineModel<any>()

const showModel = computed(() => {
  return Array.isArray(model.value) ? model.value.map(v => props.enums[v].label).join() : props.enums[model.value]?.label
})
</script>

<template>
  <template v-if="edit">
    <u-select-menu v-model="model" value-key="value" :multiple="Array.isArray(model)" :items="_values(enums)"
      v-bind="$attrs" />
  </template>
  <div v-else>
    {{ showModel }}
  </div>
</template>

<style lang="scss" scoped></style>
