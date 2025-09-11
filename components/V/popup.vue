<script lang="ts" setup>
import { cloneVNode } from 'vue'

const [show, toggle] = useToggle()

const default_slot = ref(useSlots().default)
const renderSlot = () => cloneVNode(default_slot.value!()[0], { onClick: () => toggle(true) })

const open = () => toggle(true)
const close = () => toggle(false)

const trigger = !!useSlots().trigger

defineExpose({
  toggle, open, close
})

onUpdated(() => {
  // 监听子组件是否改变
  default_slot.value = useSlots().default
})
</script>

<template>
  <slot name="trigger" v-if="trigger" v-bind="{ toggle, open, close }"></slot>
  <component v-else-if="default_slot" :is="renderSlot" />
  <!--  -->
  <van-popup v-model:show="show" position="bottom" destroy-on-close v-bind="$attrs">
    <slot name="content" v-bind="{ toggle, open, close }"></slot>
  </van-popup>
</template>

<style lang="scss" scoped></style>
