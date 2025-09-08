<script lang="ts" setup>
const state = useState<G_SYNC_STATE>('g_sync')

const icon = ref()

// 等待动画时间
const loading_duration = 500

// 成功停留时间
const check_duration = 3000

const start = useIntervalFn(() => {
  if (state.value === 'pending') {
    icon.value = 'pending'
  } else if (state.value === 'success') {
    // 
  } else {
    icon.value = 'fail'
  }
}, loading_duration, { immediate: false, immediateCallback: true })

watch(state, (v) => {
  v === 'pending' ? start.resume() : setTimeout(() => {
    icon.value = null
    start.pause()
  }, check_duration)
})

</script>

<template>
  <div v-show="icon">
    {{ state }}
  </div>
</template>

<style lang="css" scoped></style>
