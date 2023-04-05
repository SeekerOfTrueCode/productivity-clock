import { defineStore } from 'pinia'

export const usePinnedStore = defineStore('pinned', () => {
  const tabPagePinned = ref<boolean>(true)

  function setTabPagePinned (value: boolean) {
    tabPagePinned.value = value
  }

  return { tabPagePinned, setTabPagePinned }
}, { persistedState: { persist: true } })
