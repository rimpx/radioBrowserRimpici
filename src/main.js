import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import App from './App.vue'; 
import router from './router'; 

Vue.use(Vuetify);

const vuetify = new Vuetify();

new Vue({
  router,  
  vuetify, 
  render: h => h(App)
}).$mount('#app');
