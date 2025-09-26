<script lang="ts" setup>

const emits = defineEmits<{ (e: 'query'): void }>()

const game = useGame()

const columns = game.columns

const { sort, sort_options } = game.useSort()

const sortChange = () => {
  emits('query')
}

const { filter, labels } = game.useFilter('home_page')

const cb = debounceWatch(filter, () => {
  if (_isFocusedInput()) return requestAnimationFrame(() => cb())
  emits('query')
}, 2000, { deep: true })
</script>

<template>
  <div class=" h-screen flex flex-col gap-4 px-3 py-12 overflow-auto pt-[100%]">
    <div class=" flex justify-end">
      <v-pick-single teleport="body" v-model="sort" :options="sort_options" @closed="sortChange">
        <u-button variant="outline">
          <i-format-list class=" text-[20px]" />
        </u-button>
      </v-pick-single>
    </div>
    <slot-list :list="labels" class=" text-[12px]" title-class="text-gray-400">
      <template #name_or_alias>
        <v-field-blur v-model="filter.name_or_alias" clearable />
      </template>
      <template #tags>
        <v-field-blur v-model="filter.name_or_alias" />
      </template>
      <template #finish_date_range>
        <v-field-blur type="number" v-model="filter.finish_date_range" clearable />
      </template>
      <template #status>
        <v-tag-group v-model="filter.status" :enums="columns.status.enums" />
      </template>
      <template #play_time_range>
        <div class=" flex items-baseline gap-2">
          <v-field-blur type="number" v-model="filter.play_time_range[0]" clearable />
          至
          <v-field-blur type="number" v-model="filter.play_time_range[1]" clearable />
        </div>
      </template>
      <template #tiers>
        <v-tag-group v-model="filter.tiers" :enums="columns.tier.enums">
          <template #default="{ option }">
            <span class=" text-[12px]" :style="{ color: option.color }">{{ option.value }}</span>
          </template>
        </v-tag-group>
      </template>
      <template #only_owned_or_not>
        <v-check class=" flex items-center gap-3 text-[12px] py-1" v-model="filter.only_owned_or_not"
          :options="_values(columns.owned.map)">
        </v-check>
      </template>
      <template #platforms>
        <v-tag-group v-model="filter.platforms" :enums="columns.platform.enums"
          item-class=" w-auto px-3 text-[12px]"></v-tag-group>
      </template>
      <template #series>
        <v-field-blur v-model="filter.series" clearable />
      </template>
    </slot-list>
  </div>
</template>

<style lang="css" scoped>
:deep(.van-cell) {
  background-color: transparent;
  line-height: 24px;
}

:deep(.van-cell::after) {
  display: block;
}
</style>