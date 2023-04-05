import { App } from 'vue'
import { createI18n } from 'vue-i18n'
import enUS from '@/locales/en-US.json'
import messages from '@intlify/unplugin-vue-i18n/messages'

type MessageSchema = typeof enUS

export function setupI18n (app: App) {
  const i18n = createI18n<[MessageSchema], 'en-US' | 'pl'>({
    legacy: false,
    allowComposition: true,
    globalInjection: true,
    locale: 'pl',
    fallbackLocale: 'en-US',
    availableLocales: ['en-US', 'pl'],
    messages
    // something vue-i18n options here ...
  })
  app.use(i18n)
  return i18n
}
