import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import PlanetView from '../views/PlanetView.vue'  

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
      component: FavoritesView
    },
    {
      path: '/planet',  // Definisci il percorso per la nuova vista
      name: 'Planet',
      component: PlanetView  // Assegna il componente PlanetView a questo percorso
    }
  ]
})

export default router
