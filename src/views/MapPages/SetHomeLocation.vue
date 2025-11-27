<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Set Home Location</ion-title>
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
        <ion-button expand="full" @click="saveHomeLocation" class="save-button">Save Home Location</ion-button>
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
import router from '@/router';
import storage from '@/services/storagefile';
import { loadGoogleMaps } from '@/services/googleMapsLoader';


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonFooter
  },
  setup() {
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const mapContainer = ref<HTMLElement | null>(null); // Map container reference
      const mapRef = ref<google.maps.Map | null>(null);
    let newMap: google.maps.Map | null = null;
    const currentLat = ref<number | null>(null); // Track current latitude
    const currentLng = ref<number | null>(null); // Track current longitude
    const currentZoom = ref<number | null>(null); // Track current zoom level

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


          newMap.addListener('center_changed', () => {
          const currentCenter = newMap?.getCenter();
          const currentZoomval = newMap?.getZoom();

          if (currentCenter) {
            currentLat.value = currentCenter.lat(); // Update the latitude
          currentLng.value = currentCenter.lng(); // Update the longitude
            currentZoom.value = currentZoomval; // Track the zoom level

            // console.log('Current Zoom:', currentLat.value+" "+currentLng.value+" "+currentZoom.value);
          }
        });

      
        } else {
          console.error('Map element not found.');
        }
      } catch (error) {
        console.error('Error creating Google Map:', error);
      }
    });

    // Clean up the map when the component is unmounted
    onUnmounted(() => {
      if (mapRef.value) {
        mapRef.value=null;
      }
    });

    // Save home location function
    const saveHomeLocation = async () => {
      if (currentLat.value !== null && currentLng.value !== null && currentZoom.value !== null) {
        // Save zoom level and center location in localStorage
        await storage.set('mapZoom', currentZoom.value.toString());
        await storage.set('mapLat', currentLat.value.toString());
        await storage.set('mapLong', currentLng.value.toString());

        console.log('Home location saved:', {
          zoom: currentZoom.value,
          latitude: currentLat.value,
          longitude: currentLng.value,
        });
          router.back();
        
      } else {
        console.error('No camera position available.');
      }
    };

    return {
      isConnected, showReconnectedMessage, initNetworkListener,

      mapContainer,
      saveHomeLocation,
    };
  },
  methods: {
    // Go back to the previous page
    async goBack() {
      this.$router.back();
    },
  },
});
</script>

<style scoped>
#map {
  height: 100%;
}

/* Styling the footer */
.footer-style {
  --background: #3880ff; /* You can change this to the desired color */
}

/* Make the button inherit the footer's background */
.save-button {
  --background: inherit; /* Button will inherit the footer's background color */
  color: white; /* You can adjust text color if necessary */
}

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
