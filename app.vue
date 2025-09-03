<template>
  <van-config-provider :theme="<'dark'>colorMode?.preference">
    <AppContainer>
      <NuxtPage />
      <ContextComp />
    </AppContainer>
  </van-config-provider>
</template>
<script lang="ts" setup>
import { ConfigProvider } from 'vant'
import { GesturePlugin } from '@vueuse/gesture'
const app = useNuxtApp()
app.vueApp.use(ConfigProvider)
app.vueApp.use(GesturePlugin)
  
const colorMode = useColorMode()
</script>
<style>
:root {
  --ui-bg: rgb(23, 23, 23);
  /* --van-black: red; */
  --van-background-2: var(--ui-bg);
  --van-padding-md: 0px !important;
  --van-cell-vertical-padding: 0 !important;
}
</style>