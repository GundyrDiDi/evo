<script lang="ts" setup>
function balanceSums(numbers: number[], n: number) {
  // 特殊情况处理
  if (n === 1) return {
    groups: [numbers],
    sum: numbers.reduce((a, b) => a + b, 0)
  }

  const sorted = [...numbers].sort((a, b) => b - a).map((v, i) => [v, i])

  const groups = Array.from({ length: n }, () => [] as number[])
  const sums = groups.map(() => 0)

  for (const [num, idx] of sorted) {
    let targetIdx = sums.indexOf(Math.min(...sums))
    groups[targetIdx].push(idx)
    sums[targetIdx] += num
  }

  return {
    groups,
    sum: Math.max(...sums)
  }
}

const calcSize = (rects: { height: number, width: number }[]) => {
  const h = rects[0].height
  const wList = rects.map((v) => v.width)
  let minS = Infinity
  let group: number[][] = []
  let row = 1
  while (row <= wList.length) {
    let h2 = row * h
    if (h2 >= minS) break
    let { groups: g, sum } = balanceSums([...wList], row)
    const max = Math.max(h2, sum)
    if (max < minS) {
      group = g
      minS = max
    }
    row++
  }
  return {
    group,
    side: minS,
    row: group.length * h
  }
}

const props = defineProps<{ list: any[], itemClass?: string }>()

const container = ref<HTMLDivElement>()

const group = ref<any[]>([])

const adapt = async () => {
  if (group.value.length) {
    group.value = []
    // 等待渲染后
    await new Promise(r => requestAnimationFrame(r))
  }
  if (container.value) {
    const list = [...container.value?.children!].map(v => v.getBoundingClientRect())
    group.value = calcSize(list).group
  }
}

watch(props.list, adapt)

onMounted(() => {
  adapt()
})
</script>

<template>
  <div v-if="group.length">
    <div class=" flex items-center" v-for="row in group" v-bind="$attrs">
      <slot v-for="i in row" v-bind="{ data: list[i] }">
        <div :class="itemClass">{{ list[i] }}</div>
      </slot>
    </div>
  </div>
  <div v-else ref="container" class="flex items-center flex-wrap" v-bind="$attrs">
    <template v-for="v in list">
      <slot v-bind="{ data: v }">
        <div :class="itemClass">{{ v }}</div>
      </slot>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
