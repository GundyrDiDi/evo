<script lang="ts" setup>
const emit = defineEmits<{ (e: 'commit', data: any): void }>()

const data = useLocalStorage('new_game_data', {} as any)

const commit = () => {
  emit('commit', data.value)
  data.value = useGameDTODefault()
}
</script>

<template>
  <v-popup>
    <div class=" fixed z-99 bottom-12 right-4 h-12 w-12 bg-blue-400 rounded-full flex justify-center items-center">
      <i-plus-solid class="text-[32px]" />
    </div>
    <template #content="{ close }">
      <div class=" h-[50vh] px-4">
        <Cell v-model="data" />
        <u-button class=" w-full justify-center my-2" @click="commit(); close()">新增</u-button>
      </div>
    </template>
  </v-popup>
</template>

<style lang="scss" scoped></style>
