import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Video.js styles
import 'video.js/dist/video-js.css'

// Import VideoPlayer as a named export
import { VideoPlayer } from 'vue-hls-video-player'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(VideoPlayer)  // Register the video player plugin

app.mount('#app')
