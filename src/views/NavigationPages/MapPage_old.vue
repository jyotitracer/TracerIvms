<!-- This Page is menu Map  Page. -->
<template>
  <ion-content>
    <!-- Attach the ref to the map container -->
  
      <!-- <div :class="ishowPath ? 'map-fab-container-small' : 'map-fab-container-full'"> -->
  
        <div :style="{ height: mapFabContainerHeight }" class="map-fab-container-full">
        <div ref="mapContainer" class="map-container">
          <div id="map"></div> 
       </div>
  
  
       
        <!-- Display InfoBoxSummaryTrip over the map -->
        <div v-if="isSumTripObject" class="info-box-summary-trip">
          <InfoBoxSummaryTrip 
          :vehicleData="historyarray[currentIndex]"  
          :isSummaryChecked="isSummaryChecked"
          :isTripInfoChecked="isTripInfoChecked"
         
          />
        </div>
  
        <!-- InfoBoxNearestVeh -->
        <div v-if="isnearVehObject" class="info-box-nearest-veh">
          <InfoBoxNearestVeh 
            :vehicleData="Near_vehicleObject" 
            @closeInfoBox="clearPolyline" 
          />
        </div>
  
  
        
  
        <ion-fab slot="fixed" vertical="bottom" horizontal="start" style="bottom: 30px;">
        <ion-fab-button ref="fabButton">
          <ion-icon :icon="chevronUpCircle" style="color: white;"></ion-icon>
        </ion-fab-button>
  
        <ion-fab-list side="top">
        
  
          <div class="fab-item" @click="navigateToPage('7')">
            <img src="\ic_btn_search_landmark.png" class="fab-image" />
            <ion-label class="fab-label">Search Landmark</ion-label>
          </div>
  
          <div class="fab-item" @click="navigateToPage('6')">
            <img src="\ic_btn_search_vehicle.png" class="fab-image" />
            <ion-label class="fab-label">Search Vehicle</ion-label>
          </div>
  
          <div class="fab-item" @click="navigateToPage('5')">
            <img src="\ic_btn_search_closest_vehicle.png"  class="fab-image" />
            <ion-label class="fab-label">Search Closest Vehicle From Landmark </ion-label>
          </div>
  
          <div class="fab-item" @click="navigateToPage('4')">
            <img src="\ic_btn_home.png"  class="fab-image" />
            <ion-label class="fab-label">Home Location</ion-label>
          </div>
  
  
          <div class="fab-item" @click="navigateToPage('3')">
            <img src="\ic_settings.png" class="fab-image" />
            <ion-label class="fab-label">Settings</ion-label>
          </div>
  
  
          <div class="fab-item" @click="navigateToPage('2')">
            <img src="\filter_group.png" class="fab-image" />
            <ion-label class="fab-label">Select Group</ion-label>
          </div>
  
         
          <div class="fab-item" @click="navigateToPage('1')">
            <img src="\ic_btn_search_closest_vehicle.png" class="fab-image" />
            <ion-label class="fab-label">Show Trip</ion-label>
          </div>
  
        
        </ion-fab-list>
      </ion-fab>
      
    </div>
  
  
      <!-- show trip  -->
  
  <div class="filter-section" v-if="ishowPath" >
  
    <ion-icon :icon="closeCircle" style="color: white; margin-bottom: 10px;" class="close-icon" @click="closeShowPath(1)"></ion-icon>
  
    <div class="from-to-section" v-if="isMarkerShowPath">
  
      <div>
  
        <ion-grid style="padding-bottom: 0px;">
  
          <!-- From DateTime -->
          <ion-row>
  
            <ion-col>
              <ion-label class="lable_class">From DateTime</ion-label>
              <ion-item @click="openModal('from')" class="item_class">
                <ion-label class="lable_class2">{{ fromDateTimeFormatted }}</ion-label>
              </ion-item>
            </ion-col>
  
            <!-- To DateTime -->
            <ion-col>
              <ion-label class="lable_class">To DateTime</ion-label>
              <ion-item @click="openModal('to')" class="item_class">
                <ion-label class="lable_class2">{{ toDateTimeFormatted }}</ion-label>
              </ion-item>
            </ion-col>
  
            <!-- Load Data Button -->
            <ion-col size="3" class="ion-align-self-center">
              <ion-label class="lable_class" style="color: #4d4d4d;">sds</ion-label>
  
              <ion-button class="button_load" @click="loadData">Load Data</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>
      <!-- New Play/Pause Section -->
      <div class="play-pause-section" v-if="isLoadPath" :style="{ height: playPauseSection }">
        <div class="first-div">
        <ion-button @click="togglePlayPause" class="play-pause-icon">
             <ion-icon :icon="isPlaying ? pauseIcon : playIcon" style="color: white;"></ion-icon>
          </ion-button> 
        </div>   
        <div class="second-div">
  
          <div class="label-and-range">
            <ion-label style="width: 60px;   color: white; font-size: 14px;">Progress</ion-label>
  
         
            <ion-range
              class="progress-bar"
              :min="0"
              :max="maxValue"
              step="1"
              v-model="animationProgress"
              :disabled="!isPlaying"
              @ionChange="updateAnimationProgress"
            ></ion-range>
          </div>
  
          <div class="label-and-range">
            <ion-label style="width: 60px; color: white; font-size: 14px;">Speed</ion-label>
           
            <ion-range class="progress-bar"
              min="1"
              max="10"
              step="1"
              :value="speedValue"
              @ionChange="updateSpeed"
            ></ion-range>
          </div>
        </div>
  
        <div class="trip-info-section">
          <ion-label style="margin-right: 5px; color: white;font-size: 14px;">Summary</ion-label>
          <ion-checkbox v-model="isSummaryChecked" style="margin-top: 10px;"/>
  
          <!-- Trip Information Checkbox below Summary -->
          <div class="trip-info">
            <ion-label style="margin-right: 5px; color: white; font-size: 14px;">Trip Info</ion-label>
            <ion-checkbox v-model="isTripInfoChecked"/>
          </div>
        </div>
        
      </div>
  
  
     <!-- Trip info section remains unchanged -->
   
      <ion-modal 
        :is-open="isDateTimePickerVisible" 
        @didDismiss="closeModal">
          <ion-content>
            <div class="modal-content">
              <h2>Select Date and Time</h2>
  
              <!-- Date Picker -->
              <ion-datetime
                :value="selectedDateTime"
                display-format="YYYY-MM-DD HH:mm"
                picker-format="YYYY-MM-DD HH:mm"
                :max="currentDateTime"
                @ionChange="updateDateTime"
              ></ion-datetime>
  
              <!-- Buttons -->
              <div class="modal-buttons">
                <ion-button  color="primary" @click="saveDateTime" style="margin-right: 30px;">Done</ion-button>
                <ion-button  color="primary"  @click="closeModal">Cancel</ion-button>
              </div>
            </div>
          </ion-content>
        </ion-modal>
    </div>
  
    </ion-content>
  </template>
  
  
  <style scoped>
  
  ion-range{
    --knob-size: 16px;
    --height: 38px;
  
  }
  
  .info-box-summary-trip {
    position: absolute;
    top: 10px; /* Adjust for spacing */
    left: 0;
    right: 0;
    width: 100%;
    z-index: 10; /* Ensure it stays above the map */
    padding: 0px;
    box-sizing: border-box;
  }
  
  .info-box-nearest-veh {
    position: absolute;
    top: 70px; /* Adjust for spacing below the summary */
    left: 0;
    right: 0;
    width: 100%;
    z-index: 10; /* Ensure it stays above the map */
    padding: 0px;
    box-sizing: border-box;
  }
  
  
  .close-icon {
    position: absolute;
    right: 2px; /* Distance from the right */
    font-size: 24px; /* Size of the close icon */
    color: #fff; /* White color for the icon */
    cursor: pointer; /* Cursor pointer to indicate it's clickable */
    z-index: 9999; /* Make sure it's above other content */
  }
  
  .close-icon:hover {
    color: #f00; /* Change color on hover */
  }
  
  ion-content {
    --padding-top: 0;
    --padding-bottom: 0;
    overflow: hidden;
  }
  
  
  
  
  
  .map-container {
    height: 100%; /* Default height */
  }
  
  .full-screen-map {
    height: 100%; /* Full screen height when isShowPath is false */
  }
  
  .filter-section {
    background-color: #4d4d4d;
    position: relative;
    z-index: 5;
    margin-top: 5px;
  
  }
  
  
  .fab-over-map {
    position: absolute;
    z-index: 10; /* Ensures FAB is above the map */
    bottom: 10px;
    left: 10px;
  }
  
  
  .map-fab-container-full {
    position: relative;
    height: 100%;
  }
  
  /* .map-fab-container-small {
    position: relative;
    height: calc(100% - 80px - 85px); 
  } */
  
  .map-fab-container-small {
    position: relative;
  }
  
  
  /* Ensure the label and button are in a row with icon on left */
  .fab-item {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-right: 40px; /* Add padding to the right to avoid text being cut off */
    overflow: hidden; /* Prevent overflow issues */
  }
  
  
  .fab-label {
    margin-left: 5px;          /* Space between icon and label */
    font-size: 14px;
    color: white;
    background-color:rgb(45, 44, 44);
    padding: 4px 4px 4px 4px;
    border-radius: 4px;
    white-space: nowrap;       /* Prevent the label from breaking into a new line */
    /* Remove or increase max-width if needed */
    max-width: 300px;          /* Increase max-width to fit longer text */
    overflow: visible;         /* Allow text to extend */
    text-overflow: initial;    /* Remove ellipsis */
  }
  
  
  
  
  ion-icon {
    font-size: 24px;
    color: red;
  }
  
  
  
  .gm-ui-hover-effect > img {
    width: 100% !important;    /* Make sure the image inside the button scales accordingly */
    height: 100% !important;
  }
  
  
  .data-section {
    padding: 10px;
    background-color: #f8f8f8;
  }
  
  .vehicle-info {
    display: flex;
    justify-content: space-between;
  }
  
  
  
  
  ion-button{
    margin: 0px;
    padding: 0px;
    width: 130dp;
  
  }
  
  ion-col{
    margin: 0px;
    padding: 0px;
  }
  
  
  
  
  .filter-section
  {
    background-color: #4d4d4d;
  }
  
  .from-to-section {
    bottom: 0;
    width: 100%;
    height: 60px; /* Set a fixed height for the filter section */
  }
  
  .play-pause-section {
    display:flex;
    align-items: center;
    width: 100%; /* Set width to 100% to ensure it takes full width */
  
  
  }
  
  .progress-bar,
  .speed-progress-bar {
    flex-grow: 1; /* This will make the progress bar take the remaining width */
    margin-left: 10px; /* Add space between the label and progress bar */
  
  }
  .trip-info-section {
    justify-items: flex-end;
    text-align: center;
    white-space: nowrap; /* Prevent content wrapping, ensuring width is based on content */
  margin-right: 5px;
  margin-bottom: 20px;
  
  }
  
  .trip-info {
    margin-top: 10px; /* Add some space between Summary and Trip Info */
    text-align: center;
  
  }
  
  
  /* Keep your existing styles */
  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .custom-datetime {
    --ion-text-color: #000;
    --ion-background-color: #f0f0f0;
    --ion-color-primary: #3b83f6;
    --ion-color-secondary: #ffcc00;
    
  }
  
  .ion-button {
    margin-top: 10px;
  }
  
  .item_class{
    --padding-top: 0px; 
      --padding-bottom: 0px;
      --padding-start:2px;
       --padding-end: 2px;
       padding: 0px;
       --min-height:30px;
      
      }
  
  
  .play-pause-icon {
  
    border-radius: 50%;  /* To make the circle */
    width: 40px;  /* Width of the circle */
    height: 40px;  /* Height of the circle */
    display: flex;
    align-items: center;
    --background: red;
      --color: white;
      padding: 0px;
      --padding-top: 0px; 
      --padding-bottom: 0px;
      --padding-start: 0em;
       --padding-end: 0em;
       margin-right: 10px;
  
  }
  .lable_class {
    color: white; /* Replace with your desired color */
    font-size: 12px;
    text-align: left;
    margin: 0px;
  
  
  
  }
  
  .lable_class2 {
    color: black; /* Replace with your desired color */
    font-size: 12px;
    text-align: left;
    margin: 0px;
  
  
  
  }
  
  .button_load {
    font-size: 12px;
    align-items:end;
    color: white;
    --background: red;
    text-transform: none;
    width: auto;
    margin: 0px 0px 0px 0px;
    padding: 0px;
    --padding-top: 0px;
    --padding-end: 10px;
    --padding-bottom: 0px;
    --padding-start: 10px;
    min-height: 30px;
  }
  
  ion-col {
    padding: 0px;
    margin-left: 5px;
    margin-left: 5px;
  
    text-align: left;
    justify-content: center;
  }
  
  .ion-align-self-center {
    justify-content: baseline;
    align-items: center;
  
  
  }
  
  .label-and-range {
    display: flex;
    align-items: center;
  }
  
  .fab-image{
    height: 32px;
    width: 32px;
  }
  
  
  .first-div {
    white-space: nowrap; /* Prevent content wrapping, ensuring width is based on content */
    margin-left: 5px;
  }
  
  .second-div {
    flex-grow: 1; /* Take up the remaining space */
    text-align: left; /* Optional: Center text inside the second div */
    margin-right: 5px;
  
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  
  </style>
  
  
    
    <script lang="ts">
    import InfoBoxNearestVeh from '@/components/InfoBoxNearestVeh.vue';
    import InfoBoxSummaryTrip from '@/components/InfoBoxSummeryTrip.vue';
  
    
    import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar,IonLabel,
      loadingController,IonProgressBar,IonRange,IonCheckbox, 
      useBackButton} from '@ionic/vue';
    import {  chevronUpCircle,    colorPalette,    globe, playCircle, pauseCircle, star, close, closeCircle } from 'ionicons/icons';
    import router from '@/router/index'; // Assuming your router file is named router.js
    import{MapIntervalRefresh,stopInterval1Min} from '@/services/MaprefreshService';
    import { ref, onMounted, onUnmounted,nextTick } from 'vue';
    import Constants from '@/common/constants';
    import { fetchData } from '@/services/ApiService';
    import storage from '@/services/storagefile';
    import { Network } from '@capacitor/network';
    import { useRoute } from 'vue-router';
    import { showToast,showToastMessage } from '@/services/toast'; // Import the toast utility function
    import axios from 'axios';
    import { Loader } from "@googlemaps/js-api-loader";
    import InfoWindowMapMarker from '@/components/InfoWindowMapMarker.vue';
    import InfoWindowDorMarker from '@/components/InfoWindowDotMarker.vue';
  
    import { createApp } from 'vue';
    import { format, startOfDay, subYears } from 'date-fns';
  import { IonButton, IonModal, IonDatetime, IonGrid, IonCol, IonItem, IonRow } from '@ionic/vue';
  import {  selectedPage } from '@/services/userstate'; // Import the global state
  import { formatISO } from 'date-fns';
  
  
  
  
  const selectedVehNo=ref('');
  const currentIndex = ref(0);  // Track the current index
  
          const selectedItems = ref([]);
          const mapRef = ref<google.maps.Map | null>(null);
          let newMap: google.maps.Map | null = null;
         
          const mapContainer = ref<HTMLElement | null>(null); // Ref for the map container
          const markersArray = ref<google.maps.Marker[]>([]); // Array to store Google Maps markers
          const polylineRef = ref<google.maps.Polyline | null>(null);
          let vehicleLat: string | number | string[],vehicleLon: string | number | string[];
          
          const Near_vehicleObject = ref(null);
          const isnearVehObject = ref(false);
          const isSumTripObject=ref(false);
          const summaryTripObject = ref(null);
          const markersDotsArray: (never[] | google.maps.Marker)[]=[];
            let currentInfoWindow = null; // Variable to store the currently open infoWindow
  
            const isMapBusyWithRoute=ref(false);
          const items = ref([]);
          const historyarray = ref([]);
          let markerId1=<google.maps.Polyline | null>(null);
          let markerId2=<google.maps.Polyline | null>(null);
            let markerMovingIcon=<google.maps.Polyline | null>(null);
  
  
          const intervalRunning1Min = ref(false);
          
          const showData = ref(false); // Controls visibility of the toggleable section
      const vehicleNo = ref('QATAR101849'); // Example Vehicle Number
      const distance = ref(36.8); // Example distance
  
      const isFromPickerVisible = ref(false); // For controlling the visibility of the From DateTime picker
      const isToPickerVisible = ref(false); // For controlling the visibility of the To DateTime picker
      const isDateTimeValid = ref(true); // For checking date-time validity
      const ishowPath=ref(false);
      const isMarkerShowPath=ref(false);
      const isLoadPath=ref(false);
  
  
           // Initialize DateTimes
  // const fromDateTime = ref(startOfDay(new Date()).toISOString());
  // const toDateTime = ref(new Date().toISOString());


  const fromDateTime = ref('');
  const toDateTime = ref('');
  
  const fromDateTimeFormatted = ref('');
  const toDateTimeFormatted = ref('');
  
  
  // Modal control
  const isDateTimePickerVisible = ref(false);
  const selectedDateTime = ref(null);
  const dateType = ref(null);
  
  // Set min and max date
  // const minDate = ref(subYears(new Date(), 10).toISOString());
  const currentDateTime = ref(formatISO(new Date())); // Maximum selectable date and time (current date and time)
  
  
  
  // Icons
  const playIcon = playCircle;
   const pauseIcon = pauseCircle;
  
  
  const isPlaying= ref(false);
  const progressValue = ref(0); // Value for progress bar
  const maxValue = ref(0); // Default maximum value for the range
  const speedValue = ref(5); // Example speed in km/h
  
  
  
           // const marker = ref();
              const polylinePathsForShowPath = ref();
              const directionsService = ref();
              const routePoints = ref([]);
              const middleMarkers = ref([]);
              const animationIndex = ref(0);
              const animationTimer = ref();
              const animationSpeed = ref(600); // Default to 600ms
              const animationProgress = ref(0);
               const index_route_array = ref([]);
  
  const isSummaryChecked = ref(true); // Default checked
                      const isTripInfoChecked = ref(true); // Default checked
  
  // Play/Pause and Progress
  let interval = 0; // Store the interval ID
  const fabButton = ref(null);
  
  
  
            export default {
              components: { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar ,IonLabel,  
                  InfoBoxNearestVeh,  InfoBoxSummaryTrip,  InfoWindowMapMarker,IonButton, IonModal, IonDatetime, IonGrid, IonCol,
                   IonItem, IonRow,IonProgressBar,IonRange,IonCheckbox,InfoWindowDorMarker},
  
                   computed: {
                    mapFabContainerHeight() {
                            let height = "100%";
                            if (ishowPath.value) {
                              if(isMarkerShowPath.value){
                              height = `calc(${height} - 70px)`;
                              }
                             
                            }
  
                            if (isLoadPath.value) {
                              if(isMarkerShowPath.value){
                              height = `calc(${height} - 85px)`;
                              }else{
                              height = `calc(${height} - 120px)`;
                              }
                            }
  
  
                            return height;
                          },
  
                          playPauseSection(){
                            if(isMarkerShowPath.value){
                             return `calc(85px)`;
                              }else{
                             return `calc(120px)`;
                              }
                          }
                  },
                  
              setup() {
  
               
  
                  const route = useRoute();
                  vehicleLat = route.params.vehLat;
                  vehicleLon = route.params.vehLon;
                  // historyarray.value = route.params.arrayData;
                  historyarray.value=[];
                   historyarray.value = route.params.arrayData
                  ? JSON.parse(route.params.arrayData)
                  : [];
               
                 // console.log("displayData",vehicleLat+" "+vehicleLon);
                 // console.log("arrayData", historyarray.value);
  
  
  
    
                  
                
                  onMounted(async () => {
                      useBackButton(9999, async () => {
                        const title='';
                      const pageid='';
                      const path='';
                      selectedPage.value = { title, pageid,path }; // Update the shared state
  
                      router.replace('/today');
                    });
                   CallOnlyAPI();
                    MapDisplay();
                    MapIntervalRefresh();
                              
  
          
                  });
            
                      // Stop timer when component is unmounted
                  onUnmounted(() => {
                    // Destroy the map when the component is unmounted
                    if (mapRef.value) {
                      mapRef.value = null;
                    }
                    closeShowPath(1);
  
                    stopInterval1Min();
                  });
  
  
                   // Method to clear the polyline
                    const clearPolyline = () => {
                      if (polylineRef.value) {
                        polylineRef.value.setMap(null); // Remove polyline from the map
                        polylineRef.value = null; // Clear the reference
                      }
                      isnearVehObject.value = false; // Also hide the info box
                    };
  
            
          
                  return {
                    closeCircle,chevronUpCircle, colorPalette,globe, mapContainer,navigateToPage, closeShowPath,ishowPath,isMarkerShowPath,isLoadPath,
                      moveCameraToLocation, MapDisplay,getDirections, Near_vehicleObject, summaryTripObject,isnearVehObject,isSumTripObject,
                        clearPolyline,showData,isPlaying,vehicleNo,distance,fromDateTime,toDateTime,loadData,togglePlayPause,playIcon,
                    pauseIcon,isFromPickerVisible,isToPickerVisible,isDateTimeValid,fromDateTimeFormatted,toDateTimeFormatted,
                  openDatePicker,validateDateTime,closeModal,selectedDateTime,
                  openModal,progressValue,speedValue,maxValue,isSummaryChecked,isTripInfoChecked,isDateTimePickerVisible,
                  currentDateTime,updateDateTime,saveDateTime,interval,historyarray,currentIndex,fabButton,
                  markerMovingIcon,isMapBusyWithRoute,
        polylinePathsForShowPath,
        directionsService,
        routePoints,
        middleMarkers,
        animationIndex,
        animationTimer,
        animationSpeed,
        // fetchRoute,processWaypoints,
        // extractRoutePoints,
        animateRoute,
        updateSpeed,
        updateAnimationProgress,
        animationProgress,
        
  
                        };
                  },
          };
  
  
  
  
          const loadData = () => {
          CallTripPath();
  
         // console.log('Loading data...');
  
        };
  
  //       const processWaypoints = async (waypoints) => {
  //         for (let i = 0; i < waypoints.length -1; i++) {
  //           const origin = waypoints[i].location;
  //           const destination = waypoints[i + 1].location;
  //           try {
  //             await fetchRoute(origin, destination,i);
  //           } catch (error) {
  //             console.error(`Error fetching route for segment ${i} -> ${i + 1}:`, error);
  //           }
  //         }
  //    };
  
  // const fetchRoute = (origin, destination,wayPointIndex) => {


  //   return new Promise((resolve, reject) => {
  //     const request = {
  //       origin,
  //       destination,
  //       travelMode: google.maps.TravelMode.DRIVING,
  //     };
  
  //     directionsService.value.route(request, (response, status) => {
  //       if (status === google.maps.DirectionsStatus.OK) {
  //         extractRoutePoints(response,wayPointIndex);

  //         resolve();
  //       } else {
  //         showToastMessage('Directions failed');
  //         console.error("Directions request failed:", status);
  //         reject(status);
  //       }
  //     });
  //   });
  // };
  
  // const extractRoutePoints = (response,wayPointIndex) => {
  //   const route = response.routes[0];
  //   const legs = route.legs;

  
  //   legs.forEach((leg) => {
  //     leg.steps.forEach((step) => {
  //       const stepPoints = google.maps.geometry.encoding.decodePath(step.polyline.points);
  //       routePoints.value.push(...stepPoints);

  //     });
  //   });
  
  //   const routeLength = routePoints.value.length;
  //  // console.log("displayatNew",wayPointIndex+" "+routeLength);


  //   index_route_array.value.push([wayPointIndex, routeLength]);
  
  // };
  
  const animateRoute = () => {

    maxValue.value=historyarray.value.length;
  //  console.log("displayData",isPlaying.value +" "+animationIndex.value+" "+routePoints.value.length);
  
    if (!isPlaying.value || animationIndex.value >= historyarray.value.length) {
      clearTimeout(animationTimer.value);
    animationIndex.value = 0;
    animationProgress.value = 0;
    isPlaying.value = false;
    // markerMovingIcon.setPosition(routePoints.value[0]);
    // newMap.panTo(routePoints.value[0]);
    return;
  }
  
    
  
    // const currentPoint = historyarray.value[animationIndex.value];
    // const nextPoint = historyarray.value[animationIndex.value + 1];
  
    const currentPoint = new google.maps.LatLng(
      historyarray.value[animationIndex.value].lat,
      historyarray.value[animationIndex.value].lon
    );

    const nextPoint =
      animationIndex.value + 1 < historyarray.value.length
        ? new google.maps.LatLng(
            historyarray.value[animationIndex.value + 1].lat,
            historyarray.value[animationIndex.value + 1].lon
          )
        : null;

  
    markerMovingIcon.setPosition(currentPoint);
    newMap?.panTo(currentPoint);
  
  
   
      if (nextPoint) {
        const heading = google.maps.geometry.spherical.computeHeading(currentPoint, nextPoint);
        markerMovingIcon.setIcon({
          ...markerMovingIcon.getIcon(),
          rotation: heading,
        });
      }
    

  
     // Optionally, adjust the zoom level
          if (animationIndex.value === 0 || animationIndex.value === historyarray.value.length - 1) {
            newMap.setZoom(18); // Focus zoom on start and end
          } else {
            newMap.setZoom(17); // Zoom out for middle points
          }
  
  
  
    const path = polylinePathsForShowPath.value.getPath();
    path.push(currentPoint);
  
  
    currentIndex.value=animationIndex.value;

    animationProgress.value = animationIndex.value;
    animationIndex.value++;
  
  
    animationTimer.value = setTimeout(animateRoute, animationSpeed.value);
  };
  
  
  
      const togglePlayPause = () => {

      
        if (animationIndex.value === 0 && animationProgress.value === 0 && !isPlaying.value) {
          polylinePathsForShowPath.value.setPath([]);
          const s1 ={lat:historyarray.value[0].lat,lng:historyarray.value[0].lon}

          markerMovingIcon.setPosition(s1);
          newMap.panTo(s1);
        }
  
        isPlaying.value = !isPlaying.value;
  
        if (isPlaying.value) {
          animateRoute();
        } else {
          clearTimeout(animationTimer.value);
        }
      };
  
      const updateSpeed = (event: { detail: { value: number; }; }) => {
        speedValue.value = event.detail.value;
  
        const speeds = {
          1: 1000,
          2: 900,
          3: 800,
          4: 700,
          5: 600,
          6: 500,
          7: 400,
          8: 300,
          9: 200,
          10: 200,
        };
  
       // console.log("display",speedValue.value);
        animationSpeed.value = speeds[speedValue.value];
       // console.log("animationSpeed.value",animationSpeed.value);
  
      };
  
      const updateAnimationProgress = (event: { detail: { value: number; }; }) => {

         showToastMessage("Can't forword or backword");
         animationIndex.value = animationIndex.value;
          animationProgress.value = animationIndex.value;
  
        //  animationIndex.value = event.detail.value;
        //  animationProgress.value = animationIndex.value;
  
        //  if (animationIndex.value < historyarray.value.length) {

       
        //   const currentPoint =new google.maps.LatLng(
        //   historyarray.value[animationIndex.value].lat,
        //   historyarray.value[animationIndex.value].lon
        // );

        //   markerMovingIcon.setPosition(currentPoint);
        //   newMap.panTo(currentPoint);
  
        //   const path = polylinePathsForShowPath.value.getPath();
        //   path.clear();
  
        //   for (let i = 0; i <= animationIndex.value; i++) {
        //     const s1 =new google.maps.LatLng(
        //         historyarray.value[i].lat,
        //         historyarray.value[i].lon
        //       );
        //     path.push(s1);
        //   }
        // }


  
       
      };
  
  
  // Function to open the modal
  const openModal = (type: string | null) => {
     dateType.value = type;
    
    if(type==='from')
  {
    if(fromDateTime.value){
      selectedDateTime.value = formatISO(fromDateTime.value);
  
    }else{
      selectedDateTime.value = formatISO(new Date());
  
    }
  
  }else{
    if(toDateTime.value){
      selectedDateTime.value = formatISO(toDateTime.value);
  
    }else{
      selectedDateTime.value = formatISO(new Date());
  
    }
  }
  
  
  
    isDateTimePickerVisible.value = true;
  };
  
  // Function to close the modal
  const closeModal = () => {
    isDateTimePickerVisible.value = false;
  };
  
  // Function to update DateTime based on selection in the modal
  const updateDateTime = (event: { detail: { value: null; }; }) => {
    selectedDateTime.value = event.detail.value; // Update with selected value
  
  };
  
  // Function to save DateTime and close modal
  const saveDateTime = () => {
    if (dateType.value === 'from') {
      fromDateTime.value = selectedDateTime.value;
      fromDateTimeFormatted.value = format(new Date(selectedDateTime.value), 'dd/MM/yyyy HH:mm');
    } else {
      toDateTime.value = selectedDateTime.value;
      toDateTimeFormatted.value = format(new Date(selectedDateTime.value), 'dd/MM/yyyy HH:mm');
    }
    validateDateTime(); // Validate the From/To datetime relationship
    closeModal(); // Close the modal after saving
  };
  
  // Function to validate From/To DateTime
  const validateDateTime = () => {
    isDateTimeValid.value = new Date(fromDateTime.value) <= new Date(toDateTime.value); // Ensure From is before To
  };
  
  
  const getRoute = (start: { lat: any; lng: any; }, end: { lat: any; lng: any; }) => {
    return new Promise((resolve, reject) => {
      const request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING // Use DRIVING for road following
      };
  
          if (typeof google !== 'undefined' && google.maps) {
  
            const directionsService = new google.maps.DirectionsService();
          
  
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          resolve(result.routes[0].overview_path); // This is the path along the road
        } else {
          reject('Directions request failed due to ' + status);
        }
      });
    }else {
    console.error('Google Maps JavaScript API is not loaded.');
  }
  
    });
  };
  
  
  
  
  
  
  const openDatePicker = (type: string) => {
        if (type === 'from') {
          isFromPickerVisible.value = true;
          isToPickerVisible.value = false;
        } else {
          isFromPickerVisible.value = false;
          isToPickerVisible.value = true;
        }
      };
  
  
      const closeShowPath=(count)=>{
  
        if(count===1)
      {
        ishowPath.value=false;
        isMarkerShowPath.value=false;
        isLoadPath.value=false;
        isMapBusyWithRoute.value=false;
      }
  
        if (polylinePathsForShowPath.value) {
          polylinePathsForShowPath.value.setPath([]);
          const path=polylinePathsForShowPath.value.getPath();
          path.clearPolyline;
  
         
  
          }
  
          if (markerMovingIcon) {
            markerMovingIcon.setMap(null);
            markerMovingIcon= null;
          }
  
                
                if(markerId1)
                {
                  markerId1.setMap(null); // This removes the marker from the map
                  markerId1 = null;
  
                }
  
                if(markerId2)
                {
                  markerId2.setMap(null); // This removes the marker from the map
                  markerId2 = null;
  
                }
  
  
                function removeMarker(marker: google.maps.Marker) {
                      if (marker) {
                          marker.setMap(null); // Removes the marker from the map
                      }
                  }
  
                  if(markersDotsArray.length>1){
  
                        markersDotsArray.forEach(marker => {
                        // console.log(marker.getPosition());
                          removeMarker(marker);
          
                      });
                    }
            markersDotsArray.length = 0; // Clear the array
           // console.log("dot1",markersDotsArray.length);
  
  
            index_route_array.value = [];
            routePoints.value = [];
            routePoints.value.length=0;
            
                isSumTripObject.value=false;
              
                
     };
      
            const navigateToPage = (pageName: number) => {
  
  
             
              isMapBusyWithRoute.value=false;
              closeShowPath(1);
  
  
                // Navigate to the selected page
                          console.log("Navigating to", pageName);
                          if(pageName==1)
                          {
                            router.push('/showtrip');
  
                          }else if(pageName==2)
                          {
                            router.push('/searchgoupmap');
  
                          }else if(pageName==3)
                          {
                            router.push('/settingmap');
  
  
                          }else if(pageName==4)
                          {
                            if (fabButton.value) {
                                    fabButton.value.$el?.click(); // Access the native element and trigger a click
                                  }
                           
                            moveCameraToHomeLocation(); // Move camera to home location for page 4
  
                          }else if(pageName==5)
                          {
                            router.push('/searchclosestland');
  
                          }else if(pageName==6)
                          {
                            router.push('/searchvehiclemap');
  
                          }if(pageName==7)
                          {
                            router.push('/searchland');
  
                          }
  
                };
  
  
  
  
            async function MapDisplay(){
                try {
                  await nextTick();
              if (mapContainer.value) {
  
                    const login_data= await storage.get("login_data");
  
  
                    // Retrieve stored zoom and center from localStorage
                    const storedZoom = localStorage.getItem('mapZoom');
                    const mapLat = localStorage.getItem('mapLat');
                    const mapLong = localStorage.getItem('mapLong');
                    const storedMapType = localStorage.getItem('mapType'); // Retrieve map type
  
  
                    const initialLat=mapLat ? parseFloat(mapLat) : parseFloat(login_data.h_lat);
                    const initialLong=mapLong ? parseFloat(mapLong) : parseFloat(login_data.h_lon);
  
  
                    // Parse zoom and center values from storage or set defaults
                    const initialZoom = storedZoom ? parseInt(storedZoom) : parseInt(login_data.zoom_lvl); // Default zoom to 12  
                    const initialCenter= { lat: initialLat, lng: initialLong }; // Default center coordinates
                    const initialMapType = storedMapType ? storedMapType : 'roadmap';
  
                    const loader = new Loader({
                    apiKey: Constants.Google_map_API,
                    version: "beta", // Ensure you're using the beta version for AdvancedMarkerElement
                    libraries: ['geometry', 'places'] // Include necessary libraries
                  });
  
  
                  loader.load().then(() => {
  
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
                  }).catch((e) => {
                          console.error('Error loading Google Maps API:', e);
                        });
                  
  
                    // Update the map type if it's stored in localStorage
                if (storedMapType) {
                  mapRef.value?.setMapTypeId(storedMapType);
                }
  
                    const storedGroupData = await storage.get(Constants.storageValue.Key_GroupAPI);
  
                    
  
                if (storedGroupData && storedGroupData.length > 0) {
                  // console.log("filteredGroupData",storedGroupData);
  
              
                          const storedGroups = await storage.get(Constants.storageValue.key_Map_GroupWithStatus);
  
                      // Filter the groups where 'checked' is true
                      const checkedGroups = storedGroups.filter((group: { checked: any; }) => group.checked);
  
  
                      // Filter storedGroupData to match only the checked groups
                      // const filteredGroupData = storedGroupData.filter((groupData: { group: any; }) => 
                      //   checkedGroups.some((checkedGroup: { group: any; }) => checkedGroup.group === groupData.group)
                        
                      // );
  
                      const filteredGroupData = storedGroupData.filter((groupData: { group: any; }) => {
                      // Find a matching entry in vehicleStatusColorData
                      const matchingStatus = checkedGroups.find((checkedGroup: { group: any; }) => 
                      checkedGroup.group === groupData.group 
                      );
                      
                      // Return true if a match is found, false otherwise
                      return matchingStatus !== undefined;
                    });
  
                  
  
  
                      // Collect vehicles from the filtered groups
                      selectedItems.value = filteredGroupData.flatMap((group: { veh_arr: any[]; }) =>
  
                      group.veh_arr.map((veh: {
                        rec_dt: any;
                        drv_name: any;
                        speed: any; veh_id: any; veh_no: any; veh_sts: any; sts_colr: any; lat: any; lon: any; sts_str: any; loc_str: any; status: any; 
  }) => ({
                          vehicleId: veh.veh_id,
                          vehicleName: veh.veh_no,
                          vehicleStatus: veh.veh_sts, // status for filtering
                          vehicleColor: veh.sts_colr,
                          lat: veh.lat,
                          lon: veh.lon,
                          sts_str: veh.sts_str,
                          loc_str: veh.loc_str,
                          status: veh.status,
                          rec_dt: veh.rec_dt,
                          drv_name : veh.drv_name,
                          speed : veh.speed
                        }))
                        
                      );
  
  
  
                }
  
                const vehicleStatusColorData = await storage.get('VehicleStatusColor');
  
               // console.log("vehicleStatusColorData",vehicleStatusColorData);
  
               
            
                const filteredVehicles = selectedItems.value.filter(item => {
                // Find a matching entry in vehicleStatusColorData
                const matchingStatus = vehicleStatusColorData.find((statusData: { id: any; isEnabled: boolean; }) => 
                  statusData.id === item.status && statusData.isEnabled === true
                );
                
                // Return true if a match is found, false otherwise
                return matchingStatus !== undefined;
              });
  
          
  
  
  
  
                              // Create custom controls for navigator and map icons
                              const controlContainer = document.createElement('div');
                            controlContainer.style.position = 'absolute';
                            controlContainer.style.right = '20px';
                            controlContainer.style.bottom = '100px'; // Adjust to position it below the zoom controls
                            controlContainer.style.display = 'flex';
                            controlContainer.style.gap = '10px'; // Add spacing between the icons
                            controlContainer.style.alignItems = 'center';
                            controlContainer.style.background = 'white'; // Optional: to match the background of the buttons
                            controlContainer.style.borderRadius = '5px'; // Optional: rounded corners
                            controlContainer.style.padding = '5px'; // Optional: add some padding
  
                            // Add the map icon
                            const mapControlDiv = document.createElement('div');
                            mapControlDiv.innerHTML = `
                              <button style="background: transparent; border: none;">
                                <img src="/pin.png" alt="Map" width="30" height="30">
                              </button>`;
                            mapControlDiv.style.display = 'none'; // Initially hidden
  
                            // Add the navigator icon
                            const navControlDiv = document.createElement('div');
                            navControlDiv.innerHTML = `
                              <button style="background: transparent; border: none;">
                                <img src="/navigation.png" alt="Navigator" width="30" height="30">
                              </button>`;
                            navControlDiv.style.display = 'none'; // Initially hidden
  
                            // Append the icons to the container
                            controlContainer.appendChild(navControlDiv);
                            controlContainer.appendChild(mapControlDiv);
  
                            // Append the container to the map controls
                            newMap?.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlContainer);
  
  
              //  console.log("filteredVehicles",filteredVehicles);
  
  
              filteredVehicles.forEach(async (vehicle) => {
              
  
  
                    const vehicleLat = parseFloat(vehicle.lat);
                    const vehicleLng = parseFloat(vehicle.lon);
                    const initialCenter = { lat: vehicleLat, lng: vehicleLng };
  
                    // Use the vehicle's color or default to red
                    const markerColor = vehicle.vehicleColor || '#FF0000'; // Use the 'sts_colr' field for marker color
  
  
                    // Create a custom marker icon
                    const markerIcon = {
                      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                      fillColor: markerColor,               // Use the vehicle status color
                      fillOpacity: 1,
                      strokeWeight: 0,
                      scale: 5,                             // Reduce the size by adjusting the scale (e.g., 5)
                    };
  
  
                    const markerId = new google.maps.Marker ({
                      position: initialCenter,
                      map: newMap,
                      icon: markerIcon,  // Set the custom icon
  
                    });
  
  
                     markersArray.value.push(markerId);
  
                      // Create a new google.maps.InfoWindow instance with default settings
  
                
                      const styleElement = document.createElement('style');
                          styleElement.textContent = `
                           
                                .gm-style .gm-style-iw-c{
                                   max-width: 100% !important;
                                }
  
                  
                                  .info-window[data-v-56b631a0] {
                                  width: 95vw;
                                  padding: 5px;
                                  background-color: #ffffff;
                                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                                  border-radius: 8px;
                              }
                                  .gm-ui-hover-effect {
                                     width: 30px !important; 
                                    height: 30px !important;
                                    right: 5px !important;
                                    top: 5px !important;
                                }
  
  
                              
                            }
  
  
                          `;
                          document.head.appendChild(styleElement);
  
                          const infoWindomarker = new google.maps.InfoWindow();
                          
                          infoWindomarker.addListener('domready', () => {
                          setTimeout(() => {
                            const iwContainer = document.querySelector('.gm-style-iw');
                            if (iwContainer) {
                              iwContainer.style.maxWidth = '100%';
                              iwContainer.style.padding = '0';
                              iwContainer.style.margin = '0';
  
                              iwContainer.style.boxSizing = 'border-box';
                            }
                          }, 100); // Adjust the delay as needed
                        });
  
  
                      const infoWindowContainer = document.createElement('div');
                            infoWindowContainer.style.margin = '0';
                            infoWindowContainer.style.padding = '0';
  
                            // Mount your Vue component into the container
                            const app = createApp(InfoWindowMapMarker, {
                              vehicleData: vehicle,
                              onShowPath: (vehicleData: { vehicleId: string; }) => {
                              

                                console.log('Show path for vehicle:', vehicleData);

                          fromDateTime.value = startOfDay(new Date(vehicleData.rec_dt)).toISOString();
                          toDateTime.value = new Date(vehicleData.rec_dt).toISOString();

                                console.log('fromtodate:', fromDateTime.value+" "+toDateTime.value);

                                 fromDateTimeFormatted.value = format(fromDateTime.value, 'dd/MM/yyyy HH:mm');
                                   toDateTimeFormatted.value = format(toDateTime.value, 'dd/MM/yyyy HH:mm');
                                selectedVehNo.value = vehicleData.vehicleId;
                                ishowPath.value = true;
                                isMarkerShowPath.value=true;
                                infoWindomarker.close(); // Close the InfoWindow on button click
                              }
                            });
  
                            app.mount(infoWindowContainer);
  
                            // Set the content and open the InfoWindow
                            infoWindomarker.setContent(infoWindowContainer);
  
  
                          
                            
                            let currentInfoWindow: google.maps.InfoWindow | null = null;
                            let currentNavControlDiv: HTMLDivElement | null = null;
                            let currentMapControlDiv: HTMLDivElement | null = null;
  
                  // Add click event to the marker to show info window
                  markerId.addListener('click', () => {
  
                       // console.log("marker click");
                       fromDateTimeFormatted.value='';
                       toDateTimeFormatted.value='';
                       isMapBusyWithRoute.value=false;
  
                       if(ishowPath.value)
                       {
                        ishowPath.value=false;
                        isMarkerShowPath.value=false;
                        closeShowPath(1);
                       }
  
                                    // Show the custom controls when the marker is clicked
                                    navControlDiv.style.display = 'block';
                                    mapControlDiv.style.display = 'block';
  
  
                                    currentNavControlDiv = navControlDiv;
                                    currentMapControlDiv = mapControlDiv;
  
  
                                    // Log latitude and longitude
                                    const lat = markerId.getPosition().lat();
                                    const lng = markerId.getPosition().lng();
                                   // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  
                                    // Add click event listeners to controls to perform desired actions
                                    navControlDiv.addEventListener('click', () => {
                                      window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                                    });
  
                                    mapControlDiv.addEventListener('click', () => {
                                      window.location.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                                    });
  
                    
                  
                   
  
                    infoWindomarker.open({
                          anchor: markerId,
                          map: newMap,
                        
                        });  
                        currentInfoWindow = infoWindomarker; // Update the reference
  
                        if (currentInfoWindow && currentInfoWindow !== infoWindomarker) {
                      currentInfoWindow.close();
                    }
  
                                                // Add a listener for when the info window is closed
                            infoWindomarker.addListener('closeclick', () => {
                              console.log("Info window closed");
  
                              // Hide or remove the custom controls
                              if (currentNavControlDiv) {
                                currentNavControlDiv.style.display = 'none';
                                currentNavControlDiv = null;
                              }
  
                              if (currentMapControlDiv) {
                                currentMapControlDiv.style.display = 'none';
                                currentMapControlDiv = null;
                              }
  
                              currentInfoWindow = null; // Reset the current info window reference
                            });
                      
                      });        
                });
  
  
                // If valid lat/lon are passed, move camera to that location
                if (!isNaN(vehicleLat) && !isNaN(vehicleLon) && parseFloat(vehicleLat) !== 0  &&
                 parseFloat(vehicleLon) !== 0) {
                  moveCameraToLocation(vehicleLat, vehicleLon,16);
                }
  
                if (historyarray.value.length > 0) {
                 // console.log('History Array:', historyarray.value);
                  isMapBusyWithRoute.value=true;
  
                  const waypoints = historyarray.value.map((item) => ({
                        location: { lat: item.lat, lng: item.lon },
                        stopover: true, // Set to true if these should be treated as stopovers
                      }));

                    //  console.log("Historyarray",historyarray.value.length+" "+waypoints.length);

                       

                           // processWaypoints(waypoints);

                          
                  processAnimation(2);
                } else {
                  isMapBusyWithRoute.value=false;
  
                 // console.log('History Array is empty or not available.');
                }
  
  
                const lat = localStorage.getItem("landmark_lat");
          const lng = localStorage.getItem("landmark_lng");
  
  
          if (lat && lng) {
            const parsedLat = parseFloat(lat);
            const parsedLng = parseFloat(lng);
  
           // console.log("searched_land",parsedLat+" "+parsedLng);
            moveCameraToLocation(parsedLat, parsedLng,10);
            localStorage.removeItem("landmark_lat");
            localStorage.removeItem("landmark_lng");
  
          }
        
          const Nearest_dirLat = localStorage.getItem("Near_landmark_lat");
            const Nearest_dirLon = localStorage.getItem("Near_landmark_lng");
            const NearesVeh=JSON.parse(localStorage.getItem("NearestVeh"));
           // console.log("displayjyoby",NearesVeh);
  
            if (Nearest_dirLat !== null && Nearest_dirLat.trim() !== "" && Nearest_dirLon !== null && Nearest_dirLon.trim() !== "") {
  
            getDirections(Nearest_dirLat,Nearest_dirLon,NearesVeh);
          }
        
  
          
          localStorage.removeItem("Near_landmark_lat");
            localStorage.removeItem("Near_landmark_lng");
            localStorage.removeItem("Near_landmark_address");
            localStorage.removeItem("NearestVeh");
        
  
                  } else {
                    console.error('Map element not found.');
                  }
                } catch (error) {
                  console.error('Error creating Google Map:', error);
                }
  
             
  
  
              };
  
             
            const moveCameraToLocation = (lat: string | string[], lon: string | string[],zoomno:number) => {
              // Move the camera to the latitude and longitude
            
              if (newMap) {
                  newMap.setCenter(new google.maps.LatLng(lat, lon));
                  newMap.setZoom(zoomno);
                } else {
                  console.error('Map not initialized');
                }
              };
          
            const getDirections = async (destLat: number, destLon: number, vehicleObject:object) => {
            if (!mapRef.value || !vehicleObject) {
                console.error('Map or vehicle object is not initialized');
                return;
            }
  
            Near_vehicleObject.value=vehicleObject;
            // Clear existing polyline if present
                if (polylineRef.value) {
                  polylineRef.value.setMap(null); // Remove the existing polyline from the map
                  polylineRef.value = null; // Clear the reference
                }
  
            const origin = { lat: vehicleObject.lat, lng: vehicleObject.lon };
            const destination = { lat: destLat, lng: destLon };
  
            const directionsServiceUrl = "https://maps.googleapis.com/maps/api/directions/json";
  
            try {
                const response = await axios.get(directionsServiceUrl, {
                    params: {
                        origin: `${origin.lat},${origin.lng}`,
                        destination: `${destination.lat},${destination.lng}`,
                        key: Constants.Google_map_API,
                    },
                });
  
               // console.log("Directions API Response", response.data);
  
                if (response.data.status === "OK" && response.data.routes.length > 0) {
                    const route = response.data.routes[0].overview_polyline.points;
                    const decodedPath = google.maps.geometry.encoding.decodePath(route);
  
                    // Log the decoded path
                   // console.log("Decoded Path:", decodedPath);
  
                    // Convert decoded path to the format required by Capacitor Google Maps (array of LatLng objects)
                    const polylinePoints = decodedPath.map(point => ({ lat: point.lat(), lng: point.lng() }));
  
                    if (decodedPath) {
                    polylineRef.value = new google.maps.Polyline({
                      path: decodedPath,
                      geodesic: true,
                      strokeColor: '#FF0000',
                      strokeOpacity: 1.0,
                      strokeWeight: 5,
                    });
  
                    polylineRef.value.setMap(mapRef.value); // Add the polyline to the map
  
                    isnearVehObject.value=true;
  
                    // Move the camera to the vehicle's location (if desired)
                    moveCameraToLocation(vehicleObject.lat, vehicleObject.lon, 16);
                  }
                } else {
                    console.error("No route found or status not OK");
                }
            } catch (error) {
                console.error("Error fetching directions:", error);
            }
              };
  
            // Function to move the camera to home location
            const moveCameraToHomeLocation = async () => {
              const login_data= await storage.get("login_data");
  
  
                          // Retrieve stored zoom and center from localStorage
                          const storedZoom = localStorage.getItem('mapZoom');
                          const mapLat = localStorage.getItem('mapLat');
                          const mapLong = localStorage.getItem('mapLong');
                          const storedMapType = localStorage.getItem('mapType'); // Retrieve map type
  
  
                          const initialLat=mapLat ? parseFloat(mapLat) : parseFloat(login_data.h_lat);
                          const initialLong=mapLong ? parseFloat(mapLong) : parseFloat(login_data.h_lon);
  
  
                          // Parse zoom and center values from storage or set defaults
                          const initialZoom = storedZoom ? parseInt(storedZoom) : parseInt(login_data.zoom_lvl); // Default zoom to 12  
                          const initialCenter= { lat: initialLat, lng: initialLong }; // Default center coordinates
                          const initialMapType = storedMapType ? storedMapType : 'roadmap';
  
              if (mapRef.value) {
                
  
                mapRef.value.setCenter(new google.maps.LatLng(initialCenter));
                mapRef.value.setZoom(initialZoom);
        
                
             //   console.log(`Camera moved to: (${initialLat}, ${initialLong}) with zoom ${initialZoom}`);
              } else {
                console.error('Map not initialized.');
              }
              };
  
            const CallOnlyAPI = () => {
  
              isnearVehObject.value=false;
              // Show loading controller
              loadingController.create({
                
                backdropDismiss: true // Makes the loading controller cancelable
              })
              .then(loading => {
                // Present the loading spinner
                loading.present();
  
                const params = {
                  grping: '2',
                };
  
                // Make the API call
                return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Group, params)
                  .then((response: { data: any; status: number }) => {
                    const responsejson = response.data;
  
                    if (response.status === 200) {
                      const arrData = responsejson.arr_data;
  
                      if (arrData && arrData.length > 0) {
                        items.value = arrData.map(
                          (
                            data: { name: any; total_count: any; veh_arr: any; sts_arr: any },
                            index: number
                          ) => ({
                            id: index + 1, // Unique ID
                            group: data.name, // Group name
                            total_count: data.total_count, // Total vehicles
                            veh_arr: data.veh_arr,
                            sts_arr: data.sts_arr,
                          })
                        );
  
                        const newItems = items.value;
  
                        // Retrieve existing data from storage
                        return storage
                          .get(Constants.storageValue.Key_GroupAPI)
                          .then((storedGroupData: never[]) => {
                            return storage
                              .get(Constants.storageValue.key_VehicleDetails)
                              .then((storedVehDetails: never[]) => {
                                storedGroupData = storedGroupData || [];
                                storedVehDetails = storedVehDetails || [];
  
                                // Check if data needs to be updated
                                const isDataChanged =
                                  JSON.stringify(storedGroupData) !== JSON.stringify(newItems);
  
                                  if (isDataChanged) {
  
  
                                        return storage
                                                    .set(Constants.storageValue.Key_GroupAPI, newItems)
                                                    .then(async () => {
  
                                                      const storedGroups = await storage.get(Constants.storageValue.key_GroupWithStatus) || [];
  
                                                        const storedGroupsEvent = new Map(
                                                          storedGroups.map((group: { group: any; groupId: any; }) => [`${group.group}-${group.groupId}`, group])
                                                        );
  
                                                                                        // Create an updated array by iterating over arrData and merging with storedGroups if applicable.
                                                  const groupStatusEventItems = arrData.map((data: { name: any; id: any; }) => {
                                                    const key = `${data.name}-${data.id}`;  
                                                    if (storedGroupsEvent.has(key)) {
                                                      // If a match is found, use the stored group but ensure it has the required structure.
                                                      return {
                                                        ...storedGroupsEvent.get(key),
                                                      };
                                                    } else {
                                                      // If no match, create a new group status item with default values.
                                                      return {
                                                        group: data.name,
                                                        groupId: data.id,
                                                        status: 1, // Initial status set to 1
                                                        checked: true
                                                      };
                                                    }
  
                                                  });
  
                                                  const storedGroups_map = await storage.get(Constants.storageValue.key_Map_GroupWithStatus) || [];
  
                                                  const storedGroupsMap = new Map(
                                                    storedGroups_map.map((group: { group: any; groupId: any; }) => [`${group.group}-${group.groupId}`, group])
                                                  );
  
                                                  const groupStatusMapItems = arrData.map((data: { name: any; id: any; }) => {
                                                    const key = `${data.name}-${data.id}`;                                  
                                                    if (storedGroupsMap.has(key)) {
                                                      // If a match is found, use the stored group but ensure it has the required structure.
                                                      return {
                                                        ...storedGroupsMap.get(key),
                                                      };
                                                    } else {
                                                      // If no match, create a new group status item with default values.
                                                      return {
                                                        group: data.name,
                                                        groupId: data.id,
                                                        status: 1, // Initial status set to 1
                                                        checked: true
                                                      };
                                                    }
  
                                                  });
  
  
                                                  const storedGroups_fuel = await storage.get(Constants.storageValue.key_Fuel_GroupWithStatus) || [];
  
                                                      const storedGroupsFuel = new Map(
                                                        storedGroups_fuel.map((group: { group: any; groupId: any; }) => [`${group.group}-${group.groupId}`, group])
                                                      );
  
                                                  const groupStatusFuelItems = arrData.map((data: { name: any; id: any; }) => {
                                                    const key = `${data.name}-${data.id}`;                                  
                                                    if (storedGroupsFuel.has(key)) {
                                                      // If a match is found, use the stored group but ensure it has the required structure.
                                                      return {
                                                        ...storedGroupsFuel.get(key),
                                                      };
                                                    } else {
                                                      // If no match, create a new group status item with default values.
                                                      return {
                                                        group: data.name,
                                                        groupId: data.id,
                                                        status: 1, // Initial status set to 1
                                                        checked: true
                                                      };
                                                    }
  
                                                  });
  
                                            // Store the group and status data
                                            return storage.set(Constants.storageValue.key_GroupWithStatus, groupStatusEventItems)
                                              .then(() => storage.set(Constants.storageValue.key_Fuel_GroupWithStatus, groupStatusFuelItems))
                                              .then(() => storage.set(Constants.storageValue.key_Map_GroupWithStatus, groupStatusMapItems)) // Add this line for Map
                                              .then(async () => {
  
                                                // Create and store vehicle details data
                                                const vehicleDetails = arrData.flatMap((data: { veh_arr: any[]; }) =>
                                                  data.veh_arr.map((veh: { veh_id: any; veh_no: any; veh_sts: any; sts_colr: any; }) => ({
                                                    vehid: veh.veh_id,
                                                    vehname: veh.veh_no,
                                                    vehstatus: veh.veh_sts,
                                                    vehColor: veh.sts_colr,
                                                    status: 1,
                                                  }))
                                                );
  
  
                                                // Compare existing vehicle details data with the new one
                                                const isVehDetailsChanged = JSON.stringify(storedVehDetails) !== JSON.stringify(vehicleDetails);
  
                                                if (isVehDetailsChanged) {
  
                                                const event_veh = await storage.get(Constants.storageValue.key_VehicleDetails) || [];
  
                                                          const storedEventVeh = new Map(
                                                            event_veh.map((vehicle: { vehid: any; vehname: any; }) => [`${vehicle.vehid}-${vehicle.vehname}`, vehicle])
                                                          );
  
                                                      // Create new or updated vehicle details
                                                      const vehicleDetailsEvent = arrData.flatMap((data: { veh_arr: any[]; }) => 
                                                        data.veh_arr.map((veh: { veh_id: any; veh_no: any; veh_sts: any; sts_colr: any; }) => {
                                                          const key = `${veh.veh_id}-${veh.veh_no}`;
                                                          if (storedEventVeh.has(key)) {
                                                            // If a match is found, use the stored vehicle but ensure it has the required structure.
                                                            return {
                                                              ...storedEventVeh.get(key)
                                                            };
                                                          } else {
                                                            // If no match, create a new vehicle detail with default values.
                                                            return {
                                                              vehid: veh.veh_id,
                                                              vehname: veh.veh_no,
                                                              vehstatus: veh.veh_sts,
                                                              vehColor: veh.sts_colr,
                                                              status: 1 // Initial status set to 1
                                                            };
                                                          }
                                                        })
                                                      );
  
  
  
                                                          const fuel_veh = await storage.get(Constants.storageValue.key_Fuel_VehicleDetails) || [];
  
                                                          const storedVehFuel = new Map(
                                                            fuel_veh.map((vehicle: { vehid: any; vehname: any; }) => [`${vehicle.vehid}-${vehicle.vehname}`, vehicle])
                                                          );
  
                                                                                              // Create new or updated vehicle details
                                                      const vehicleDetailsFuel = arrData.flatMap((data: { veh_arr: any[]; }) => 
                                                        data.veh_arr.map((veh: { veh_id: any; veh_no: any; veh_sts: any; sts_colr: any; }) => {
                                                          const key = `${veh.veh_id}-${veh.veh_no}`;
                                                          if (storedVehFuel.has(key)) {
                                                            // If a match is found, use the stored vehicle but ensure it has the required structure.
                                                            return {
                                                              ...storedVehFuel.get(key)
                                                            };
                                                          } else {
                                                            // If no match, create a new vehicle detail with default values.
                                                            return {
                                                              vehid: veh.veh_id,
                                                              vehname: veh.veh_no,
                                                              vehstatus: veh.veh_sts,
                                                              vehColor: veh.sts_colr,
                                                              status: 1 // Initial status set to 1
                                                            };
                                                          }
                                                        })
                                                      );
  
  
                                                  return storage.set(Constants.storageValue.key_VehicleDetails, vehicleDetailsEvent)
                                                    .then(() => storage.set(Constants.storageValue.key_Fuel_VehicleDetails, vehicleDetailsFuel));
                                                }
  
                                                return Promise.resolve(); // No change in vehicle details
                                              });
                                          });
                                        }
  
                                return Promise.resolve(); // No change in group data
                              });
                          });
                      }
                    } else if (response.status === 401) {
                      console.error('Unauthorized:', responsejson.message);
                    } else {
                      console.error('Empty response data');
                    }
                  })
                  .catch((error: any) => {
                    console.error('Error:', error);
                  })
                  .finally(() => {
                    // Dismiss the loading spinner after the API call finishes
                    loading.dismiss();
                  });
              })
              .catch(error => {
                console.error('Error creating loading:', error);
              });
              };
  
  
              const processAnimation=(fromwhere)=>{
  
                if(fromwhere===1)
              {
                isMarkerShowPath.value=true;
              }
  
                ishowPath.value=true;
                isLoadPath.value=true;
  
  
              isSumTripObject.value=true;
              isSummaryChecked.value=true;
              isTripInfoChecked.value=true;
               // maxValue.value = historyarray.value.length;
  
  
                  // Extract origin (0th index)
                  const origin = {
                    lat: historyarray.value[0].lat,
                    lng: historyarray.value[0].lon,
                  };
  
                  // Extract destination (last index)
                  const destination = {
                    lat: historyarray.value[historyarray.value.length - 1].lat,
                    lng: historyarray.value[historyarray.value.length - 1].lon,
                  };
  
  
  
                  // // Extract waypoints (elements between 0th and last index)
                  // const waypoints = historyarray.value.slice(0, historyarray.value.length+1).map((point) => ({
                  //   location: { lat: point.lat, lng: point.lon },
                  //   stopover: true,
                  // }));
  
                 
  
  
  
                  markerId1 = new google.maps.Marker ({
                  position: origin,
                  map: newMap,
                  icon: {
                          url: "/ic_end.png", // Path to the icon
                          scaledSize: new google.maps.Size(25, 25) // Adjust width and height
                        }              
                      
                    });
  
  
                  markerId2 = new google.maps.Marker ({
                  position: destination,
                  map: newMap,
                        icon: {
                            url: "/ic_st.png", // Path to the icon
                            scaledSize: new google.maps.Size(25, 25) // Adjust width and height
                          }
                  });
  
  
                  markersArray.value.push(markerId1);
                  markersArray.value.push(markerId2);
  
  
                  newMap?.setCenter(new google.maps.LatLng(origin));
                  newMap?.setZoom(14);
  
  
                  markerMovingIcon = new google.maps.Marker({
                      map: newMap,
                      icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 3.5,
                        strokeColor: "#FF0000",
                      },
                    });
  
                    polylinePathsForShowPath.value = new google.maps.Polyline({
                      path: [],
                      geodesic: true,
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.7,
                      strokeWeight: 2.5,
                      map: newMap,
                    });
  
  
  
                  directionsService.value = new google.maps.DirectionsService();
  
  
                        //  fetchRoute(origin, destination, waypoints);
                      // processWaypoints(origin, destination, waypoints);
  
                  for (let i = 0; i < historyarray.value.length; i++) 
                  {
  
                      const s1 ={lat:historyarray.value[i].lat,lng:historyarray.value[i].lon}
  
  
                      let dot_marker;
                      if(historyarray.value[i].event_type===Constants.eventType.Event_Type_Stopped ||
                      historyarray.value[i].event_type===Constants.eventType.Event_Type_Idel)
                      {
  
                        dot_marker = new google.maps.Marker({
                          position: s1,
                          map: newMap,
  
                          icon: {
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 4,
                              strokeColor: '#ff0000',
                              fillColor: '#ff0000',
                              fillOpacity: 0.8, // Adjust the fill opacity (0.0 to 1.0)
                              strokeWeight: 1, // Adjust the border thickness
                              rotation: 0 // Will be dynamically updated
                            }
                        });
                      }else  if(historyarray.value[i].event_type===Constants.eventType.Event_Type_NoData ||
                      historyarray.value[i].event_type===Constants.eventType.Event_Type_IG_OFF_NoGPS ||
                      historyarray.value[i].event_type===Constants.eventType.Event_Type_IG_ON_NoGPS
                    )
                                  {
                              
                                    dot_marker = new google.maps.Marker({
                                      position: s1,
                                      map: newMap,
                              
                                      icon: {
                                          path: google.maps.SymbolPath.CIRCLE,
                                          scale: 4,
                                          strokeColor: '#999999',
                                          fillColor: '#999999', // Set the fill color
                                          fillOpacity: 0.8, // Adjust the fill opacity (0.0 to 1.0)
                                          strokeWeight: 1, // Adjust the border thickness
                                          rotation: 0 // Will be dynamically updated
                                        }
                                    });
                                  }else{
                      // Place marker at current point with dot icon
                                            dot_marker = new google.maps.Marker({
                                              position: s1,
                                              map: newMap,
                                      
                                              icon: {
                                                  path: google.maps.SymbolPath.CIRCLE,
                                                  scale: 4,
                                                  strokeColor: '#999999',
                                                  fillColor: '#999999',
                                                  fillOpacity: 0.8, // Adjust the fill opacity (0.0 to 1.0)
                                                  strokeWeight: 1, // Adjust the border thickness
                                                  rotation: 0 // Will be dynamically updated
                                                }
                                            });                             

                                   }
        
  
        const infoWindow = new google.maps.InfoWindow();
  
        
                // Create a new div to mount your Vue component
                const infoWindowContainer = document.createElement('div');
  
            infoWindowContainer.style.margin = '0';            // Remove margins
            infoWindowContainer.style.padding = '0';           // Remove padding
  
  
                // Use Vue's createApp to mount the InfoBox component inside the div
                const app = createApp(InfoWindowDorMarker, 
                { 
                  vehicleData: historyarray.value[i],
                
                });
              
                app.mount(infoWindowContainer);
  
  
              
                // Set the infoWindow's content to the container with the Vue component
                infoWindow.setContent(infoWindowContainer);
  
  
   
                // Add click event to the marker to show info window
                dot_marker.addListener('click', () => {
  
                  infoWindow.open(newMap, dot_marker);
  
                  // Automatically close InfoWindow after 3 seconds (3000ms)
                  setTimeout(() => {
                    infoWindow.close();
                  }, 3000); // Adjust the closing time as needed
                  
               });
  
  
                  //  markersDotsArray.value.push(dot_marker);
                 
                  markersDotsArray.push(dot_marker);
  
  
                    }
  
                    // console.log("markersDotsArray",markersDotsArray.length);
                   
                   
                   
  
  
              };
  
              const CallTripPath=async()=>{
                loadingController.create({
                
                backdropDismiss: false // Makes the loading controller cancelable
              })
              .then(loading => {
                // Present the loading spinner
                loading.present();
  
  
  
                const fromdateString = fromDateTimeFormatted.value;
              const todateString = toDateTimeFormatted.value;
  
             // console.log(fromdateString+" "+todateString);
              const [day1, month1, year1, hour1, minute1] = fromdateString.match(/\d+/g); // Extract date and time parts
              const [day2, month2, year2, hour2, minute2] = todateString.match(/\d+/g); // Extract date and time parts
  
  
              // Create a Date object with parsed values (months are zero-indexed in JavaScript Dates)
              const fromdateObject = new Date(year1, month1 - 1, day1, hour1, minute1);
              const todateObject = new Date(year2, month2 - 1, day2, hour2, minute2);
  
              const FromepochTime = Math.floor(fromdateObject.getTime() / 1000); // Convert to seconds
              const ToepochTime = Math.floor(todateObject.getTime() / 1000); // Convert to seconds
  
  
             // console.log(FromepochTime+" "+ToepochTime);
  
                const params = {
                  veh_id: selectedVehNo.value,
                  fdate: FromepochTime,
                  edate: ToepochTime,
  
                  
                };
  
                // Make the API call
                return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_trip_path, params)
                  .then(async (response: { data: any; status: number }) => {
                    const responsejson = response.data;
  
                    if (response.status === 200) {
  
                      isMapBusyWithRoute.value=true;
                    
                      if(responsejson.arr_data && responsejson.arr_data.length>1)
                       {
                       
                // Odometer values
                const odometerLast = parseInt(responsejson.arr_data[responsejson.arr_data.length - 1].odometer);
                const odometerFirst = parseInt(responsejson.arr_data[0].odometer);
                const start_loc = responsejson.arr_data[0].location;
                const end_loc = responsejson.arr_data[responsejson.arr_data.length - 1].location;
  
                const distance = ((odometerLast - odometerFirst) / 1000).toFixed(1);
  
                // Dates and times
                const lastDate = `${responsejson.arr_data[responsejson.arr_data.length - 1].rtcdate} ${responsejson.arr_data[responsejson.arr_data.length - 1].rtctime}`;
                const firstDate = `${responsejson.arr_data[0].rtcdate} ${responsejson.arr_data[0].rtctime}`;
  
                const format = "yyyy-MM-dd HH:mm:ss"; // Date format
  
  
               
  
                // Calculate time difference
                const calculateDuration = (start: string, end: string) => {
  
                             // console.log("dattime",start+" "+end);
              // Convert string dates to actual Date objects
              const startDate = new Date(start.split('-').reverse().join('-'));
                const endDate = new Date(end.split('-').reverse().join('-'));
  
                // Get the difference in milliseconds
                const diffMs = endDate - startDate;
  
                            
                  // Calculate days, hours, minutes, and seconds
                  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
                  // Format the result
                  let result = '';
  
                  if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
                  if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''}, `;
  
                  if (minutes > 0) {
                    result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
                  } else if (seconds > 0) {
                    result += `${seconds} second${seconds > 1 ? 's' : ''}`;
                  }
  
                  return result;
  
                };
  
                // Calculate duration
                const duration = calculateDuration(firstDate, lastDate);
  
  
                const ConvertSecondToHHMMSSString=(nSecondTime: string | number)=>{
                   // Calculate hours, minutes, and seconds
                const h = Math.floor(nSecondTime / 3600);
                const m = Math.floor((nSecondTime % 3600) / 60);
                const s = nSecondTime % 60;
  
                // Format each part
                const sh = h > 0 ? `${h} h` : '';
                const sm = m > 0 ? `${h > 0 && s === 0 && m < 10 ? '0' : ''}${m} m` : '';
                const ss = s === 0 && (h > 0 || m > 0)
                    ? ''
                    : `${(s < 10 && (h > 0 || m > 0)) ? '0' : ''}${s} s`;
  
                // Combine the parts with appropriate spacing
                return `${sh}${h > 0 ? ' ' : ''}${sm}${m > 0 ? ' ' : ''}${ss}`.trim();
                };
  
                  // Function to return event status message based on event type
                  const getEventStatus = (event_type: string,status: string,speed: string | number,stoppage: string) => {
  
                   // console.log("vehicleJyo",event_type);
  
                    if (event_type === Constants.eventType.Event_Type_Moving) {
                      return `${status} at ${speed} Km/h`;
                    } else {
                      return `${status} for ${ConvertSecondToHHMMSSString(stoppage)}`;
                    }
                  };
  
         
                  historyarray.value=[];
  
                    historyarray.value = responsejson.arr_data
                        .filter((item: { lat: string; lon: string }) => item.lat && item.lon) // Filter out invalid lat/lon
                        .map((item: { rec_id: any; lat: string; lon: string; location: any; speed: string; veh_no: any; rtcdate: any; rtctime: any; driver_name: any; event_type: string; label: string; stoppage_dur: string }) => ({
                          recId: item.rec_id,
                          lat: parseFloat(item.lat),
                          lon: parseFloat(item.lon),
                          location: item.location,
                          speed: parseInt(item.speed, 10),
                          vehNo: item.veh_no,
                          rtcDate: item.rtcdate,
                          rtcTime: item.rtctime,
                          driverName: item.driver_name,
                          distance: distance,
                          duration: duration,
                          start_loc: start_loc,
                          end_loc: end_loc,
                          driver_name: item.driver_name,
                          event_type: item.event_type,
                          label: item.label,
                          stoppage: item.stoppage_dur,
                          event_status: getEventStatus(item.event_type, item.label, parseInt(item.speed, 10), item.stoppage_dur),
                        }));
                      

                        const waypoints = historyarray.value.map((item) => ({
                        location: { lat: item.lat, lng: item.lon },
                        stopover: true, // Set to true if these should be treated as stopovers
                      }));

                    //  console.log("Historyarray",historyarray.value.length+" "+waypoints.length);

                        loadingController.create({
                          backdropDismiss: false // Makes the loading controller cancelable
                        })
                        .then(async loading => {
                          loading.present();

                          // await processWaypoints(waypoints);

                            loading.dismiss();
                      
                    })
                    

                        closeShowPath(2);
  
                       
                            processAnimation(1);
  
                          }else if(responsejson.arr_data.length===1)
                          {
                            showToastMessage("Start and end location getting same.");
                          }
  
                      
                 } else if (response.status === 401) {
                      console.error('Unauthorized:', responsejson.message);
                    } else {
                      console.error('Empty response data');
                    }
                  })
                  .catch((error: any) => {
                    console.error('Error:', error);
                  })
                  .finally(() => {
                    // Dismiss the loading spinner after the API call finishes
                    loading.dismiss();
                  });
              })
              .catch(error => {
                console.error('Error creating loading:', error);
              });
          };
  
                         
            const intervalCallback1Min = async () => {
                // console.log("Interval callback triggered For Map!");
                const currentRoute = router.currentRoute.value;
  
                const isLoggedIn = await storage.get('IsLoginAlready');
                  if (isLoggedIn) {
  
                    const status = await Network.getStatus();
                    if (currentRoute.name === 'map'){
                        if (status.connected) {
                          if(!isMapBusyWithRoute.value){
                            CallOnlyAPI();
                          }
                        } else {
                          showToast();
                        }
                  }
                }else{
                  stopInterval1Min();
                }
              };
  
     
      export { intervalCallback1Min,intervalRunning1Min };
  
  
  </script>
  
  
  