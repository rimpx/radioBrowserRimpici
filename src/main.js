import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
});

app.use(router)
app.use(vuetify) 

app.mount('#app')
