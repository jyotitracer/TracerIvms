<!-- This Page is menu Map  Page. -->
<template>
<ion-content class="safe-bottom" >
    <!-- Attach the ref to the map container -->
    
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
  
    <!-- 🔘 Button to open popup -->

        <!-- FAB BUTTON -->
<ion-fab slot="fixed" vertical="bottom" horizontal="start" style="bottom: 30px;">
  <ion-fab-button @click="toggleFab">
        <ion-icon :icon="fabIcon" style="color: white;"></ion-icon>

  </ion-fab-button>
</ion-fab>



      
  

    
<div class="fab-popup" :class="{ open: isFabOpen }">

        <!-- Show Trip -->
        <div class="menu-item active" @click="navigateToPage('1')">
          <ion-icon :icon="mapOutline"></ion-icon>
          <span>Show Trip</span>
        </div>

        <!-- Select Group -->
        <div class="menu-item active" @click="navigateToPage('2')">
          <ion-icon :icon="peopleOutline"></ion-icon>
          <span>Select Group</span>
        </div>


           <!-- Settings -->
        <div class="menu-item active" @click="navigateToPage('3')">
          <ion-icon :icon="settingsOutline"></ion-icon>
          <span>Settings</span>
        </div>
        
        <!-- Home -->
        <div class="menu-item active" @click="navigateToPage('4')">
          <ion-icon :icon="homeOutline"></ion-icon>
          <span>Home Location</span>
        </div>

        <!-- Home -->
        <div class="menu-item active" @click="navigateToPage('5')">
          <ion-icon :icon="searchOutline"></ion-icon>
          <span>Search Closest Vehicle From Landmark</span>
        </div>

         <!-- Home -->
        <div class="menu-item active" @click="navigateToPage('6')">
          <ion-icon :icon="carOutline"></ion-icon>
          <span>Search Vehicle</span>
        </div>


        <!-- Search Vehicle -->
        <div class="menu-item active" @click="navigateToPage('7')">
          <ion-icon :icon="locationOutline"></ion-icon>
          <span>Search Landmark</span>
        </div>
    </div>


        
  
        <!-- <ion-fab slot="fixed" vertical="bottom" horizontal="start" style="bottom: 30px;">
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
      </ion-fab> -->
      
    </div>
  
  
      <!-- show trip  -->
  
  <div class="filter-section" v-if="ishowPath" >
  
    <ion-icon :icon="closeCircle" style="color: white; margin-bottom: 10px;" 
    class="close-icon" @click="closeShowPath(1)"></ion-icon>
  
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
        <ion-button
         @click="togglePlayPause"
          class="play-pause-icon"
          :disabled="!canPlay">

             <ion-icon :icon="isPlaying ? pauseIcon : playIcon" style="color: white;"></ion-icon>

          </ion-button> 
        </div>   
        <div class="second-div">
  
          <div class="label-and-range">
            <ion-label style="width: 60px;   color: #006837; font-size: 14px; font-weight: 600;">Progress</ion-label>
  
         
        

            <ion-range
                  :key="routePoints.length"
                  class="progress-bar"
                  :min="0"
                  step="1"
                  :max="Math.max(routePoints.length - 1, 0)"
                  v-model="animationProgress"
                  @ionChange="updateAnimationProgress"
                />
          </div>
  
          <div class="label-and-range">
            <ion-label style="width: 60px; color: #006837; font-size: 14px; font-weight: 600;">Speed</ion-label>
           
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
          <ion-label style="margin-right: 5px; color: #006837; font-size: 14px; font-weight: 600;">Summary</ion-label>
          <ion-checkbox v-model="isSummaryChecked" style="margin-top: 10px;"/>
  
          <!-- Trip Information Checkbox below Summary -->
          <div class="trip-info">
            <ion-label style="margin-right: 5px; color: #006837; font-size: 14px; font-weight: 600;">Trip Info</ion-label>
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
                    presentation="date-time"
                    locale="en-GB"
                    :max="currentDateTime"
                    @ionChange="updateDateTime"
                  />
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
/* 🔥 Top-right (end) */
.closeicon {
  position: absolute;
  right: 10px;   /* 👉 end of screen */
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 24px;
  color: var(--ion-color-primary);
  z-index: 10;
  cursor: pointer;
}
ion-fab-button {
  --background: #006b47;
  --background-hover: #00875A;
  --box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);
}

.fab-popup {
  position: fixed;
  bottom: 90px; /* above FAB */
  left: 16px;
  width: 260px;

  background: white;
  border-radius: 16px;
  padding: 12px;

  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);

  transform: translateY(20px) scale(0.9);
  opacity: 0;
  pointer-events: none;

  transition: all 0.25s ease;
  z-index: 999;
}

/* 🔥 Open animation */
.fab-popup.open {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}


/* Menu Item */
.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 50px;

  padding: 12px;
  border-radius: 12px;
  margin-bottom: 4px;

  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  color: #021f29;
  transition: background 0.2s ease;
}

.menu-item ion-icon {
  font-size: 20px;
  color: #535f66;
}

/* Hover */
.menu-item:hover {
  background: #e6f6ff;
  color: #006b47;
}

.menu-item:hover ion-icon {
  color: #006b47;
}

/* Active */
.menu-item.active {
  background: #e6f6ff;
  color: #006b47;
  font-weight: bold;
}

.menu-item.active ion-icon {
  color: #006b47;
}

/* Divider */
.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 10px 0;
}


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

  }
  
  .modelclass{
     border-radius: 20px 20px 0 0;
      margin: 5px;
   box-shadow: 0 -4px 16px rgba(0,0,0,0.15);
  }
  
  .map-container {
  height: calc(100%); /* adjust 120px for controls */
}

  
  
  .full-screen-map {
      height: 100%; 
 /* Full screen height when isShowPath is false */
  }
  
  .filter-section {
    background-color: #4d4d4d;
    position: relative;
    z-index: 5;
    margin-top: 5px;
      background-color: #4d4d4d;

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
    color:#00875A;
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
  
  
  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .custom-datetime {
    --ion-text-color: #000;
    --ion-background-color: var(--ion-background-color);
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
     --background:#00875A;

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
     --background:#00875A;

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

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonLabel,
  loadingController,
  IonProgressBar,
  IonRange,
  IonCheckbox,
  useBackButton,
  IonButton,
  IonModal,
  IonDatetime,
  IonGrid,
  IonCol,
  IonItem,
  IonRow
} from '@ionic/vue';

import {
  chevronUpCircle,
  colorPalette,
  globe,
  playCircle,
  pauseCircle,
  star,
  close,
  closeCircle,
  mapOutline,
  peopleOutline,
  home,
  homeOutline,
  settingsOutline,
  carOutline,
  searchOutline,
  locationOutline,
  closeOutline,
  add,
  
} from 'ionicons/icons';

import router from '@/router/index';
import { MapIntervalRefresh, stopInterval1Min } from '@/services/MaprefreshService';

import {
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  watch
} from 'vue';

import Constants from '@/common/constants';
import { fetchData } from '@/services/ApiService';
import storage from '@/services/storagefile';

import { Network } from '@capacitor/network';
import { useRoute } from 'vue-router';

import { showToast, showToastMessage } from '@/services/toast';

import axios from 'axios';
import { Loader } from "@googlemaps/js-api-loader";

import InfoWindowMapMarker from '@/components/InfoWindowMapMarker.vue';
import InfoWindowDorMarker from '@/components/InfoWindowDotMarker.vue';

import { createApp } from 'vue';

import { format, startOfDay, formatISO } from 'date-fns';
import * as tz from "date-fns-tz";

import { selectedPage } from '@/services/userstate';
import { loadGoogleMaps } from '@/services/googleMapsLoader';
// State
    const isFabOpen = ref(false);
    const fabIcon = ref(add);

    const  toggleFab = () => {
      isFabOpen.value = !isFabOpen.value;
      fabIcon.value = isFabOpen.value ? close : add; // Update icon based on FAB state
    };


/* ===========================
   REFS & STATE VARIABLES
=========================== */

const selectedVehNo = ref('');
const currentIndex = ref(0);

const selectedItems = ref([]);

const mapRef = ref<google.maps.Map | null>(null);
let newMap: google.maps.Map | null = null;
let mapControlDiv: HTMLDivElement | null = null;
let navControlDiv: HTMLDivElement | null = null;

const mapContainer = ref<HTMLElement | null>(null);
const markersArray = ref<google.maps.Marker[]>([]);
let polylineRef: google.maps.Polyline | null = null;

let vehicleLat: string | number | string[];
let vehicleLon: string | number | string[];

const Near_vehicleObject = ref(null);
const isnearVehObject = ref(false);

const isSumTripObject = ref(false);
const markersDotsArray: (never[] | google.maps.Marker)[] = [];
const showPathOverlays: any[] = [];

let currentInfoWindow = null;

const isMapBusyWithRoute = ref(false);

const items = ref([]);
const historyarray = ref([]);

let markerMovingIcon: google.maps.Marker | null;
let markerId1: google.maps.Marker | null;
let markerId2: google.maps.Marker | null;


/* ===========================
   INTERVAL / FLAGS
=========================== */

const intervalRunning1Min = ref(false);

const showData = ref(false);
const vehicleNo = ref('QATAR101849');
const distance = ref(36.8);


/* ===========================
   DATE TIME CONTROLS
=========================== */

const isFromPickerVisible = ref(false);
const isToPickerVisible = ref(false);

const isDateTimeValid = ref(true);

const ishowPath = ref(false);
const isMarkerShowPath = ref(false);
const isLoadPath = ref(false);

const fromDateTime = ref('');
const toDateTime = ref('');

const currentDateTime = ref('');

const fromDateTimeFormatted = ref('');
const toDateTimeFormatted = ref('');

const isDateTimePickerVisible = ref(false);
const selectedDateTime = ref(null);
const dateType = ref(null);


/* ===========================
   PLAYER CONTROLS
=========================== */

const playIcon = playCircle;
const pauseIcon = pauseCircle;

const isPlaying = ref(false);
const canPlay = ref(false);

const progressValue = ref(0);
const speedValue = ref(5);


/* ===========================
   ROUTE & ANIMATION
=========================== */

let polylinePathsForShowPath: google.maps.Polyline | null = null;

const routePoints = ref([]);
const middleMarkers = ref([]);

const animationIndex = ref(0);
const animationTimer = ref();

const animationSpeed = ref(220); // default speed level 5 = 220ms per step
const animationProgress = ref(0);

const index_route_array = ref([]);


/* ===========================
   CHECKBOX CONTROLS
=========================== */

const isSummaryChecked = ref(true);
const isTripInfoChecked = ref(true);


/* ===========================
   FAB / INTERVAL
=========================== */

let interval = 0;
const fabButton = ref(null);

const userTimeZone = ref('Asia/Kolkata');

    let isFirstTimeDataCall = true;  


    export default {
  components: {
    IonContent,
    IonFab,
    IonFabButton,
    IonFabList,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonLabel,

    InfoBoxNearestVeh,
    InfoBoxSummaryTrip,
    InfoWindowMapMarker,
    InfoWindowDorMarker,

    IonButton,
    IonModal,
    IonDatetime,
    IonGrid,
    IonCol,
    IonItem,
    IonRow,
    IonProgressBar,
    IonRange,
    IonCheckbox
  },

  computed: {
    mapFabContainerHeight() {
      let height = "100%";

      if (ishowPath.value) {
        if (isMarkerShowPath.value) {
          height = `calc(${height} - 70px)`;
        }
      }

      if (isLoadPath.value) {
        if (isMarkerShowPath.value) {
          height = `calc(${height} - 85px)`;
        } else {
          height = `calc(${height} - 120px)`;
        }
      }

      return height;
    },

    playPauseSection() {
      if (isMarkerShowPath.value) {
        return `calc(85px)`;
      } else {
        return `calc(120px)`;
      }
    }
  },

  setup() {
    const route = useRoute();

    vehicleLat = route.params.vehLat;
    vehicleLon = route.params.vehLon;

    historyarray.value = [];
    historyarray.value = route.params.arrayData
      ? JSON.parse(route.params.arrayData)
      : [];
    if (historyarray.value.length > 0) {
      ishowPath.value = true;
    }

    /* ===========================
       DATE FORMAT FUNCTION
    =========================== */

    const formatDateToString = (date, timeZone) => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).formatToParts(date);

      const lookup: any = {};

      parts.forEach((p) => {
        lookup[p.type] = p.value;
      });

      return `${lookup.year}-${lookup.month}-${lookup.day}T${lookup.hour}:${lookup.minute}:${lookup.second}`;
    };

    /* ===========================
       WATCHERS
    =========================== */

    watch(
      () => routePoints.value.length,
      (newLen) => {
        if (newLen > 0) {
          animationProgress.value = 0;
        }
      }
    );

    watch(
      () => route.params.arrayData,
      async (newArrayData) => {
        if (newArrayData && typeof newArrayData === 'string' && newArrayData !== '[]') {
          try {
            historyarray.value = JSON.parse(newArrayData);
            if (historyarray.value && historyarray.value.length > 0) {
              isMapBusyWithRoute.value = true;
              canPlay.value = false;
              const loading = await loadingController.create({
                message: 'Please Wait',
                spinner: 'circles',
              });
              await loading.present();
              await processAnimation(2);
              canPlay.value = true;
              await loading.dismiss();
            }
          } catch (err) {
            console.error("Error parsing arrayData from route:", err);
          }
        }
      }
    );

    /* ===========================
       LIFECYCLE - MOUNT
    =========================== */

    onMounted(async () => {
      const login_data = await storage.get("login_data");
      userTimeZone.value = login_data.tz_idfier;

      currentDateTime.value = formatDateToString(
        new Date(),
        userTimeZone.value
      );

      await MapDisplay();
      await CallOnlyAPI();

      await MapIntervalRefresh();

      useBackButton(9999, async () => {
        const title = "";
        const pageid = "";
        const path = "";

        selectedPage.value = { title, pageid, path };

        router.replace("/today");
      });
    });

    /* ===========================
       LIFECYCLE - UNMOUNT
    =========================== */

    onUnmounted(() => {
      if (mapRef.value) {
        mapRef.value = null;
      }
      newMap = null;

      closeShowPath(1);
      stopInterval1Min();
    });

    /* ===========================
       METHODS
    =========================== */

    const clearPolyline = () => {
      if (polylineRef) {
        polylineRef.setPath([]);
        polylineRef.setMap(null);
        polylineRef = null;
      }
      if (polylinePathsForShowPath) {
        polylinePathsForShowPath.setPath([]);
        polylinePathsForShowPath.setMap(null);
        polylinePathsForShowPath = null;
      }

      isnearVehObject.value = false;
    };

    /* ===========================
       RETURN
    =========================== */

    return {
      closeCircle,
      chevronUpCircle,
      colorPalette,
      globe,fabIcon,
    mapOutline,add,close,
  peopleOutline,
  home,closeOutline,
  homeOutline,searchOutline,
  settingsOutline,
  carOutline,locationOutline,
      mapContainer,
      navigateToPage,
      closeShowPath,

      ishowPath,
      isMarkerShowPath,
      isLoadPath,

      moveCameraToLocation,
      MapDisplay,
      getDirections,

      Near_vehicleObject,
      isnearVehObject,
      isSumTripObject,

      clearPolyline,

      showData,
      isPlaying,
      vehicleNo,
      distance,

      fromDateTime,
      toDateTime,
      loadData,
      togglePlayPause,

      playIcon,
      pauseIcon,

      isFromPickerVisible,
      isToPickerVisible,
      isDateTimeValid,

      fromDateTimeFormatted,
      toDateTimeFormatted,

      openDatePicker,
      validateDateTime,
      closeModal,
      selectedDateTime,
      canPlay,

      openModal,      toggleFab ,isFabOpen,

      progressValue,
      speedValue,

      isSummaryChecked,
      isTripInfoChecked,

      isDateTimePickerVisible,
      currentDateTime,

      updateDateTime,
      saveDateTime,

      interval,
      historyarray,
      currentIndex,
      fabButton,

      markerMovingIcon,
      isMapBusyWithRoute,

      formatDateToString,

      animateRoute,
      getCurrentWaypointIndex,

      polylinePathsForShowPath,
      routePoints,
      middleMarkers,
      animationIndex,
      animationTimer,
      animationSpeed,

processWaypointsWithoutAPI,
      updateSpeed,
      updateAnimationProgress,
      animationProgress
    };
  }
};
  
    // this function called on click of loadData Button of show trip point
const loadData = () => {
  CallTripPath();

  // console.log('Loading data...');
};


/* ===========================
   PROCESS WAYPOINTS
=========================== */

/* =========================================================
   GENERATE SMOOTH ROUTE POINTS (NO DIRECTIONS API FALLBACK)
========================================================= */
const processWaypointsWithoutAPI = (historyPoints: Array<{ lat: number; lon: number }>) => {
  routePoints.value = [];
  if (historyPoints.length < 2) return;

  for (let i = 0; i < historyPoints.length - 1; i++) {
    const p1 = new google.maps.LatLng(historyPoints[i].lat, historyPoints[i].lon);
    const p2 = new google.maps.LatLng(historyPoints[i + 1].lat, historyPoints[i + 1].lon);

    const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    // Cap at 20 steps max so far-apart dots don't slow down the animation
    const steps = Math.min(20, Math.max(5, Math.floor(distanceMeters / 5)));

    for (let step = 0; step < steps; step++) {
      const fraction = step / steps;
      const interpolatedPoint = google.maps.geometry.spherical.interpolate(p1, p2, fraction);
      routePoints.value.push(interpolatedPoint);
    }
  }

  const last = historyPoints[historyPoints.length - 1];
  routePoints.value.push(new google.maps.LatLng(last.lat, last.lon));

  animationIndex.value = 0;
  animationProgress.value = 0;
};

/* =========================================================
   GENERATE SMOOTH ROUTE POINTS ALONG ROADS USING DIRECTIONS API
========================================================= */
const interpolatePathPoints = (pathPoints: google.maps.LatLng[]): google.maps.LatLng[] => {
  const result: google.maps.LatLng[] = [];
  if (pathPoints.length < 2) return pathPoints;

  for (let i = 0; i < pathPoints.length - 1; i++) {
    const p1 = pathPoints[i];
    const p2 = pathPoints[i + 1];
    const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    // Cap at 20 steps max between OSRM road points
    const steps = Math.min(20, Math.max(1, Math.floor(distanceMeters / 5)));

    for (let step = 0; step < steps; step++) {
      const fraction = step / steps;
      const interpolatedPoint = google.maps.geometry.spherical.interpolate(p1, p2, fraction);
      result.push(interpolatedPoint);
    }
  }
  result.push(pathPoints[pathPoints.length - 1]);
  return result;
};

const appendSegmentWithoutAPI = (segmentPoints: Array<{ lat: number; lon: number }>, targetArray: google.maps.LatLng[]) => {
  for (let i = 0; i < segmentPoints.length - 1; i++) {
    const p1 = new google.maps.LatLng(segmentPoints[i].lat, segmentPoints[i].lon);
    const p2 = new google.maps.LatLng(segmentPoints[i + 1].lat, segmentPoints[i + 1].lon);
    const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    // Cap at 20 steps max per segment
    const steps = Math.min(20, Math.max(5, Math.floor(distanceMeters / 5)));

    for (let step = 0; step < steps; step++) {
      const fraction = step / steps;
      targetArray.push(google.maps.geometry.spherical.interpolate(p1, p2, fraction));
    }
  }
};

/* =========================================================
   FREE OSRM (OPEN SOURCE ROUTING MACHINE) ROAD ROUTING HELPER
========================================================= */
async function fetchOSRMRoute(points: Array<{ lat: number; lon: number }>): Promise<google.maps.LatLng[]> {
  if (!points || points.length < 2) return [];

  const resultPoints: google.maps.LatLng[] = [];
  const CHUNK_SIZE = 25;

  for (let i = 0; i < points.length - 1; i += CHUNK_SIZE - 1) {
    const chunk = points.slice(i, i + CHUNK_SIZE);
    if (chunk.length < 2) break;

    const coordsString = chunk.map(p => `${p.lon},${p.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0 && data.routes[0].geometry?.coordinates) {
          const coords = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => new google.maps.LatLng(coord[1], coord[0])
          );
          if (resultPoints.length > 0 && coords.length > 0) {
            resultPoints.push(...coords.slice(1));
          } else {
            resultPoints.push(...coords);
          }
          continue;
        }
      }
    } catch (err) {
      console.warn("OSRM routing request failed, fallback segment:", err);
    }

    for (let j = 0; j < chunk.length; j++) {
      resultPoints.push(new google.maps.LatLng(chunk[j].lat, chunk[j].lon));
    }
  }

  return resultPoints;
}

const processWaypointsWithRoads = async (
  historyPoints: Array<{ lat: number; lon: number }>
) => {

  routePoints.value = [];

  if (!historyPoints || historyPoints.length < 2) {
    return;
  }

  try {

    // Get road geometry from OSRM
    const roadPoints = await fetchOSRMRoute(historyPoints);

    if (roadPoints && roadPoints.length >= 2) {

      // Add extra points for smooth vehicle movement
      routePoints.value = interpolatePathPoints(roadPoints);

    } else {

      // OSRM failed → use GPS points directly
      processWaypointsWithoutAPI(historyPoints);
    }

  } catch (error) {

    console.error("OSRM routing failed:", error);

    // NO Directions API
    processWaypointsWithoutAPI(historyPoints);
  }

  animationIndex.value = 0;
  animationProgress.value = 0;
};









/* ===========================
   PLAY / PAUSE CONTROL
=========================== */

// this function used for play pause button
const togglePlayPause = () => {
  // If at the end or at the start, reset to start and clear polyline before replaying
  if (
    animationIndex.value >= routePoints.value.length - 1 ||
    (animationIndex.value === 0 && animationProgress.value === 0)
  ) {
    animationIndex.value = 0;
    animationProgress.value = 0;
    polylinePathsForShowPath?.setPath([]);
  }

  isPlaying.value = !isPlaying.value;

  if (isPlaying.value) {
    animateRoute();
  } else {
    // 🛑 Cancel both requestAnimationFrame and timer when paused
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (animationTimer.value) clearTimeout(animationTimer.value);
  }
};



/* ===========================
   ANIMATE ROUTE
=========================== */
let animationFrameId: number | null = null;

const animateRoute = () => {
  if (!isPlaying.value || animationIndex.value >= routePoints.value.length) {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    isPlaying.value = false;

    // Keep the vehicle at destination (point B) with full polyline drawn
    if (routePoints.value.length > 0) {
      const lastIndex = routePoints.value.length - 1;
      animationIndex.value = lastIndex;
      animationProgress.value = lastIndex;
      markerMovingIcon?.setPosition(routePoints.value[lastIndex]);
      newMap?.panTo(routePoints.value[lastIndex]);

      const path = polylinePathsForShowPath?.getPath();
      if (path && path.getLength() !== routePoints.value.length) {
        path.clear();
        for (let i = 0; i < routePoints.value.length; i++) {
          path.push(routePoints.value[i]);
        }
      }
    }
    return;
  }

  const currentPoint = routePoints.value[animationIndex.value];
  const nextPoint =
    animationIndex.value < routePoints.value.length - 1
      ? routePoints.value[animationIndex.value + 1]
      : currentPoint;

  // Compute smooth vehicle bearing/rotation
  const heading = google.maps.geometry.spherical.computeHeading(currentPoint, nextPoint);

  markerMovingIcon?.setPosition(currentPoint);
  markerMovingIcon?.setIcon({
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 3.5,
    strokeColor: "#FF0000",
    rotation: heading,
  });

  newMap?.panTo(currentPoint);

  const path = polylinePathsForShowPath?.getPath();
  path?.push(currentPoint);

  animationProgress.value = animationIndex.value;
  animationIndex.value++;

  // Schedule next frame using the speed directly as the delay (ms)
  animationTimer.value = setTimeout(() => {
    animationFrameId = requestAnimationFrame(animateRoute);
  }, animationSpeed.value);

};


/* ===========================
   GET CURRENT WAYPOINT INDEX
=========================== */
const getCurrentWaypointIndex = (point) => {
  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < routePoints.value.length; i++) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(point, routePoints.value[i]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
};

/* ===========================
   UPDATE SPEED
=========================== */
const updateSpeed = (event: { detail: { value: number } }) => {
  speedValue.value = event.detail.value;

  // Lower ms = faster animation; speed 1 = 800ms/step, speed 10 = 30ms/step
  const speeds: Record<number, number> = {
    1: 800, 2: 600, 3: 450, 4: 320, 5: 220,
    6: 150, 7: 100, 8: 70, 9: 50, 10: 30,
  };

  animationSpeed.value = speeds[speedValue.value] ?? 220;
};

/* ===========================
   WATCH PROGRESS
=========================== */
// NOTE: We do NOT watch animationProgress here to avoid rebuilding the
// entire polyline on every animation tick. The polyline is updated
// incrementally inside animateRoute() (path.push). applyAnimationProgress
// is only called when the user manually drags the progress slider.

/* ===========================
   APPLY PROGRESS
=========================== */
const applyAnimationProgress = (index: number) => {
  if (index >= routePoints.value.length) return;

  markerMovingIcon.setPosition(routePoints.value[index]);
  newMap.panTo(routePoints.value[index]);

  const path = polylinePathsForShowPath?.getPath();
  path?.clear();

  for (let i = 0; i <= index; i++) {
    path?.push(routePoints.value[i]);
  }
};

/* ===========================
   UPDATE PROGRESS (SLIDER)
=========================== */
const updateAnimationProgress = (event: { detail: { value: number } }) => {
  const index = event.detail.value;

  animationIndex.value = index;
  animationProgress.value = index;

  applyAnimationProgress(index);
};

/* ===========================
   FORMAT DATE (NO UTC CHANGE)
=========================== */
function formatForIonDatetime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/* ===========================
   MODAL CONTROLS
=========================== */
const openModal = (type: "from" | "to") => {
  dateType.value = type;

  let originalDate = type === "from" 
    ? (fromDateTime.value ? new Date(fromDateTime.value) : new Date())
    : (toDateTime.value ? new Date(toDateTime.value) : new Date());

  selectedDateTime.value = formatForIonDatetime(originalDate);
  isDateTimePickerVisible.value = true;
};

const closeModal = () => {
  isDateTimePickerVisible.value = false;
};

const updateDateTime = (event: any) => {
  selectedDateTime.value = event.detail.value;
};

const saveDateTime = () => {
  if (!selectedDateTime.value) return;

  if (dateType.value === "from") {
    fromDateTime.value = selectedDateTime.value;
    fromDateTimeFormatted.value = format(new Date(selectedDateTime.value), "dd/MM/yyyy HH:mm");
  } else {
    toDateTime.value = selectedDateTime.value;
    toDateTimeFormatted.value = format(new Date(selectedDateTime.value), "dd/MM/yyyy HH:mm");
  }

  validateDateTime();
  closeModal();
};

const validateDateTime = () => {
  isDateTimeValid.value = new Date(fromDateTime.value) <= new Date(toDateTime.value);
};

/* ===========================
   DATE PICKER
=========================== */
const openDatePicker = (type: string) => {
  isFromPickerVisible.value = type === "from";
  isToPickerVisible.value = type !== "from";
};

/* ===========================
   CLOSE SHOW PATH
=========================== */
const closeShowPath = (count: number) => {
  // Stop any running animation first
  isPlaying.value = false;
  if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
  if (animationTimer.value) { clearTimeout(animationTimer.value); animationTimer.value = undefined; }

  if (count == 1) {
    ishowPath.value = false;
    isMarkerShowPath.value = false;
    isLoadPath.value = false;
    isMapBusyWithRoute.value = false;
    isSumTripObject.value = false;
    historyarray.value = [];
  }

  index_route_array.value = [];
  routePoints.value = [];
  animationIndex.value = 0;
  animationProgress.value = 0;

  // Clear ALL tracked show-path overlays completely
  showPathOverlays.forEach((overlay: any) => {
    if (overlay) {
      if (typeof overlay.setPath === 'function') overlay.setPath([]);
      if (typeof overlay.setMap === 'function') overlay.setMap(null);
    }
  });
  showPathOverlays.length = 0;

  // Clear Start Marker (markerId1)
  if (markerId1) {
    markerId1.setMap(null);
    markerId1 = null;
  }

  // Clear Destination Marker (markerId2)
  if (markerId2) {
    markerId2.setMap(null);
    markerId2 = null;
  }

  // Clear Moving Marker
  if (markerMovingIcon) {
    markerMovingIcon.setMap(null);
    markerMovingIcon = null;
  }

  // Clear Polyline (must call setMap(null) and setPath([]) BEFORE setting to null)
  if (polylinePathsForShowPath) {
    polylinePathsForShowPath.setPath([]);
    polylinePathsForShowPath.setMap(null);
    polylinePathsForShowPath = null;
  }

  if (polylineRef) {
    polylineRef.setPath([]);
    polylineRef.setMap(null);
    polylineRef = null;
  }

  // Clear Dot Markers
  if (markersDotsArray.length > 0) {
    markersDotsArray.forEach((marker: google.maps.Marker) => marker?.setMap?.(null));
  }
  markersDotsArray.length = 0;
};
     


const navigateToPage = (pageName) => {
   if (fabButton.value) {
        fabButton.value.$el?.click(); // Access the native element and trigger a click
      }

       isFabOpen.value = false;
          fabIcon.value = add;

  isMapBusyWithRoute.value = false;
  closeShowPath(1);

      console.log("Navigating to", pageName);

  if (pageName == 1) {

    router.push('/showtrip');

  } else if (pageName == 2) {
    router.push('/searchgoupmap');
  } else if (pageName == 3) {
    router.push('/settingmap');
  } else if (pageName == 4) {
    if (fabButton.value) fabButton.value.$el?.click();
    moveCameraToHomeLocation();
  } else if (pageName == 5) {
    router.push('/searchclosestland');
  } else if (pageName == 6) {
    router.push('/searchvehiclemap');
  } else if (pageName == 7) {
    router.push('/searchland');
  } else {
    console.warn('Invalid page number:', pageName);
  }


    // Close the FAB list and toggle the icon to 'add' when navigating
         
};
  

async function MapDisplay() {
  try {
    await nextTick();
    
 // 🔴 Remove old markers
if (markersArray.value && markersArray.value.length > 0) {
  markersArray.value.forEach((marker: google.maps.Marker) => {
    marker.setMap(null);
  });
  markersArray.value = [];
}
if (!ishowPath.value) {
  showPathOverlays.forEach((overlay: any) => {
    if (overlay) {
      if (typeof overlay.setPath === 'function') overlay.setPath([]);
      if (typeof overlay.setMap === 'function') overlay.setMap(null);
    }
  });
  showPathOverlays.length = 0;
  if (markerId1) { markerId1.setMap(null); markerId1 = null; }
  if (markerId2) { markerId2.setMap(null); markerId2 = null; }
  if (markerMovingIcon) { markerMovingIcon.setMap(null); markerMovingIcon = null; }
  if (polylinePathsForShowPath) {
    polylinePathsForShowPath.setPath([]);
    polylinePathsForShowPath.setMap(null);
    polylinePathsForShowPath = null;
  }
  if (polylineRef) {
    polylineRef.setPath([]);
    polylineRef.setMap(null);
    polylineRef = null;
  }
  markersDotsArray.forEach((m: any) => m?.setMap?.(null));
  markersDotsArray.length = 0;
}
    if (mapContainer.value) {

      const login_data = await storage.get('login_data');

      // Retrieve stored values
      const storedZoom = await storage.get('mapZoom');
      const mapLat = await storage.get('mapLat');
      const mapLong = await storage.get('mapLong');
      const storedMapType = await storage.get('mapType');

      const initialLat =
        mapLat !== null && mapLat !== undefined && !isNaN(parseFloat(mapLat))
          ? parseFloat(mapLat)
          : parseFloat(login_data?.h_lat);

      const initialLong =
        mapLong !== null && mapLong !== undefined && !isNaN(parseFloat(mapLong))
          ? parseFloat(mapLong)
          : parseFloat(login_data?.h_lon);

      console.log("initialLat:", login_data.h_lat, "initialLong:", login_data.h_lon);

      const initialZoom =
        storedZoom !== null && storedZoom !== undefined && !isNaN(parseFloat(storedZoom))
          ? parseInt(storedZoom)
          : parseInt(login_data.zoom_lvl);

      const initialCenter = { lat: initialLat, lng: initialLong };

      const initialMapType =
        storedMapType !== null && storedMapType !== undefined && !isNaN(parseFloat(storedMapType))
          ? storedMapType
          : 'roadmap';

      await loadGoogleMaps();

      if (!newMap) {
        newMap = new google.maps.Map(mapContainer.value as HTMLElement, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeId: initialMapType,
          zoomControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });

        mapRef.value = newMap;

        if (storedMapType) {
          mapRef.value?.setMapTypeId(storedMapType);
        }

        // --- CONTROLS ---
        const controlContainer = document.createElement('div');
        controlContainer.style.position = 'absolute';
        controlContainer.style.right = '20px';
        controlContainer.style.bottom = '100px';
        controlContainer.style.display = 'flex';
        controlContainer.style.gap = '10px';
        controlContainer.style.alignItems = 'center';
        controlContainer.style.background = 'white';
        controlContainer.style.borderRadius = '5px';
        controlContainer.style.padding = '5px';

        mapControlDiv = document.createElement('div');
        mapControlDiv.innerHTML = `
          <button style="background: transparent; border: none;">
            <img src="/pin.png" width="30" height="30">
          </button>`;
        mapControlDiv.style.display = 'none';

        navControlDiv = document.createElement('div');
        navControlDiv.innerHTML = `
          <button style="background: transparent; border: none;">
            <img src="/navigation.png" width="30" height="30">
          </button>`;
        navControlDiv.style.display = 'none';

        controlContainer.appendChild(navControlDiv);
        controlContainer.appendChild(mapControlDiv);

        newMap?.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlContainer);
      }

      const storedGroupData = await storage.get(Constants.storageValue.Key_GroupAPI);

      if (storedGroupData && storedGroupData.length > 0) {

        const storedGroups = await storage.get(Constants.storageValue.key_Map_GroupWithStatus);

        const checkedGroups = storedGroups.filter((group: { checked: any }) => group.checked);

        const filteredGroupData = storedGroupData.filter((groupData: { group: any }) => {
          const matchingStatus = checkedGroups.find(
            (checkedGroup: { group: any }) => checkedGroup.group === groupData.group
          );
          return matchingStatus !== undefined;
        });

        selectedItems.value = filteredGroupData.flatMap((group: { veh_arr: any[] }) =>
          group.veh_arr.map((veh: any) => ({
            vehicleId: veh.veh_id,
            vehicleName: veh.veh_no,
            vehicleStatus: veh.veh_sts,
            vehicleColor: veh.sts_colr,
            lat: veh.lat,
            lon: veh.lon,
            sts_str: veh.sts_str,
            loc_str: veh.loc_str,
            status: veh.status,
            rec_dt: veh.rec_dt,
            drv_name: veh.drv_name,
            speed: veh.speed,
          }))
        );
      }

      const vehicleStatusColorData = await storage.get('VehicleStatusColor');

      const filteredVehicles = selectedItems.value.filter(item => {
        const matchingStatus = vehicleStatusColorData.find(
          (statusData: { id: any; isEnabled: boolean }) =>
            statusData.id === item.status && statusData.isEnabled === true
        );
        return matchingStatus !== undefined;
      });

      // --- MARKERS ---
      filteredVehicles.forEach(async (vehicle) => {

              isFirstTimeDataCall=false;


        const Lat = parseFloat(vehicle.lat);
        const Lng = parseFloat(vehicle.lon);
        const initialCenter = { lat: Lat, lng: Lng };

        const markerColor = vehicle.vehicleColor || '#FF0000';

        const markerIcon = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 5,
        };

        const markerId = new google.maps.Marker({
          position: initialCenter,
          map: newMap,
          icon: markerIcon,
        });

       

        markersArray.value.push(markerId);

        const styleElement = document.createElement('style');
        styleElement.textContent = `
          .gm-style .gm-style-iw-c{ max-width:100%!important; }
          .gm-ui-hover-effect{
            width:30px!important;
            height:30px!important;
            right:5px!important;
            top:5px!important;
          }
        `;
        document.head.appendChild(styleElement);

        const infoWindomarker = new google.maps.InfoWindow();

        const infoWindowContainer = document.createElement('div');

        const app = createApp(InfoWindowMapMarker, {
          vehicleData: vehicle,
          onShowPath: (vehicleData: any) => {

            fromDateTime.value = startOfDay(new Date(vehicleData.rec_dt));
            toDateTime.value = new Date(vehicleData.rec_dt);

            fromDateTimeFormatted.value = format(new Date(fromDateTime.value), 'dd/MM/yyyy HH:mm');
            toDateTimeFormatted.value = format(new Date(toDateTime.value), 'dd/MM/yyyy HH:mm');

            selectedVehNo.value = vehicleData.vehicleId;

            ishowPath.value = true;
            isMarkerShowPath.value = true;

            infoWindomarker.close();
          }
        });

        app.mount(infoWindowContainer);
        infoWindomarker.setContent(infoWindowContainer);

        let currentInfoWindow: google.maps.InfoWindow | null = null;
        let currentNavControlDiv: HTMLDivElement | null = null;
        let currentMapControlDiv: HTMLDivElement | null = null;

        markerId.addListener('click', () => {

          fromDateTimeFormatted.value = '';
          toDateTimeFormatted.value = '';
          isMapBusyWithRoute.value = false;

          if (ishowPath.value) {
            ishowPath.value = false;
            isMarkerShowPath.value = false;
            closeShowPath(1);
          }

          if (navControlDiv && mapControlDiv) {
            navControlDiv.style.display = 'block';
            mapControlDiv.style.display = 'block';

            currentNavControlDiv = navControlDiv;
            currentMapControlDiv = mapControlDiv;

            const lat = markerId.getPosition().lat();
            const lng = markerId.getPosition().lng();

            navControlDiv.addEventListener('click', () => {
              window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            });

            mapControlDiv.addEventListener('click', () => {
              window.location.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            });
          }

          infoWindomarker.open({
            anchor: markerId,
            map: newMap,
          });

          currentInfoWindow = infoWindomarker;

          if (currentInfoWindow && currentInfoWindow !== infoWindomarker) {
            currentInfoWindow.close();
          }

          infoWindomarker.addListener('closeclick', () => {

            if (currentNavControlDiv) {
              currentNavControlDiv.style.display = 'none';
              currentNavControlDiv = null;
            }

            if (currentMapControlDiv) {
              currentMapControlDiv.style.display = 'none';
              currentMapControlDiv = null;
            }

            currentInfoWindow = null;
          });

        });

      });

      // If valid lat/lon are passed, move camera to that location
    if (
      !isNaN(vehicleLat) &&
      !isNaN(vehicleLon) &&
      parseFloat(vehicleLat) !== 0 &&
      parseFloat(vehicleLon) !== 0
    ) {
      await moveCameraToLocation(vehicleLat, vehicleLon, 16);
      vehicleLat = NaN;
      vehicleLon = NaN;
    }

    // Check if there is a history array to process animation
    if (historyarray.value.length > 0 && ishowPath.value) {
      isMapBusyWithRoute.value = true;

      canPlay.value = false;
      const loading = await loadingController.create({
        message: 'Please Wait',
        spinner: 'circles',
      });

      await loading.present();
      await processAnimation(2);
      canPlay.value = true;

      loading.dismiss();
    } else {
      isMapBusyWithRoute.value = false;
      // console.log('History Array is empty or not available.');
    }

    // Handle landmark coordinates if present
    const lat = await storage.get('landmark_lat');
    const lng = await storage.get('landmark_lng');

    if (lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);

      // console.log("searched_land", parsedLat, parsedLng);
      await moveCameraToLocation(parsedLat, parsedLng, 10);

      await storage.remove('landmark_lat');
      await storage.remove('landmark_lng');
    }

    // Handle nearest vehicle directions
    const Nearest_dirLat = await storage.get('Near_landmark_lat');
    const Nearest_dirLon = await storage.get('Near_landmark_lng');
    const NearesVeh = JSON.parse(await storage.get('NearestVeh'));

    console.log("displayjyoby", NearesVeh);

    if (
      Nearest_dirLat !== null &&
      Nearest_dirLat !== "" &&
      Nearest_dirLon !== null &&
      Nearest_dirLon !== ""
    ) {
      await getDirections(Nearest_dirLat, Nearest_dirLon, NearesVeh);
    }

    // Clean up storage values
    storage.remove('Near_landmark_lat');
    storage.remove('Near_landmark_lng');
    storage.remove('Near_landmark_address');
    storage.remove('NearestVeh');
      

    } else {
      console.error('Map element not found.');
    }

  } catch (error) {
    console.error('Error creating Google Map:', error);
  }
}




// Move camera to a specific location
function moveCameraToLocation(lat: number, lon: number, zoom: number): void {
  if (!newMap) {
    console.error('Map not initialized');
    return;
  }

  console.log("Camera move to:", lat, lon, "Zoom:", zoom);
  newMap.setCenter(new google.maps.LatLng(lat, lon));
  newMap.setZoom(zoom);
}

// Move camera to home location (based on stored or login data)
async function moveCameraToHomeLocation(): Promise<void> {
  if (!mapRef.value) {
    console.error('Map not initialized.');
    return;
  }

  const login_data = await storage.get('login_data');
  const [storedZoom, mapLat, mapLong] = await Promise.all([
    storage.get('mapZoom'),
    storage.get('mapLat'),
    storage.get('mapLong'),
  ]);

  const initialLat = mapLat ? parseFloat(mapLat) : parseFloat(login_data.h_lat);
  const initialLng = mapLong ? parseFloat(mapLong) : parseFloat(login_data.h_lon);
  const initialZoom = storedZoom ? parseInt(storedZoom) : parseInt(login_data.zoom_lvl);

  mapRef.value.setCenter(new google.maps.LatLng(initialLat, initialLng));
  mapRef.value.setZoom(initialZoom);

  console.log(`Camera moved home: (${initialLat}, ${initialLng}) Zoom: ${initialZoom}`);
}

// Get driving directions and draw polyline on the map
async function getDirections(
  destLat: number,
  destLon: number,
  vehicleObject: any
): Promise<void> 
{

  if (!mapRef.value || !vehicleObject) {
    console.error("Map or vehicle object is not initialized");
    return;
  }

  Near_vehicleObject.value = vehicleObject;

  // Remove existing polyline
  if (polylineRef) {
    polylineRef.setPath([]);
    polylineRef.setMap(null);
    polylineRef = null;
  }

  const origin = {
    lat: Number(vehicleObject.lat),
    lon: Number(vehicleObject.lon)
  };

  const destination = {
    lat: Number(destLat),
    lon: Number(destLon)
  };

  console.log("========== OSRM TEST ==========");
  console.log("Origin:", origin);
  console.log("Destination:", destination);

  // Validate coordinates
  if (
    !Number.isFinite(origin.lat) ||
    !Number.isFinite(origin.lon) ||
    !Number.isFinite(destination.lat) ||
    !Number.isFinite(destination.lon)
  ) {
    console.error("Invalid coordinates");
    return;
  }

  console.log(
    "Origin valid:",
    origin.lat >= -90 &&
    origin.lat <= 90 &&
    origin.lon >= -180 &&
    origin.lon <= 180
  );

  console.log(
    "Destination valid:",
    destination.lat >= -90 &&
    destination.lat <= 90 &&
    destination.lon >= -180 &&
    destination.lon <= 180
  );

  const loading = await loadingController.create({
    message: "Loading directions...",
    spinner: "circles",
  });

  await loading.present();

  try {

    // IMPORTANT:
    // OSRM = longitude,latitude
    const coords =
      `${origin.lon},${origin.lat};` +
      `${destination.lon},${destination.lat}`;

    const url =
      `https://router.project-osrm.org/route/v1/driving/${coords}` +
      `?overview=full&geometries=geojson`;

    console.log("OSRM URL:");
    console.log(url);

    const response = await fetch(url);

    console.log("OSRM HTTP status:", response.status);

    const data = await response.json();

    console.log("OSRM RESPONSE:");
    console.log(data);

    if (!response.ok) {
      throw new Error(
        `OSRM HTTP error: ${response.status}`
      );
    }

    if (data.code !== "Ok") {
      console.error(
        "OSRM did NOT find route:",
        data.code
      );

      throw new Error(
        `OSRM route error: ${data.code}`
      );
    }

    if (
      !data.routes ||
      data.routes.length === 0
    ) {
      throw new Error("OSRM returned zero routes");
    }

    console.log(
      "OSRM route FOUND"
    );

    console.log(
      "Distance:",
      data.routes[0].distance,
      "meters"
    );

    console.log(
      "Duration:",
      data.routes[0].duration,
      "seconds"
    );

    const coordinates =
      data.routes[0].geometry.coordinates;

    console.log(
      "Route coordinate count:",
      coordinates.length
    );

    const path =
      coordinates.map(
        ([lng, lat]: [number, number]) =>
          new google.maps.LatLng(lat, lng)
      );

    polylineRef =
      new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 5,
      });

    polylineRef.setMap(mapRef.value);

    isnearVehObject.value = true;

    moveCameraToLocation(
      origin.lat,
      origin.lon,
      16
    );

  } catch (error) {

    console.error(
      "========== OSRM ROUTE FAILED =========="
    );

    console.error(error);

    // DON'T draw direct line here while testing
    isnearVehObject.value = false;

  } finally {

    await loading.dismiss();

  }
}

async function CallOnlyAPI(): Promise<void> {
  console.log("Called from map");

  let loading: HTMLIonLoadingElement | null = null;

  try {
    // Show loading spinner
    loading = await loadingController.create({ backdropDismiss: true });
    if(isFirstTimeDataCall)
    await loading.present();

    const params = {}; // API params
    const response = await fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.req_all_veh, params);
    const responsejson = response.data;

    if (response.status == 200 && responsejson.arr_data?.length > 0) {
      const arrData = responsejson.arr_data;

      // Map API response to internal items structure
      items.value = arrData.map((data: any, index: number) => ({
        id: index + 1,
        group: data.name,
        total_count: data.total_count,
        veh_arr: data.veh_arr,
        sts_arr: data.sts_arr,
      }));

      const newItems = items.value;

      // Get stored group and vehicle data
      let storedGroupData = (await storage.get(Constants.storageValue.Key_GroupAPI)) || [];
      let storedVehDetails = (await storage.get(Constants.storageValue.key_VehicleDetails)) || [];

      const isDataChanged = JSON.stringify(storedGroupData) !== JSON.stringify(newItems);

      if (isDataChanged) {
        // Update group data
        await storage.set(Constants.storageValue.Key_GroupAPI, newItems);

        // Handle event/map/fuel group statuses
        const storedGroups = (await storage.get(Constants.storageValue.key_GroupWithStatus)) || [];
        const storedGroups_map = (await storage.get(Constants.storageValue.key_Map_GroupWithStatus)) || [];
        const storedGroups_fuel = (await storage.get(Constants.storageValue.key_Fuel_GroupWithStatus)) || [];

        function mergeGroupStatus(arrData: any[], storedGroups: any[]) {
          const map = new Map(storedGroups.map(g => [`${g.group}-${g.groupId}`, g]));
          return arrData.map(data => {
            const key = `${data.name}-${data.id}`;
            return map.has(key)
              ? { ...map.get(key) }
              : { group: data.name, groupId: data.id, status: 1, checked: true };
          });
        }

        const groupStatusEventItems = mergeGroupStatus(arrData, storedGroups);
        const groupStatusMapItems = mergeGroupStatus(arrData, storedGroups_map);
        const groupStatusFuelItems = mergeGroupStatus(arrData, storedGroups_fuel);

        await storage.set(Constants.storageValue.key_GroupWithStatus, groupStatusEventItems);
        await storage.set(Constants.storageValue.key_Fuel_GroupWithStatus, groupStatusFuelItems);
        await storage.set(Constants.storageValue.key_Map_GroupWithStatus, groupStatusMapItems);

        // Handle vehicle details
        const storedEventVeh = new Map((await storage.get(Constants.storageValue.key_VehicleDetails) || []).map((v: any) => [`${v.vehid}-${v.vehname}`, v]));
        const storedVehFuel = new Map((await storage.get(Constants.storageValue.key_Fuel_VehicleDetails) || []).map((v: any) => [`${v.vehid}-${v.vehname}`, v]));

        function mergeVehicleDetails(arrData: any[], storedMap: Map<string, any>) {
          return arrData.flatMap((data: any) =>
            data.veh_arr.map((veh: any) => {
              const key = `${veh.veh_id}-${veh.veh_no}`;
              return storedMap.has(key)
                ? { ...storedMap.get(key) }
                : {
                    vehid: veh.veh_id,
                    vehname: veh.veh_no,
                    vehstatus: veh.veh_sts,
                    vehColor: veh.sts_colr,
                    status: 1,
                  };
            })
          );
        }
        const vehicleDetailsEvent = mergeVehicleDetails(arrData, storedEventVeh);
        const vehicleDetailsFuel = mergeVehicleDetails(arrData, storedVehFuel);

        await storage.set(Constants.storageValue.key_VehicleDetails, vehicleDetailsEvent);
        await storage.set(Constants.storageValue.key_Fuel_VehicleDetails, vehicleDetailsFuel);
      }
      isFirstTimeDataCall=false;
      await MapDisplay();

    } else if (response.status == 401) {
      console.error('Unauthorized:', responsejson.message);
    } else {
      console.error('Empty response data');
    }
  } catch (error) {
    console.error('Error in CallOnlyAPI:', error);
  } finally {
    if (loading) await loading.dismiss();
  }
}

// Function to process animation on map
async function processAnimation(fromwhere: number) {
  if (fromwhere ==1) {
    isMarkerShowPath.value = true;
  }

  ishowPath.value = true;
  isLoadPath.value = true;
  isSumTripObject.value = true;
  isSummaryChecked.value = true;
  isTripInfoChecked.value = true;

  // Clean up any existing markers/polyline before drawing a new route
  showPathOverlays.forEach((overlay: any) => {
    if (overlay) {
      if (typeof overlay.setPath === 'function') overlay.setPath([]);
      if (typeof overlay.setMap === 'function') overlay.setMap(null);
    }
  });
  showPathOverlays.length = 0;

  if (markerMovingIcon) {
    markerMovingIcon.setMap(null);
    markerMovingIcon = null;
  }
  if (markerId1) {
    markerId1.setMap(null);
    markerId1 = null;
  }
  if (markerId2) {
    markerId2.setMap(null);
    markerId2 = null;
  }
  if (polylinePathsForShowPath) {
    polylinePathsForShowPath.setPath([]);
    polylinePathsForShowPath.setMap(null);
    polylinePathsForShowPath = null;
  }
  markersDotsArray.forEach((marker: google.maps.Marker) => marker?.setMap?.(null));
  markersDotsArray.length = 0;

  // Extract origin and destination
  const origin = { lat: historyarray.value[0].lat, lng: historyarray.value[0].lon };
  const destination = { lat: historyarray.value[historyarray.value.length - 1].lat, lng: historyarray.value[historyarray.value.length - 1].lon };

  // Create moving marker
  markerMovingIcon = new google.maps.Marker({
    map: newMap,
    position: origin,
    icon: {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 3.5,
      strokeColor: "#FF0000",
    },
  });
  showPathOverlays.push(markerMovingIcon);

  // Create polyline for the path
  polylinePathsForShowPath = new google.maps.Polyline({
    path: [],
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 0.7,
    strokeWeight: 2.5,
    map: newMap,
  });
  showPathOverlays.push(polylinePathsForShowPath);


// Process waypoints along roads using OSRM (road-following route)
  await processWaypointsWithRoads(historyarray.value);

  if (!ishowPath.value) {
    showPathOverlays.forEach((overlay: any) => {
      if (overlay) {
        if (typeof overlay.setPath === 'function') overlay.setPath([]);
        if (typeof overlay.setMap === 'function') overlay.setMap(null);
      }
    });
    showPathOverlays.length = 0;
    if (markerMovingIcon) { markerMovingIcon.setMap(null); markerMovingIcon = null; }
    if (polylinePathsForShowPath) {
      polylinePathsForShowPath.setPath([]);
      polylinePathsForShowPath.setMap(null);
      polylinePathsForShowPath = null;
    }
    return;
  }

  for (let i = 0; i < historyarray.value.length; i++) {
    // Snap raw GPS point to the nearest point on the OSRM road route
    const s1 = findNearestPointOnRoute(historyarray.value[i].lat, historyarray.value[i].lon);

    // Start marker (A) — do NOT push to markersArray; handled exclusively by markerId1
    if (i == 0) {
      markerId1 = new google.maps.Marker({
        position: s1,
        map: newMap,
        icon: { url: "/ic_end.png", scaledSize: new google.maps.Size(25, 25) },
      });
      showPathOverlays.push(markerId1);
      newMap?.setCenter(new google.maps.LatLng(s1.lat, s1.lng));
      newMap?.setZoom(16);
    }

    // End marker (B) — do NOT push to markersArray; handled exclusively by markerId2
    if (i == historyarray.value.length - 1) {
      markerId2 = new google.maps.Marker({
        position: s1,
        map: newMap,
        icon: { url: "/ic_st.png", scaledSize: new google.maps.Size(25, 25) },
      });
      showPathOverlays.push(markerId2);
    }

    // Dot marker based on event type
    let dot_marker: google.maps.Marker;
    const evt = historyarray.value[i].event_type;
    dot_marker = createDotMarker(s1, getDotColor(evt));
    showPathOverlays.push(dot_marker);

    // Mount InfoWindow Vue component
    const infoWindow = new google.maps.InfoWindow();
    const infoWindowContainer = document.createElement("div");
    infoWindowContainer.style.margin = "0";
    infoWindowContainer.style.padding = "0";

    const app = createApp(InfoWindowDorMarker, { vehicleData: historyarray.value[i] });
    app.mount(infoWindowContainer);

    infoWindow.setContent(infoWindowContainer);
    dot_marker.addListener("click", () => {
      infoWindow.open(newMap, dot_marker);
      setTimeout(() => infoWindow.close(), 3000);
    });

    markersDotsArray.push(dot_marker);
  }
}

// Helper: return dot color based on GPS event type
// Moving (1)=green, Idle (2)=orange, Stopped (3)=red, NoGPS/NoData=dark gray
function getDotColor(eventType: string): string {
  switch (eventType) {
    case Constants.eventType.Event_Type_Moving:      return '#00C853'; // green
    case Constants.eventType.Event_Type_Idel:        return '#FF6D00'; // orange
    case Constants.eventType.Event_Type_Stopped:     return '#D50000'; // red
    case Constants.eventType.Event_Type_IG_ON_NoGPS: return '#546E7A'; // blue-gray
    case Constants.eventType.Event_Type_IG_OFF_NoGPS:return '#546E7A'; // blue-gray
    case Constants.eventType.Event_Type_NoData:      return '#9E9E9E'; // gray
    default:                                         return '#9E9E9E'; // gray
  }
}

// Helper function to create dot markers
function createDotMarker(position: any, color: string) {
  const lat = typeof position.lat === 'function' ? position.lat() : parseFloat(position.lat);
  const lng = typeof position.lng === 'function' ? position.lng() : parseFloat(position.lng ?? position.lon);

  return new google.maps.Marker({
    position: { lat, lng },
    map: newMap,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4,
      strokeColor: color,
      fillColor: color,
      fillOpacity: 0.8,
      strokeWeight: 1,
      rotation: 0,
    },
  });
}

// Function to call trip path API
async function CallTripPath() {
  let loading: HTMLIonLoadingElement | null = null;
  try {
    loading = await loadingController.create({ backdropDismiss: false });
    await loading.present();

    const fromdateString = fromDateTimeFormatted.value;
    const todateString = toDateTimeFormatted.value;

    const [day1, month1, year1, hour1, minute1] = fromdateString.match(/\d+/g)!;
    const [day2, month2, year2, hour2, minute2] = todateString.match(/\d+/g)!;

    const fromdateObject = new Date(+year1, +month1 - 1, +day1, +hour1, +minute1);
    const todateObject = new Date(+year2, +month2 - 1, +day2, +hour2, +minute2);

    const params = {
      veh_id: selectedVehNo.value,
      fdate: Math.floor(fromdateObject.getTime() / 1000),
      edate: Math.floor(todateObject.getTime() / 1000),
    };

    const response = await fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_trip_path, params);
    const responsejson = response.data;

    if (response.status == 200) {
      isMapBusyWithRoute.value = true;

      if (responsejson.arr_data && responsejson.arr_data.length > 1) {
        processTripData(responsejson.arr_data);

        closeShowPath(2);
        canPlay.value = false;

        const loadingPlay = await loadingController.create({
          message: "Please wait for play",
          spinner: "circles",
        });
        await loadingPlay.present();

        await processAnimation(1);
       await loadingPlay.dismiss();
               canPlay.value = true;


      } else if (responsejson.arr_data.length == 1) {
        showToastMessage("Start and end location getting same.");
      }
    } else if (response.status == 401) {
      console.error("Unauthorized:", responsejson.message);
    } else {
      console.error("Empty response data");
    }
  } catch (error) {
    console.error("Error in CallTripPath:", error);
  } finally {
    if (loading) await loading.dismiss();
  }
}

// Function to process trip data and populate historyarray
function processTripData(arr_data: any[]) {
  const odometerFirst = parseInt(arr_data[0].odometer);
  const odometerLast = parseInt(arr_data[arr_data.length - 1].odometer);
  const distance = ((odometerLast - odometerFirst) / 1000).toFixed(1);
  const start_loc = arr_data[0].location;
  const end_loc = arr_data[arr_data.length - 1].location;

  const firstDate = `${arr_data[0].rtcdate} ${arr_data[0].rtctime}`;
  const lastDate = `${arr_data[arr_data.length - 1].rtcdate} ${arr_data[arr_data.length - 1].rtctime}`;

  const duration = calculateDuration(firstDate, lastDate);

  const ConvertSecondToHHMMSSString = (nSecondTime: string | number) => {
    const h = Math.floor(+nSecondTime / 3600);
    const m = Math.floor((+nSecondTime % 3600) / 60);
    const s = +nSecondTime % 60;
    const sh = h > 0 ? `${h} h` : "";
    const sm = m > 0 ? `${h > 0 && s === 0 && m < 10 ? "0" : ""}${m} m` : "";
    const ss = s === 0 && (h > 0 || m > 0) ? "" : `${s < 10 && (h > 0 || m > 0) ? "0" : ""}${s} s`;
    return `${sh}${h > 0 ? " " : ""}${sm}${m > 0 ? " " : ""}${ss}`.trim();
  };

  const getEventStatus = (event_type: string, status: string, speed: string | number, stoppage: string) => {
    if (event_type === Constants.eventType.Event_Type_Moving) {
      return `${status} at ${speed} Km/h`;
    } else {
      return `${status} for ${ConvertSecondToHHMMSSString(stoppage)}`;
    }
  };

  historyarray.value = arr_data
    .filter((item) => item.lat && item.lon)
    .map((item) => ({
      recId: item.rec_id,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      location: item.location,
      speed: parseInt(item.speed, 10),
      vehNo: item.veh_no,
      rtcDate: item.rtcdate,
      rtcTime: item.rtctime,
      driverName: item.driver_name,
      distance,
      duration,
      start_loc,
      end_loc,
      event_type: item.event_type,
      label: item.label,
      stoppage: item.stoppage_dur,
      event_status: getEventStatus(item.event_type, item.label, parseInt(item.speed, 10), item.stoppage_dur),
    }));
}

// Helper function to calculate duration between two datetime strings
function calculateDuration(start: string, end: string) {
  const startDate = new Date(start.split("-").reverse().join("-"));
  const endDate = new Date(end.split("-").reverse().join("-"));
  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  let result = "";
  if (days > 0) result += `${days} day${days > 1 ? "s" : ""}, `;
  if (hours > 0) result += `${hours} hour${hours > 1 ? "s" : ""}, `;
  if (minutes > 0) result += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  else if (seconds > 0) result += `${seconds} second${seconds > 1 ? "s" : ""}`;
  return result;
}        
 

// Find the nearest point on the OSRM road route for a given raw GPS coordinate.
// This ensures dot markers sit exactly on the road polyline.
function findNearestPointOnRoute(lat: number, lng: number): { lat: number; lng: number } {
  const pts = routePoints.value;
  if (!pts || pts.length === 0) return { lat, lng };

  const rawPoint = new google.maps.LatLng(lat, lng);
  let nearestLat = lat;
  let nearestLng = lng;
  let minDist = Infinity;

  for (let i = 0; i < pts.length; i++) {
    const dist = google.maps.geometry.spherical.computeDistanceBetween(rawPoint, pts[i]);
    if (dist < minDist) {
      minDist = dist;
      nearestLat = pts[i].lat();
      nearestLng = pts[i].lng();
    }
  }

  return { lat: nearestLat, lng: nearestLng };
}

// Interval callback triggered every 1 minute
async function intervalCallback1Min() {
  try {
    // Get current route
    const currentRoute = router.currentRoute.value;

    // Check login status
    const isLoggedIn = await storage.get('IsLoginAlready');
    if (!isLoggedIn) {
      stopInterval1Min();
      return;
    }

    // Check network status
    const status = await Network.getStatus();
    if (currentRoute.name === 'map') {
      if (status.connected) {
        // Only call API if map is not busy
        if (!isMapBusyWithRoute.value) {
          await CallOnlyAPI();
        }
      } else {
        showToast();
      }
    }
  } catch (error) {
    console.error('Error in intervalCallback1Min:', error);
  }
}

export { intervalCallback1Min,intervalRunning1Min };
  
</script>
  
 
  
  