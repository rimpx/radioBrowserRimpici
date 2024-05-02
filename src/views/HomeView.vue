<template>
  <v-container>
    <h1>RimpiciRadio</h1>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search Radio Stations"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="radios"
      :search="search"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:[`item.name`]="{ item }">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="togglePlay(item)">
          <v-icon>
            {{ currentRadio === item.url ? 'mdi-stop' : 'mdi-play' }}
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <audio ref="audioPlayer" @ended="stopRadio" style="display:none;"></audio>
  </v-container>
</template>

<script>
import Hls from 'hls.js';

export default {
  name: 'HomeView',
  data() {
    return {
      radios: [],
      search: '',
      currentRadio: null,
      headers: [
        { text: 'Radio Station', align: 'start', sortable: false, value: 'name' },
        { text: 'Actions', align: 'end', sortable: false, value: 'actions' }
      ]
    }
  },
  methods: {
    getRadios() {
      fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=100&countrycode=IT&hidebroken=true&order=clickcount&reverse=true')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.radios = data;
        })
        .catch(error => {
          console.error('Error fetching radios:', error);
        });
    },
    togglePlay(item) {
      if (this.currentRadio === item.url) {
        this.stopRadio();
      } else {
        this.playRadio(item.url);
      }
    },
    playRadio(url) {
      const audio = this.$refs.audioPlayer;
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play();
        });
        this.currentRadio = url;
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = url;
        audio.addEventListener('loadedmetadata', () => {
          audio.play();
        });
        this.currentRadio = url;
      }
    },
    stopRadio() {
      const audio = this.$refs.audioPlayer;
      if (this.currentRadio && audio) {
        audio.pause();
        audio.src = ''; // Clear the source to stop downloading
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.detachMedia();
          hls.destroy();
        }
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
.v-list-item {
  display: block;
}

.v-container {
  max-width: 100%;
}

.v-list {
  width: 100%;
}
</style>

