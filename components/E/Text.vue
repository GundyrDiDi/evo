<script lang="ts" setup>
const props = defineProps<{
  asArray: boolean,
  edit: boolean,
  readonly?: boolean
  max?: number,
}>()

defineEmits<{ (e: 'change', v: string | string[]): void }>()

const model = defineModel<string | string[]>({ default: ()=>props.asArray ? [''] : '' })
</script>

<template>
  <div v-if="Array.isArray(model)" class=" flex flex-col gap-2">
    <template v-if="edit">
      <u-input v-for="(_, i) in model" v-model="model[i]"></u-input>
      <u-button @click="model.push('')">+</u-button>
    </template>
    <span v-else>{{ model.join() }}</span>
  </div>
  <div v-else>
    <u-input v-if="edit" v-model="model"></u-input>
    <span v-else>{{ model }}</span>
  </div>
</template>

<style lang="scss" scoped></style>
