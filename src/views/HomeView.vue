<template>
  <v-container>
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
      <img :src="require('@/assets/default-image.jpg')" alt="Logo" class="logo-image"
        style="border-radius: 50%; margin-right: 16px;">
      <h1 class="title">RimpiciRadio</h1>
    </div>

    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search Radio Stations" single-line
      hide-details></v-text-field>

    <v-row>
      <v-col cols="12" sm="12" md="10" lg="8" xl="6" offset-md="1" offset-lg="2" offset-xl="3">
        <v-data-table :headers="headers" :items="radios" :search="search" hide-default-footer class="elevation-1">

          <template v-slot:[`item.name`]="{ item }">
            <div style="display: flex; align-items: center;">
              <img :src="item.favicon || 'default-image.jpg'"
                style="width: 40px; height: 40px; margin-right: 16px; border-radius: 50%;">
              <v-icon small class="mr-2">mdi-radio</v-icon>
              <span>{{ item.name }}</span>
            </div>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon @click="togglePlay(item)">
              <v-icon>
                {{ currentRadio === item.url ? 'mdi-stop' : 'mdi-play' }}
              </v-icon>
            </v-btn>
            <v-btn icon :color="isFavorite(item) ? 'red' : 'grey'" @click="toggleFavorite(item)">
              <v-icon>{{ isFavorite(item) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
            </v-btn>
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
      //this.updateKey++; // Incrementa la chiave per forzare l'aggiornamento
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
  created() {
    this.getRadios();
  },
}
</script>

<style scoped>
/* Stile base per il titolo e l'immagine del logo che non cambia tra i dispositivi */
.title {
  font-family: 'Roboto', sans-serif; /* Font Roboto */
  color: #1976D2; /* Colore blu profondo */
  font-weight: bold; /* Testo in grassetto */
  font-size: 4em; /* Dimensione grande per desktop */
}

.logo-image {
  width: 4em; /* Dimensione del logo proporzionale al titolo */
  height: 4em;
  object-fit: cover; /* Mantiene le proporzioni dell'immagine */
  border-radius: 50%; /* Rende l'immagine rotonda */
}

/* Regole specifiche per schermi di dimensioni inferiori usando media queries */
@media (max-width: 960px) {
  /* Impostazioni per tablet e schermi di dimensioni medie */
  .title {
    font-size: 3em; /* Dimensione ridotta del titolo per schermi medi */
  }
  .logo-image {
    width: 3em; /* Dimensione ridotta dell'immagine per schermi medi */
    height: 3em;
  }
}

@media (max-width: 600px) {
  /* Impostazioni per smartphone e schermi piccoli */
  .title {
    font-size: 2em; /* Ulteriore riduzione per adattarsi a schermi stretti */
  }
  .logo-image {
    width: 2em; /* Riduzione della dimensione dell'immagine per schermi stretti */
    height: 2em;
  }
}

/* Stili aggiuntivi per migliorare la disposizione e la spaziatura */
.v-col {
  padding: 0; /* Rimuove il padding predefinito per le colonne */
}

.mr-2 {
  margin-right: 8px; /* Spazio a destra per gli icon */
}
</style>


