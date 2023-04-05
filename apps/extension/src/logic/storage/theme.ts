import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const dark = ref<boolean>(true)

  function setTheme (value: boolean) {
    dark.value = value
  }

  return { dark, setTheme }
}, { persistedState: { persist: true } })
