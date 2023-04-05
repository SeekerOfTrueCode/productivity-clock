import { defineStore } from 'pinia'

export interface StorageBackgroundMusicSchema {
    enabled: boolean;
    volume: number;
    musicKey?: string;

}

export const useBackgroundMusicStore = defineStore('background-music', () => {
  const data = ref<StorageBackgroundMusicSchema>({
    enabled: false,
    volume: 50,
    musicKey: undefined
  })

  return { data }
}, { persistedState: { persist: true } })
