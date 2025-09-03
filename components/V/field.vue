<script lang="ts" setup>
const props = defineProps<{ asArray?: boolean, allowEmpty?: boolean, trim?: boolean }>()

// 支持根据分隔符转换成数组类型
const model = defineModel<string[] | string | null>({ required: true })

const text = computed<string>({
  get() {
    return model.value ? model.value.toString() : ''
  },
  set(val) {
    // 默认过滤空
    model.value = props.asArray ? val.split(/(,|，)/) : val
  }
})
</script>

<template>
  <van-field label-width="auto" v-bind="$attrs" v-model="text" />
</template>

<style lang="scss" scoped></style>
