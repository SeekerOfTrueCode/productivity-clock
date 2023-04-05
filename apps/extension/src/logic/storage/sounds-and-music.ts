import { AudioSourceType } from '@/logic/audio/audio-players/types/audio-source-type'
import { defineStore } from 'pinia'

interface SoundSchema {
  name: string
  sourceType: AudioSourceType
  uri: string
  isDefault?: boolean
}
interface MusicSchema {
  name: string
  sourceType: AudioSourceType
  uri: string
}

export interface StorageSoundsSchema {
  [key: string]: SoundSchema
}
export interface StorageMusicSchema {
  [key: string]: MusicSchema
}

export enum StorageType {
  Sound = 'sound',
  Music = 'music',
}

export const useSoundsAndMusicStore = defineStore('sounds-and-music', () => {
  const timerTimeout = ref({
    enabled: true,
    time: '00:01:00'
  })
  const sounds = ref<StorageSoundsSchema>({
    0: {
      sourceType: AudioSourceType.DirectResource,
      uri: 'https://www.orangefreesounds.com/wp-content/uploads/2022/03/Analog-alarm-clock-bell-rings-short-sound-effect.mp3',
      name: 'Default ring',
      isDefault: true
    }
  })
  const music = ref<StorageMusicSchema>({})

  const getSoundsKeys = computed(() => {
    return Object.keys(sounds.value)
  })
  const getMusicKeys = computed(() => {
    return Object.keys(music.value)
  })

  function get (from: StorageType, key: string | undefined): SoundSchema | undefined {
    if (key == null) { return key }
    switch (from) {
      case StorageType.Music: return music.value[key]
      case StorageType.Sound: return sounds.value[key]
      default: return undefined
    }
  }

  function set (from: StorageType, key: string, value: SoundSchema) {
    switch (from) {
      case StorageType.Music:
        music.value[key] = value
        break
      case StorageType.Sound:
        sounds.value[key] = value
        break
    }
  }

  function add (from: StorageType, value: SoundSchema) {
    let keys
    switch (from) {
      case StorageType.Music:
        keys = getMusicKeys.value
        break
      case StorageType.Sound:
        keys = getSoundsKeys.value
        break
      default: return
    }

    const soundKey = keys?.at(keys?.length - 1)
    set(from, `${soundKey == null ? 0 : +soundKey + 1}`, {
      name: value.name,
      sourceType: value.sourceType,
      uri: value.uri
    })
  }

  function remove (from: StorageType, key: string) {
    switch (from) {
      case StorageType.Music:
        delete music.value[key]
        break
      case StorageType.Sound:
        delete sounds.value[key]
        break
    }
  }

  return { timerTimeout, sounds, music, getSoundsKeys, getMusicKeys, get, set, add, remove }
}, { persistedState: { persist: true } })
