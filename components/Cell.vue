<script lang="ts" setup>
const model = defineModel<GameDTO>({ required: true })

const data = toValue(model.value)

defineEmits<{ (e: 'update', v?: GameDTO): void }>()

const [show, toggle] = useToggle()

// const cell = useOutClick(_ => {
//   requestAnimationFrame(() => {
//     toggle(false)
//   })
// })

const title = ref()

onLongPress(
  title,
  () => toggle(true),
  { delay: 300 }
)

const { alias, finish_date, status } = useGameColumn()

// const update = useDebounceFn((v) => {
//   console.log(v)
// }, 5000)
// watch(data, update)

</script>

<template>
  <div ref="cell">
    <div class=" flex items-center relative pb-2">
      <v-field v-model="data.name" ref="title" />
      <span class="absolute right-0 flex gap-3 items-center">
        <v-date-picker v-model="data.finish_date">
          <span class=" text-[12px]">{{
            data.finish_date ? dayjs(data.finish_date).format("MM/YY") : '--/--'
          }}</span>
        </v-date-picker>
        <Badge v-model="data" />
      </span>
    </div>
    <div v-if="show">
      <v-field v-model="data.alias" :label="alias.label" :as-array="alias.asArray" />
      <!-- <v-pick-single v-model="data.status!" :label="status.label" :enums="status.enums" /> -->
      <u-button class=" w-full justify-center my-2" @click="toggle()">
        <i-chevron-double-up-solid class=" inline-block text-gray-800 text-[20px]" />
      </u-button>
    </div>
  </div>
</template>

<style scoped>
:deep(.van-field) {
  line-height: 32px;
}

:deep(.van-picker__toolbar) {
  padding: 0 1rem;
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