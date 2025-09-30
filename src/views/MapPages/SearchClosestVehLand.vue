<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="goBack"></ion-back-button>
          </ion-buttons>
          <ion-title>Search Landmark</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <!-- Network Status Bar -->
      <div v-if="!isConnected" class="network-status-bar">
        No Network Connection
      </div>
      <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
        Connected to Network
      </div>   
  
      <ion-content>
        <!-- Search Bar -->
        <ion-searchbar 
          placeholder="Search for a landmark" 
          v-model="searchQuery" 
          @ionInput="onSearch"
          debounce="500" 
        ></ion-searchbar>
  
        <!-- Autocomplete List -->
        <ion-list v-if="searchResults.length > 0">
          <ion-item 
            v-for="landmark in searchResults" 
            :key="landmark.place_id"
            @click="selectLandmark(landmark)"
          >
            <ion-label>
              <h2>{{ landmark.name }}</h2>
              <p>{{ landmark.formatted_address }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
  
        <!-- No Results Found Message -->
        <ion-item v-else-if="searchQuery.length > 2">
          <ion-label>No results found</ion-label>
        </ion-item>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import useNetwork from '@/services/networkService';
  import { onMounted, ref } from 'vue';
  import Constants from '@/common/constants';
  import router from '@/router/index';
  
  
  import {
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,IonSearchbar,IonLabel,IonList,IonItem
  } from '@ionic/vue';
  import { getPlaceApi } from "@/services/ApiService"; // Import the getPlaceApi service
  
  export default {
    name: 'SearchLandmark',
    components: {
      IonContent,
      IonHeader,
      IonPage,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonBackButton,
      IonSearchbar,IonLabel,IonList,IonItem
    },
    setup() {
      const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork();
      const searchQuery = ref('');
      const searchResults = ref([]);
      const googleApiKey = Constants.Google_map_API;
  
      const onSearch = async (event) => {
        const query = event.target.value.trim();
  
        // Only make API request if query length is 3 or more characters
        if (query.length > 2) {
          try {
            const data = await getPlaceApi(query, googleApiKey);
            if (data && data.results) {
              // Populate the searchResults with the data received from the API
              searchResults.value = data.results.map(result => ({
                name: result.name,
                formatted_address: result.formatted_address,
                place_id: result.place_id,
                geometry: result.geometry.location // Includes lat and lng
              }));
            } else {
              searchResults.value = [];
            }
          } catch (error) {
            console.error('Error fetching places:', error);
            searchResults.value = [];
          }
        } else {
          searchResults.value = [];
        }
      };
  
      const selectLandmark = (landmark) => {
        // When a landmark is selected, log the lat/lon and navigate back
        const lat = landmark.geometry.lat;
        const lng = landmark.geometry.lng;
       // console.log('Selected Landmark:', landmark, `Lat: ${lat}, Lng: ${lng}`);
        console.log(landmark.formatted_address);
  
       localStorage.setItem("Near_landmark_lat",lat);
       localStorage.setItem("Near_landmark_lng",lng);
       localStorage.setItem("Near_landmark_address",landmark.formatted_address);


  
  
        router.push('/nearestvehicle');
        
      };
  
      onMounted(() => {
        initNetworkListener();
      });
  
      return {
        searchQuery,
        searchResults,
        onSearch,
        selectLandmark,
        isConnected,
        showReconnectedMessage,
        initNetworkListener
      };
    },
    methods: {
      async goBack() {
        router.back();
      }
    }
  };
  </script>
  
  <style scoped>
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
  