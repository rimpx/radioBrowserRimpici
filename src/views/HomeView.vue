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
      search: '',
      loading: false,
    };
  },
  computed: {
    filteredStations() {
      return this.stations
        .filter(station =>
          station.name.toLowerCase().includes(this.search.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  },
  methods: {
    fetchStations() {
      this.loading = true;
      axios.get('https://de1.api.radio-browser.info/json/stations?limit=100')
        .then(response => {
          this.stations = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching stations:', error);
          this.loading = false;
        });
    },
    playRadio(url) {
      const audio = this.$refs.audioPlayer;
      audio.src = url;
      audio.play();
      audio.style.visibility = 'visible';
    }
  },
  filters: {
    formatTags(value) {
      if (!value) return '';
      return value.replace(/,/g, ',<br>');
    }
  },
  mounted() {
    this.fetchStations();
  }
};
</script>



<style scoped>
.v-list-item {
  display: block; /* Assicurati che ogni item sia trattato come blocco, favorendo un layout verticale */
}

.v-container {
  max-width: 100%; /* Utilizza tutta la larghezza disponibile */
}

.v-list {
  width: 100%; /* Garantisce che la lista occupi l'intera larghezza del suo contenitore */
}
</style>


