<script lang="ts" setup>
const model = defineModel<GameDTO>({ required: true })

const data = toValue(model)

const props = defineProps<{ cell_key?: Numeric, expand?: boolean }>()

const emit = defineEmits<{ (e: 'update', v: GameDTO): void }>()

const cell_id = props.cell_key ? useState<Numeric | undefined>('cell_id', () => undefined) : ref()

const toggle = (v?: Numeric) => {
  cell_id.value = v
}

const { alias, publish_date, dlc_associated_game, status, platform, edition, owned, play_time, series, tags, judgment } = useGameColumn()

function isFocusedInput() {
  const activeElement = document.activeElement
  return activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)
}

const update = useDebounceFn(() => {
  // 输入框聚焦时不提交
  if (isFocusedInput()) return requestAnimationFrame(update)
  emit('update', data)
}, 3000)

watch(data, update)

const title = ref()

onMounted(() => {
  props.expand && title.value.focus()
})

const showDay = (d) => dayjs(d).format("YYYY/MM")
</script>

<template>
  <div ref="cell" class="py-1">
    <div class=" flex items-center relative">
      <v-field v-model="data.name" ref="title" @click="toggle(data.id)" trim />
      <span class="absolute right-0 flex gap-3 items-center">
        <v-date-picker v-model="data.finish_date" :min-date="new Date('2000/01/01')" :max-date="new Date()">
          <span class=" text-[12px]">{{
            data.finish_date ? showDay(data.finish_date) : '--/--'
          }}</span>
        </v-date-picker>
        <Badge v-model="data" />
      </span>
    </div>
    <div v-auto-animate>
      <div v-if="cell_id === data.id" class=" max-h-[70vh] overflow-auto">
        <v-field v-model="data.tags" :label="tags.label" />
        <v-field v-model="data.alias" :label="alias.label" :as-array="alias.asArray" trim />
        <v-pick-single v-model="data.status!" :label="status.label" :enums="status.enums" />
        <v-select v-model="data.platform!" :label="platform.label" :enums="platform.enums" />
        <v-field-number v-model="data.play_time" :label="play_time.label" />
        <!--  -->
        <v-date-picker v-model="data.publish_date" :label="publish_date.label" />
        <v-pick-single v-model="data.edition!" :label="edition.label" :enums="edition.enums" />
        <v-check v-model="data.owned" :label="owned.label" />
        <v-field v-model="data.series" :label="series.label" />
        <v-pick-single v-model="data.dlc_associated_game!" :label="dlc_associated_game.label"
          :options="[{ text: '无', value: '' }]" />
        <v-field v-model="data.judgment" :label="judgment.label" :rows="1" autosize type="textarea" />
        <!--  -->
        <u-button v-if="!expand" class=" w-full justify-center my-2" @click="toggle()">
          <i-chevron-double-up-solid class=" inline-block text-gray-800 text-[20px]" />
        </u-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.van-cell) {
  line-height: 36px;
}

:deep(.van-picker__toolbar) {
  padding: 0 1rem;
}

:deep(.van-cell__title) {
  color: var(--van-text-color-2)
}
</style>