<script lang="ts" setup>
const model = defineModel<number | null>({ required: true })

const strModel = computed({
  get() { return model.value?.toString() ?? '' },
  set(v) {
    let num = v ? Number(v) : null
    if (Number.isNaN(num)) {
      num = null
    }
    model.value = num
  }
})
</script>

<template>
  <v-field v-model="strModel" v-bind="$attrs" type="number" />
</template>

<style lang="scss" scoped></style>
