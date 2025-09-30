<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Change Vehicle Status</ion-title>
      </ion-toolbar>
    </ion-header>
    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   
    <ion-content>
      <ion-list>
        <ion-item v-for="(statuscolor, index) in statusList" :key="index">
          <ion-label>{{ statuscolor.status }}</ion-label>
          <!-- Toggle button for each status -->
          <ion-toggle slot="end"
                      :checked="statuscolor.isEnabled"
                      @ionChange="toggleStatus(index, $event)"
                      color="danger">
          </ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>


<script lang="ts">
import useNetwork from '@/services/networkService'; // Import the network service

import { defineComponent, ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton } from '@ionic/vue';
import Constants from "@/common/constants";
import storage from "@/services/storagefile";

export default defineComponent({
  name: 'VehicleStatusColorPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonButtons,
    IonBackButton
  },
  setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const statusList = ref([
      { status: 'Moving', key: 'MOVING', color: Constants.Veh_color.Key_Active_Color,id:"1",isEnabled:true },
      { status: 'Idle', key: 'IDLE', color: Constants.Veh_color.Key_Idle_Color,id:"2" ,isEnabled:true},
      { status: 'Stopped', key: 'STOPPED', color: Constants.Veh_color.key_Stopped_Color,id:"3" ,isEnabled:true},
      { status: 'Towing', key: 'TOWING', color: Constants.Veh_color.Key_Towing_Color,id:"4" ,isEnabled:true},
      { status: 'Offline', key: 'OFFLINE', color: Constants.Veh_color.Key_Offline_Color,id:"7" ,isEnabled:true }
    ]);



    // Load data from storage when the component is mounted
    onMounted(async () => {
      initNetworkListener();

      const storedColors = await storage.get('VehicleStatusColor');
      if (storedColors && storedColors) {
        statusList.value.forEach(statuscolor => {

          const matchedColor = storedColors.find(item => item.status === statuscolor.status);
          if (matchedColor) {
            statuscolor.color = matchedColor.color; // Set the color from stored data
            statuscolor.isEnabled = matchedColor.isEnabled ; // Set the toggle state from stored data
          }
        });
      }
    });

    // Toggle the status and save the state to storage
    const toggleStatus = async (index, event) => {
      const isEnabled = event.detail.checked;
      statusList.value[index].isEnabled = isEnabled;

      // Update the localStorage data
      const updatedData = statusList.value.map(statusvalue => ({
        ...statusvalue,
        isEnabled: statusvalue.isEnabled,
      }));

      console.log("updatedData",updatedData);

      // Save to localStorage
      await storage.set('VehicleStatusColor',  updatedData );
    };

    return {
      statusList,
      toggleStatus,
      isConnected, showReconnectedMessage, initNetworkListener

    };
  },
  methods:{
    async goBack() {
      this.$router.back();
    }
  }
});
</script>


<style scoped>
ion-icon {
  font-size: 24px;
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
