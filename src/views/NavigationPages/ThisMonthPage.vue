<template>
  
<ion-content fullscreen class="safe-bottom">
      <div class="month-below1">
        <div  class="month-total date" @click="clickForDatePage">{{monthFromDate}} to {{monthToDate}}</div>
        <div class="right-group" @click="openGroup">
          <div class="month-total">Group</div>
             <img src="\right-arrow.png" alt="event icon" class="icon-arrow" @click="callnextPage" />
          </div>  
        </div>
        <div class="custom-card">
          <span style="font-weight: bold; font-size: 14px;">Fleet Status Overview</span>
          <span style="font-weight: 200; font-size: 12px;">Monthly Vehicle Count By Date</span>

        <div class="custom-legend ">
          
        <div class="legend-item">
          <span class="legend-box" :style="{ backgroundColor: moving_color ,border:moving_color}"></span> Active
        </div>
        <div class="legend-item">
          <span class="legend-box" :style="{ backgroundColor: stopped_color ,border: stopped_color }"></span> Stopped
        </div>
        <div class="legend-item">
          <span class="legend-box" :style="{ backgroundColor: offline_color , border: stopped_color }"></span> Offline
        </div>
      </div>

        

        <div class="chart-wrapper">
    <div class="chart-scroll">
        <canvas ref="barChart"></canvas>
    </div>
</div>


        </div>
<!-- 
      <div class="month-below">
        <div class="month-total">Fleet Total - </div>
        <div class="today-total">(Per Vehicle Average)</div>
      </div> -->
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



  </ion-content>
</template>


<script>
import { ref, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { timeOutline, warningOutline, waterOutline } from 'ionicons/icons';
import { distanceRouteIcon } from "@/common/customIcons";
import {   IonContent,IonIcon,IonCol,IonRow,IonItem,IonList,IonGrid,  loadingController, 
  IonCard,IonCardContent,
} from '@ionic/vue';
import router from '@/router/index'; // Assuming your router file is named router.js
import Constants from  '@/common/constants';
import { fetchData } from "@/services/ApiService";
import storage from "@/services/storagefile";
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin
import { checkTimeDifference } from "@/services/dateTimeUtils"; // Make sure this path is correct
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function
import useNetwork from '@/services/networkService';
import { useBackButton } from '@ionic/vue';
import {  selectedPage } from '@/services/userstate'; // Import the global state


Chart.register(...registerables,zoomPlugin,ChartDataLabels);
let isPeriodChange = false;


   
export default {
  name: 'Dashboard',
  components:{IonContent,IonIcon,IonIcon,IonCol,IonRow,IonItem,IonList,IonGrid,IonCard,IonCardContent},
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

    //  const movingStoredColor = '';
    // const stoppedStoredColor = '';
    // const idleStoredColor = '';
    // const offlineStoredColor = '';


    this.moving_color = movingStoredColor || Constants.Veh_color.Key_Active_Color;
    this.stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
    this.offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;
    this.idle_color = idleStoredColor || Constants.Veh_color.Key_Idle_Color;

  },
   setup() {

    const { isConnected } = useNetwork();
    let isFirstTimeDataCall = true;
 const IsFuelEnable=ref(true);
    

  // Variables to hold the values from the API
  const Distance_tot = ref(0);
  const Distance_per = ref(0);
  const movingDuration1 = ref(0);
  const movingDuration2 = ref(0);
  const violation1 = ref(0);
  const violation2 = ref(0);
  const fuelCons1 = ref(0);
  const fuelCons2 = ref(0);

  const barChart = ref(null); // Reference for the chart canvas
    let chartInstance = null; // Variable to track the current chart instance



  function getFormattedDate(date) {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  function get_Date_API(date) {
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit format
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const getCurrentMonthDates = () => {
    // Get the current date
    const currentDate = new Date();

    // Get the start date of the current month
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the end date of the current month
    const endDate = currentDate;

    return {
      startFrom: startDate,
      endTo: endDate
    };
  };

  const { startFrom, endTo } = getCurrentMonthDates();

  const processData = (arrData) => {
    const labels = [];
    const activeData = [];
    const stoppedData = [];
    const offlineData = [];

    // Iterate over the response data
    for (const [date, counts] of Object.entries(arrData.grph_arr[0])) {
      // Extract the date in 'DD' format
      labels.push(date.slice(-2));
      // Extract the counts
      activeData.push(Math.max(0, parseInt(counts.act_cnt, 10)));
      stoppedData.push(Math.max(0, parseInt(counts.stopped_cnt, 10)));
      offlineData.push(Math.max(0, parseInt(counts.oflne_cnt, 10)));
    }

    return { labels, activeData, stoppedData, offlineData ,isConnected};
  };

  async function DisplayStoreData() {
    const arrData = await storage.get(Constants.storageValue.Key_Month);

    if (arrData && arrData.length > 0) {
      const { labels, activeData, stoppedData, offlineData } = processData(arrData[0]);

      Distance_tot.value = arrData[0].t_d;
      Distance_per.value = arrData[0].a_d_pd;
      movingDuration1.value = arrData[0].t_dd;
      movingDuration2.value = arrData[0].a_dd_pd;
      violation1.value = arrData[0].t_vc;
      violation2.value = arrData[0].a_vc_pd;
      fuelCons1.value = arrData[0].t_f;
      fuelCons2.value = arrData[0].a_f_pd;

     await createChart(labels, activeData, stoppedData, offlineData);
                   isFirstTimeDataCall=false;

    }


  }

 const CallAPIForTodayData = async () => {
  const params = {
    fdate: FromdateAPI.value,
    tdate: TodateAPI.value,
    req_period: "5",
    is_smry: "1",
    period_type: "1",
    day_avg: "1",
    grp_type: "1"
  };

                       // Show loading controller
                       loadingController.create({
    message: "Loading...",
    backdropDismiss: true // Makes the loading controller cancelable

  }).then(loading => {
     if(isFirstTimeDataCall){
         loading.present();
    }




  // Return a promise to maintain the same behavior
  return fetchData(
    Constants.CONT.Mobile_Contro,
    Constants.CMD.Req_Dash_All,
    params
  )
    .then(async(response) => {
      const responsejson = response.data;

      if (response.status === 200) {
        // Handle success
        const currentDateTime = new Date();
        await storage.set('APIcalledMonthDate', currentDateTime + "");

        const arrData = responsejson.arr_data;

        if (arrData && arrData.length > 0) {
          return storage.set(Constants.storageValue.Key_Month, arrData)
            .then(() => {
              const { labels, activeData, stoppedData, offlineData } = processData(arrData[0]);

              Distance_tot.value = arrData[0].t_d;
              Distance_per.value = arrData[0].a_d_pd;
              movingDuration1.value = arrData[0].t_dd;
              movingDuration2.value = arrData[0].a_dd_pd;
              violation1.value = arrData[0].t_vc;
              violation2.value = arrData[0].a_vc_pd;
              fuelCons1.value = arrData[0].t_f;
              fuelCons2.value = arrData[0].a_f_pd;

              createChart(labels, activeData, stoppedData, offlineData);
            });
        }
      } else if (response.status === 401) {
        // Handle unauthorized access
        this.toastMessage = responsejson.message;
      } else {
        console.error("Empty response data");
        // Handle empty response
      }
    })
    .catch(error => {
          console.error("Error:", error);
        })
        .finally(() => {

           if(isFirstTimeDataCall){
              loading.dismiss();   
             }
             
          // Dismiss the loading controller after the API call completes
          return ; 
         
        });
    })
    .catch(error => {
      console.error("Error creating loading:", error);
    });
};


  const monthFromDate = ref(null);
  const monthToDate = ref(null);
  const receivedFromDate = ref(null);
  const receivedToDate = ref(null);
  const FromdateAPI = ref(null);
  const TodateAPI = ref(null);

  if (receivedFromDate.value !== null && receivedToDate.value !== null) {
    monthFromDate.value = getFormattedDate(receivedFromDate.value);
    monthToDate.value = getFormattedDate(receivedToDate.value);

    FromdateAPI.value = get_Date_API(receivedFromDate.value);
    TodateAPI.value = get_Date_API(receivedToDate.value);
  } else {
    monthFromDate.value = getFormattedDate(startFrom);
    monthToDate.value = getFormattedDate(endTo);

    FromdateAPI.value = get_Date_API(startFrom);
    TodateAPI.value = get_Date_API(endTo);
  }

  const openGroup = () => {
    router.push({
      name: "groupmonth",
      params: {
        fromdate: monthFromDate.value,
        todate: monthToDate.value
      }
    });
  };

  // Methods to open specific pages
  const clickForDatePage = () => {
    router.push({
      name: "Periodmonth",
      params: {
        fromdate: monthFromDate.value,
        todate: monthToDate.value
      }
    });

    
    //router.push("/dashPeriodmonth");
  };


 const createChart = async (labels, activeData, stoppedData, offlineData) => {

  const movingStoredColor = await storage.get('movingcolor');
  const stoppedStoredColor = await storage.get('stoppedcolor');
  const offlineStoredColor = await storage.get('offlinecolor');

 
    

  const moving_color = movingStoredColor || Constants.Veh_color.Key_Active_Color;
  const stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
  const offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;

  await nextTick();

const canvas = barChart.value;

canvas.width = Math.max(labels.length * 20, 400);
canvas.height = 250;


  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(barChart.value, {
    type: 'bar',
    data: {
      labels: labels,
datasets: [
  {
    label: 'Active',
    data: activeData,
    backgroundColor: moving_color,
    borderWidth: 1,
    borderColor: '#f3faff',
    stack: 'fleet',

    barThickness: 8,      // <-- Make bar thinner
    maxBarThickness: 8
  },
  {
    label: 'Stopped',
    data: stoppedData,
    backgroundColor: stopped_color,
    borderWidth: 1,
    borderColor: '#f3faff',
    stack: 'fleet',

    barThickness: 8,
    maxBarThickness: 8
  },
  {
    label: 'Offline',
    data: offlineData,
    backgroundColor: offline_color,
    borderWidth: 1,
    borderColor: '#f3faff',
    stack: 'fleet',

    barThickness: 8,
    maxBarThickness: 8
  }
]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,

      scales: {
        x: {
          stacked: true,   // ✅ KEY LINE
          ticks: {
             autoSkip: false,
                maxRotation: 0,
                minRotation: 0
          }
        },
        
        y: {
           stacked: true,
  beginAtZero: true,
  grace: '10%',      // Adds some space above the tallest bar

  ticks: {
    precision: 0
  }

        }
      },

      plugins: {
        legend: {
          display: false
        },

        datalabels: {
          display: false
        },

        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      }
    }
  });
};

  onMounted(async () => {

     const loginResponse = await storage.get('login_data');
                  const loginisfuel = loginResponse.isFuel;
                  IsFuelEnable.value = loginisfuel === 1 ? true : false;

    useBackButton(9999, async () => {

            const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');

          });
            
    const FromDate = await storage.get('savedMonthFromDate');
    const ToDate =await storage.get('savedMonthToDate');


    if(FromDate)

    if (FromDate && ToDate) {
      receivedFromDate.value = FromDate;
      receivedToDate.value = ToDate;
    } else {
      receivedFromDate.value = startFrom;
      receivedToDate.value = endTo;
    }


    if (receivedFromDate.value !== null && receivedToDate.value !== null) {
      const datafromdate = new Date(receivedFromDate.value);
      const datatodate = new Date(receivedToDate.value);
      
    

     

      monthFromDate.value = getFormattedDate(datafromdate);
      monthToDate.value = getFormattedDate(datatodate);

      FromdateAPI.value = get_Date_API(datafromdate);
      TodateAPI.value = get_Date_API(datatodate);

    }


    const ApiCalledDate = await storage.get('APIcalledMonthDate');

    if (ApiCalledDate !== null) {
      const isMinDoneOrNot = checkTimeDifference(ApiCalledDate);
    //  console.log("isMinDoneOrNot", isMinDoneOrNot);

      if (isMinDoneOrNot) {
        const status = await Network.getStatus();
        if (status.connected) {
          DisplayStoreData();
          CallAPIForTodayData();
        } else {
          showToast();
          DisplayStoreData();
        }
      } else {
        if(isPeriodChange)
      {
        CallAPIForTodayData();

      }else{
        DisplayStoreData();
      }
      }
    } else {
      const status = await Network.getStatus();
      if (status.connected) {
        DisplayStoreData();
        CallAPIForTodayData();
      } else {
        showToast();
      }
    }
  });

  return {
    receivedFromDate,
    receivedToDate,
    monthFromDate,
    monthToDate,
    barChart,
    clickForDatePage,
    openGroup,
    distanceIcon: distanceRouteIcon,
    durationIcon: timeOutline,
    violationIcon: warningOutline,
    fuelIcon: waterOutline,
    Distance_tot,
    Distance_per,
    movingDuration1,
    movingDuration2,
    violation1,
    violation2,
    fuelCons1,
    fuelCons2,IsFuelEnable,
    CallAPIForTodayData,
  };
},


   async beforeRouteEnter(to, from, next) {
    // Log the navigation for debugging
    
    isPeriodChange=false;

    // Check if we are coming back from Page 2
    if (from.name === 'Periodmonth') {

      let isChangeDate =await storage.get('isChangeDate');
      // Perform your task here

      if (isChangeDate) {
        
      isPeriodChange=true;
    }


  }
    next(); // Proceed with route navigation
  },
 
  



};
</script>

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
 

.custom-metric-card {
  margin: 10px;
  border-radius: 16px;

  background: #e6f6ff; /* surface-container-low */
  border: 1px solid rgba(255, 255, 255, 0.5);

  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);
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
  padding: 16px;
  margin: 10px;

  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);

  display: flex;
  flex-direction: column;

  align-items: stretch;   /* 🔥 IMPORTANT (not center) */
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

.custom-legend {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 5px;
  font-size: 12px;
}

.legend-box {
   width: 10px;              /* smaller = premium look */
  height: 10px;
  margin-right: 6px;
  border-radius: 50%;      /* 🔥 makes it circle */
}

.chart-container {
  white-space: nowrap; /* Prevent chart from wrapping */
  height: 200px;
}

.chart-wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}

.chart-scroll {
    height: 250px;
}

.chart-scroll canvas {
    display: block;
}

.date-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f1f1f1;
  color:#00875A;
}
.fleet-info {
  padding: 16px;
}
.info-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
}
.info-item ion-icon {
  margin-right: 8px;
}
.month-below1 {
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
  
}

.month-total.date {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
 color: var(--ion-color-tertiary-shade);
}

.right-group {
  display: flex;
  align-items: center;
 color: var(--ion-color-tertiary-shade);

  margin-left: auto; /* Pushes the right-group to the right side */
}

.icon-arrow {
  width: 20px;
  height: 20px;
  margin-left: 5px;

  filter: invert(34%) sepia(91%) saturate(400%) hue-rotate(120deg);
}
.month-below {
  display: flex;
  background-color: #f3faff;
  padding: 10px;
  align-content: center;
  flex-direction: inherit;
  justify-content: center;
}
.month-total {
  font-size: 14px;
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



</style>
