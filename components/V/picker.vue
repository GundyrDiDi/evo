<script lang="ts" setup>
import { cloneVNode } from 'vue'

defineOptions({
  inheritAttrs: false
})

type Options = { text?: string, value: Numeric }[]

const props = defineProps<{ columns: Options[] }>()

const model = defineModel<Numeric[]>()

const selectItems = computed(() => {
  return props.columns.map((opt, i) => {
    return opt.find(v => v.value == model.value?.[i])
  })
})

const default_slot = useSlots().default
const renderSlot = () => cloneVNode(default_slot!()[0], { onClick: () => toggle(true) })

const [show, toggle] = useToggle()

// 重置回打开时的状态
const openState = ref()
const open = () => {
  openState.value = [...model.value ?? []]
}
const reset = () => {
  model.value = openState.value
}

const clear = () => {
  model.value = []
}

const vin = ref()

</script>

<template>
  <component v-if="default_slot" :is="renderSlot" />
  <v-field v-else :label="$attrs.label ?? ''" readonly :model-value="selectItems.map(v => v?.text).join()"
    placeholder="请选择" @click="toggle(true)" />
  <!--  -->
  <van-popup v-model:show="show" position="bottom" destroy-on-close @open="open">
    <van-picker ref="vin" v-model="model" :columns="columns" cancel-button-text="清空" @cancel="clear"
      confirm-button-text="重置" @confirm="reset" />
  </van-popup>
</template>

<style lang="scss" scoped></style>
