import type { App } from 'vue'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $appLoading: Ref<boolean>;
        $loadApp: (callback: () => (Promise<void> | void)) => Promise<void>
    }
}

export function setupAppLoading (app: App) {
  const appLoading = ref(false)

  async function loadApp (callback: () => (Promise<void> | void)) {
    app.config.globalProperties.$appLoading.value = true
    await callback()
    app.config.globalProperties.$appLoading.value = false
  }

  app.config.globalProperties.$appLoading = appLoading
  app.config.globalProperties.$loadApp = loadApp
  // Provide access to `appLoading` in script setup with `const appLoading = inject('appLoading')`
  app.provide<Ref<boolean>>('appLoading', app.config.globalProperties.$appLoading)
  app.provide<typeof loadApp>('loadApp', app.config.globalProperties.$loadApp)
}
