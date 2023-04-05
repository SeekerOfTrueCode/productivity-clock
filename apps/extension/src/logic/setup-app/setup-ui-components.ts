import { I18n, useI18n } from 'vue-i18n'

import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { plugin } from '@nobodyz/productivity-clock_ui/src/plugin'
import type { App } from 'vue'

export function setupUiComponents (app: App, i18n: I18n) {
  app.use(plugin({
    adapter: createVueI18nAdapter({ i18n, useI18n })
  }))
}
