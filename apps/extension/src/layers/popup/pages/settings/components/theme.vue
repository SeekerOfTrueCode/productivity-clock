<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/logic/storage/theme'
const themeStore = useThemeStore()
const theme = useTheme()

watch(
  () => themeStore.dark,
  () => {
    if (theme.global.current.value.dark && !themeStore.dark) {
      theme.global.name.value = 'light'
    } else if (!theme.global.current.value.dark && themeStore.dark) {
      theme.global.name.value = 'dark'
    }
  }
)
</script>

<template>
  <UiSwitch
    :value-model="themeStore.dark"
    :label="$t('settings-page.theme-page.application-theme')"
    @input="themeStore.setTheme(!themeStore.dark)"
  >
    <template #prepend>
      <UiIcon>
        <icon-mdi-weather-sunny v-if="themeStore.dark" />
        <icon-mdi-weather-night v-else />
      </UiIcon>
    </template>
  </UiSwitch>
</template>
