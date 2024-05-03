import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Importing Material Design Icons for Vuetify
import '@mdi/font/css/materialdesignicons.css'  // Assicurati che questo percorso sia corretto

// Video.js styles
import 'video.js/dist/video-js.css'

// Import VideoPlayer as a named export
import { VideoPlayer } from 'vue-hls-video-player'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi',  // 'mdi' specifies to use Material Design Icons
  }
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(VideoPlayer)  // Register the video player plugin

app.mount('#app')

