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
  <div>
    <Title>Nuxt 3 x Supabase</Title>
    <div class="flex items-center md:justify-between justify-center">
      <div class="hidden md:block">
        <UButton
          label="Source"
          variant="link"
          color="gray"
          target="_blank"
          to="https://github.com/nuxt-modules/supabase/tree/main/demo"
          icon="i-heroicons-outline-external-link"
        />
        <UButton
          label="Hosted on Netlify"
          variant="link"
          color="gray"
          target="_blank"
          to="https://netlify.com"
          icon="i-heroicons-outline-external-link"
        />
      </div>
      <div class="flex items-center">
        <UButton
          variant="link"
          color="gray"
          :icon="colorModeIcon"
          @click="toggleDark"
        />
        <UButton
          v-if="user"
          variant="link"
          color="gray"
          @click="logout"
        >
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>
