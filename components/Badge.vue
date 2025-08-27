<script lang="ts" setup>
const model = defineModel<GameDTO>({ required: true })

const data = toValue(model)

// 显示顺序：tier>judgment>status
const badge = computed(() => {
  if (data.tier) return data.tier
  if (data.judgment) return data.judgment.slice(0, 1)
  return Enum.complete_status[data.status ?? 'not_start'].icon
})

const options = computed(() => [
  Object.values(Enum.complete_status).map(v => ({ text: v.icon, value: v.value })),
  [{ text: '暂不定级', value: '' }].concat(Object.values(Enum.tier).map(v => ({ text: v.value, value: v.value }))),
])

const status_tier = computed({
  get() {
    // 默认值
    return [data.status ?? 'not_start', data.tier ?? '']
  },
  set([a, b]: [Enums<'complete_status'>, Enums<'g_tier'>]) {
    [data.status, data.tier] = [a || null, b || null]
  }
})

</script>

<template>
  <v-picker :columns="options" v-model="status_tier">
    <a-tier-text v-if="data.tier" class=" w-4.5 h-4.5 rounded text-[10px] font-[700]" :text="badge">
    </a-tier-text>
    <span v-else>{{ badge }}</span>
  </v-picker>
</template>

<style lang="scss" scoped></style>
