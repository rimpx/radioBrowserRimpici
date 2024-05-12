<template>
    <div ref="container" style="width: 100%; height: 100vh;"></div>
    <div v-if="currentStation" class="radio-info">
        <img :src="currentStation.favicon" alt="Station Logo" class="station-logo">
        <h3>{{ currentStation.name }}</h3>
        <v-btn icon @click="stopRadio">
            <v-icon>mdi-stop</v-icon>
        </v-btn>
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { fetchRadiosWithCoordinates } from './api'; // Assicurati che questa funzione sia definita correttamente nel file api.js

export default {
    name: 'WorldMap',
    data() {
        return {
            globe: null,
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            stations: [],
            currentStation: null
        };
    },
    methods: {
        initThree() {
            const width = this.$refs.container.clientWidth;
            const height = this.$refs.container.clientHeight;

            // Inizializzazione della scena 3D
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(width, height);
            this.$refs.container.appendChild(this.renderer.domElement);

            // Impostazione dei controlli per orbitare intorno al globo
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.camera.position.z = 5; // Distanza della camera dal centro della scena

            // Creazione del mappamondo
            const geometry = new THREE.SphereGeometry(2, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true });
            this.globe = new THREE.Mesh(geometry, material);
            this.scene.add(this.globe);

            // Aggiungi markers per le stazioni
            this.addStationMarkers();

            // Avvia l'animazione della scena
            this.animate();
        },
        animate() {
            requestAnimationFrame(this.animate); // Crea un loop di animazione
            this.controls.update(); // Aggiorna i controlli della camera
            this.renderer.render(this.scene, this.camera); // Renderizza la scena
        },
        addStationMarkers() {
            // Aggiunge un marker per ogni stazione sulla superficie del globo
            this.stations.forEach(station => {
                const { latitude, longitude } = station;
                const phi = (90 - latitude) * (Math.PI / 180);
                const theta = (longitude + 180) * (Math.PI / 180);

                const x = -((2 + 0.1) * Math.sin(phi) * Math.cos(theta));
                const y = ((2 + 0.1) * Math.cos(phi));
                const z = ((2 + 0.1) * Math.sin(phi) * Math.sin(theta));

                const sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 32, 32),
                    new THREE.MeshBasicMaterial({ color: 0xff0000 })
                );
                sphere.position.set(x, y, z);
                sphere.userData = { station };

                this.scene.add(sphere);
            });
        },
        fetchStations() {
            // Recupera le stazioni con coordinate valide
            fetchRadiosWithCoordinates().then(data => {
                this.stations = data.filter(station => station.latitude && station.longitude);
                this.initThree(); // Inizializza Three.js dopo il caricamento dei dati
            }).catch(error => {
                console.error('Failed to fetch stations:', error);
            });
        },
        playRadio(station) {
            this.currentStation = station;
            // Qui potresti implementare un metodo per riprodurre l'audio della stazione
        },
        stopRadio() {
            this.currentStation = null;
            // Qui potresti implementare un metodo per fermare l'audio della stazione
        }
    },
    mounted() {
        this.fetchStations(); // Carica le stazioni radio non appena il componente è montato
    }
};
</script>


<style scoped>
.radio-info {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.station-logo {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
}
</style>