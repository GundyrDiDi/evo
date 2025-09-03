<script lang="ts" setup>
const props = defineProps<{ timing?: string, type?: 'scroll-down', duration?: number, js?: boolean }>()

// scroll-down
const animation = ({ el, done }: { el: HTMLElement, done: () => void }, type: 'enter' | 'leave',) => {
  const duration = props.duration ?? 300
  const original_style = _pick(el.style, ['height', 'overflow', 'transition'])
  const end = () => {
    done()
    requestAnimationFrame(() => {
      Object.entries(original_style).forEach(([k, v]) => {
        el.style[k] = v
      })
    })
  }
  const start_time = Date.now()
  const { height } = el.getBoundingClientRect()
  // const height=el.scrollHeight

  const animate = () => {
    // js模式
    if (props.js) {
      let delta = Math.min(1, (Date.now() - start_time) / duration)
      if (delta < 1) {
        if (type === 'leave') delta = 1 - delta
        el.style.height = `${(height * delta).toFixed(2)}px`
        requestAnimationFrame(animate)
      } else {
        end()
      }
      return
    }
    // css模式
    el.style.transition = `height ${duration}ms ${props.timing ?? 'ease-out'}`
    el.style.height = type === 'enter' ? `${height}px` : '0px'
    setTimeout(end, duration)
  }
  el.style.height = type === 'enter' ? '0px' : `${height}px`
  el.style.overflow = 'hidden'
  requestAnimationFrame(animate)
}

const enter = (el, done) => {
  animation({ el, done }, 'enter')
}
const leave = (el, done) => {
  animation({ el, done }, 'leave')
}
</script>

<template>
  <transition v-bind="$attrs" @enter="enter" @leave="leave">
    <slot></slot>
  </transition>
</template>

<style lang="scss" scoped></style>
