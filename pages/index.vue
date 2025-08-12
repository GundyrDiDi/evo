<script lang="ts" setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const logging = computed(() => useRoute().query.code)

watchEffect(() => {
  user.value ? navigateTo('/home') : logging.value ? null : navigateTo('/login')
})
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>
