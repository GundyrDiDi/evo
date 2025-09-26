<script lang="ts" setup>
const model = defineModel<string>()

const text = ref(model.value ?? '')

watch(model, (v) => {
  if (text.value !== v) text.value = v ?? ''
})
</script>

<template>
  <v-field v-model="text" v-bind="$attrs" @blur="model = text" />
</template>

<style lang="css" scoped></style>
