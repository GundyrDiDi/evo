<script lang="ts" setup>
const state = useState<G_SYNC_STATE>('g_sync')

const icon = ref<G_SYNC_STATE | undefined>()

// 等待动画时间
const loading_duration = 500

// 成功停留时间
const check_duration = 3000

const start = useIntervalFn(() => {
  icon.value = state.value
}, loading_duration, { immediate: false, immediateCallback: true })

watch(state, (v) => {
  v === 'pending' ? start.resume() : setTimeout(() => {
    icon.value = undefined
    start.pause()
  }, check_duration)
})

</script>

<template>
  <div>
    <Lottie v-if="icon === 'pending'" name="spinner" :height="24" />
    <Lottie v-else-if="icon === 'success'" name="check" :height="24" :loop="1" :speed="0.75" />
    <span class=" text-red-700 font-semibold" v-else-if="icon === 'fail'">Error</span>
  </div>
</template>

<style lang="css" scoped></style>
