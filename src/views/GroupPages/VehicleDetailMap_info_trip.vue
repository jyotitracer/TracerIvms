<template>
  <ion-page>
      <ion-header>
        <ion-toolbar>
          <!-- <ion-buttons slot="start">
            <ion-back-button default-href="#"></ion-back-button>
          </ion-buttons> -->
           <ion-buttons slot="start">
          <!-- Custom Back Button -->
          <ion-button @click="goBack" fill="clear">
          <ion-icon :icon="arrowBack" slot="icon-only" style="color: white;"></ion-icon>
          </ion-button>
        </ion-buttons>
          <ion-title>{{ vehicleName }}</ion-title>
        </ion-toolbar>
      </ion-header>

<ion-content class="safe-bottom">

    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   
      
      <ion-tabs>
  <ion-router-outlet></ion-router-outlet>
  <ion-tab-bar slot="bottom" class="ios-tab-bar">
    <ion-tab-button 
      @click="selectTab('map')" 
      :class="{ 'tab-selected': selectedTab === 'map' }"
    >
      <ion-icon :icon="location" />
      <ion-label>Map</ion-label>
    </ion-tab-button>

    <ion-tab-button 
      @click="selectTab('info')" 
      :class="{ 'tab-selected': selectedTab === 'info' }"
    >
      <ion-icon :icon="informationCircle" />
      <ion-label>Info</ion-label>
    </ion-tab-button>

    <ion-tab-button 
      @click="selectTab('trip')" 
      :class="{ 'tab-selected': selectedTab === 'trip' }"
    >
      <ion-icon :icon="listSharp" />
      <ion-label>Trip</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonContent, IonTabBar, IonTabButton, IonTabs, 
  IonLabel, IonIcon, IonPage, IonButton, 
  IonButtons, IonHeader, IonTitle, IonToolbar, 
  IonRouterOutlet, 
  useIonRouter,
  onIonViewWillEnter,
  onIonViewWillLeave,
  onIonViewDidLeave,
  useBackButton
} from '@ionic/vue';
import { useRouter ,useRoute} from 'vue-router';
import { location,informationCircle, documentAttach, list, listSharp, arrowBack} from 'ionicons/icons';
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import useNetwork from '@/services/networkService'; // Import the network service
import type { PluginListenerHandle } from "@capacitor/core";
import { App } from "@capacitor/app";
import { showToast,showToastMessage } from '@/services/toast'; // Custom toast utility
import { color } from 'html2canvas/dist/types/css/types/color';


export default defineComponent({
  name: "VehcileMapInfoTripPage",
  
  components: {
    IonContent,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonButton,
    IonButtons,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonRouterOutlet,
  },

  props: {
    vehicleId: {
      type: String,
      required: true
    },
    vehicleName: {
      type: String,
      required: true
    },
    groupname:{
      type:String,
    }

  },

   setup(props) {
    let isFirstTimeDataCall = true;


    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service


    const selectedTab = ref('map');
    const router = useRouter();
    const route = useRoute();

    const ionRouter = useIonRouter();

    let backButtonListener: any;



    const selectTab = (tabname: string) => {
      selectedTab.value = tabname;

      router.replace(`/vehtabs/${props.vehicleId}/${props.vehicleName}/${props.groupname}/${tabname}`);
    };


    const goBack = () => {

    

    setTimeout(() => {
      window.location.reload(); // Force reload after going back
    }, 100);
    router.back();
  };


       // Listen for hardware back button
    onMounted(async () => {
      
      initNetworkListener();
      selectTab('map');



      // Method 1 — Ionic’s built-in listener
        useBackButton(9999, (processNextHandler) => {
      
                                goBack();
                                

        });

        // OR Method 2 — Capacitor’s App listener (more control)
        backButtonListener = await App.addListener('backButton', ({ canGoBack }) => {
         

                          //  showToastMessage("app back");

        });
            
     
  });



    
    onUnmounted(()=>{
        if (backButtonListener) backButtonListener.remove();

    });

    return {
      location,informationCircle,documentAttach,listSharp,
      selectedTab,
      selectTab,
      vehicleId: props.vehicleId,
      vehicleName: props.vehicleName,
      groupname:props.groupname,
      isConnected, showReconnectedMessage, initNetworkListener,
      goBack,
      arrowBack,

    };
  },

  
});
</script>

<style scoped>


/* iOS tab bar container */
.ios-tab-bar {
  padding-bottom: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Default tab style */
ion-tab-button {
  --color: #8e8e93;              /* iOS gray */
  --color-selected: var(--ion-color-primary);     /* iOS blue */
  font-size: 11px;
}

/* Icon size for iOS */
ion-tab-button ion-icon {
  font-size: 22px;
  margin-bottom: 2px;
}

/* Label spacing */
ion-tab-button ion-label {
  font-size: 11px;
}

/* Selected tab */
.tab-selected ion-icon,
.tab-selected ion-label {
  color: var(--ion-color-primary) !important; /* iOS native blue */
}


.tab-selected ion-icon,
.tab-selected ion-label {
  color: var(--ion-color-primary) !important; /* Set selected tab icon and label to red */
}

.network-status-bar {
  background-color:#00875A;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}


.network-status-bar.connected {
  background-color: green;
}

</style>
