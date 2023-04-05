import { defineStore } from 'pinia'

export interface EnabledSchema {
  system: boolean
}
export interface NotificationSchema {
  key: number;
  title: string;
  timestamp: number;
  show: boolean;
  unread: boolean;
}

type AddNotificationSchema = Omit<NotificationSchema, 'timestamp' | 'show' | 'key' | 'unread'>

export const useNotificationsStore = defineStore('notifications', () => {
  const enabled = ref<EnabledSchema>({
    system: true
  })
  const notifications = ref<NotificationSchema[]>([
    {
      key: 0,
      title: 'Welcome',
      timestamp: Date.now(),
      show: true,
      unread: true
    }
  ])

  const getNotifications = computed(() => notifications.value)
  const getNotificationsUnread = computed(() => notifications.value.filter(x => x.unread).length)

  function addNotification (notification: AddNotificationSchema) {
    const lastNotification = notifications.value.at(-1)

    notifications.value = [...notifications.value, {
      key: lastNotification?.key == null ? 0 : (lastNotification.key + 1),
      ...notification,
      timestamp: Date.now(),
      show: true,
      unread: true
    }]
  }

  function hideNotification (key: number) {
    const notification = notifications.value.find(x => x.key === key)
    if (notification == null) { return }
    notification.show = false
  }

  function read () {
    notifications.value.filter(x => x.unread).forEach((x) => { x.unread = false })
  }

  return { notifications, enabled, getNotifications, getNotificationsUnread, addNotification, hideNotification, read }
}, { persistedState: { persist: true } })
