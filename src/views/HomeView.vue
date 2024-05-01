<template>
  <v-container>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search Radio Stations"
      single-line
      hide-details
    ></v-text-field>
    <v-list>
      <v-list-item-group>
        <v-list-item
          v-for="station in filteredStations"
          :key="station.stationuuid"
          @click="playRadio(station.url)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ station.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ station.tags }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <audio ref="audioPlayer" controls style="width: 100%; visibility: hidden;"></audio>
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
      return this.stations
        .filter(station => station.name.toLowerCase().includes(this.search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name)); // Aggiunge ordinamento alfabetico
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
      audio.style.visibility = 'visible';
    }
  },
  mounted() {
    this.fetchStations();
  }
};
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: #f0f0f0;
}

.v-list-item-title {
  font-weight: bold;
}

.audio-player-visible {
  visibility: visible;
}
</style>

