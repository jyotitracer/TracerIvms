<template>
  <!-- <div v-if="!isConnected" class="network-status-bar">
       No Network Connection
     </div>
     <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
       Connected to Network
     </div> -->
<ion-content fullscreen class="safe-bottom">
  
   <div class="month-below1">
     <div class="month-total date" @click="clickForDatePage">
       {{ formattedCurrentDate }}
     </div>
     <div class="right-group" @click="openGroup">
       <div class="month-total">Group</div>
       <img
         src="/right-arrow.png"
         alt="event icon"
         class="icon-arrow"
       />
     </div>
   </div>

   <div class="overview-header">
  <div class="overview-title">Precision Overview</div>
  <div class="overview-time">
    Updated {{ lastUpdatedText }}
  </div>
</div>

  <div class="custom-card">

  <!-- Chart -->
  <div class="chart-wrapper">
    <canvas ref="pieChartRef"></canvas>

    <!-- CENTER TEXT -->
    <div class="center-text">
      <span style="font-weight:bold">TOTAL COUNT<br>  </span>
      <span style="font-size: 20px; font-weight: 600; color: black;">{{ totalCount }}</span>
    </div>
  </div>

  <!-- STATUS -->
  <div class="status-row">

    <div class="status-box">
      <div class="dot active"></div>
     
      <span class="status-value">{{ chartData.moving }}</span>
       <span class="status-label">Active</span>
    </div>

    <div class="status-box">
      <div class="dot stopped"></div>
     
      <span class="status-value">{{ chartData.stopped }}</span>
       <span class="status-label">Stopped</span>
    </div>

    <div class="status-box">
      <div class="dot offline"></div>
     
      <span class="status-value">{{ chartData.offline }}</span>
       <span class="status-label">Offline</span>
    </div>

  </div>

</div>

   <!-- <div class="month-below">
     <div class="month-total">Fleet Total - </div>
     <div class="today-total">(Per Vehicle Average)</div>
   </div> -->

  <!-- Distance -->
   <div class="below_cust_part">

<ion-card class="custom-metric-card">
  <ion-card-content>
    <div class="card-row">

      <div class="left-section">
        <div class="icon-box">
          <ion-icon :icon="distanceIcon" style="font-size: 30px;" />
        </div>

        <div class="text-container">
          <p class="text1">Distance travelled</p>
          <div class="value-row">
            <p class="text2">{{ Distance_tot }}</p>
            <p class="text3">({{ Distance_per }})</p>
          </div>
        </div>
      </div>


    </div>
  </ion-card-content>
</ion-card>


<!-- Moving Duration -->
<ion-card class="custom-metric-card">
  <ion-card-content>
    <div class="card-row">

      <div class="left-section">
        <div class="icon-box">
           <ion-icon :icon="durationIcon" style="font-size: 30px;" />
        </div>

        <div class="text-container">
          <p class="text1">Moving Duration</p>
          <div class="value-row">
            <p class="text2">{{ movingDuration1 }}</p>
            <p class="text3">({{ movingDuration2 }})</p>
          </div>
        </div>
      </div>


    </div>
  </ion-card-content>
</ion-card>


<!-- Violation -->
<ion-card class="custom-metric-card">
  <ion-card-content>
    <div class="card-row">

      <div class="left-section">
        <div class="icon-box">
          <ion-icon :icon="violationIcon" style="font-size: 30px;" />
        </div>

        <div class="text-container">
          <p class="text1">Violation Count</p>
          <div class="value-row">
            <p class="text2">{{ violation1 }}</p>
            <p class="text3">({{ violation2 }})</p>
          </div>
        </div>
      </div>

     

    </div>
  </ion-card-content>
</ion-card>


<!-- Fuel -->
<ion-card class="custom-metric-card" v-if="IsFuelEnable">
  <ion-card-content>
    <div class="card-row">

      <div class="left-section">
        <div class="icon-box">
           <ion-icon :icon="fuelIcon" style="font-size: 30px;" />
        </div>

        <div class="text-container">
          <p class="text1">Fuel Consumed</p>
          <div class="value-row">
            <p class="text2">{{ fuelCons1 }}</p>
            <p class="text3">({{ fuelCons2 }})</p>
          </div>
        </div>
      </div>

      

    </div>
  </ion-card-content>
</ion-card>

   </div>
 </ion-content>
</template>



<style scoped>

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 20px 8px;
}

.overview-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}


.overview-time {
  font-size: 12px;
  color: #6b7280;
}

.below_cust_part{
  margin: 20px;
}

.custom-metric-card {
  margin: 10px;
  border-radius: 16px;

  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0px 4px 18px rgba(0, 30, 60, 0.04);
}

/* hover effect */
.custom-metric-card:hover {
  background: #d8f2ff;
}

.custom-metric-card:hover .right-icon {
  color: var(--ion-color-primary);
}

/* layout */
.card-row {
  display: flex;
  align-items: center;
}

/* left side */
.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* icon box */
.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(var(--ion-color-primary-rgb), 0.1);
}

.icon-box ion-icon {
  font-size: 22px;
  color: var(--ion-color-primary);
}

/* text */
.label-text {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b787f;
  margin: 0;
}

.value-text {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  color: #021f29;
}

.unit-text {
  font-size: 14px;
  color: #6b787f;
  font-weight: 500;
}

/* right icon */
.right-icon {
  font-size: 22px;
  color: #9aa6ad;
  transition: 0.3s;
}



.item-inner {
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    margin-bottom: 0;
    padding-top: var(--inner-padding-top);
    padding-bottom: var(--inner-padding-bottom);
    padding-right: 0px;
    padding-left: 0px;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-direction: inherit;
    flex-direction: inherit;
    -ms-flex-align: inherit;
    align-items: inherit;
    -ms-flex-item-align: stretch;
    align-self: stretch;
    min-height: inherit;
    border-width: var(--inner-border-width);
    border-style: var(--border-style);
    border-color: var(--border-color);
    -webkit-box-shadow: var(--inner-box-shadow);
    box-shadow: var(--inner-box-shadow);
    overflow: inherit;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
/* 🔥 CARD STYLE */
.custom-card {
  background: white;
  border-radius: 16px;
  padding: 10px;
  margin: 10px 20px 20px 20px;

  /* soft shadow like your HTML */
  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);

  display: flex;
  flex-direction: column;
  align-items: center;
}

.padding-class{
    padding: 100px;

}

/* CHART */
.chart-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  margin-top: 20px;
}

/* CENTER TEXT */
.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.center-text span {
  font-size: 12px;
  color: #535f66;
}

.center-text b {
  font-size: 28px;
  font-weight: 800;
}

/* STATUS ROW */
.status-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
}

/* EACH STATUS */
.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

/* OPTIONAL CENTER DIVIDER */
.status-box.mid {
  border-left: 1px solid rgba(189, 202, 192, 0.2);
  border-right: 1px solid rgba(189, 202, 192, 0.2);
}

/* DOT */
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-bottom: 5px;
}

/* COLORS */
.dot.active {
  background: v-bind(moving_color);
}

.dot.stopped {
  background: v-bind(stopped_color);
}

.dot.offline {
  background: v-bind(offline_color);
}

/* TEXT */
.status-label {
  font-size: 12px;
  color: #535f66;
}
.dot.active, .dot.offline , .dot.stopped{
      width: 8px;
    height: 8px;
    border-radius: 50%;

}

.status-value {
  font-weight: 700;
  font-size: 18px;
}

.custom-item {
 display: flex;
 align-items: center;
 flex-direction: column;
 margin: 10px;


}

#chart-container {
 width: 150px;
 height: 180px;
 margin-right: 10px;
 top: 20px; /* Distance from the top of the screen */
 left: 50%; /* Center horizontally */
}
.item-content {
 flex: 1;
 
}
.group-name {
 font-weight: bold;
 margin-bottom: 10px;
 margin-left: 5px;
}
.status {
 display: flex;
 flex-direction: column;
}
.status-item {
 display: flex;
 align-items: center;
 justify-content: space-between; /* Add this to space the label and value */
 margin-bottom: 15px;
 border-radius: 15px;
 padding: 5px 10px;
 font-size: 0.9em;
 background-color: white; /* White background for all status items */
 border: 1px solid; /* Set a border for all status items */
}

.moving {
 color: v-bind(moving_color); /* Dynamic text color */
}

.idle {
 color: v-bind(idle_color); /* Dynamic text color */
}

.stopped {
 color: v-bind(stopped_color); /* Dynamic text color */
}

.offline {
 color: v-bind(offline_color); /* Dynamic text color */
}



.month-below {
 display: flex;
 padding: 10px;
 align-content: center;
 flex-direction: inherit;
 justify-content: center;
}
.month-total {
 font-size: 16px;
 text-align: center;
}
.today-total {
 font-size: 11px;
 align-content: center;
}
.text-container {
 /* display: flex;
 flex-direction: column; */
 justify-content: center;
}

.text1 ,.text3{
 margin: 0;
 padding: 0;
 font-size: 14px;
 /* color: grey; */
 font-weight: 400;
}
.text2 {
 margin: 0;
 padding: 0;
 font-size: 18px;
 /* color: #5d5b5b; */
 font-weight: bold;
}


.month-below1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  padding: 10px 16px;
  margin: 12px 16px 8px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.month-total.date {
  color: #006837;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.right-group {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #006837;
  font-weight: 700;
  cursor: pointer;
}

.icon-arrow {
  width: 20px;
  height: 20px;
  margin-left: 5px;

  filter: invert(34%) sepia(91%) saturate(400%) hue-rotate(120deg);
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
.custom-item-card {
  --background: #e6f6ff; /* like your HTML section */
  --border-width: 0px;   /* remove default line */
  --inner-border-width: 0px;

  border-radius: 8px;
  margin: 10px 20px 20px 20px;

  /* soft elevation */
  box-shadow: 0px 4px 12px rgba(2, 31, 41, 0.04);
}

/* REMOVE LIST LINES */
ion-list {
  background: transparent;
}
</style>

<script>
import {
 defineComponent,
 ref,
 onMounted,
 watch,
 onBeforeUnmount,
 nextTick,
 computed,
} from "vue";
import {
 IonContent,
 IonIcon,
 IonCol,
 IonRow,
 IonItem,
 IonList,
 IonGrid,
 loadingController,IonCard,IonCardContent,
} from "@ionic/vue";
import { checkTimeDifference } from "@/services/dateTimeUtils"; // Make sure this path is correct

import { Chart, registerables } from "chart.js";
import { timeOutline, warningOutline, waterOutline, checkboxSharp } from "ionicons/icons";
import { distanceRouteIcon } from "@/common/customIcons";
import router from "@/router/index"; // Assuming your router file is named router.js
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import storage from "@/services/storagefile";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function
import { onIonViewWillEnter } from '@ionic/vue';
import { useBackButton } from '@ionic/vue';
import { showToastMessage } from '@/services/toast'; 

const savedTodaysData = ref("");
    let isFirstTimeDataCall = true;

    let updateTimer;

Chart.register(...registerables);

let isPeriodChange=false;

export default defineComponent({
 name: "PieChartView",
 components: { IonContent, IonIcon, IonCol, IonRow, IonItem, IonList,IonGrid,IonCard,IonCardContent},

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

  // Set the colors from constants or directly in your code

    let lastBackPressed = 0;

  
   const isConnected = ref(true);
   const showReconnectedMessage = ref(false);
   let reconnectTimeout = null;
   const IsFuelEnable=ref(true);

const lastUpdatedTime = ref('');
const lastUpdatedText = ref("Just now");

   const formatUpdatedTime = (date) => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};


const updateLastUpdatedText = (apiDate) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - apiDate.getTime()) / 1000);

  if (diff < 60) {
    lastUpdatedText.value = "Just now";
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    lastUpdatedText.value = `${mins} min${mins > 1 ? "s" : ""} ago`;
  } else if (diff < 86400) {
    const hrs = Math.floor(diff / 3600);
    lastUpdatedText.value = `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diff / 86400);
    lastUpdatedText.value = `${days} day${days > 1 ? "s" : ""} ago`;
  }
};


const checkNetworkStatus = async () => {
 const status = await Network.getStatus();
 isConnected.value = status.connected;
};


const totalCount = computed(() => {
  return Number(chartData.value.moving || 0) +
         Number(chartData.value.stopped || 0) +
         Number(chartData.value.offline || 0);
});
const listenToNetworkChanges = () => {
     Network.addListener('networkStatusChange', (status) => {
       isConnected.value = status.connected;

       if (status.connected) {
         // Show "Connected" message for 3 seconds when network reconnects
         showReconnectedMessage.value = true;
         if (reconnectTimeout) clearTimeout(reconnectTimeout);
         
         reconnectTimeout = setTimeout(() => {
           showReconnectedMessage.value = false;
         }, 10000); // Show for 3 seconds
       }
     });
 
};



         function getFormattedDate(date) {
               const options = { year: "numeric", month: "short", day: "2-digit" };
               return new Intl.DateTimeFormat("en-US", options).format(date);
         }

// Function to get the date in "day-mm-yyyy" format (e.g., "14-08-2024")
         function get_Date_API(date) {
           const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit format
           const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
           const year = date.getFullYear();

           return `${day}-${month}-${year}`;
         }
           
           const receivedDate = ref(null);
           const formattedCurrentDate=ref(null);
           const dateAPI=ref(null);

         if(receivedDate.value!==null)
           {
               formattedCurrentDate.value = getFormattedDate(receivedDate.value);
               dateAPI.value = get_Date_API(receivedDate.value);
           }else {
               // Example usage:
               const today = new Date();

               formattedCurrentDate.value = getFormattedDate(today);
               dateAPI.value = get_Date_API(today);
           }

          
                   
                   



           async function DisplayStoredData(){
             const arrData = await storage.get(Constants.storageValue.Key_Todays);

                       if (arrData && arrData.length > 0) {
                         // Access t_av from the first item
                         todaysData.value.t_av = arrData[0].t_av;

                         // Assign other values if needed
                         todaysData.value.t_sv = arrData[0].t_sv; // Replace with actual key
                         todaysData.value.t_ov = arrData[0].t_ov; // Replace with actual key

                         Distance_tot.value = arrData[0].t_d;
                         Distance_per.value = arrData[0].a_d_pav;
                         movingDuration1.value = arrData[0].t_dd;
                         movingDuration2.value = arrData[0].a_dd_pav;
                         violation1.value = arrData[0].t_vc;
                         violation2.value = arrData[0].a_vc_pav;
                         fuelCons1.value = arrData[0].t_f;
                         fuelCons2.value = arrData[0].a_f_pav;
                         isFirstTimeDataCall=false;


                         // Update chart data
                         updateChartData();

                       }


           }
           
           async function CallAPIForTodayData() {
            console.log("calledAPi");
                     const DateTime = dateAPI.value;

                     const params = {
                       req_period: "5",
                       is_smry: "1",
                       fdate: DateTime,
                       rpt_type: "1",
                       tdate: DateTime,
                     };

                                               // Show loading controller
                                               loadingController.create({
                                           message: "Loading...",
                                           backdropDismiss: true // Makes the loading controller cancelable

                                         }).then(loading => {
                                            if(isFirstTimeDataCall)
                                            {
                                            loading.present();
                                                }


                     // Call the API using the fetchData promise
                     fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Dash_All, params)
                       .then(async response => {
                         const responsejson = response.data;

                         if (response.status === 200) {
                           // Handle success
                           const arrData = responsejson.arr_data;
                           console.log("Received data");

                           const currentDateTime = new Date();
                          await storage.set('APIcalledTodaysDate', currentDateTime);
                            updateLastUpdatedText(currentDateTime);


                           if (arrData && arrData.length > 0) {
                             console.log("displayerror", arrData[0]);

                             // Store today's data and update UI values
                             return await storage.set(Constants.storageValue.Key_Todays, arrData)
                               .then(() => {
                                 todaysData.value.t_av = arrData[0].t_av;
                                 todaysData.value.t_sv = arrData[0].t_sv;
                                 todaysData.value.t_ov = arrData[0].t_ov;

                                 Distance_tot.value = arrData[0].t_d;
                                 Distance_per.value = arrData[0].a_d_pav;
                                 movingDuration1.value = arrData[0].t_dd;
                                 movingDuration2.value = arrData[0].a_dd_pav;
                                 violation1.value = arrData[0].t_vc;
                                 violation2.value = arrData[0].a_vc_pav;
                                 fuelCons1.value = arrData[0].t_f;
                                 fuelCons2.value = arrData[0].a_f_pav;

                                 // Update chart data after setting values
                                 updateChartData();
                               });
                           }
                         } else if (response.status === 401) {
                           this.toastMessage = responsejson.message;
                           return Promise.reject(new Error(responsejson.message));
                         } else {
                           console.error("Empty response data");
                           return Promise.reject(new Error("Empty response data"));
                         }

                          loading.dismiss();   

                       })
                       .catch(error => {
         console.error("Error:", error);
       })
       .finally(async () => {
        if(isFirstTimeDataCall){
            await loading.dismiss();   
                         isFirstTimeDataCall=false;

 }
         // Dismiss the loading controller after the API call completes
         return ; 
       });
   })
   .catch(error => {
     console.error("Error creating loading:", error);
   });
};


               const pieChartRef = ref(null);
               let chartInstance = null;

               const todaysData = ref({
                 t_av: 0,
                 t_sv: 0,
                 t_ov: 0,
                 total_dis: 0,
                 dist_per: 0,
                 moving_dis: 0,
                 moving_per: 0,
                 violation_count: 0,
                 violation_per: 0,
                 fuel_cons: 0,
                 fuel_per: 0,
               });

               // Icon reference
                 const distanceIcon = ref(distanceRouteIcon);
                 const durationIcon = ref(timeOutline);
                 const violationIcon = ref(warningOutline);
                 const fuelIcon = ref(waterOutline);

                 // Variables to hold the values from the API
                 const Distance_tot = ref(0);
                 const Distance_per = ref(0);
                 const movingDuration1 = ref(0);
                 const movingDuration2 = ref(0);
                 const violation1 = ref(0);
                 const violation2 = ref(0);
                 const fuelCons1 = ref(0);
                 const fuelCons2 = ref(0);

                 // Methods to open specific pages
                 const clickForDatePage = () => {
                   console.log(formattedCurrentDate.value);
                   // router.push("/dashPeriodtoday");
                   router.push({ name: "Periodtoday", params:{currentDate: formattedCurrentDate.value } });

                 };

                 const openGroup = () => {
                   router.push({ name: "grouptoday", params:{currentDate: formattedCurrentDate.value} });
                 };

               

                 
               


                 const updateChartData = () => {

                       chartData.value.moving = todaysData.value.t_av;
                       chartData.value.stopped = todaysData.value.t_sv;
                       chartData.value.offline = todaysData.value.t_ov;

                       // Recreate chart with new data
                       if (chartInstance) {
                         chartInstance.destroy();
                       }
                       createChart();
                        
                 };

                 const chartData = ref({
                   moving: 0,
                   stopped: 0,
                   offline: 0,
                 });

                 const createChart = async () => {

                  
                      await nextTick();

                 
                  const movingStoredColor = await storage.get('movingcolor');
              const stoppedStoredColor = await storage.get('stoppedcolor');
              const idleStoredColor = await storage.get('idlecolor');
              const offlineStoredColor = await storage.get('offlinecolor');


            


              const moving_color = movingStoredColor || Constants.Veh_color.Key_Active_Color;
              const stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
              const offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;
              const idle_color = idleStoredColor || Constants.Veh_color.Key_Idle_Color;

              if (chartInstance) {
                     chartInstance.destroy();
                   }
              
                   if (pieChartRef.value) {
                   const ctx = pieChartRef.value.getContext("2d");
                   const total = Number(chartData.value.moving) + Number(chartData.value.stopped) + Number(chartData.value.offline);
                   chartInstance = new Chart(ctx, {
                     type: "doughnut",
                     data: {
                       datasets: [
                         {
                           label: "Today Status",
                           data: [chartData.value.moving, chartData.value.stopped, chartData.value.offline],

                           backgroundColor: [moving_color, stopped_color, offline_color],
                           borderWidth: 0, // Remove white space by setting borderWidth to 0

                         },
                       ],
                     },
                     options: {
                       responsive: true,
                       maintainAspectRatio: false,
                       cutout: "65%",

                       plugins: {
                         legend: {
                           display: false,
                         },
                         datalabels: {
                             display: false,
                           },

                       },
                       tooltip: {
                             callbacks: {
                               label: function (context) {
                                 let label = context.label || "";
                                 if (label) {
                                   label += ": ";
                                 }
                                 if (context.raw !== null) {
                                   label += context.raw;
                                 }
                                 return label;
                               },
                             },
                           },
                           datalabels: {
                             display: false,
                           },
                     },
                     plugins: [
                        //  {
                        //    id: "centerText",
                        //    beforeDraw: (chart) => {
                        //      const width = chart.width;
                        //      const height = chart.height;
                        //      const ctx = chart.ctx;
                        //      ctx.restore();
                        //      const fontSize = (height / 150).toFixed(2);
                        //      ctx.font = `${fontSize}em sans-serif`;
                        //      ctx.textBaseline = "middle";
                        //      ctx.fillStyle = "#000";

                        //      // const text = total.toString();
                        //      // const textX = Math.round((width - ctx.measureText(text).width) / 2);
                        //      // const textY = height / 2;
                        //      // ctx.fillText(text, textX, textY);
                        //      // ctx.save();

                        //      // Custom text
                        //  const text1 = "Total";
                        //  const text2 = "Count";
                        //  const text3 = total.toString();

                        //  // Calculate positions
                        //  const textX1 = Math.round((width - ctx.measureText(text1).width) / 2);
                        //  const textX2 = Math.round((width - ctx.measureText(text2).width) / 2);
                        //  const textX3 = Math.round((width - ctx.measureText(text3).width) / 2);

                        //  const textY1 = height / 2 - 20;
                        //  const textY2 = height / 2;
                        //  const textY3 = height / 2 + 20;

                        //  // Draw text
                        //  ctx.fillText(text1, textX1, textY1);
                        //  ctx.fillText(text2, textX2, textY2);
                        //  ctx.fillText(text3, textX3, textY3);

                        //  ctx.save();
                        //    },
                        //  },
                       ],
                   });
                 }
                 };


              
                 onBeforeUnmount(() => {
                   // Optionally remove listeners if needed
                   Network.removeAllListeners();
                   if (reconnectTimeout) clearTimeout(reconnectTimeout);

                 });

                 onMounted(async () => {

                  const loginResponse = await storage.get('login_data');
                  const loginisfuel = loginResponse.isFuel;
                  IsFuelEnable.value = loginisfuel === 1 ? true : false;

                  
                  useBackButton(9999, async () => {
                    console.log("displayionview","today");

                        const currentTime = new Date().getTime();

                    if (currentTime - lastBackPressed < 2000) {
                      // Exit the app if back button is pressed twice within 2 seconds
                      navigator.app.exitApp();
                    } else {
                      lastBackPressed = currentTime;

                      await showToastMessage("Press again to exit the app");
                    }
            });

                   await checkNetworkStatus();
                   // Start listening to network changes
                   listenToNetworkChanges();

                     const savedDate = await storage.get('savedTodaysDate');

                     if (savedDate) {
                       receivedDate.value = savedDate;
                     
                     }else{

                       const today = new Date();

                       receivedDate.value = today;

                     }
                     

                     console.log('Selected date11:', receivedDate.value);

                     if(receivedDate.value!==null)
                       {
                         const datatoday = new Date(receivedDate.value);

                         formattedCurrentDate.value = getFormattedDate(datatoday);
                          dateAPI.value = get_Date_API(datatoday);
                       }

                      const ApiCalledDate= await storage.get('APIcalledTodaysDate');

                        if (ApiCalledDate) {
                                  updateLastUpdatedText(new Date(ApiCalledDate));

                                  if (updateTimer) clearInterval(updateTimer);

                                  updateTimer = setInterval(() => {
                                    updateLastUpdatedText(new Date(ApiCalledDate));
                                  }, 60000); // refresh every minute
                                }

                      if(ApiCalledDate!==null)
                      {
                         const isMinDoneOrNot= checkTimeDifference(ApiCalledDate);
                         console.log("isMinDoneOrNot",isMinDoneOrNot);

                         if(isMinDoneOrNot)
                         {
                           const status = await Network.getStatus();
                           if (status.connected) {
                             DisplayStoredData();
                           CallAPIForTodayData();
                           }else{
                               showToast();
                               DisplayStoredData();
                           }
                         }else {
                             if(isPeriodChange)
                             {
                               CallAPIForTodayData();

                             }else{
                           DisplayStoredData();
                             }
                         }
                     }else{
                       const status = await Network.getStatus();
                       if (status.connected) {
                         DisplayStoredData();
                       CallAPIForTodayData();
                       }else{
                         showToast();
                       }

                     }

                       createChart();

                 });

             

                 onBeforeUnmount(() => {
                   if (chartInstance) {
                     chartInstance.destroy();
                   }

                   if (updateTimer) {
                    clearInterval(updateTimer);
                  }
                 });

                 return {
                   totalCount,
                   formattedCurrentDate,
                   receivedDate,
                   pieChartRef,
                   todaysData,
                   Distance_tot,
                   Distance_per,
                   movingDuration1,
                   movingDuration2,
                   violation1,
                   violation2,
                   fuelCons1,
                   fuelCons2,
                   distanceIcon,
                   durationIcon,
                   violationIcon,
                   fuelIcon,
                   chartData,
                   clickForDatePage,
                   openGroup,
                   IsFuelEnable,
                   isConnected,
                   showReconnectedMessage,lastUpdatedTime,  lastUpdatedText


                 };
               },


               async beforeRouteEnter(to, from, next) {
                // Log the navigation for debugging
                
                isPeriodChange=false;

                // Check if we are coming back from Page 2
                if (from.name === 'Periodtoday') {

                  let isChangeDate = await storage.get('isChangeDateToday');
                  // Perform your task here

                  if (isChangeDate) {    
                      isPeriodChange=true;

                  }
                  }
                    next(); // Proceed with route navigation
                  },

  });
</script>



