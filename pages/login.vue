<script setup lang="ts">
const user = useSupabaseUser()
const { auth } = useSupabaseClient()

if (user.value) {
  navigateTo('/home')
}
</script>

<template>
  
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold">
      Sign in to your account
    </h2>
    <LoginCard>
      <UButton class="mt-3" icon="i-mdi-github" block label="Github" color="primary" variant="solid"
        @click="auth.signInWithOAuth({ provider: 'github' })" />
    </LoginCard>
  </div>
</template>
