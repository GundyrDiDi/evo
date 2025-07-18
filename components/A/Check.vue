<script lang="ts" setup>
const model = defineModel<boolean>()

const emits = defineEmits<{ (e: 'change', val: boolean): void }>()

const handleClick = () => {
  emits('change', !model.value)
  model.value = !model.value
}
</script>

<template>
  <div @click="handleClick" class="h-full w-full cursor-pointer">
    <span class=" text-xl">
      {{ model ? '✅' : '▢' }}
    </span>
  </div>
</template>

<style lang="scss" scoped></style>
