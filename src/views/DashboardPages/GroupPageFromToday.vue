<template>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Group-Dashboard-Today

          <div @click="toggleTooltip" class="subtitle">
            Tap here for more info
          </div>

        </ion-title>
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

    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>  

    <ion-content>
      <div class="month-below1">
        <div class="month-total date">{{ currentDate }}</div>
        <ion-searchbar 
          placeholder="Search Group"
          v-model="searchQuery"
        ></ion-searchbar>
      </div>

      <ion-list>
        <custom-item
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
        />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonButtons, IonBackButton, IonContent, IonHeader, IonPage, 
  IonTitle, IonToolbar, IonList, IonSearchbar, loadingController 
} from '@ionic/vue';
import { defineComponent, ref, computed, onMounted } from 'vue';
import CustomItem from '@/components/TodaysGroupCustomItem.vue';
import { useRoute } from 'vue-router';
import { fetchData } from "@/services/ApiService";
import Constants from "@/common/constants";
import { checkTimeDifference } from "@/services/dateTimeUtils";
import storage from "@/services/storagefile";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast';
import useNetwork from '@/services/networkService'; // Import the network service
import html2canvas from 'html2canvas';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { useIonRouter } from '@ionic/vue';


export default defineComponent({
  name: 'Home',
  
  setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service
    const router = useIonRouter();

    const route = useRoute();
    const currentDate = route.params.currentDate;
    const originalDate = ref(currentDate);

    // State variables
    const items = ref([]);
    const searchQuery = ref('');
    const showTooltip = ref(false);
    const showHeader = ref(true);
    const pageId = ref('11');


    const toggleTooltip = () => {
      showTooltip.value = !showTooltip.value;
      console.log("toggleclicked", showTooltip.value);
    };

    const takeTour = (id) => {
      showHeader.value = false;
      router.push({ name: "TourPage", params: { pageid: id } });
      toggleTooltip();
    };

    const shareScreen = async () => {
      try {
        const ionPageElement = document.getElementById("main-content");
        if (!ionPageElement) {
          console.error("Main content area not found.");
          return;
        }

        const canvas = await html2canvas(ionPageElement);
        const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        const fileName = `screenshot_${new Date().getTime()}.jpg`;

        await Filesystem.writeFile({
          path: fileName,
          data: dataUrl.split(',')[1],
          directory: Directory.Cache,
        });

        const uri = await Filesystem.getUri({
          directory: Directory.Cache,
          path: fileName,
        });

        await Share.share({
          title: 'Check this out!',
          text: 'Sharing a screenshot',
          url: uri.uri,
          dialogTitle: 'Share Screenshot',
        });
      } catch (error) {
        console.error('Error capturing and sharing screenshot', error);
      }
    };


    // Function to format the date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formattedDate = ref(formatDate(originalDate.value));

    async function DisplayStoreData() {
      const arrData = await storage.get(Constants.storageValue.Key_TodaysGroup);

      if (arrData && arrData.length > 0) {
        items.value = arrData.map((data, index) => ({
          id: index + 1, // Unique ID
          group: data.grp_name, // Group name
          number: parseInt(data.t_v), // Total vehicles
          moving: parseInt(data.t_av), // Active vehicles
          stopped: parseInt(data.t_sv), // Offline vehicles
          offline: parseInt(data.t_ov), // Offline vehicles, adjust if needed
          distance1: data.t_d, // Total distance
          distance2: data.a_d_pav, // Distance per day
          moving1: data.t_dd, // Moving duration
          moving2: data.a_dd_pav, // Moving duration per day
          vio1: data.t_vc, // Total violations
          vio2: data.a_vc_pav, // Violations per day
          fuel1: data.t_f, // Total fuel
          fuel2: data.a_f_pav // Fuel per day
        }));
      }
    }

    const CallAPIForGroupTodayData = async () => {
  const params = {
    req_period: "5",
    is_smry: "0",
    fdate: formattedDate.value,
    rpt_type: "1",
    tdate: formattedDate.value
  };

  loadingController.create({
    message: "Loading...",
    backdropDismiss: true // Makes the loading controller cancelable

  }).then(loading => {
    loading.present();




  // Return a promise to keep the same behavior as async/await
  return fetchData(
    Constants.CONT.Mobile_Contro,
    Constants.CMD.Req_Dash_All,
    params
  )
    .then((response) => {
      if (response.status === 200) {
        const arrData = response.data.arr_data;

        if (arrData && arrData.length > 0) {
          return storage.set(Constants.storageValue.Key_TodaysGroup, arrData)
            .then(() => {
              items.value = arrData.map((data, index) => ({
                id: index + 1,
                group: data.grp_name,
                number: parseInt(data.t_v),
                moving: parseInt(data.t_av),
                stopped: parseInt(data.t_sv),
                offline: parseInt(data.t_ov),
                distance1: data.t_d,
                distance2: data.a_d_pav,
                moving1: data.t_dd,
                moving2: data.a_dd_pav,
                vio1: data.t_vc,
                vio2: data.a_vc_pav,
                fuel1: data.t_f,
                fuel2: data.a_f_pav
              }));
            });
        }
      } else {
        console.error("Error fetching data:", response.data);
      }
    })
    .catch(error => {
          console.error("Error:", error);
        })
        .finally(() => {
          // Dismiss the loading controller after the API call completes
          return loading.dismiss();
        });
    })
    .catch(error => {
      console.error("Error creating loading:", error);
    });
};


    const filteredItems = computed(() =>
      items.value.filter(item => 
        item.group.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    onMounted(async () => {
      initNetworkListener();

      const ApiCalledDate = localStorage.getItem("APIcalledTodaysGroupDate");

      if (ApiCalledDate !== null) {
        const isMinDoneOrNot = checkTimeDifference(ApiCalledDate);
        const status = await Network.getStatus();

        if (isMinDoneOrNot && status.connected) {
          DisplayStoreData();
          CallAPIForGroupTodayData();
        } else {
          showToast();
          DisplayStoreData();
        }
      } else {
        DisplayStoreData();
        CallAPIForGroupTodayData();
      }
    });

    return {
      currentDate,
      formattedDate,
      items,
      searchQuery,
      filteredItems,
      isConnected, showReconnectedMessage, initNetworkListener,
      toggleTooltip,
      showTooltip,
      takeTour,
      shareScreen,
      showHeader,
      pageId

    };
  },

  components: {
    IonPage, IonContent, IonList, IonSearchbar, CustomItem, 
    IonButtons, IonBackButton, IonHeader, IonTitle, IonToolbar
  },

  methods: {
    goBack() {
      this.$router.back();
    }
  }
});
</script>

<style>

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

.month-below1 {
  align-items: center;
  position: relative;
  background-color: #f4f2f2;
  text-align: center;
  margin-top: 5px;
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
