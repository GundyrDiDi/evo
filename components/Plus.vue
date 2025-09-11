<script lang="ts" setup>
import { useDrag } from '@vueuse/gesture'

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

const thumb = ref<HTMLElement>()

const dragMotion = useMotion(thumb, {
  x: 0,
  y: 0,
  scale: 1,
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20
  }
})

useDrag((state) => {
  const { offset: [mx, my], dragging } = state
  dragMotion.apply({
    x: mx,
    y: my,
    scale: dragging ? 0.95 : 1
  })
}, { domTarget: thumb })

</script>

<template>
  <v-popup>
    <div ref="thumb"
      class=" fixed z-99 bottom-12 right-4 h-12 w-12 bg-teal-700 rounded-full flex justify-center items-center">
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

<style lang="css" scoped>
.test-box {
  width: 100px;
  height: 100px;
  background: red;
}
</style>
