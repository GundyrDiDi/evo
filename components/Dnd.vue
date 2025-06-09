<script lang="ts" setup>

const container = ref<HTMLElement>()

const [isDrag, setDrag] = useToggle()

const dragEl = ref()

const mousedown = (e: MouseEvent) => {
  e.stopPropagation()
  dragStart(e)
  const removeEvent = _listenEvent('mousemove', dragging)
  _onceEvent('mouseup', (e: MouseEvent) => {
    removeEvent()
    dragEnd(e)
  })
}

const dragStart = (e: MouseEvent) => {
  const { x, y } = e
  console.log(e)
  const el = container.value as HTMLElement
  if (el) {
    const { left, top, width, height } = el.getBoundingClientRect()
    containerSize.x = x - left
    containerSize.y = y - top
    containerSize.width = width
    containerSize.height = height

    position.x = left
    position.y = top
  }
}

const dragging = (e: MouseEvent) => {
  setDrag(true)
  requestAnimationFrame(() => {
    const { width, height } = dragEl.value.getBoundingClientRect()
    if (width === containerSize.width && height === containerSize.height) {
      position.x = e.x - containerSize.x
      position.y = e.y - containerSize.y
    } else {
      position.x = e.x - (width / 2)
      position.y = e.y - (height / 2)
    }
  })
}

const dragEnd = (e: MouseEvent) => {
  setDrag(false)
}

const drop = () => {
  if (!isDrag.value) {
    console.log('drop')
    console.log(data)
  }
}

const data = ref()

const containerSize = reactive({
  x: 0, y: 0, width: 0, height: 0
})

const position = reactive({ x: 0, y: 0 })

const style = computed(() => {
  return {
    left: position.x + 'px',
    top: position.y + 'px'
  }
})

onMounted(() => {
  container.value?.addEventListener('mouseup', drop)
})

onUnmounted(() => {
  container.value?.addEventListener('mouseup', drop)
})
</script>

<template>
  <div v-bind="$attrs" ref="container" @mousedown="mousedown">
    <slot v-bind="{ isDragEl: false }"></slot>
  </div>
  <div v-if="isDrag" ref="dragEl" v-bind="$attrs" class=" fixed pointer-events-none opacity-80" :style>
    <slot v-bind="{ isDragEl: true }"></slot>
  </div>
</template>

<style scoped></style>
