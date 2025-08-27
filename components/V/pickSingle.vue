<script lang="ts" setup>
import { cloneVNode } from 'vue'

defineOptions({
  inheritAttrs: false
})

type Options = { text?: string, value: Numeric }[]

const props = defineProps<{ options?: Options, enums?: Record<Numeric, Enum_Value> }>()

const options = computed<Options>(() => {
  if (props.enums) return Object.values(props.enums).map(v => ({ text: v.label ?? v.value, value: v.value }))
  return props.options ?? []
})

const model = defineModel<Numeric>()

const change = (e) => {
  console.log(e)
  model.value = e.selectedValues[0]
}

const selectOpt = computed(() => {
  return options.value.find(v => v.value == model.value)
})

const default_slot = useSlots().default
const renderSlot = () => cloneVNode(default_slot!()[0], { onClick: () => toggle(true) })

const [show, toggle] = useToggle()

// 重置回打开时的状态
const openState = ref()
const open = () => {
  openState.value = model.value
}
const reset = () => {
  model.value = openState.value
}

const clear = () => {
  model.value = undefined
}

const vin = ref()

</script>

<template>
  <component v-if="default_slot" :is="renderSlot" />
  <v-field v-else :label="$attrs.label ?? ''" readonly :model-value="selectOpt?.text ?? model?.toString() ?? ''"
    placeholder="请选择" @click="toggle(true)" />
  <!--  -->
  <van-popup v-model:show="show" position="bottom" destroy-on-close @open="open">
    <van-picker ref="vin" :model-value="[model!]" @change="change" :columns="options" cancel-button-text="清空"
      @cancel="clear" confirm-button-text="重置" @confirm="reset" />
  </van-popup>
</template>

<style lang="scss" scoped></style>
