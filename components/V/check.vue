<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})

const model = defineModel<boolean | null>()

const emits = defineEmits<{ (e: 'change', val: boolean): void }>()

const handleClick = () => {
  emits('change', !model.value)
  model.value = !model.value
}
</script>

<template>
  <van-field label-width="auto" v-bind="$attrs" readonly clickable @click="handleClick">
    <template #input>
      <slot v-bind="{ value: model }">
        {{ model ? '✅' : '▢' }}
      </slot>
    </template>
  </van-field>
</template>

<style scoped>
</style>
