import '@/styles'
import { RuntimeContext } from '@/logic/communication/send-and-receive'
import { createApp } from 'vue'
import { setupApp } from '@/logic/setup-app'
import App from './index.vue'

const app = createApp(App)
setupApp({ app, runtimeContext: RuntimeContext.Options, routerBaseRoute: '/options' })
app.mount('#app')
