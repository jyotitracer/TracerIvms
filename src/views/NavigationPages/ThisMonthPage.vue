<template>
  
    <ion-content>
      <div class="month-below1">
        <div  class="month-total date" @click="clickForDatePage">{{monthFromDate}} to {{monthToDate}}</div>
        <div class="right-group" @click="openGroup">
          <div class="month-total">Group</div>
             <img src="\right-arrow.png" alt="event icon" class="icon-arrow" @click="callnextPage" />
          </div>  
        </div>
        <div class="custom-legend">
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

        <div class="chart-container">
      <canvas ref="barChart"></canvas>
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
      <ion-item>
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
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { addCircleOutline } from 'ionicons/icons';
import {   IonContent,IonIcon,IonCol,IonRow,IonItem,IonList,IonGrid,  loadingController} from '@ionic/vue';
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
  components:{IonContent,IonIcon,IonIcon,IonCol,IonRow,IonItem,IonList,IonGrid},
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

    const { isConnected } = useNetwork();

    

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

      createChart(labels, activeData, stoppedData, offlineData);
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
    loading.present();




  // Return a promise to maintain the same behavior
  return fetchData(
    Constants.CONT.Mobile_Contro,
    Constants.CMD.Req_Dash_All,
    params
  )
    .then((response) => {
      const responsejson = response.data;

      if (response.status === 200) {
        // Handle success
        const currentDateTime = new Date();
        localStorage.setItem('APIcalledMonthDate', currentDateTime + "");

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
          // Dismiss the loading controller after the API call completes
          return loading.dismiss();
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

     // Check if data exists in storage
     const movingStoredColor = await storage.get('movingcolor');
                const stoppedStoredColor = await storage.get('stoppedcolor');
                const offlineStoredColor = await storage.get('offlinecolor');

                 const moving_color =  movingStoredColor || Constants.Veh_color.Key_Active_Color;
                 const idle_color =  Constants.Veh_color.Key_Idle_Color;
                 const stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
                 const offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;

                 
    const maxValue = Math.max(
      ...activeData, 
      ...stoppedData, 
      ...offlineData
    );

    // Define the step size based on the maximum value
    const stepSize = Math.ceil((maxValue) / 5.5); // 6 intervals

    console.log("stepSize",stepSize+" "+maxValue);

    if (chartInstance) {
        chartInstance.destroy();
      }

      // Create a new chart instance
      chartInstance = new Chart(barChart.value, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Active',
            data: activeData,  // Dynamic data for 'Active'
            backgroundColor: moving_color,
          },
          {
            label: 'Stopped',
            data: stoppedData,  // Dynamic data for 'Stopped'
            backgroundColor: stopped_color,
          },
          {
            label: 'Offline',
            data: offlineData,  // Dynamic data for 'Offline'
            backgroundColor: offline_color,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to be responsive
        
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date (scroll to see more data)',
            },
            ticks: {
              autoSkip: false, // Disable auto-skipping of ticks

            },
            min: 0, // Start displaying from the first label (index 0)
            max: 6, // Show up to the 7th label (index 6)
          },
          y: {
            title: {
              display: true,
              text: 'Vehicle Count',
            },
            beginAtZero: false,
            max: stepSize * 6, // Ensure the max is a multiple of the step size
            ticks: {
              stepSize: stepSize, // Dynamic step size
            },
          },
        },
        plugins: {
          datalabels: {
            display: true, // Display the labels
            color: '#000', // Label color
            anchor: 'end', // Position of the label
            align: 'top', // Position of the label
            formatter: (value) => {
              return value > 0 ? value : '0'; // Display only positive values
            },
            font: {
              size: 8, // Set font size to small (adjust as needed)
              weight: 'normal', // Set font weight to normal
            },
            offset: 1, // Adjust this value to move labels up or down
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x', // Enable horizontal panning
            },
            zoom: {
              wheel: {
                enabled: true, // Enable zooming with the mouse wheel
              },
              drag: {
                enabled: true, // Enable zooming by dragging
              },
              pinch: {
                enabled: true, // Enable pinch zooming on touch devices
              },
              mode: 'x', // Enable zooming in the x direction only
            },
          },
          legend: {
            display: false, // Disable the legend
          },
        },
      },
    });
  };

  onMounted(async () => {

    useBackButton(9999, async () => {

            const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');

          });
            
    const FromDate = localStorage.getItem('savedMonthFromDate');
    const ToDate = localStorage.getItem('savedMonthToDate');


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


    const ApiCalledDate = localStorage.getItem("APIcalledMonthDate");

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
    iconName: addCircleOutline, // replace with your desired icon
    Distance_tot,
    Distance_per,
    movingDuration1,
    movingDuration2,
    violation1,
    violation2,
    fuelCons1,
    fuelCons2,
    CallAPIForTodayData,
  };
},


beforeRouteEnter(to, from, next) {
    // Log the navigation for debugging
    
    isPeriodChange=false;

    // Check if we are coming back from Page 2
    if (from.name === 'Periodmonth') {

      let isChangeDate = localStorage.getItem('isChangeDate');
      // Perform your task here

      if (isChangeDate === "true") {
        
      isPeriodChange=true;
    }


  }
    next(); // Proceed with route navigation
  },
 
  



};
</script>

<style scoped>

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

.chart-container {
  white-space: nowrap; /* Prevent chart from wrapping */
  height: 200px;
  margin-top: 20px;
}

.date-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f1f1f1;
  color: red;
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
  background-color: #f4f2f2;
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
  margin-left: 10px; /* Adjust the margin as needed */
  height: 25px;
  width: 25px;
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
