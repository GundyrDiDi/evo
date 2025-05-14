<script lang="ts" setup>
const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { data } = await useAsyncData('tasks', async () => {
  const { data } = await client.from('game-list').select('*').eq('user_id', user.value!.id).order('alias')
  return data
})

</script>

<template>
  <!-- <> -->
   {{ data }}
</template>

<style lang="scss" scoped></style>
