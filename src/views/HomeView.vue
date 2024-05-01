<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="station in stations" :key="station.stationuuid">
          <v-card>
            <v-card-title>{{ station.name }}</v-card-title>
            <v-card-subtitle>{{ station.tags }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="primary" @click="playRadio(station.url)">Play</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <audio ref="audioPlayer" controls style="width: 100%;"></audio>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      stations: [],
      currentStation: null
    };
  },
  methods: {
    fetchStations() {
      axios.get('https://de1.api.radio-browser.info/json/stations')
        .then(response => {
          this.stations = response.data;
        })
        .catch(error => {
          console.error('Error fetching stations:', error);
        });
    },
    playRadio(url) {
      const audio = this.$refs.audioPlayer;
      audio.src = url;
      audio.play();
      this.currentStation = url;
    }
  },
  mounted() {
    this.fetchStations();
  }
};
</script>

<style scoped>
/* Aggiungi qui lo stile CSS se necessario */
</style>
