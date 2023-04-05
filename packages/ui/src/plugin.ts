// Vuetify
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { type LocaleOptions, createVuetify } from 'vuetify'

export function plugin (locale: LocaleOptions) {
  return createVuetify({
    theme: {
      defaultTheme: 'dark'
    },
    components,
    directives,
    locale
  })
}
