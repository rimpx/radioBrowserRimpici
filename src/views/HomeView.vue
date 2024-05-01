<template>
  <v-container>
    <h1>RadioRimpici</h1>
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
        <v-list-item @click="playRadio(item.url)">
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-data-table>
    <audio ref="audioPlayer" style="display:none;"></audio>
  </v-container>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      radios: [],
      search: '',
      headers: [
        { text: 'Radio Station', align: 'start', sortable: false, value: 'name' }
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
    playRadio(url) {
      const audio = this.$refs.audioPlayer;
      if (audio) {
        audio.src = url;
        audio.play();
      }
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

