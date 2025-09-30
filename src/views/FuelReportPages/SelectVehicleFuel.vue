<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Select Vehicle</ion-title>
      </ion-toolbar>
    </ion-header>
    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   
    <ion-content>
      <div class="search-toggle-container">
        <ion-searchbar v-model="searchQuery" placeholder="Search Vehicle"></ion-searchbar>
      </div>
      <ion-list>
        <ion-item v-for="(page, index) in filteredItems" :key="index" @click="selectVehicle(page)">
          <!-- Vertical Bar with dynamic color -->
          <div class="status-bar" :style="{ backgroundColor: page.vehicleColor }"></div>
          <ion-label>{{ page.vehicleName }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import useNetwork from '@/services/networkService'; // Import the network service

import { defineComponent, onMounted, ref, computed } from 'vue';
import { IonButtons, IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonList, IonSearchbar, IonLabel } from '@ionic/vue';
import storage from "@/services/storagefile";
import Constants from "@/common/constants";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonList,
    IonSearchbar,
    IonLabel
  },

  setup() {


    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const selectedItems = ref([]);
    const searchQuery = ref('');

    const collectResponse = async () => {
      const vehicleDetails = await storage.get(Constants.storageValue.key_Fuel_VehicleDetails);

      if (vehicleDetails && vehicleDetails.length > 0) {
        selectedItems.value = vehicleDetails.map(veh => ({
          vehicleName: veh.vehname,
          vehicleId: veh.vehid,
          vehicleStatus: veh.vehstatus,
          status: veh.status,
          vehicleColor: veh.vehColor, // Include vehicleColor
          checked: veh.status === 1 // Set `checked` based on `status`
        }));
      } else {
        selectedItems.value = [];
      }
    };

    onMounted(async () => {
      initNetworkListener();

      await collectResponse();
    });

    // const filteredItems = computed(() => {
    //   if (searchQuery.value) {
    //     return selectedItems.value.filter(item =>
    //       item.vehicleName.toLowerCase().includes(searchQuery.value.toLowerCase())
    //     );
    //   }
    //   return selectedItems.value;
    // });

    const filteredItems = computed(() => {
  const items = selectedItems.value;
  
  // Add "All Vehicles" item at the beginning
  const allVehiclesItem = {
    vehicleName: "All Vehicles",
    vehicleId: "all",
    vehicleStatus: null,
    status: null,
    vehicleColor: "#fff", // Default color for "All Vehicles"
    checked: false
  };

  // Filter based on search query if it exists
  if (searchQuery.value) {
    const filtered = items.filter(item =>
      item.vehicleName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    return [allVehiclesItem, ...filtered];
  }

  return [allVehiclesItem, ...items];
});

const selectVehicle = (vehicle) => {
      // Store the selected vehicle details in localStorage
      localStorage.setItem('selectedFuelVehicle', JSON.stringify(vehicle));
      console.log('Selected vehicle saved:', vehicle);
      goBack();
    };
    const goBack = () => {
      window.history.back(); // Or this.$router.back();
    };

    return {
      selectedItems,
      searchQuery,
      filteredItems,
      selectVehicle,
      isConnected, showReconnectedMessage, initNetworkListener,

      goBack
    };
  }
});
</script>

<style scoped>
.search-toggle-container {
  display: flex;
  align-items: center;
}

ion-searchbar {
  flex: 1;
}

ion-item {
  display: flex;
  align-items: center;
  padding-left: 0; /* Remove left padding */
  margin-left: 0; /* Remove left margin */
}

.status-bar {
  width: 4px;
  height: 100%;
  margin-right: 10px;
  border-radius: 2px;
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
