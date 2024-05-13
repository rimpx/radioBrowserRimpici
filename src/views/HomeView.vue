<template>
  <v-container>
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
      <img :src="require('@/assets/default-image.jpg')" alt="Logo" class="logo-image"
        style="border-radius: 50%; margin-right: 16px;">
      <h1 class="title">RimpiciRadio</h1>
    </div>

    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search Radio Stations" single-line hide-details></v-text-field>

    <v-row>
      <v-col cols="12" sm="12" md="10" lg="8" xl="6" offset-md="1" offset-lg="2" offset-xl="3">
        <v-data-table :headers="headers" :items="radios" :search="search" hide-default-footer class="elevation-1">
          <template v-slot:item="{ item }">
            <tr>
              <td>
                <div style="display: flex; align-items: center;">
                  <img :src="item.favicon || defaultImage" style="width: 40px; height: 40px; margin-right: 16px; border-radius: 50%;">
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
      </v-col>
    </v-row>

    <v-btn @click="$router.push('/favorites')">Vedi Preferiti</v-btn>

    <video ref="videoPlayer" @ended="stopRadio" style="display: none;"></video>
  </v-container>
</template>




<script>
import Hls from 'hls.js';
import defaultImage from '@/assets/default-image.jpg';

export default {
  name: 'HomeView',
  data() {
    return {
      updateKey: 0,
      radios: [],
      favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
      search: '',
      currentRadio: null,
      currentHlsInstance: null,
      headers: [
        { text: 'Radio Station', align: 'start', sortable: false, value: 'name' },
        { text: 'Actions', align: 'end', sortable: false, value: 'actions' }
      ],
      defaultImage
    }
  },
  methods: {
    getRadios() {
      fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=100&countrycode=IT&hidebroken=true&order=clickcount&reverse=true')
        .then(response => response.json())
        .then(data => {
          this.radios = data.map((station, index) => ({
            ...station,
            id: station.id || `station-${index}`,
            favicon: station.favicon || this.defaultImage
          }));
        })
        .catch(error => {
          console.error('Error fetching radios:', error);
        });
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
      if (item.url.endsWith('.m3u8')) {
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
  },
  beforeUnmount() {
    this.stopRadio();  // Stop any playing radio when the component is being unmounted
  },
  created() {
    this.getRadios();
  },
}
</script>


<style scoped>
.title {
  font-family: 'Roboto', sans-serif;
  color: #1976D2;
  font-weight: bold;
  font-size: 4em;
}

.logo-image {
  width: 4em;
  height: 4em;
  object-fit: cover;
  border-radius: 50%;
}


@media (max-width: 960px) {

  .title {
    font-size: 3em;
  }

  .logo-image {
    width: 3em;
    height: 3em;
  }
}

@media (max-width: 600px) {
  .radio-info, .radio-actions {
    justify-content: flex-start;
  }

  .radio-actions {
    flex-grow: 1;
    justify-content: flex-end;
  }
}


.v-col {
  padding: 0;
}

.mr-2 {
  margin-right: 8px;
}

.radio-info, .radio-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.radio-image {
  width: 40px;
  height: 40px;
  margin-right: 16px;
  border-radius: 50%;
}

.radio-name {
  flex-grow: 1;
}
</style>