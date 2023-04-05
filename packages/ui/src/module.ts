import '@nuxt/schema'
import { defineNuxtModule } from '@nuxt/kit'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const module = defineNuxtModule({
  meta: {
    name: '@nobodyz/productivity-clock_ui'
  },
  hooks: {
    'components:dirs' (dirs) {
      dirs.push({
        path: join(__dirname, 'components'),
        prefix: 'ui'
      })
    }
  }
})

export default module
