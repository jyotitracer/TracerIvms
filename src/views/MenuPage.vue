<template>
  <ion-page id="main-content" style="background-color: #ffffff;">
   
    <ion-header v-if="showHeader">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          {{ pageTitle }}
          <!-- Subtitle with Tooltip Trigger -->
          <div @click="toggleTooltip" class="subtitle">
            Tap here for more info
          </div>
        </ion-title>
        <ion-buttons slot="primary">
          <ion-button>
            <!-- <ion-icon slot="icon-only" :ios="refreshOutline" :md="refreshSharp"></ion-icon> -->
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Tooltip -->
      <div v-if="showTooltip" class="tooltip">
        <div class="tooltip-section" @click="takeTour(pageId)">
          <!-- Icon from Code -->
          <img src="\ic_tour_data.png" alt="star icon" class="tooltip-icon" />
          <!-- Text -->
          <span class="tooltip-text">Take a Tour</span>
        </div>
        <div class="tooltip-section" @click="shareScreen">
          <!-- Icon from Code -->
          <img src="\ic_share_data.png" alt="star icon" class="tooltip-icon" />
          <!-- Text -->
          <span class="tooltip-text">Share Screen</span>
        </div>
      </div>
    </ion-header>

     <!-- Network Status Bar -->
     <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>
      
    <router-view :pageTitle="pageTitle" />
  </ion-page>
</template>


<!-- This Page is used for maintain Menu items -->


<script lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonRouterOutlet,
} from "@ionic/vue";

import useNetwork from "@/services/networkService"; // Import the network service
import { search, refreshOutline, refreshSharp } from "ionicons/icons";
import { defineComponent, ref, onMounted, watch, onUnmounted } from "vue";
import storage from "@/services/storagefile";
import html2canvas from "html2canvas";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { GroupIntervalRefresh } from "@/services/GrouprefreshService";
import { useRouter, useRoute } from "vue-router";

import { username, selectedPage,isFuelEnabled } from "@/services/userstate"; // Import the global state
import { App } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { getCountryGoogleKey } from "@/services/ApiService";


export default defineComponent({
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonRouterOutlet,
  },
  setup() {

    
    const { isConnected, showReconnectedMessage, initNetworkListener } =
      useNetwork(); // Use network service

    const router = useRouter();
    const route = useRoute();

    const backPressedOnce = ref(false);
    let backButtonListener: PluginListenerHandle | undefined;

    // Reactive state
    const pageTitle = ref<string>("");
    const pageId = ref<string | number>("");
    const showTooltip = ref<boolean>(false);
    const showHeader = ref<boolean>(true);

const showExitToast = async () => {
  const toast = await toastController.create({
    message: 'Press back again to exit',
    duration: 2000,
    position: 'bottom',
  });
  await toast.present();
};

const handleBackButton = async () => {
  const currentPath = route.path;

  // Tab1 – double back to exit
  if (currentPath === '/tabs/tab1') {
    if (backPressedOnce.value) {
      App.exitApp();
    } else {
      backPressedOnce.value = true;
      await showExitToast();
      setTimeout(() => {
        backPressedOnce.value = false;
      }, 2000);
    }
  }
};

    const updatePageDetails = async () => {
      if (selectedPage.value.title !== "Logout") {
        pageTitle.value = selectedPage.value.title || "Dashboard Today";
        pageId.value = selectedPage.value.pageid || "1";
        console.log(
          "Updated Page Details:",
          pageTitle.value,
          pageId.value
        );

        showTooltip.value = false;
      }
    };

    // Watch the shared state for changes
    watch(
      () => selectedPage.value,
      () => {
        updatePageDetails();
      },
      { immediate: true }
    );

    const toggleTooltip = (): void => {
      showTooltip.value = !showTooltip.value;
      console.log("toggleclicked", showTooltip.value);
    };

    const takeTour = (id: string | number): void => {
      showHeader.value = false;
      router.replace({ name: "TourPage", params: { pageid: id } });
      toggleTooltip();
    };

    const shareScreen = async (): Promise<void> => {
      try {
        const ionPageElement = document.getElementById("main-content");
        if (!ionPageElement) {
          console.error("Main content area not found.");
          return;
        }

        const canvas = await html2canvas(ionPageElement);
        const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
        const fileName = `screenshot_${new Date().getTime()}.jpg`;

        await Filesystem.writeFile({
          path: fileName,
          data: dataUrl.split(",")[1],
          directory: Directory.Cache,
        });

        const uri = await Filesystem.getUri({
          directory: Directory.Cache,
          path: fileName,
        });

        await Share.share({
          title: "Check this out!",
          text: "Sharing a screenshot",
          url: uri.uri,
          dialogTitle: "Share Screenshot",
        });
      } catch (error) {
        console.error("Error capturing and sharing screenshot", error);
      }
    };

    // Lifecycle
    onMounted(() => {

      App.addListener('backButton', ({ canGoBack }) => {
    // prevent default capacitor back
            handleBackButton();
          }).then(listener => {
            backButtonListener = listener;
          });
      retrieveData('login_data');
      callMenuPage();
      GroupIntervalRefresh();
      initNetworkListener();

        getCountryGoogleKey();


    });

    onUnmounted(() => {
      App.removeAllListeners();
    });

    // Retrieve page details
    const callMenuPage = async (): Promise<void> => {
      showTooltip.value = false;
      const path = (await storage.get('selectedItem')) as string | null;
      const title = (await storage.get('pagename')) as string | null;
      const pageid = (await storage.get('pageid')) as string | null;

      console.log("displayname", title + " " + pageid + " " + path);

      selectedPage.value = { title, pageid, path }; // Update the shared state

      pageTitle.value = title || "Dashboard Today";
      pageId.value = pageid || "1";

      if (pageId.value !== "6") {
        const eventReport = await storage.get('eventReport');
        if (eventReport) {
          await storage.remove("eventReport");
        }
      }
      if (pageId.value !== "7") {
        const fuelData = await storage.get('fuelReport');
        if (fuelData) {
          await storage.remove("fuelReport");
        }
      }

      if (path) {
        router.replace(path);
      } else {
        router.replace("/today");
      }
    };

    const retrieveData = async (keyname: string): Promise<void> => {
      const data = await storage.get(keyname);
      if (data?.username) {
        username.value = data.username;
      }

      if(data?.isFuel)
      {
        isFuelEnabled.value=data.isFuel;
      }

    };

    return {
      search,
      refreshOutline,
      refreshSharp,
      toggleTooltip,
      showTooltip,
      takeTour,
      shareScreen,
      showHeader,
      pageTitle,
      pageId,
      isConnected,
      showReconnectedMessage,
      initNetworkListener,
    };
  },
});
</script>


<style scoped>
.subtitle {
  cursor: pointer;
  position: relative;
  font-size: 12px;
  color: #fff; /* Optional: Change color to indicate interactivity */
  margin-top: 8px; /* Adjust as necessary for spacing */
}

.tooltip {
  display: flex;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black background */
  z-index: 1000; /* Higher z-index to ensure it overlays other elements */
  opacity: 1; /* Ensure it's visible when shown */
  pointer-events: auto;
}

.tooltip-section {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  flex: 1;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  color: red; /* Text color */
  background-color: #dbd7d7; /* Background for the text */
}

.tooltip-section:hover {
  background-color: #f0f0f0; /* Hover effect */
}

.tooltip-icon {
  height: 20px; /* Adjust size as needed */
  width: 20px; /* Adjust size as needed */
  margin-bottom: 5px; /* Space between icon and text */
}

.tooltip-text {
  font-size: 12px; /* Adjust text size as needed */
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
