import { defineStore } from 'pinia'

export const useNowStore = defineStore('now', () => {
  const now = ref(Date.now())
  setInterval(() => (now.value = Date.now()), 100)
  return { now }
}, { persistedState: { persist: false } })
