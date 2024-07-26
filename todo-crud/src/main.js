import '@/assets/scss/styles.scss'

import moment from 'moment'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(moment)
app.mount('#app')
