import { StorageType, useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
import { hmsToSeconds } from '@/logic/utils/time/hms-to-seconds'
import { universalAudioPlayer } from '@/logic/audio/universal-audio.player'
import { useDefaultTimerSoundStore } from '@/logic/storage/default-timer-sound'

export function useAudioNotifications () {
  const defaultTimerSoundStore = useDefaultTimerSoundStore()
  const soundsAndMusicStore = useSoundsAndMusicStore()
  const player = universalAudioPlayer()

  async function isReady (): Promise<void> {
    await Promise.allSettled([
      soundsAndMusicStore.$persistedState.isReady(),
      defaultTimerSoundStore.$persistedState.isReady()
    ])
    await player.isReady()
  }

  let stopTimerSoundUponTimeoutId: globalThis.NodeJS.Timeout | undefined
  function notificationStopTimerSoundUponTimeout () {
    if (!soundsAndMusicStore.timerTimeout.enabled) { return }

    const timeInSeconds = hmsToSeconds(soundsAndMusicStore.timerTimeout.time)
    stopTimerSoundUponTimeoutId = setTimeout(async () => {
      await player.stop()
      stopTimerSoundUponTimeoutId = undefined // clear
    }, timeInSeconds * 1000)
  }

  async function notification (soundKey: string): Promise<void> {
    if (!defaultTimerSoundStore.data.enabled) { return }
    const timerSound = soundsAndMusicStore.get(StorageType.Sound, soundKey)
    if (timerSound == null) { return }

    if (stopTimerSoundUponTimeoutId != null) { clearTimeout(stopTimerSoundUponTimeoutId) } // if another notification sound comes, then clear timeout stopping it since it will be stopped here
    await player.load({
      url: timerSound.uri,
      audioSource: timerSound.sourceType,
      maybeElementId: 'notification-music'
    })
    await player.isReady()
    await player.stop()
    await player.setVolume(defaultTimerSoundStore.data.volume)
    await player.play()

    notificationStopTimerSoundUponTimeout()
  }

  return { notification, isReady, player }
}
