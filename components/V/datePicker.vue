<script lang="ts" setup>
import { cloneVNode } from 'vue'

const props = defineProps<{ transfer?: (val: string[]) => string | Date | null }>()

const model = defineModel<string | Date | null>()

const date = ref()

const [show, toggle] = useToggle()

const setNowOrNull = (now?: boolean) => {
  now ? change({ selectedValues: _date_str().split('-') }) : (model.value = null)
  toggle(false)
}

const change = ({ selectedValues }) => {
  date.value = selectedValues
  const transfer = props.transfer ?? ((val) => val.length ? val.join('-') : null)
  model.value = transfer(selectedValues)
}

const open = () => {
  date.value = _date_str(model.value || undefined).split('-')
}
watch(show, (v) => v && open())

const default_slot = useSlots().default
const renderSlot = () => cloneVNode(default_slot!()[0], { onClick: () => toggle(true) })
</script>

<template>
  <component v-if="default_slot" :is="renderSlot" />
  <v-field v-else :label="$attrs.label ?? ''" :model-value="model?.toString() ?? ''"
    @input="e => model = e.target.value" readonly placeholder="选择日期" clickable @click="toggle(true)" />
  <!--  -->
  <van-popup v-model:show="show" position="bottom" class=" h-[50%]" destroy-on-close>
    <van-date-picker :model-value="date" v-bind="$attrs" title="选择日期" confirm-button-text="今日" cancel-button-text="置空"
      @confirm="setNowOrNull(true)" @cancel="setNowOrNull()" @change="change" />
  </van-popup>
</template>

<style scoped></style>
