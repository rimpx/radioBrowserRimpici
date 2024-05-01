<template>
  <v-container>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Cerca stazioni"
      single-line
      hide-details
    ></v-text-field>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="station in filteredStations"
        :key="station.stationuuid"
      >
        <v-card>
          <v-card-title>{{ station.name }}</v-card-title>
          <v-card-subtitle>{{ station.tags }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="playRadio(station.url)">Play</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <audio ref="audioPlayer" controls style="width: 100%;"></audio>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      stations: [],
      search: ''
    };
  },
  computed: {
    filteredStations() {
      return this.stations.filter(station =>
        station.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    fetchStations() {
      axios
        .get('https://de1.api.radio-browser.info/json/stations?limit=100')
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
    }
  },
  mounted() {
    this.fetchStations();
  }
};
</script>

<style scoped>
/* Qui puoi aggiungere stili CSS specifici per questo componente */
</style>
