<script lang="ts" setup>
const h = ref()
onMounted(() => {
  h.value = window.innerHeight
})
</script>

<template>
  <div class="min-h-screen overflow-x-hidden flex flex-col" :style="{ height: h + 'px' }">
    <slot></slot>
  </div>
</template>

<style lang="css" scoped></style>
