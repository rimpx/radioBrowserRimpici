<template>
  <v-container>
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
      <img :src="require('@/assets/default-image.jpg')" alt="Logo" style="width: 40px; height: 40px; margin-right: 16px; border-radius: 50%;">
      <h1 class="title">RimpiciRadio</h1>
    </div>

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
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    
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
      radios: [],
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
          this.radios = data.map(station => ({
            ...station,
            favicon: station.favicon || this.defaultImage
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

img.radio-icon {
  width: 40px;  
  height: 40px; 
  object-fit: cover; 
  border-radius: 50%; 
}

.title {
  font-family: 'Roboto', sans-serif; /* Example: Roboto. You can change it as needed */
  color: #1976D2; /* Deep blue, change as desired */
  font-size: 2em; /* Larger font size */
  font-weight: bold; /* Bold font weight */
}

.mr-2 {
  margin-right: 8px; /* Margin right for the icon */
}
</style>



