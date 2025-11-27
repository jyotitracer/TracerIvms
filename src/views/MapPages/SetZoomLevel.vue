<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Set Zoom Level</ion-title>
      </ion-toolbar>
    </ion-header>
    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   

    <ion-content>
      <div ref="mapContainer" id="map" style="height: 100%;"></div>
    </ion-content>

    <ion-footer class="footer-style">
      <ion-toolbar>
        <ion-button expand="full" @click="backPage" class="save-button">Save</ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import useNetwork from '@/services/networkService'; // Import the network service

import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonFooter
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import Constants from '@/common/constants';
import storage from '@/services/storagefile';
import router from '@/router';
import { loadGoogleMaps } from '@/services/googleMapsLoader';


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,IonButton,IonFooter
  },
  setup() {
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const mapContainer = ref<HTMLElement | null>(null);

    const mapRef = ref<google.maps.Map | null>(null);
    let newMap: google.maps.Map | null = null;

     
    onMounted(async () => {
      initNetworkListener();

      try {
        await nextTick();
    if (mapContainer.value) {
          // Retrieve stored zoom and center from localStorage
          
          const login_data= await storage.get('login_data');


        // Retrieve stored zoom and center from localStorage
        const storedZoom = await storage.get('mapZoom');
        const mapLat = await storage.get('mapLat');
        const mapLong = await storage.get('mapLong');
        const storedMapType = await storage.get('mapType'); // Retrieve map type


                      const initialLat =
                        mapLat !== null && mapLat !== undefined && !isNaN(parseFloat(mapLat))
                          ? parseFloat(mapLat)
                          : parseFloat(login_data?.h_lat);

                      const initialLong =
                        mapLong !== null && mapLong !== undefined && !isNaN(parseFloat(mapLong))
                          ? parseFloat(mapLong)
                          : parseFloat(login_data?.h_lon);

                        console.log("initialLat:", login_data.h_lat, "initialLong:", login_data.h_lon);
  
                    // Parse zoom and center values from storage or set defaults
                    const initialZoom =  storedZoom !== null && storedZoom !== undefined && !isNaN(parseFloat(storedZoom)) ? parseInt(storedZoom) : parseInt(login_data.zoom_lvl); // Default zoom to 12  
                    const initialCenter= { lat: initialLat, lng: initialLong }; // Default center coordinates
                    const initialMapType = storedMapType !== null && storedMapType !== undefined && !isNaN(parseFloat(storedMapType))  ? storedMapType : 'roadmap';

                      await loadGoogleMaps(); // ✅ Wait until Maps API is loaded


          newMap = new google.maps.Map(mapContainer.value, {
          
          center: initialCenter,
          zoom: initialZoom,
          mapTypeId: initialMapType,
          zoomControl: true,
          mapTypeControl: false, // Disable Map/Satellite control
    fullscreenControl: false, // Disable fullscreen control (ESC button)
    streetViewControl: false, // Disable the Pegman/Street View control


        });


          mapRef.value = newMap;
          // Add an event listener to capture zoom changes via camera move
          // newMap.setOnCameraIdleListener((position) => {
          //   const currentZoom = position.zoom; // The zoom level comes from the event
          //   console.log('Current Zoom:', currentZoom);
          //   storage.set('mapZoom', currentZoom.toString()); // Store the zoom value in localStorage
          // });


          newMap.addListener('zoom_changed', async () => {
          const currentZoom = newMap?.getZoom();
          if (currentZoom !== null) {
            console.log('Current Zoom:', currentZoom);
            await storage.set('mapZoom', currentZoom+"");
          }
        });

      

        } else {
          console.error('Map element not found.');
        }
      } catch (error) {
        console.error('Error creating Google Map:', error);
      }
    });

    onUnmounted(() => {
      if (mapRef.value) {
        mapRef.value = null;
      }
    });

    const backPage = () => {
      
          router.back();
        
    };

    return {
      mapContainer,
      isConnected, showReconnectedMessage, initNetworkListener,backPage,

    };
  },
  methods: {
    async goBack() {
      this.$router.back();
    },
  },
});
</script>

<style>
.network-status-bar {
  background-color: red;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}


.network-status-bar.connected {
  background-color: green;
}


</style>
