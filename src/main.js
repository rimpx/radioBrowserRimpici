import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';  // Assicurati di importare i nuovi stili di Vuetify 3
import App from './App.vue';
import router from './router';

const app = createApp(App);

// Crea l'istanza di Vuetify
const vuetify = createVuetify({
  // qui puoi configurare ulteriormente Vuetify se necessario
});

// Usa Vuetify
app.use(vuetify);

// Configura il router se il tuo progetto lo utilizza
app.use(router);

// Monta l'app
app.mount('#app');
