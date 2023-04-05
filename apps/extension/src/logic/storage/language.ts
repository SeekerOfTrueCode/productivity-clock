import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  const userLang = navigator.language ?? (navigator as any)?.userLanguage ?? 'en-US'
  const language = ref<string>(userLang)

  function setLanguage (value: string) {
    language.value = value
  }

  return { language, setLanguage }
}, { persistedState: { persist: true } })
