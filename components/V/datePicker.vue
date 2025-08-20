<script lang="ts" setup>
const props = defineProps<{ transfer?: (val: string[]) => string | Date | null }>()

const model = defineModel<string | Date | null>()

const date = ref()

const [show, toggle] = useToggle()

const setDate = (now?: 'now') => {
  now ? change({ selectedValues: dayjs().format('YYYY/MM/DD').split('/') }) : (model.value = null)
  toggle(false)
}

const change = ({ selectedValues }) => {
  date.value = selectedValues
  const transfer = props.transfer ?? ((val) => val.length ? val.join('/') : null)
  model.value = transfer(selectedValues)
}

const open = () => {
  date.value = _date_str(model.value || undefined).split('/')
  toggle(true)
}

</script>

<template>
  <div @click="open">
    <slot v-bind="{ date }"></slot>
  </div>
  <van-popup v-model:show="show" position="bottom" class=" h-[50%]">
    <van-date-picker :model-value="date" v-bind="$attrs" title="选择日期" confirm-button-text="今日" cancel-button-text="置空"
      @confirm="setDate('now')" @cancel="setDate()" @change="change" />
  </van-popup>
</template>

<style scoped>
:deep(.van-picker__toolbar) {
  padding: 0 1rem;
}
</style>
