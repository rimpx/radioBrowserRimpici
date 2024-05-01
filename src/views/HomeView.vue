<template>
  <v-container>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search Radio Stations"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="filteredStations"
      :search="search"
      hide-default-footer
      class="elevation-1"
    >
      <!-- Uso corretto di v-slot con Vuetify -->
      <template v-slot:item="{ item }">
        <v-list-item @click="playRadio(item.url)">
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-data-table>
  </v-container>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      stations: [],
      search: '',
      headers: [
        { text: 'Radio Station', align: 'start', value: 'name' }
      ],
      loading: false,
    };
  },
  computed: {
    filteredStations() {
      return this.stations
        .filter(station =>
          station.name.toLowerCase().includes(this.search.toLowerCase())
        );
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


