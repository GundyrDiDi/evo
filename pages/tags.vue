<script lang="ts" setup>
import type Masonry from 'masonry-layout'
import Adaptive from '~/components/Adaptive.vue'
const tags = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque quia ducimus, molestiae perspiciatis ipsum consectetur voluptatem nihil libero eos repellendus sequi eum? Neque deleniti velit voluptate vel dignissimos veritatis hic.`.split(' ')

const masonry = ref<Masonry>()

const relavent: any = {
  Lorem: tags.slice(0, 9)
}

const layout = ref({
  columnWidth: 50,
  gutter: 10
})

onMounted(async () => {
  const { default: Masonry } = await import('masonry-layout')
  masonry.value = new Masonry('.m-grid', {
    itemSelector: '.m-grid-item',
    ...layout.value
  })
})

const getMasons = () => {

}
</script>

<template>
  <div class="w-[500px] m-grid">
    <Dnd v-for="v in tags" class=" m-grid-item border p-2">
      <template #default="{ isDragEl }">
        <div class=" text-center">
          {{ v }}
        </div>
        <div v-if="!isDragEl">
          <Adaptive v-if="relavent[v]" class=" gap-3" :list="relavent[v]"></Adaptive>
        </div>
      </template>
    </Dnd>
  </div>
</template>

<style>
.m-grid-item {
  user-select: none;
  margin-bottom: 10px;
  cursor: default;
}
</style>
