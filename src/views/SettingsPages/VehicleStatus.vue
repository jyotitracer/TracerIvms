<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Vehicle Status Color</ion-title>
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
          <ion-icon slot="end" :icon="ellipseIcon" :style="{ color: statuscolor.color, height: '40px', width: '40px' }"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import useNetwork from '@/services/networkService'; // Import the network service

import { defineComponent, ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButtons, IonBackButton } from '@ionic/vue';
import { ellipse } from 'ionicons/icons';
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
    IonIcon,
    IonButtons,
    IonBackButton
  },
  setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service



    const statusList = ref([
      { status: 'Moving', key: 'MOVING', color: Constants.Veh_color.Key_Active_Color,id:"1" },
      { status: 'Idle', key: 'IDLE', color: Constants.Veh_color.Key_Idle_Color,id:"2" },
      { status: 'Stopped', key: 'STOPPED', color: Constants.Veh_color.key_Stopped_Color,id:"3" },
      { status: 'Towing', key: 'TOWING', color: Constants.Veh_color.Key_Towing_Color,id:"4" },
      { status: 'Offline', key: 'OFFLINE', color: Constants.Veh_color.Key_Offline_Color,id:"7"  }
    ]);

    onMounted(async () => {
      initNetworkListener();

      const storedColors = await storage.get('VehicleStatusColor');
        console.log("color",storedColors);

      

      if (storedColors) {

        statusList.value.forEach(statuscolor => {
          const matchedColor = storedColors.find((item: { status: string; }) => item.status.toUpperCase() === statuscolor.status.toUpperCase());

          if (matchedColor) {
            statuscolor.color = matchedColor.color; // Set the color from stored data
          }
        });
      }
    });

    return {
      ellipseIcon: ellipse,
      statusList,
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

ion-icon {
  font-size: 24px;
}
</style>
