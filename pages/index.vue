<script lang="ts" setup>
const user = useSupabaseUser()

watchEffect(() => {
  user.value ? navigateTo('/home') : navigateTo('/login')
})
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>
