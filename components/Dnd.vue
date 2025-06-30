<script lang="ts" setup generic="T">

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
  // console.log(e)
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
  dragData.value = props.data

  requestAnimationFrame(() => {
    if (!dragEl.value) return
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
  if (stopDragEnd.value) return
  emits('dragEnd', e)
}

const drop = () => {
  if (!isDrag.value) {
    dragData.value && emits('drop', dragData.value)
    dragData.value = null
    stopDragEnd.value = true
    requestAnimationFrame(() => {
      stopDragEnd.value = false
    })
  }
}

const stopDragEnd = useState('stop-drag-end', () => false)

const dragData = useState<T | null>('drag-data', () => null)

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

const props = defineProps<{ data: T }>()
const emits = defineEmits<{ (e: 'drop', data: T): void, (e: 'dragEnd', event: MouseEvent): void }>()
</script>

<template>
  <div v-bind="$attrs" ref="container" @mousedown="mousedown" @mouseup="drop">
    <slot v-bind="{ isDragEl: false }"></slot>
  </div>
  <div v-if="isDrag" ref="dragEl" v-bind="$attrs" class=" fixed pointer-events-none opacity-80" :style>
    <slot v-bind="{ isDragEl: true }"></slot>
  </div>
</template>

<style scoped></style>
