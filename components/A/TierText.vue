<script lang="ts" setup>
const colorMode = 'light' //useColorMode()

const tier_bg = {
  "light": [
    "#C62828", // 深红 (位置0)
    "#E53935", // 红 (位置1)
    "#FF5722", // 橙红 (位置2)
    "#FF9800", // 橙黄 (位置3)
    // "#FFEB3B", // 黄 (位置4)
    "#81C784", // 青绿 (位置5)
    "#4CAF50", // 绿 (位置6)
    "#2196F3", // 蓝 (位置7)
    "#9C27B0"  // 紫 (位置8)
  ],
  "dark": [
    "#FF5252", // 深红 (位置0) - 鲜艳的亮红色
    "#FF6E6E", // 红 (位置1) - 明亮的粉红色
    "#FF8A65", // 橙红 (位置2) - 鲜艳的橙红色
    "#FFB74D", // 橙黄 (位置3) - 明亮的橙黄色
    // "#FFFF72", // 黄 (位置4) - 鲜艳的亮黄色
    "#A5D6A7", // 青绿 (位置5) - 亮青绿色
    "#66BB6A", // 绿 (位置6) - 鲜艳的绿色
    "#64B5F6", // 蓝 (位置7) - 明亮的蓝色
    "#BA68C8"  // 紫 (位置8) - 鲜艳的紫色
  ]
};

const length = tier_bg[colorMode].length

const props = defineProps<{ text: string }>()

const tiers = Object.keys(Enum.tier)

const bg = computed(() => {
  const i = tiers.findIndex((v) => v === props.text)
  return i < length ? tier_bg[colorMode][i] : ''
})
</script>

<template>
  <span class=" inline-flex items-center justify-center" :class="bg && ' text-[#333]'"
    :style="bg && { background: bg }">
    {{ text }}</span>
</template>

<style lang="scss" scoped></style>
