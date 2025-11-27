<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="goBack"></ion-back-button>
        </ion-buttons>

        <!-- Conditionally display the title or search input -->
        <ion-title v-if="!isSearching">Nearest Vehicle</ion-title>
        <ion-searchbar 
          v-if="isSearching" 
          placeholder="Search Vehicle" 
          v-model="searchQuery" 
          debounce="500" 
          @ionClear="clearSearch"
        ></ion-searchbar>

        <ion-buttons slot="end">
          <!-- Search icon to toggle search mode -->
          <ion-button @click="toggleSearch">
            <ion-icon :icon="isSearching ? 'close-outline' : 'search-outline'" color="light"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   
    <ion-content>
      <!-- Button Group to filter vehicle status -->
      <div class="button-group">
        <ion-button
          v-for="(label, index) in labels"
          :key="index"
          :class="{'selected': selectedLabel === label}"
          @click="selectButton(label)"
          style="text-transform: none;"
          fill="clear"
        >
          {{ label }}
        </ion-button>
      </div>

      <!-- Display for the selected section (Moving, Stopped, Idle, All) -->
      <div v-if="selectedLabel === 'Moving'">
        <p v-if="movingItems.length === 0">Data not available</p>
        <ion-list v-else>
          <template v-for="(vehicle, index) in movingItems" :key="vehicle.vehid">
            <VehicleItem 
              :vehicle="vehicle" 
              @click="navigateToPage(vehicle)"
            />
            <ion-item-divider 
              v-if="index < movingItems.length - 1" 
              class="custom-divider">
            </ion-item-divider>
          </template>
        </ion-list>
      </div>

      <div v-else-if="selectedLabel === 'Stopped'">
        <p v-if="stoppedItems.length === 0">Data not available</p>
        <ion-list v-else>
          <template v-for="(vehicle, index) in stoppedItems" :key="vehicle.vehid">
            <VehicleItem 
              :vehicle="vehicle" 
              @click="navigateToPage(vehicle)"
            />
            <ion-item-divider 
              v-if="index < stoppedItems.length - 1" 
              class="custom-divider">
            </ion-item-divider>
          </template>
        </ion-list>
      </div>

      <div v-else-if="selectedLabel === 'Idle'">
        <p v-if="idleItems.length === 0">Data not available</p>
        <ion-list v-else>
          <template v-for="(vehicle, index) in idleItems" :key="vehicle.vehid">
            <VehicleItem 
              :vehicle="vehicle" 
              @click="navigateToPage(vehicle)"
            />
            <ion-item-divider 
              v-if="index < idleItems.length - 1" 
              class="custom-divider">
            </ion-item-divider>
          </template>
        </ion-list>
      </div>

      <div v-else-if="selectedLabel === 'All'">
        <p v-if="allItems.length === 0">Data not available</p>
        <ion-list v-else>
          <template v-for="(vehicle, index) in allItems" :key="vehicle.vehid">
            <VehicleItem 
              :vehicle="vehicle" 
              @click="navigateToPage(vehicle)"
            />
            <ion-item-divider 
              v-if="index < allItems.length - 1" 
              class="custom-divider">
            </ion-item-divider>
          </template>
        </ion-list>
      </div>

    </ion-content>
  </ion-page>
</template>


<script>
import useNetwork from '@/services/networkService'; // Import the network service

import { ref, defineComponent, computed, onMounted } from 'vue';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSearchbar,
  IonButton,
  IonIcon
} from '@ionic/vue';
import VehicleItem from '@/components/closestVehItem.vue';
import router from '@/router/index';
import storage from '@/services/storagefile';
import Constants from '@/common/constants';


export default defineComponent({
  name: 'VehicleNearest',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    VehicleItem,
    IonBackButton,
    IonButtons,
    IonSearchbar,
    IonButton,
    IonIcon,

  },
  setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const items = ref([]); // Vehicle items
    const searchQuery = ref(''); // Search query bound to the search bar
    const isSearching = ref(false); // Flag to toggle search view
    const selectedLabel = ref('All'); // Track selected filter
    const selectedLandCoords = ref({ lat: 0, lon: 0 }); // Store latitude and longitude for selected landmark
    const selectedLandAdd=ref('');

   

    const labels = ['All', 'Moving', 'Stopped', 'Idle']; // Filter labels

     // Haversine formula to calculate the distance between two points (lat/lon)
     const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Radius of the Earth in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

          // Function to calculate travel time based on speed
      const calculateTravelTime = (distance, speed) => {
        const timeInHours = distance / speed; // Time = Distance / Speed

          // Convert hours to minutes and seconds
          const totalMinutes = timeInHours * 60;
          const totalSeconds = timeInHours * 3600;

          if (totalMinutes >= 60) {
            const hours = Math.floor(timeInHours);
            const minutes = Math.round((timeInHours - hours) * 60);
            return `${hours} hours `;
          } else if (totalMinutes >= 1) {
            const minutes = Math.floor(totalMinutes);
            const seconds = Math.round((totalMinutes - minutes) * 60);
            return `${minutes} minutes `;
          } else {
            return `${Math.round(totalSeconds)} seconds`;
          }
      };

    // Load vehicle details from Key_GroupAPI
    const loadVehicleDetails = async () => {
      const storedGroupData = await storage.get(Constants.storageValue.Key_GroupAPI);
      console.log("display",storedGroupData);

      if (storedGroupData && storedGroupData.length > 0) {
        // Collect all vehicles from all groups
        items.value = storedGroupData.flatMap((group) =>
          group.veh_arr.map((veh) => {
            const distance = calculateDistance(
              selectedLandCoords.value.lat,
              selectedLandCoords.value.lon,
              veh.lat,
              veh.lon
            );

             // Assuming an average speed of 60 km/h
        const averageSpeed = 60; // km/h
        const travelTime = calculateTravelTime(distance, averageSpeed);

            return {
              vehid: veh.veh_id,
              vehname: veh.veh_no,
              vehstatus: veh.veh_sts, // status for filtering
              vehColor: veh.sts_colr,
              lat: veh.lat,
              lon: veh.lon,
              status: veh.status,
              loc_str: veh.loc_str,
              driverName:veh.drv_name,
              distance: distance.toFixed(2), // Save distance in km (rounded to 2 decimal places),
              land_lat:selectedLandCoords.value.lat,
              land_lon:selectedLandCoords.value.lon,
              land_add:selectedLandAdd.value,
              travelTime:travelTime +"("+distance.toFixed(2)+")"+"Km",

            };
          })
        );

        items.value.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      }
    };



    // Toggle search bar visibility
    const toggleSearch = () => {
      isSearching.value = !isSearching.value;
    };

    // Clear search input and exit search mode
    const clearSearch = () => {
      searchQuery.value = '';
      isSearching.value = false;
    };

    // Filter items based on selected label
    const filteredItems = computed(() => {
      const query = searchQuery.value.toLowerCase();
      const filtered = items.value.filter(item => 
        item.vehname.toLowerCase().includes(query)
      );

      // Filter by vehicle status
      if (selectedLabel.value === 'Moving') {
        return filtered.filter(item => item.status === '1');
      } else if (selectedLabel.value === 'Stopped') {
        return filtered.filter(item => item.status === '3');
      } else if (selectedLabel.value === 'Idle') {
        return filtered.filter(item => item.status === '2');
      }
      return filtered;
    });

    // Arrays to store vehicles by status
    const movingItems = computed(() => filteredItems.value.filter(item => item.status === '1'));
    const stoppedItems = computed(() => filteredItems.value.filter(item => item.status === '3'));
    const idleItems = computed(() => filteredItems.value.filter(item => item.status === '2'));
    const allItems = computed(() => filteredItems.value);

    // Select button for the filter
    const selectButton = (label) => {
      selectedLabel.value = label;
    };

    onMounted(async () => {
      initNetworkListener();
      
  // Parse the selected landmark's latitude and longitude
  try {

      selectedLandCoords.value.lat = await storage.get('Near_landmark_lat');
      selectedLandCoords.value.lon = await storage.get('Near_landmark_lng');
      selectedLandAdd.value=  await storage.get('Near_landmark_address');

      console.log("parsedLandmark",selectedLandCoords.value.lat+" "+selectedLandCoords.value.lon+" "+selectedLandAdd.value);


    } catch (error) {
      console.error("Error parsing landmark coordinates", error);
    }

      await loadVehicleDetails(); // Load vehicle data from storage
      console.log("displaylost",items.value);

    });

    const navigateToPage = (veh) => {
      console.log("displaydata",veh);
      // router.replace({
      //   name: 'map',  // Parent page route name
      //   params: { vehLat: veh.lat, vehLon: veh.lon }  // Passing the selected lat/lon as query parameters
      // });      

      storage.set('NearestVeh',JSON.stringify(veh));

      router.go(-2); // Go back two steps in the navigation history
      
    };

    const goBack = () => {
      router.back();
    };

    const openSection = (item) => {
      // Logic to open detailed section for a specific item
      console.log("Opening section for", item);
    };

    return {
      goBack,
      navigateToPage,
      items,
      searchQuery,
      filteredItems,
      isSearching,
      toggleSearch,
      clearSearch,
      labels,
      selectedLabel,
      selectButton,
      movingItems,
      stoppedItems,
      idleItems,
      allItems,
      openSection,
      isConnected, showReconnectedMessage, initNetworkListener

    };
  },
});
</script>
<style scoped>
.custom-divider {
  margin: 0;
  padding: 0;
  height: 0px;
  min-height: auto;
}

ion-item {
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
}

ion-list {
  padding: 0;
}

ion-content {
  --ion-background-color: #fff;
}

.button-group {
  display: flex;
  justify-content: space-around;
  margin: 10px 0 ;
  padding: 0 10px 0 10px;
}
ion-button {
  --border-color: red;
  --border-width: 1px;
  --border-style: solid;
  --color: red;
  --background: transparent;
  --border-radius: 0;
  margin-right: -2px;
  font-size: 11px;
  flex: 1;
  box-sizing: border-box;
  
}

ion-button.selected {
  --background: red;
  --color: white;
  font-size: 10px;
}

.item {
  margin-bottom: 10px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border: 1px solid #ccc;
}

.item-details {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  align-items: center;
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
