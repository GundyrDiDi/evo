<script lang="ts" setup>
defineProps<{ a: string, b: number }>()
defineEmits<{ (e: 'change', v: string): void, (e: 'update', v: number): void }>()

</script>

<template>
  <div @click="$emit('change', a + a.length)">{{ a }}</div>
  <div @click="$emit('update', b)">{{ b }}</div>
</template>

<style lang="scss" scoped></style>
