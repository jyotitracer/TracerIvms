<template>
  <!-- <div v-if="!isConnected" class="network-status-bar">
       No Network Connection
     </div>
     <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
       Connected to Network
     </div> -->
 <ion-content>
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

   <div class="custom-item">
     <div id="chart-container">
       <canvas ref="pieChartRef"></canvas>
     </div>
     <div class="item-content">
       <div class="status">
         <div :style="{ color: moving_color }" class="status-item">
           <span class="status-label">Active</span>
           <span class="status-value">{{ chartData.moving }}</span>
         </div>

         <div class="status-item stopped">
           <span class="status-label">Stopped</span>
           <span class="status-value">{{ chartData.stopped }}</span>
         </div>
         <div class="status-item offline">
           <span class="status-label">Offline</span>
           <span class="status-value">{{ chartData.offline }}</span>
         </div>
       </div>
     </div>
   </div>
   <div class="month-below">
     <div class="month-total">Fleet Total - </div>
     <div class="today-total">(Per Vehicle Average)</div>
   </div>
   <ion-list>
     <ion-item>
       <ion-grid>
         <ion-row style="align-items: center;">
           <ion-col size="auto">
             <ion-icon :icon="iconName" style="font-size: 30px;" />
           </ion-col>
           <ion-col>
             <div class="text-container">
               <p class="text1">Distance travelled</p>
               <div style="display: flex;">
                 <p class="text2">{{ Distance_tot }} </p>
                 <p class="text2">-</p>
                 <p class="text3">({{ Distance_per }}) </p>
               </div>
             </div>
           </ion-col>
         </ion-row>
       </ion-grid>
     </ion-item>
     <ion-item>
       <ion-grid>
         <ion-row style="align-items: center;">
           <ion-col size="auto">
             <ion-icon :icon="iconName" style="font-size: 30px;" />
           </ion-col>
           <ion-col>
             <div class="text-container">
               <p class="text1">Moving Duration</p>
               <div style="display: flex;">
                 <p class="text2">{{ movingDuration1 }}</p>
                 <p class="text2">-</p>
                 <p class="text3">({{ movingDuration2 }})</p>
               </div>
             </div>
           </ion-col>
         </ion-row>
       </ion-grid>
     </ion-item>
     <ion-item>
       <ion-grid>
         <ion-row style="align-items: center;">
           <ion-col size="auto">
             <ion-icon :icon="iconName" style="font-size: 30px;" />
           </ion-col>
           <ion-col>
             <div class="text-container">
               <p class="text1">Violation Count</p>
               <div style="display: flex;">
                 <p class="text2">{{ violation1 }}</p>
                 <p class="text2">-</p>
                 <p class="text3">({{ violation2 }})</p>
               </div>
             </div>
           </ion-col>
         </ion-row>
       </ion-grid>
     </ion-item>
     <ion-item v-if="IsFuelEnable">
       <ion-grid>
         <ion-row style="align-items: center;">
           <ion-col size="auto">
             <ion-icon :icon="iconName" style="font-size: 30px;" />
           </ion-col>
           <ion-col>
             <div class="text-container">
               <p class="text1">Fuel Consumed</p>
               <div style="display: flex;">
                 <p class="text2">{{ fuelCons1 }}</p>
                 <p class="text2">-</p>
                 <p class="text3">({{ fuelCons2 }})</p>
               </div>
             </div>
           </ion-col>
         </ion-row>
       </ion-grid>
     </ion-item>
   </ion-list>
 </ion-content>
</template>


<script>
import {
 defineComponent,
 ref,
 onMounted,
 watch,
 onBeforeUnmount,
 nextTick,
} from "vue";
import {
 IonContent,
 IonIcon,
 IonCol,
 IonRow,
 IonItem,
 IonList,
 IonGrid,
 loadingController,
} from "@ionic/vue";
import { checkTimeDifference } from "@/services/dateTimeUtils"; // Make sure this path is correct

import { Chart, registerables } from "chart.js";
import { addCircleOutline } from "ionicons/icons";
import router from "@/router/index"; // Assuming your router file is named router.js
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import storage from "@/services/storagefile";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function
import { onIonViewWillEnter } from '@ionic/vue';
import { useBackButton } from '@ionic/vue';
import { showToastMessage } from '@/services/toast'; 


Chart.register(...registerables);

let isPeriodChange=false;


export default defineComponent({
 name: "PieChartView",
 components: { IonContent, IonIcon, IonCol, IonRow, IonItem, IonList,IonGrid },

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


const checkNetworkStatus = async () => {
 const status = await Network.getStatus();
 isConnected.value = status.connected;
};

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

                         // Update chart data
                         updateChartData();

                       }
           }
           
           async function CallAPIForTodayData() {
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
                                           loading.present();


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
                 const iconName = ref(addCircleOutline);

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
                         {
                           id: "centerText",
                           beforeDraw: (chart) => {
                             const width = chart.width;
                             const height = chart.height;
                             const ctx = chart.ctx;
                             ctx.restore();
                             const fontSize = (height / 150).toFixed(2);
                             ctx.font = `${fontSize}em sans-serif`;
                             ctx.textBaseline = "middle";
                             ctx.fillStyle = "#000";

                             // const text = total.toString();
                             // const textX = Math.round((width - ctx.measureText(text).width) / 2);
                             // const textY = height / 2;
                             // ctx.fillText(text, textX, textY);
                             // ctx.save();

                             // Custom text
                         const text1 = "Total";
                         const text2 = "Count";
                         const text3 = total.toString();

                         // Calculate positions
                         const textX1 = Math.round((width - ctx.measureText(text1).width) / 2);
                         const textX2 = Math.round((width - ctx.measureText(text2).width) / 2);
                         const textX3 = Math.round((width - ctx.measureText(text3).width) / 2);

                         const textY1 = height / 2 - 20;
                         const textY2 = height / 2;
                         const textY3 = height / 2 + 20;

                         // Draw text
                         ctx.fillText(text1, textX1, textY1);
                         ctx.fillText(text2, textX2, textY2);
                         ctx.fillText(text3, textX3, textY3);

                         ctx.save();
                           },
                         },
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
                     

                     console.log('Selected date:', receivedDate.value);

                     if(receivedDate.value!==null)
                       {
                         const datatoday = new Date(receivedDate.value);

                         formattedCurrentDate.value = getFormattedDate(datatoday);
                          dateAPI.value = get_Date_API(datatoday);
                       }

                      const ApiCalledDate= await storage.get('APIcalledTodaysDate');

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
                 });

                 return {
                   
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
                   iconName,
                   chartData,
                   clickForDatePage,
                   openGroup,
                   IsFuelEnable,
                   isConnected,
                   showReconnectedMessage

                 };
               },


               beforeRouteEnter(to, from, next) {
   // Log the navigation for debugging
   
   isPeriodChange=false;

   // Check if we are coming back from Page 2
   if (from.name === 'Periodtoday') {

     let isChangeDate = storage.get('isChangeDateToday');
     // Perform your task here

     if (isChangeDate === "true") {
       
     isPeriodChange=true;
   }


 }
   next(); // Proceed with route navigation
 },

  });
</script>


<style scoped>
.custom-item {
 display: flex;
 align-items: center;
 flex-direction: row;
 margin-bottom: 20px;
 margin-right: 20px;
 margin-left: 20px;
 margin-top: 20px;
}

#chart-container {
 width: 150px;
 height: 150px;
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
.status-label {
 margin-right: 10px; /* Adjust this value as needed */
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
 background-color: #f4f2f2;
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
 display: flex;
 flex-direction: column;
 justify-content: center;
}

.text1 ,.text3{
 margin: 0;
 padding: 0;
 font-size: 16px;
 color: grey;
}
.text2 {
 margin: 0;
 padding: 0;
 font-size: 16px;
 color: #5d5b5b;
 font-weight: bold;
}


.month-below1 {
 display: flex;
 align-items: center;
 position: relative;
 background-color: #f4f2f2;
 padding: 10px;
 font-size: 14px;
}

.month-total.date {
 position: absolute;
 left: 50%;
 transform: translateX(-50%);
 color: var(--ion-color-tertiary-shade);
 font-size: 14px;

}

.right-group {
 display: flex;
 align-items: center;
 color: var(--ion-color-tertiary-shade);

 margin-left: auto; /* Pushes the right-group to the right side */
}

.icon-arrow {
 margin-left: 10px; /* Adjust the margin as needed */
 height: 25px;
 width: 25px;
 color: var(--ion-color-tertiary-shade);
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
