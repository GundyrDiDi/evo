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

const model = defineModel<Numeric[]>()

const selectOpts = computed(() => {
  return options.value.filter(v => model.value?.includes(v.value))
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

const check = (opt: Options[number]) => {
  if (model.value?.includes(opt.value)) {
    model.value = model.value?.filter(v => v !== opt.value)
  } else {
    model.value ? model.value.push(opt.value) : (model.value = [opt.value])
  }
}

const vins = ref()

</script>

<template>
  <component v-if="default_slot" :is="renderSlot" />
  <v-field v-else :label="$attrs.label ?? ''" readonly :model-value="selectOpts.map(v => v.text).join()"
    placeholder="请选择" clickable @click="toggle(true)" />
  <!--  -->
  <van-popup v-model:show="show" position="bottom" class=" pt-4" destroy-on-close @open="open"
    :teleport="$attrs.teleport ?? undefined">
    <!-- <div class=" header"></div> -->
    <div class=" max-h-[50vh] pb-6 overflow-auto">
      <div class=" flex items-center h-12 px-4 text-[#fff] justify-center gap-4" v-for="v in options"
        :class="[model?.includes(v.value) && ' text-primary-500 font-[600]']" @click="check(v)">
        <slot v-bind="{ item: v }">
          {{ v.text }}
        </slot>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped></style>
