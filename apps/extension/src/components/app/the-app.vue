<template>
  <UiApp>
    <VFadeTransition leave-absolute>
      <slot v-if="!$appLoading.value" />
      <AppLoading v-else />
    </VFadeTransition>
  </UiApp>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/logic/storage/language'
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/logic/storage/theme'
import { wait } from '@/logic/utils/time/wait'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const theme = useTheme()
const i18n = useI18n()

const loadApp = inject<Function>('loadApp')
loadApp!(async () => {
  await wait(500)
  await themeStore.$persistedState.isReady()
  await languageStore.$persistedState.isReady()

  if (theme.global.current.value.dark && !themeStore.dark) {
    theme.global.name.value = 'light'
  } else if (!theme.global.current.value.dark && themeStore.dark) {
    theme.global.name.value = 'dark'
  }

  i18n.locale.value = languageStore.language
})
</script>

<style scoped></style>
