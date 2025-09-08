<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const colorModeIcon = computed(() => colorMode.preference === 'dark' ? 'i-heroicons-outline-moon' : 'i-heroicons-outline-sun')

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <div class=" sticky z-1 top-0 bg-[var(--ui-bg)]">
    <Title>Gardios</Title>
    <!-- <div class="flex items-center md:justify-between justify-center">
      <div class="hidden md:block">
        <UButton label="Source" variant="link" color="gray" target="_blank"
          to="https://github.com/nuxt-modules/supabase/tree/main/demo" icon="i-heroicons-outline-external-link" />
        <UButton label="Hosted on Netlify" variant="link" color="gray" target="_blank" to="https://netlify.com"
          icon="i-heroicons-outline-external-link" />
      </div>
      <div class="flex items-center">
        <UButton variant="link" color="gray" :icon="colorModeIcon" @click="toggleDark" />
      </div>
    </div> -->
    <div class=" flex items-center justify-between px-4 h-10">
      <div class="flex items-center gap-2">
        <i-logout class="text-xl" @click="logout" />
        <!-- <u-button color="primary" variant="outline" icon="i-heroicons-bars-arrow-down"></u-button>
        <u-button color="primary" variant="outline" icon="i-heroicons-cog-6-tooth"></u-button> -->
      </div>
      <div class="flex items-center gap-2">
        <sync-icon />
      </div>
    </div>
  </div>
</template>
