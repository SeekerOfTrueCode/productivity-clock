
import { useBackgroundMusic } from '../../composables/use-background-music'
import { useNotifications } from '../../composables/use-notifications'

export function onSetup () {
  console.log('Extension setup')

  useBackgroundMusic()
  useNotifications()
}
