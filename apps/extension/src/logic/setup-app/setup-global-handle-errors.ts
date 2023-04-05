import { App } from 'vue'
import { useNotificationsStore } from '@/logic/storage/notifications'

export function setupGlobalHandleErrors (app: App) {
  const notificationsStore = useNotificationsStore()
  app.config.errorHandler = (err, instance, info) => {
    console.log(err, instance, info)
    notificationsStore.addNotification({
      title: 'Error has occured'
    })
  }
}
