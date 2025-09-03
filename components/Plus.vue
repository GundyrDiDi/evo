<script lang="ts" setup>
const emit = defineEmits<{ (e: 'commit', data: any): void }>()

const data = useLocalStorage('new_game_data', {} as any)

const { insertGame } = useGameZod()
const commit = () => {
  const safe = insertGame.safeParse(data.value)
  if (safe.data) {
    emit('commit', data.value)
    data.value = useGameDTODefault()
  } else {
    alert(safe.error)
  }
}
</script>

<template>
  <v-popup>
    <div class=" fixed z-99 bottom-12 right-4 h-12 w-12 bg-blue-400 rounded-full flex justify-center items-center">
      <i-plus-solid class="text-[32px]" />
    </div>
    <template #content="{ close }">
      <div class=" h-[80vh] px-4">
        <Cell v-model="data" :expand="true" />
        <u-button class=" w-full justify-center my-2" @click="commit(); close()">新增</u-button>
      </div>
    </template>
  </v-popup>
</template>

<style lang="scss" scoped></style>
