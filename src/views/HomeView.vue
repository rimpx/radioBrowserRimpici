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
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="radios"
          :search="search"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:[`item.name`]="{ item }">
            <div style="display: flex; align-items: center;">
              <img :src="item.favicon || 'default-image.jpg'" style="width: 40px; height: 40px; margin-right: 16px; border-radius: 50%;">
              <span>{{ item.name }}</span>
            </div>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon @click="togglePlay(item)">
              <v-icon>
                {{ currentRadio === item.url ? 'mdi-stop' : 'mdi-play' }}
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <video ref="videoPlayer" @ended="stopRadio" style="display: none;"></video>
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
    .then(response => response.json())
    .then(data => {
      this.radios = data.map(station => ({
        ...station,
        favicon: station.favicon || 'default-image.jpg' // Use a default image if none is provided
      }));
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
      const video = this.$refs.videoPlayer;
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
        this.currentRadio = url;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
        this.currentRadio = url;
      }
    },
    stopRadio() {
      const video = this.$refs.videoPlayer;
      if (this.currentRadio && video) {
        video.pause();
        video.src = ''; // Clear the source to stop downloading
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

.v-col {
  padding: 0; 
}

/* Additional style for images to ensure they fit well within the layout */
img.radio-icon {
  width: 40px;  /* Adjust width as needed */
  height: 40px; /* Adjust height to match width for a square appearance */
  object-fit: cover; /* Keeps the image ratio intact */
  border-radius: 50%; /* Optional: makes the image round */
}
</style>


