import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created',(app)=>{
    app.use(autoAnimatePlugin)
  })
});

