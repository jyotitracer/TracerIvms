<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Map Layer</ion-title>
      </ion-toolbar>
      </ion-header>

      <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   


      <ion-content class="ion-padding">

    <!-- Radio Buttons for Map Types -->
    <div class="radio-group">
      <label>
        <input type="radio" value="roadmap" v-model="selectedMapType" />
        NORMAL
      </label>
      <label>
        <input type="radio" value="satellite" v-model="selectedMapType" />
        SATELLITE
      </label>
      <label>
        <input type="radio" value="hybrid" v-model="selectedMapType" />
        HYBRID
      </label>
      <label>
        <input type="radio" value="terrain" v-model="selectedMapType" />
        TERRAIN
      </label>
    </div>

   
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
    import { IonButtons,IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
    import { defineComponent } from 'vue';
    import { ref ,watch,onMounted} from "vue";
    import useNetwork from '@/services/networkService'; // Import the network service


    export default defineComponent({
      components: {
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonBackButton
      },
      setup(){

        const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

        const selectedMapType = ref(localStorage.getItem("groupmapType") || "roadmap");

              // Watch for changes in selectedMapType and save it to localStorage
              watch(selectedMapType, (newType) => {
                localStorage.setItem("groupmapType", newType);
              });


              onMounted(()=>{
                initNetworkListener();

              });
              return {
                selectedMapType,
                isConnected, showReconnectedMessage, initNetworkListener

              };
      },
      methods:
      {
                async goBack()
                {
                       // Navigate back to the previous page
                    this.$router.back();
                }
      },
    });
  </script>


<style scoped>
/* Container for the radio group */
.radio-group {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
}

/* Label styling */
label {
  margin-bottom: 10px;
  font-size: 16px;
}

/* Optional: Customize radio button appearance */
input[type="radio"] {
  margin-right: 10px;
}

.selected-type {
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
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