<script lang="ts" setup>
const comps = useComps()

const mountHook = (comp: Comp) => {
  console.log(`${comp.id} mounted`)
}
const unMountHook = () => { }
</script>

<template>
  <template v-for="[id, comp] in comps">
    <component v-if="comp.filter() && comp.visible" :key="comp.key" :is="comp.component" v-bind="comp.props"
      :ref="e => comp.ref = e" @unmount="comp.unmount()" @vue:mounted="mountHook(comp)" @vue:unmounted="unMountHook" />
  </template>
</template>

<style lang="scss" scoped></style>
