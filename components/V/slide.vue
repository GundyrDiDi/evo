<script lang="ts" setup>
import { useDrag } from '@vueuse/gesture'

const props = defineProps<{ duration?: number }>()

// todo:各类钩子
const emits = defineEmits<{ (e: 'dragging', state): void }>()

const duration = props.duration ?? 300

// 滑动容器
const container = ref<HTMLElement>()

// 可设置控制滑动的元素
const handler = ref<HTMLElement>()

// 滑动显示元素
const slider = ref<HTMLElement>()

const width = computed(() => slider.value?.getBoundingClientRect().width ?? 0)

// 容器的motion
const motion = useMotion(container, {})

const [show, toggle] = useToggle()

// 类似transition组件的逻辑
const animate = (state: 'enter' | 'leave' = 'enter') => {
  const isE = state === 'enter'
  motion.apply({
    x: isE ? width.value : 0,
    transition: {
      type: 'tween',
      duration
    }
  })
  setTimeout(() => {
    toggle(isE)
  }, isE ? 0 : duration)
  // 其他元素的过渡动效
  next_state = isE ? 1 : 0
  next_duration = duration
  animateMask(next_state, duration)
}

const direction = ref<'x' | 'y' | void>()

// 当滑动开始时，是否是展开状态
let is_slid = false

let next_state: number

let next_duration: number

useDrag((state) => {
  const { movement: [mx], dragging, swipe, delta, first, last, event } = state
  if (first) {
    // console.log(state)
    const angle = Math.atan2(Math.abs(delta[1]), Math.abs(delta[0])) * 180 / Math.PI
    direction.value = angle > 5 ? 'y' : 'x'
    is_slid = show.value
  }
  if (direction.value === 'x') {
    first && toggle(true)
    const deltaX = is_slid ? width.value : 0
    const x = _range(0, width.value, mx + deltaX)
    // 滑动中
    if (dragging) {
      motion.apply({
        x,
        transition: { type: 'tween', duration: 0 }
      })
      // 钩子
      emits('dragging', state)
      //
      animateMask(x / width.value, 0)
    } else {
      // 放开后，判断是否触发swipe，如果没触发，默认设个66%的阈值
      if (swipe[0] === 0) {
        animate(x > width.value / 1.5 ? 'enter' : 'leave')
      } else {
        animate(swipe[0] === 1 ? 'enter' : 'leave')
      }
    }
  }
  //
  last && (direction.value = undefined)
}, {
  domTarget: container,
  threshold: 10
})

const open = () => animate('enter')
const close = () => animate('leave')

const mask = ref<HTMLElement>()
const maskMotion = useMotion(mask, {
  initial: { opacity: 0 }
})
// nextState 表示下一次的状态，值为[0,1]；后续可以通过当前值和下一次值，计算出合适的duration
const animateMask = (nextState: number, duration?: number) => {
  if (isNaN(nextState)) return
  const calcD = 0
  maskMotion.apply({
    opacity: nextState / 1.4,
    transition: {
      type: 'tween',
      duration: duration ?? calcD
    }
  })
}

</script>

<template>
  <div ref="container" class=" relative">
    <slot v-bind="{ handler, open, close }"></slot>
    <div v-if="show" class=" h-full w-full absolute z-10 top-0 right-0">
      <div ref="slider" class=" h-full absolute top-0 left-0 translate-x-[-100%]">
        <slot name="slider" v-bind="{ open, close }"></slot>
      </div>
      <div ref="mask" class=" h-full w-full bg-black" @click="animate('leave')"></div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
