import { StorageType, useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
import { universalAudioPlayer } from '@/logic/audio/universal-audio.player'
import { useBackgroundMusicStore } from '@/logic/storage/background-music'

export async function useBackgroundMusic () {
  const soundsAndMusicStore = useSoundsAndMusicStore()
  const backgroundMusicStore = useBackgroundMusicStore()
  await Promise.allSettled([
    soundsAndMusicStore.$persistedState.isReady(),
    backgroundMusicStore.$persistedState.isReady()
  ])

  const player = universalAudioPlayer()
  await player.isReady()

  watch(() => backgroundMusicStore.data.musicKey, async () => {
    const musicKey = backgroundMusicStore.data.musicKey
    const music = soundsAndMusicStore.get(StorageType.Music, musicKey)
    if (music == null) {
      if (musicKey != null) { console.warn('[productivity-clock] Music not found despite music key not being empty.') }
      return
    }

    // TU umiera
    await player.load({
      url: music.uri,
      audioSource: music.sourceType,
      maybeElementId: 'background-music'
    })
    await player.isReady()
    await player.setVolume(backgroundMusicStore.data.volume)
    if (backgroundMusicStore.data.enabled) {
      await player?.play()
    } else {
      await player?.pause()
    }
    await player?.setLoop(true)
  }, { immediate: true })

  watchEffect(async () => {
    await player?.setVolume(backgroundMusicStore.data.volume)
    if (backgroundMusicStore.data.enabled) {
      await player?.play()
    } else {
      await player?.pause()
    }
  })
}
