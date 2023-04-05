import { StorageType, useSoundsAndMusicStore } from './sounds-and-music'
import { defineStore } from 'pinia'

export interface StorageBackgroundMusicSchema {
  enabled: boolean;
  volume: number;
  soundKey?: string;
}

export const useDefaultTimerSoundStore = defineStore('default-timer-sound', () => {
  const soundsAndMusicStore = useSoundsAndMusicStore()

  const data = ref<StorageBackgroundMusicSchema>({
    enabled: true,
    volume: 50,
    soundKey: '0'
  })

  const defaultSound = computed(() => {
    const defaultSoundKey = data.value.soundKey
    const defaultSound = soundsAndMusicStore.get(StorageType.Sound, defaultSoundKey)
    if (defaultSound == null) {
      if (defaultSoundKey != null) { console.warn('[productivity-clock] Sound not found despite sound key not being empty.') }
    }
    return defaultSound
  })

  return { data, defaultSound }
}, { persistedState: { persist: true } })
