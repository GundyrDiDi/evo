<script lang="ts" setup generic="D extends Object">
const props = defineProps<{ list: D[], init?: () => D }>()

const add = () => {
  props.list.push(props.init?.() ?? {} as D)
}
</script>

<template>
  <div>
    <slot v-for="v,i in list" :item="v" :index="i" :list="list">
      {{ v }}
    </slot>
    <u-button @click="add">+</u-button>
  </div>
</template>

<style lang="scss" scoped></style>
