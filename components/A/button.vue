<script lang="ts" setup>
</script>

<template>
  <u-button v-bind="$attrs" :class="_mergeClass($attrs,'justify-center')">
    <slot></slot>
  </u-button>
</template>

<style lang="scss" scoped></style>
