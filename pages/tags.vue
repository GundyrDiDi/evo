<script lang="ts" setup>
import type Masonry from 'masonry-layout'
import Adaptive from '~/components/Adaptive.vue'
const tags = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque quia ducimus, molestiae perspiciatis ipsum consectetur voluptatem nihil libero eos repellendus sequi eum? Neque deleniti velit voluptate vel dignissimos veritatis hic.`.split(' ')

const client = useSupabase()

const { data } = useAsyncData('tags_data', async () => {
  return client.from('game_tags').select('*')
})

const masonry = ref<Masonry>()

const relavent: any = {
  Lorem: tags.slice(0, 9)
}

const masonryLayout = ref({
  columnWidth: 70,
  gutter: 20
})

onMounted(async () => {
  const { default: Masonry } = await import('masonry-layout')
  masonry.value = new Masonry('.m-grid', {
    itemSelector: '.m-grid-item',
    ...masonryLayout.value
  })
  // masonry.value.layout?.()
})

const getMasons = () => {

}

const onDrop = (data) => {
  console.log(data)
}
</script>

<template>
  <div class=" flex flex-col">
    <div class=" flex flex-wrap justify-center mb-10">
      <UFormField label="ColumnWidth">
        <UInput v-model="masonryLayout.columnWidth" />
      </UFormField>
    </div>
    <div class="w-[500px] m-grid">
      <Dnd v-for="v in tags" class=" m-grid-item" :data="v" @drop="onDrop">
        <template #default="{ isDragEl }">
          <UBadge size="lg">
            <div class=" text-center">
              {{ v }}
            </div>
            <div v-if="!isDragEl">
              <Adaptive v-if="relavent[v]" class=" gap-3" :list="relavent[v]"></Adaptive>
            </div>
          </UBadge>
        </template>
      </Dnd>
    </div>
  </div>
</template>

<style>
.m-grid-item {
  user-select: none;
  margin-bottom: 10px;
  cursor: default;
}
</style>
