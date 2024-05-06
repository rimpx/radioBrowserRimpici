<template>
  <v-container>
    <h1>Preferiti</h1>
    <v-data-table
      :headers="headers"
      :items="favorites"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="toggleFavorite(item)">
          <v-icon>mdi-heart-broken</v-icon>
        </v-btn>
        <v-btn icon @click="playRadio(item)">
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>


<script>
export default {
  name: 'FavoritesView',
  data() {
    return {
      favorites: [],
      headers: [
        { text: 'Radio Station', value: 'name' },
        { text: 'Actions', value: 'actions' }
      ]
    };
  },
  created() {
    this.loadFavorites();
  },
  methods: {
    loadFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    },
    toggleFavorite(item) {
      const index = this.favorites.findIndex(fav => fav.id === item.id);
      if (index !== -1) {
        this.favorites.splice(index, 1);
      }
      this.saveFavorites();
    },
    saveFavorites() {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    playRadio(item) {
      const video = this.$refs.videoPlayer; // Assumi l'esistenza di un ref `videoPlayer` nel componente
      if (item.url) {
        video.src = item.url;
        video.play();
      }
    }
  },
  watch: {
    '$route'() {
      this.loadFavorites();
    }
  }
}
</script>


