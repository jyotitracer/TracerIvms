<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>About</ion-title>
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
        <ion-item>
          <ion-label>App Version: 1.0.0</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Build Date : dd/mm/yyyy</ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="clickable-label"  @click="openLink('http://tracer.co.in/Mobappprivacy.aspx')">Check Privacy Policy</ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="clickable-label" @click="openLink('http://www.tracer.co.in/')">For more details visit our website</ion-label>
        </ion-item>
      
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import useNetwork from '@/services/networkService'; // Import the network service

import { defineComponent ,onMounted} from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButtons, IonBackButton } from '@ionic/vue';
import { ellipse } from 'ionicons/icons';

export default defineComponent({
  name: 'AboutPage',
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

    onMounted(()=>{
      initNetworkListener();
    })
    return {
      ellipseIcon: ellipse,
      isConnected, showReconnectedMessage, initNetworkListener

    };
  },
  methods: {
    openLink(url) {
      window.open(url, '_blank');
    },
    async goBack() {
      // Navigate back to the previous page
      this.$router.back();
    }
  },
});
</script>

<style scoped>


ion-icon {
  font-size: 24px;
}

.clickable-label {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
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
