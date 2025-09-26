<script lang="ts" setup generic="T extends Numeric">
defineProps<{ list: { name: T, label?: string }[], titleClass?: orArray<string> }>()
</script>

<template>
  <component is="div" v-for="v in list" :key="v.name" v-bind="$attrs">
    <slot :name="`${v.name}-title`">
      <slot>
        <div :class="titleClass">{{ v.label }}</div>
      </slot>
    </slot>
    <slot :name="v.name"></slot>
  </component>
</template>

<style lang="css" scoped></style>
