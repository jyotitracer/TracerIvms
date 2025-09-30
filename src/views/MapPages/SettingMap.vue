<template>
  <ion-page>
 <ion-header>
        <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Map Settings</ion-title>
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
            <ion-item @click="navigateToPage('maplayer')">Select Map Layer</ion-item>
            <ion-item @click="navigateToPage('vehistatus')">Configure Clustering for vehicle status</ion-item>
            <ion-item @click="navigateToPage('zoomlevel')">Configure Clustering Zoom Level</ion-item>
            <ion-item @click="navigateToPage('sethomeloc')">Configure Home Location</ion-item>
           
          </ion-list>
    
    </ion-content>
  </ion-page>
  </template>
  
  <script lang="ts">
  import useNetwork from '@/services/networkService'; // Import the network service

  import { onMounted, ref } from 'vue';
  import { IonItem, IonList, IonPage, IonToolbar, IonHeader, IonTitle, IonContent,IonBackButton ,IonButton,IonButtons} from '@ionic/vue';
  import router from '@/router/index'; // Assuming your router file is named router.js
  
  export default {
  components: {
    IonItem,
    IonButton,IonButtons,
    IonList,
    IonPage,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonContent,
    IonBackButton
  },
  setup() {
    
  
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    onMounted(()=>{
      initNetworkListener();

    });

    // Navigation function
    const navigateToPage = (pageName) => {
      // Navigate to the selected page
      console.log("Navigating to", pageName);
      if(pageName==='maplayer')
      {
        router.push('/maplayer');
      }else if(pageName==='vehistatus')
      {
        router.push('/statusofvehi');
  
      }else  if(pageName==='zoomlevel')
      {
        router.push('/setzoom');
  
      }else if(pageName==='sethomeloc')
      {
        router.push('/sethomemap');
  
      }
      // Use router navigation here to navigate to the page
    };
  
    const goBack=()=>{
      router.back();
    };
  return {
        navigateToPage,
        goBack,
        isConnected, showReconnectedMessage, initNetworkListener

      };
    }
  };
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
  