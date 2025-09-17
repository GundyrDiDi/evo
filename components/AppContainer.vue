<script lang="ts" setup>
const h = ref(0)
onMounted(() => {
  h.value = window.innerHeight
})
</script>

<template>
  <div class="h-screen overflow-x-hidden fixed top-0 w-screen" :style="{ minHeight: h + 'px' }">
    <slot></slot>
  </div>
</template>

<style lang="css" scoped></style>
