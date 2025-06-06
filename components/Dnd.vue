<script lang="ts" setup>
const container = ref()

const [isDrag, setDrag] = useToggle()

const dragEl = ref()

const mousedown = () => {
  setDrag(true)
  listen()
}

const listen = () => {
  const fn = () => {
    console.log('mouseup')
    document.removeEventListener('mouseup', fn)
    
  }
  document.addEventListener('mouseup', fn)
}

const mousemove = () => {
}

// 结束拖拽函数
const mouseup = () => {
  setDrag(false)
};

</script>

<template>
  <div v-bind="$attrs" ref="container" @mousedown="mousedown">
    <slot v-bind="{ isDragEl: false }"></slot>
  </div>
  <div v-if="isDrag" ref="dragEl" v-bind="$attrs" class=" fixed">
    <slot v-bind="{ isDragEl: true }"></slot>
  </div>
</template>

<style scoped></style>
