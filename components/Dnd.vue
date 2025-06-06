<script lang="ts" setup>  

const container = ref()

const [isDrag, setDrag] = useToggle()

const dragEl = ref()

const mousedown = () => {
  console.log('mousedown')
  setDrag(true)
  listen()
}

const listen = () => {
  const fn = () => {
    console.log('mouseup')
    document.removeEventListener('mouseup', fn)
    setDrag(false)
  }
  document.addEventListener('mouseup', fn)
}

const mousemove = () => {
}

</script>

<template>
  <div v-bind="$attrs" ref="container" v-longpress="mousedown">
    <slot v-bind="{ isDragEl: false }"></slot>
  </div>
  <div v-if="isDrag" ref="dragEl" v-bind="$attrs" class=" fixed">
    dragging
    <slot v-bind="{ isDragEl: true }"></slot>
  </div>
</template>

<style scoped></style>
