<script lang="ts" setup>
const [model] = defineModel<string[]>({ required: true })

const list = ref([''])
list.value = model.value?.length ? model.value : ['']

// 单向数据流
watch(list, (list) => {
  model.value = _unique(list.join(',').split(','))
}, { deep: true })

// 
const add = () => {
  const last = list.value[list.value.length - 1] ?? ''
  if (last !== '') {

  }
}
</script>

<template>
  <div>
    <u-input v-for="(_, i) in list" v-model="list[i]"></u-input>
    <!-- <u-button class=" flex justify-center" icon="i-heroicons-plus" @click="add"></u-button> -->
  </div>
</template>

<style lang="scss" scoped></style>
