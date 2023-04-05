import { useNotificationsStore } from '@/logic/storage/notifications'
export function useAppNotifications () {
  const notificationsStore = useNotificationsStore()

  async function isReady (): Promise<void> {
    await notificationsStore.$persistedState.isReady()
  }

  function notification (title: string) {
    notificationsStore.addNotification({
      title
    })
  }

  return { notification, isReady }
}
