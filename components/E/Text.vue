<script lang="ts" setup>
const props = defineProps<{
  asArray?: boolean,
  edit: boolean,
  readonly?: boolean
}>()

defineEmits<{ (e: 'change', v: string | string[]): void }>()

const model = defineModel<string | string[] | null>()

const list = reactive<string[]>([])

if (!props.asArray) {
  list.push(model.value as string ?? '')
} else {
  model.value?.length ? list.push(...model.value) : list.push('')
}

watch(list, () => {
  if (props.asArray) {
    model.value = list
  } else {
    model.value = list[0]
  }
})
</script>

<template>
  <div class=" flex flex-col gap-2">
    <template v-if="edit">
      <u-input v-for="(_, i) in list" v-model="list[i]"></u-input>
      <a-button v-if="asArray" @click="list.push('')">+</a-button>
    </template>
    <template v-else>
      {{ list.join() }}
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
