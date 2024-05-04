<template>
  <v-container>
    <h1>Preferiti</h1>
    <v-data-table
      :headers="headers"
      :items="favorites"
      hide-default-footer
    >
      <!-- Template per item e actions simili a HomeView -->
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'FavoritesView',
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
      headers: [
        { text: 'Radio Station', value: 'name' },
        { text: 'Actions', value: 'actions' }
      ]
    };
  }
}
</script>
