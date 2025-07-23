<script lang="ts" setup generic="T extends string | number">
defineProps<{ name: T }>()
</script>

<template>
  <slot :name="name"></slot>
</template>

<style lang="scss" scoped></style>
