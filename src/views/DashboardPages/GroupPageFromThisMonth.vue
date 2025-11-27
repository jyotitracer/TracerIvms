<template>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Group-Dashboard-Month

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
        <div class="month-total date">{{ FromDate }} to {{ ToDate }}</div>
        <ion-searchbar 
          placeholder="Search Group"
          v-model="searchQuery"
        ></ion-searchbar>
      </div>

      <div class="custom-legend">
        <div class="legend-item">
          <span class="legend-box" :style="{ backgroundColor: moving_color }"></span> Active
        </div>
        <div class="legend-item">
          <span class="legend-box" :style="{ backgroundColor: stopped_color }"></span> Stopped
        </div>
        <div class="legend-item">
          <span class="legend-box" :style="{ backgroundColor: offline_color }"></span> Offline
        </div>
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
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonSearchbar,
  loadingController
} from '@ionic/vue';
import useNetwork from '@/services/networkService'; // Import the network service

import { defineComponent, computed, ref, onMounted } from 'vue';
import CustomItem from '@/components/MonthGroupCustomItem.vue';
import router from '@/router/index'; 
import { useRoute } from 'vue-router';
import { fetchData } from "@/services/ApiService";
import Constants from "@/common/constants";
import { checkTimeDifference } from "@/services/dateTimeUtils";
import storage from "@/services/storagefile";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast';
import html2canvas from 'html2canvas';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';



                 
export default defineComponent({
  name: 'groupmonth',
  data() {
    return {
      moving_color: '',  // To store the dynamic color
      stopped_color: '',
      offline_color: '',
      idle_color:'',
    };
  },
  async created() {
    // Fetch color values from storage or use defaults
    const movingStoredColor = await storage.get('movingcolor');
    const stoppedStoredColor = await storage.get('stoppedcolor');
    const idleStoredColor = await storage.get('idlecolor');
    const offlineStoredColor = await storage.get('offlinecolor');

    this.moving_color = movingStoredColor || Constants.Veh_color.Key_Active_Color;
    this.stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
    this.offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;
    this.idle_color = idleStoredColor || Constants.Veh_color.Key_Idle_Color;

  },
 setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service


    
   
    const route = useRoute();
    const FromDate = route.params.fromdate;
    const ToDate = route.params.todate;

    // Original date references
    const FromoriginalDate = ref(FromDate);
    const TooriginalDate = ref(ToDate);

    // Items and search query
    const items = ref([]);
    const searchQuery = ref('');
    const showTooltip = ref(false);
    const showHeader = ref(true);
    const pageId = ref('12');



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


    // Format date function
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formattedFromDate = ref(formatDate(FromoriginalDate.value));
    const formattedToDate = ref(formatDate(TooriginalDate.value));

    // Fetch and display stored data
    async function DisplayStoredData() {
      const arrData = await storage.get(Constants.storageValue.Key_MonthGroup);

      if (arrData && arrData.length > 0) {
        items.value = arrData.map((data, index) => ({
          id: index + 1,
          group: data.grp_name,
          number: parseInt(data.t_v),
          moving: parseInt(data.t_av),
          stopped: parseInt(data.t_sv),
          offline: parseInt(data.t_ov),
          distance1: data.t_d,
          distance2: data.a_d_pd,
          moving1: data.t_dd,
          moving2: data.a_dd_pd,
          vio1: data.t_vc,
          vio2: data.a_vc_pd,
          fuel1: data.t_f,
          fuel2: data.a_f_pd,
          grphArr: data.grph_arr
        }));
      }
    }

    // API call function
    const CallAPIForGroupTodayData = async () => {
  const params = {
    req_period: "5",
    is_smry: "0",
    fdate: formattedFromDate.value,
    rpt_type: "1",
    day_avg: "1",
    tdate: formattedToDate.value
  };

  loadingController.create({
    message: "Loading...",
    backdropDismiss: true // Makes the loading controller cancelable

  }).then(loading => {
    loading.present();




  // Return a promise to handle API request
  return fetchData(
    Constants.CONT.Mobile_Contro,
    Constants.CMD.Req_Dash_All,
    params
  )
    .then((response) => {
      const responsejson = response.data;

      if (response.status === 200) {
        const arrData = responsejson.arr_data;
        storage.set('APIcalledMonthGroupDate', new Date() + "");

        if (arrData && arrData.length > 0) {
          // Store data in storage and map it to items
          return storage.set(Constants.storageValue.Key_MonthGroup, arrData)
            .then(() => {
              items.value = arrData.map((data, index) => ({
                id: index + 1,
                group: data.grp_name,
                number: parseInt(data.t_v),
                moving: parseInt(data.t_av),
                stopped: parseInt(data.t_sv),
                offline: parseInt(data.t_ov),
                distance1: data.t_d,
                distance2: data.a_d_pd,
                moving1: data.t_dd,
                moving2: data.a_dd_pd,
                vio1: data.t_vc,
                vio2: data.a_vc_pd,
                fuel1: data.t_f,
                fuel2: data.a_f_pd,
                grphArr: data.grph_arr
              }));
            });
        }
      } else if (response.status === 401) {
        console.error("Unauthorized:", responsejson.message);
      } else {
        console.error("Empty response data");
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


    // Filtered items based on search query
    const filteredItems = computed(() =>
      items.value.filter(item =>
        item.group.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    // On mount logic
    onMounted(async () => {
      initNetworkListener();

      const ApiCalledDate = storage.get('APIcalledMonthGroupDate');

      if (ApiCalledDate !== null) {
        const isMinDoneOrNot = checkTimeDifference(ApiCalledDate);

        if (isMinDoneOrNot) {
          const status = await Network.getStatus();
          if (status.connected) {
            DisplayStoredData();
            CallAPIForGroupTodayData();
          } else {
            showToast();
            DisplayStoredData();
          }
        } else {
          DisplayStoredData();
        }
      } else {
        DisplayStoredData();
        CallAPIForGroupTodayData();
      }
    });

    

   

    return {
      FromDate,
      ToDate,
      formattedFromDate,
      formattedToDate,
      items,
      searchQuery,
      filteredItems,
      isConnected, showReconnectedMessage, initNetworkListener,
      toggleTooltip,
      showTooltip,
      takeTour,
      shareScreen,
      showHeader,
       pageId,


    };
  },

  components: {
    IonPage,
    IonContent,
    IonList,
    IonSearchbar,
    CustomItem,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonTitle,
    IonToolbar
  },

  methods: {
    goBack() {
      this.$router.back();
    }
  }
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

.custom-legend {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.legend-box {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border: 1px solid;
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
