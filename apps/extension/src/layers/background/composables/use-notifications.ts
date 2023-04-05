import { Events, useTimerStore } from '@/logic/storage/timer'
import { useAppNotifications } from './use-notifications/use-app-notifications'
import { useAudioNotifications } from './use-notifications/use-audio-notifications'
import { useSystemNotifications } from './use-notifications/use-system-notifications'
import { useTimerSessionStore } from '@/logic/storage/timer-session'

export async function useNotifications () {
  const timerStore = useTimerStore()
  const timerSessionStore = useTimerSessionStore()
  await Promise.allSettled([
    timerStore.$persistedState.isReady(),
    timerSessionStore.$persistedState.isReady()
  ])

  const { notification: audioNotifications, player, isReady: audioNotificationIsReady } = useAudioNotifications()
  const { notification: systemNotification, isReady: systemNotificationIsReady } = useSystemNotifications({
    async onNotificationClicked (_id) {
      await player.stop()
    }
  })
  const { notification: appNotification, isReady: appNotificationIsReady } = useAppNotifications()
  await Promise.allSettled([
    audioNotificationIsReady(),
    systemNotificationIsReady(),
    appNotificationIsReady()
  ])

  timerStore.addEventListener(Events.Finished, (_key, timer) => {
    audioNotifications(timer.soundKey!)
    const title = `Timer ${timer.title} has finished.`
    const message = 'Clicking the message will stop the sound'
    const contextMessage = ''
    systemNotification(title, message, contextMessage)
    appNotification(title)
  })
  timerSessionStore.addEventListener(Events.Finished, (_key, timerDynamic, timerStatic) => {
    const timer = timerStatic.timers[timerDynamic.currentTimerIndex]
    audioNotifications(timer.soundKey!)

    const title = `Session timer's ${timerStatic.title} - step ${timer.title} has finished.`
    const message = 'Clicking the message will stop the sound'
    const contextMessage = ''

    systemNotification(title, message, contextMessage)
    appNotification(title)
  })
}
