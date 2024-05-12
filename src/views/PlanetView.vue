<template>
    <div ref="container" style="height: 80vh;"></div>
    <div class="navbar" v-if="selectedRadio">
        <img :src="selectedRadio.favicon || defaultImage" class="radio-logo" alt="Radio logo">
        <h4>{{ selectedRadio.name }}</h4>
        <h2>{{ selectedRadio.country }}</h2>
        <button @click="togglePlayPause(selectedRadio)">
            {{ selectedRadio.playing ? 'Stop' : 'Play' }}
        </button>
    </div>
</template>



<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earthTexturePath from '@/assets/8k_earth_daymap.jpg';
import defaultImage from '@/assets/default-image.jpg';

export default {
    name: 'PlanetView',
    data() {
        return {
            camera: null,
            renderer: null,
            controls: null,
            earthRadius: 1,
            radios: [],
            selectedRadio: null,
            defaultImage,
            mouse: new THREE.Vector2(),  // Inizializzazione qui
            raycaster: new THREE.Raycaster(),
        };
    },

    mounted() {
        this.initThree();
        this.getRadios();
        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('click', this.onDocumentMouseClick.bind(this)); // Binding the context
        this.animate = this.animate.bind(this); // Binding the context
        this.animate(); // Now 'this' inside animate will refer to the Vue instance correctly
    },

    methods: {
        initThree() {
            this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.z = 5;

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.$refs.container.appendChild(this.renderer.domElement);

            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.minDistance = 3;
            this.controls.maxDistance = 9;

            const scene = new THREE.Scene();
            const texture = new THREE.TextureLoader().load(earthTexturePath);
            const material = new THREE.MeshPhongMaterial({ map: texture });
            const earth = new THREE.Mesh(new THREE.SphereGeometry(this.earthRadius, 64, 64), material);
            scene.add(earth);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            this.scene = scene;
            this.animate();
        },
        animate() {
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        },
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        },
        async getRadios() {
            try {
                const response = await fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=100&has_geo_info=true&hidebroken=true');
                const data = await response.json();
                this.radios = data;
                this.radios.forEach(radio => {
                    this.addMarker(radio.geo_long, radio.geo_lat, radio);
                });
            } catch (error) {
                console.error('Error fetching radios:', error);
            }
        },
        addMarker(longitude, latitude, radio) {
            const phi = (90 - latitude) * (Math.PI / 180);
            const theta = (longitude + 180) * (Math.PI / 180);
            const x = -this.earthRadius * Math.sin(phi) * Math.cos(theta);
            const y = this.earthRadius * Math.cos(phi);
            const z = this.earthRadius * Math.sin(phi) * Math.sin(theta);

            const geometry = new THREE.SphereGeometry(0.02, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const marker = new THREE.Mesh(geometry, material);
            marker.position.set(x, y, z);
            marker.userData = radio; // Assicurati di includere `url` e qualsiasi altro dato necessario in `radio`
            this.scene.add(marker);
        },
        onDocumentMouseClick(event) {
            event.preventDefault();
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0 && intersects[0].object.userData.url) {
                this.selectedRadio = intersects[0].object.userData;
                this.playRadio(this.selectedRadio);
            }
        },

        playRadio(radio) {
            // Se l'audio player non esiste, lo crea
            if (!radio.audioPlayer) {
                radio.audioPlayer = new Audio(radio.url);
                radio.audioPlayer.addEventListener('canplaythrough', () => {
                    radio.audioPlayer.play()
                        .then(() => {
                            console.log("Playing:", radio.name);
                            radio.playing = true;
                        })
                        .catch(error => {
                            console.error("Error playing the radio:", error);
                        });
                });
            } else {
                radio.audioPlayer.play()
                    .then(() => {
                        console.log("Resuming:", radio.name);
                        radio.playing = true;
                    })
                    .catch(error => {
                        console.error("Error resuming the radio:", error);
                    });
            }
            this.selectedRadio = radio; // Imposta la radio selezionata come la corrente
        },
        togglePlayPause(radio) {
            if (radio.playing) {
                if (radio.audioPlayer) {
                    radio.audioPlayer.pause();
                }
                radio.playing = false;
            } else {
                // Fermiamo qualsiasi altra stazione radio che potrebbe essere in riproduzione.
                if (this.selectedRadio && this.selectedRadio !== radio && this.selectedRadio.audioPlayer) {
                    this.selectedRadio.audioPlayer.pause();
                    this.selectedRadio.playing = false;
                }
                this.playRadio(radio);
            }
        },
    }
};
</script>


<style scoped>
.container {
    height: 100vh;
    position: relative;
}

.navbar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    /* Cambio per dispositivi mobili */
    align-items: center;
    justify-content: space-around;
    padding: 10px;
}

.radio-logo {
    width: 50px;
    height: 50px;
    border-radius: 25px;
}

@media (max-width: 600px) {
    .navbar {
        flex-direction: column;
    }

    .sound-wave,
    .heart-container {
        display: none;
    }
}

.sound-wave {
    display: flex;
    align-items: center;
    height: 20px;
    margin-left: 10px;
    margin-top: 2px;
}

.bar {
    width: 4px;
    height: 100%;
    margin: 0 2px;
    background-color: #333;
    animation: pulse 0.8s infinite ease-in-out alternate;
}

@keyframes pulse {
    from {
        transform: scaleY(1);
    }

    to {
        transform: scaleY(1.5);
    }
}

.heart-container {
    display: inline-block;
    cursor: pointer;
    margin-left: 5px;
    margin-top: 2px;
}

.heart {
    width: 20px;
    height: 18px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="%23C1C1C1"/></svg>') center no-repeat;
    background-size: 100%;
}

.heart.liked {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" fill="%23FF0000"/></svg>');
}
</style>
