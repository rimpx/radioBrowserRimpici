<template>
  <v-container>
    <h1>Preferiti</h1>
    <v-data-table
      :headers="headers"
      :items="favorites"
      :search="search"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <div style="display: flex; align-items: center;">
              <img :src="item.favicon || defaultImage" alt="favicon" style="width: 40px; height: 40px; margin-right: 16px; border-radius: 50%;">
              <span>{{ item.name }}</span>
            </div>
          </td>
          <td>
            <v-btn icon @click="togglePlay(item)">
              <v-icon>
                {{ currentRadio === item.url ? 'mdi-stop' : 'mdi-play' }}
              </v-icon>
            </v-btn>
            <v-btn icon :color="isFavorite(item) ? 'red' : 'grey'" @click="toggleFavorite(item)">
              <v-icon>{{ isFavorite(item) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <video ref="videoPlayer" @ended="stopRadio" style="display: none;"></video>
  </v-container>
</template>





<script>
import Hls from 'hls.js';

export default {
  name: 'FavoritesView',
  data() {
    return {
      favorites: [],
      currentRadio: null,
      currentHlsInstance: null,
      headers: [
        { text: 'Radio Station', value: 'name' },
        { text: 'Actions', value: 'actions' }
      ],
      search: ''
    };
  },
  created() {
    this.loadFavorites();
  },
  beforeUnmount() {
    this.stopRadio(); // Stop any radio playing when the component is unmounted
  },
  methods: {
    loadFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    },
    toggleFavorite(item) {
      const index = this.favorites.findIndex(fav => fav.id === item.id);
      if (index !== -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(item);
      }
      this.updateLocalStorageFavorites();
    },
    updateLocalStorageFavorites() {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
      this.favorites = [...this.favorites];
    },
    isFavorite(item) {
      return this.favorites.some(fav => fav.id === item.id);
    },
    togglePlay(item) {
      if (this.currentRadio === item.url) {
        this.stopRadio();
      } else {
        this.playRadio(item);
      }
    },
    playRadio(item) {
      const video = this.$refs.videoPlayer;
      if (item.url.includes('m3u8')) {
        if (Hls.isSupported()) {
          if (this.currentHlsInstance) {
            this.currentHlsInstance.destroy();
          }
          const hls = new Hls();
          hls.loadSource(item.url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
          });
          this.currentHlsInstance = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = item.url;
          video.play();
        }
      } else {
        video.src = item.url;
        video.play();
      }
      this.currentRadio = item.url;
    },
    stopRadio() {
      const video = this.$refs.videoPlayer;
      video.pause();
      video.src = '';
      if (this.currentHlsInstance) {
        this.currentHlsInstance.detachMedia();
        this.currentHlsInstance.destroy();
        this.currentHlsInstance = null;
      }
      this.currentRadio = null;
    }
  }
}
</script>




