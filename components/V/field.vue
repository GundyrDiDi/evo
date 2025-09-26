<script lang="ts" setup>
const props = defineProps<{ asArray?: boolean, trim?: boolean, }>()

const emits = defineEmits<{ (e: 'blur', evt): void }>()

// 支持根据分隔符转换成数组类型
const model = defineModel<string[] | string | null>({ required: true })

const text = computed<string>({
  get() {
    return model.value ? model.value.toString() : ''
  },
  set(val) {
    // 默认过滤空
    if (props.asArray) {
      model.value = val ? val.split(/,|，/) : []
    } else {
      model.value = val
    }
  }
})

const blur = (e) => {
  if (props.trim) {
    if (props.asArray) {
      text.value = text.value.split(/,|，/).map(v => v.trim()).filter(v => v).toString()
    } else {
      text.value = text.value.trim()
    }
  }
  emits('blur', e)
}

const { expose, vins } = useExpose()
defineExpose(expose)

</script>

<template>
  <van-field :ref="vins" label-width="auto" v-bind="$attrs" v-model="text" @blur="blur" class=" bg-transparent!" />
</template>

<style lang="scss" scoped></style>
