<script lang="ts" setup>
import { cloneVNode } from 'vue'

const [show, toggle] = useToggle()

const default_slot = useSlots().default
const renderSlot = () => cloneVNode(default_slot!()[0], { onClick: () => toggle(true) })

const open = () => toggle(true)
const close = () => toggle(false)

const trigger = !!useSlots().trigger

defineExpose({
  toggle, open, close
})
</script>

<template>
  <slot name="trigger" v-if="trigger" v-bind="{ toggle, open, close }"></slot>
  <component v-else :is="renderSlot" />
  <!--  -->
  <van-popup v-model:show="show" position="bottom" destroy-on-close v-bind="$attrs">
    <slot name="content" v-bind="{ toggle, open, close }"></slot>
  </van-popup>
</template>

<style lang="scss" scoped></style>
