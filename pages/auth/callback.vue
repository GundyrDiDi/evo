<script lang="ts" setup>
const user = useSupabaseUser()
const logging = computed(() => useRoute().query.code)

watchEffect(() => {
  user.value && navigateTo('/home')
})
</script>

<template>
  <div v-if="logging">loading...</div>
  <router-link to="/" v-else>back home</router-link>
</template>

<style lang="scss" scoped></style>
