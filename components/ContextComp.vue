<script lang="ts" setup>
// 如果一定要服务端渲染，可以在这里await先等待,保证useComp先执行完毕

const comps = useComps()

// 为了用于template，将服务端的comps改为真的ref值
const compsList = computed(() => Object.values(comps.value))

const mountHook = (comp: Comp) => {
  console.log(`${comp.id} mounted`)
}
const unMountHook = (comp: Comp) => {
  console.log(`${comp.id} unmounted`)
}
</script>

<template>
  <template v-for="comp in compsList">
    <component v-if="comp.filter() && comp.visible" :key="comp.key" :is="comp.component" :ref="e => comp.ref = e"
      v-bind="comp.props" @unmount="comp.unmount()" @vue:mounted="mountHook(comp)" @vue:unmounted="unMountHook(comp)" />
  </template>
</template>

<style lang="scss" scoped></style>
