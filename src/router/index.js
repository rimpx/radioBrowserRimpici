import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FavoritesView from '../views/FavoritesView.vue'  // Assicurati di importare la vista dei preferiti

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: FavoritesView  // Aggiungi la route per i preferiti
    }
  ]
})

export default router
