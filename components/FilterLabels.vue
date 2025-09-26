<script lang="ts" setup>
const game = useGame()

const columns = game.columns

const { query_labels, filter } = game.useFilter('home_page')
</script>

<template>
  <div class=" flex gap-4">
    <slot-list :list="query_labels" class="flex border gap-1">
      <template #name_or_alias>
        <div class=" max-w-6 truncate">
          {{ filter.name_or_alias }}
        </div>
      </template>
      <!-- <template #tags>
        <v-field-blur v-model="filter.name_or_alias" />
      </template> -->
      <template #status>
        {{ filter.status.join() }}
        <!-- <v-tag-group v-model="filter.status" :enums="columns.status.enums" /> -->
      </template>
      <!-- 
      <template #finish_date_range>
        <v-field-blur type="number" v-model="filter.finish_date_range" clearable />
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
      </template> -->
    </slot-list>
  </div>
</template>

<style lang="css" scoped></style>
