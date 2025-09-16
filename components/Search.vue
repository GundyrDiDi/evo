<script lang="ts" setup>
import z from 'zod'


const game = useGame()

const baseFilter = _pick(game.useGameColumn(), ['name'])

// 比如 名称或别名，某个时间段
const ComplexFilter = z.object({
  // 查询逻辑：
  name_or_alias: z.string().min(1)
})

</script>

<template>
  <div>
    123123
  </div>
</template>

<style lang="css" scoped></style>
