<script lang="ts" setup>

const model = defineModel<GameDTO>({ required: true })

const data = toValue(model.value)

defineEmits<{ (e: 'update', v?: GameDTO): void }>()

const [show, toggle] = useToggle()

// const cell = useOutClick(_ => {
//   // 
//   requestAnimationFrame(() => {
//     toggle(false)
//   })
// })

const title = ref()

onLongPress(
  title,
  () => toggle(true),
  {
    delay: 300,
  }
)

const { alias, complete_time } = useGameColumn()

// 
const badge = computed(() => {
  if (data.tier) return data.tier
  if (data.judgment) return data.judgment.slice(0, 1)
  if (data.status === 'look_forward') return '🌟'
  return ''
})
</script>

<template>
  <div ref="cell">
    <div class=" flex items-center relative pb-2" ref="title">
      <van-field v-model="data.name" />
      <span class="absolute right-0 flex gap-3 items-center">
        <span class=" text-[12px]">{{ data.cpt_date ?? '--/--' }}</span>
        <a-tier-text v-if="data.tier" class=" w-4 h-4 rounded text-[10px] font-[700]" :text="badge">
        </a-tier-text>
        <span v-else>{{ badge }}</span>
      </span>
    </div>
    <div v-if="show">
      <v-field :label="alias.label" v-model="data.alias" />
      <!-- <van-date-picker :title="complete_time.label" /> -->
      <div class=" w-full text-center mt-2" @click="toggle(false)">
        <i-chevron-double-up-solid class=" inline-block text-sky-700 text-[20px]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.van-field {
  line-height: 32px;
}
</style>

<!-- <van-swipe-cell>
  <div class=" flex items-center">
    <van-field v-model="data.name" />
  </div>
  <template #right>
    <u-button class=" rounded-none h-full w-12 justify-center" icon="i-heroicons-trash"/>
  </template>
</van-swipe-cell> -->