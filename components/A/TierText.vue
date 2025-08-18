<script lang="ts" setup>
const colorMode = 'dark' //useColorMode()

const tier_bg = {
  "light": [
    "#FF7F7F",
    "#FFBF7F",
    "#FFF47F",
    "#87FF7F",
    "#7FBEFF",
    "#C183E0"
  ],
  "dark": [
    "#FF6161",  // 更明亮的品红
    "#FF9858",  // 明快的南瓜橙
    "#FFE25B",  // 鲜明的日光黄
    "#6BDF6B",  // 亮眼的霓虹绿
    "#67A8FF",  // 鲜艳的钴蓝
    "#AE78E0"   // 深亮紫丁香紫
  ]
}

const length = tier_bg['dark'].length

const props = defineProps<{ text: string }>()

const tiers = Object.keys(Enum.tier)

const bg = computed(() => {
  const i = tiers.findIndex((v) => v === props.text)
  return i < length ? tier_bg['dark'][i] : ''
})
</script>

<template>
  <span class=" inline-flex items-center justify-center" :class="bg && ' text-[#333]'"
    :style="bg && { background: bg }">
    {{ text }}</span>
</template>

<style lang="scss" scoped></style>
