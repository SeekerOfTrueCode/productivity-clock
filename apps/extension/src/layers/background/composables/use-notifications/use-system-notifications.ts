import { useNotificationsStore } from '@/logic/storage/notifications'

export function useSystemNotifications (options: { onNotificationClicked: (id: string) => (Promise<void> | void) }) {
  const notificationsStore = useNotificationsStore()

  async function isReady (): Promise<void> {
    await notificationsStore.$persistedState.isReady()
  }

  const notificationId = ref<string | undefined>()

  async function notification (title: string, message: string, contextMessage: string) {
    if (!notificationsStore.enabled.system) { return }
    const id = await browser.notifications.create('', {
      type: 'basic', // "progress"
      iconUrl: '/assets/icon-512.png',
      // appIconMaskUrl?: string;
      title,
      message,
      contextMessage,
      priority: 0, // -2 to 2
      eventTime: Date.now(),
      isClickable: true
      // buttons: [
      //   { title: 'Close' }
      // ]

      // imageUrl?: string;
      // items?: NotificationItem[];
      // progress?: number;
      // isClickable?: boolean;
    })
    notificationId.value = id
  }

  // browser.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  // console.log('onButtonClick', notificationId, buttonIndex)
  // })
  browser.notifications.onClicked.addListener(async (id) => {
    if (notificationId.value === id) {
      await options.onNotificationClicked(id)
      // await player.stop()
    }
    // console.log('onClick', notificationId)
  })
  browser.notifications.onClosed.addListener((id) => {
    if (notificationId.value === id) {
      notificationId.value = undefined
    }
  })

  return { notification, isReady }
}
