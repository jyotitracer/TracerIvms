<template>
  <ion-page>

   <ion-content class="dashboard-content">

  <!-- 🔹 VEHICLE HEADER -->
  <div class="vehicle-header">
    <div>
      <h1>{{ vehicleNo }}</h1>
      <p>{{ monthName }} {{ year }} Distance Report</p>
    </div>

    <div class="chip">
      <!-- <ion-icon :icon="calendarOutline"></ion-icon> -->
      <span>{{ monthName }} {{ year }}</span>
    </div>
  </div>

  <!-- 🔹 METRICS (BENTO STYLE) -->
  <div class="metrics-grid">

    <div class="metric-card">
      <div class="metric-header">
        <ion-icon :icon="gitNetworkOutline" style="size: 24px;"></ion-icon>
        <span>Distance</span>
      </div>
      <div class="metric-value">
        {{ Distance_tot }} <small>({{ Distance_per }})</small>
      </div>
    </div>

    <div class="metric-card">
      <div class="metric-header">
        <ion-icon :icon="timeOutline"></ion-icon>
        <span>Moving</span>
      </div>
      <div class="metric-value">
        {{ movingDuration1 }} <small>({{ movingDuration2 }})</small>
      </div>
    </div>

    <div class="metric-card">
      <div class="metric-header">
        <ion-icon :icon="warningOutline" class="danger"></ion-icon>
        <span>Violations</span>
      </div>
      <div class="metric-value danger">
        {{ violation1 }} <small>({{ violation2 }})</small>
      </div>
    </div>

    <div class="metric-card">
      <div class="metric-header">
        <ion-icon :icon="speedometerOutline"></ion-icon>
        <span>Fuel</span>
      </div>
      <div class="metric-value">
        {{ fuelCons1 }} <small>({{ fuelCons2 }})</small>
      </div>
    </div>

  </div>

  <!-- 🔹 CALENDAR -->
  <div class="calendar-card">

    <!-- HEADER -->
    <div class="calendar-top">
      <h3>Daily Distance Activity</h3>

      <!-- 🔥 LEGEND -->
      <div class="legend">
        <div><span class="dot low"></span> &lt; 20 km</div>
        <div><span class="dot mid"></span> 20-100 km</div>
        <div><span class="dot high"></span> &gt; 100 km</div>
      </div>
    </div>

    <!-- DAYS -->
    <div class="days">
      <div v-for="day in days" :key="day">{{ day }}</div>
    </div>

    <!-- DATES -->
    <div class="dates">
      <div
        v-for="(date, index) in calendar"
        :key="index"
        class="date-box"
        :class="[
  'date-box',
  date.value < 20 ? 'low' : 
  date.value <= 100 ? 'mid' : 
  'high'
]"
      >
        <span class="date-number" :class="[
  'date-number',
  date.value > 100 ? 'text-white' : 'text-dark'
]">
          {{ date.day }}
        </span>

        <span class="date-value" :class="[
  'date-number',
  date.value > 100 ? 'text-white' : 'text-dark'
]">
          {{ date.value }}
        </span>
      </div>
    </div>

  </div>

</ion-content>
    
<!-- <ion-content fullscreen class="no-safe-bottom">
      <div class="header-container">
        <div class="month-info">
          <div class="month-year">{{ monthName }} {{ year }}</div>
          <div class="sub-text">Kms travelled per day</div>
        </div>

        <div class="bars-container">
          <div class="bar" v-for="(bar, index) in bars" :key="index">
            <div class="bar-color" :style="{ backgroundColor: bar.color }"></div>
            <div class="bar-value">{{ bar.value }}</div>
          </div>
        </div>
      </div>
      <div class="calendar-container">
        <div class="day-names">
          <div class="day-name" v-for="day in days" :key="day">{{ day }}</div>
        </div>
        <div class="dates">
          <div
            v-for="(date, index) in calendar"
            :key="index"
            :class="['date-item', { disabled: date.isFuture }]"
          >
          <span class="date" :style="{ color: date.textColor }">{{ date.day }}</span>
          <span class="value">{{ date.value }}</span>
            <div class="dash-bar" :style="{ backgroundColor: date.color }"></div>
          </div>
        </div>
      </div>

      <div class="month-below">
        <div class="month-total">Month Total</div>
        <div class="today-total">(Today's Total)</div>
      </div>
      <ion-list>
      <ion-item>
        <ion-grid>
          <ion-row style="align-items: center;">
            <ion-col size="auto">
              <ion-icon :icon="distanceIcon" style="font-size: 30px;" />
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
              <ion-icon :icon="durationIcon" style="font-size: 30px;" />
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
              <ion-icon :icon="violationIcon" style="font-size: 30px;" />
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
              <ion-icon :icon="fuelIcon" style="font-size: 30px;" />
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
    </ion-content> -->
  </ion-page>
</template>

<style>
.dashboard-content {
  --background: #f3faff;
  padding: 8px;
  font-family: 'Inter', sans-serif;
}

/* 🔹 HEADER */
.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-left: 10px;
  margin-right: 10px;
}

.vehicle-header h1 {
  font-size: 26px;
  font-weight: 800;
  margin: 0;
}

.vehicle-header p {
  font-size: 14px;
  color: #6e7a71;
}

/* CHIP */
.chip {
  background: #e6f6ff;
  padding: 8px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
}

/* 🔹 METRICS GRID */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 10px 20px 10px 20px;
}

.metric-card {
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #3e4942;
  text-transform: uppercase;
}

ion-icon{
  height: 24px;
  width: 24px;
  color: var(--ion-color-primary);
}
.metric-value {
  font-size: 20px;
  font-weight: 800;
  margin-top: 8px;
}

.metric-value small {
  font-size: 12px;
  color: #3e4942;
}

.danger {
  color: var(--ion-color-danger);
}

/* 🔹 CALENDAR */
.calendar-card {
  background: #e6f6ff;
  padding: 10px;
  border-radius: 16px;
  margin: 10px;
  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);
}

/* TOP */
.calendar-top {
  /* display: flex; */
  justify-content: space-between;
  align-items: center;
}

.calendar-top h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 5px 0px 10px 0px;
}

/* LEGEND */
.legend {
  display: flex;
    justify-content: flex-end;   /* 🔥 push to right */

  gap: 10px;
  font-size: 11px;
  font-weight: 600;
  color: #6e7a71;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.low { background: #c3deec; }
/* .mid { background: rgba(0, 135, 90, 0.3); } */
.high { background: var(--ion-color-primary); }

/* DAYS */
.days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-top: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #6e7a71;
  text-align: center;
}

/* DATES */
.dates {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  margin-top: 10px;
}

.date-box {
  border-radius: 10px;
  padding: 6px 2px;
  min-width: 0;

  display: flex;
  flex-direction: column;   /* 🔥 IMPORTANT */
  align-items: center;      /* center horizontally */
  justify-content: center;  /* center vertically */
  text-align: center;
}

/* 🔹 COLORS EXACT MATCH */
.date-box.low {
  background: #c3deec;   /* <20 */
    color: #021f29;

}

.date-box.mid {
  background: rgba(0, 107, 71, 0.3);  /* 20–100 */
    color: #021f29;

}

.date-box.high {
  background: var(--ion-color-primary);   /* >100 */
  color: white;
}

h3{
  margin: 0px;
}


.date-number {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.8;
}

.date-value {
  font-size: 12px;
  font-weight: 800;
}
</style>
<!-- <style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3faff;
  margin-top: 5px;
}

.month-info {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}

.month-name {
  font-size: 16px;
  font-weight: bold;
}

.sub-text {
  margin-top: 2px;
  font-size: 10px;
}
.bars-container {
  display: flex;
  align-items: flex-end;
}

.bar {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.bar-color {
  width: 10px;
  height: 5px;
  margin-right: 2px;
}

.bar-value {
  font-size: 10px;
  margin-right: 2px;
}

.right-text {
  font-size: 1em;
  text-align: right;
}

.calendar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.day-names {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 5px;
  padding-top: 10px;
  background-color: #f3faff;
}
.day-name {
  width: 14.28%; /* 100% / 7 days */
  text-align: center;
}
.dates {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
}
.date-item {
  width: 14.28%; /* 100% / 7 days */
  text-align: center;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.date {
  font-size: 14px;
}
.value {
  margin-top: 2px;
  font-size: 10px;
  color: gray;
}
.dash-bar {
  width: 40%;
  height: 2px;
  margin-top: 2px;
}
.disabled {
  color: #d3d3d3;
}
.month-below {
  display: flex;
  background-color: #f3faff;
  padding: 10px;
  flex-direction: inherit;
  align-items: center;
}
.month-total {
  font-size: 14px;
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
</style> -->


<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon,  loadingController,IonItem,IonList
} from '@ionic/vue';
import { addCircleOutline,gitNetworkOutline, timeOutline,warningOutline,speedometerOutline, calendarOutline, waterOutline } from 'ionicons/icons';
import { distanceRouteIcon } from "@/common/customIcons";
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import storage from "@/services/storagefile";
import { useRouter ,useRoute} from 'vue-router';
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function
import { App } from '@capacitor/app';



export default defineComponent({
  name: 'VehicleInfo',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon,  loadingController,IonItem,IonList

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
        type: String,
    }

  },
   setup(props) {
    let isFirstTimeDataCall = true;

  // Constants and reactive variables
  const route = useRoute();
      const router = useRouter();

  const days = ref(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']);
  const calendar = ref([]);
  const monthName = ref('');
  const year = ref('');

  const bars = ref([
    { color: '#f44336', value: '<20 Kms' },
    { color: '#ff9800', value: '20-100 Kms' },
    { color: '#4caf50', value: '>100 Kms' },
  ]);

  // Function to generate the calendar based on API data
  const generateCalendar = (dlyDistArr) => {
    console.log("displaydata", dlyDistArr);

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const numDays = monthEnd.getDate();

    monthName.value = today.toLocaleString('default', { month: 'long' });
    year.value = today.getFullYear();

    const calendarDays = [];

    // Fill initial empty days to align the first day of the month
    for (let i = 0; i < monthStart.getDay(); i++) {
      calendarDays.push({ day: '', value: '', color: '', isFuture: false, textColor: '' });
    }

    // Fill the days of the current month using dlyDistArr data
    for (let i = 1; i <= numDays; i++) {
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

      const dateData = dlyDistArr[0][dateStr];
      const dist = dateData ? dateData.dist : "0";
      const lvl = dateData ? dateData.lvl : "1";

      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const isFuture = date > today;
      const isToday = date.toDateString() === today.toDateString();

      let textColor = '#000000'; // Default text color for past dates
      if (isToday) {
        textColor = '#2eaa0c'; // Green for the current date
      } else if (isFuture) {
        textColor = '#d3d3d3'; // Gray for future dates
      }

      let color = '#f44336'; // Default color for distance < 20 Kms
      if (isFuture) {
        color = '#d3d3d3'; // Gray for future dates
      } else if (dist < 20) {
        color = '#f44336';
      } else if (dist >= 20 && dist < 100) {
        color = '#ff9800';
      } else if (dist > 100) {
        color = '#4caf50';
      }

      calendarDays.push({
        day: i,
        value: dist,
        color: color,
        isFuture: isFuture,
        textColor: textColor,
      });
    }

    calendar.value = calendarDays;
  };

  // Function to fetch data from the API
  const CallAPIForData = () => {
  let loading;

  loadingController.create({
    message: "Loading...",
    backdropDismiss: true // Makes the loading controller cancelable

  })
  .then((load) => {
    loading = load;
    return ; if(isFirstTimeDataCall){
         loading.present();
    }
  })
  .then(() => {
    const params = {
      veh_id: props.vehicleId,
    };
    console.log("vehicleId", props.vehicleId);

    return fetchData(
      Constants.CONT.Mobile_Contro,
      Constants.CMD.Req_Vehi_info,
      params
    );
  })
  .then((response) => {
    const responsejson = response.data;

    if (response.status === 200) {
      const arrData = responsejson.arr_data;

      if (arrData) {
        generateCalendar(arrData.dly_dist_arr);

        // Update other details
        Distance_tot.value = arrData.tot_dist;
        Distance_per.value = arrData.tday_dist;
        movingDuration1.value = arrData.tot_drv_dur;
        movingDuration2.value = arrData.tday_drv_dur;
        violation1.value = arrData.tot_vio_cnt;
        violation2.value = arrData.tday_vio_cnt;
        fuelCons1.value = arrData.tot_flcons;
        fuelCons2.value = arrData.tday_flcons;
      }
    } else if (response.status === 401) {
      this.toastMessage = responsejson.message;
    } else {
      console.error("Empty response data");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    if (loading) {
       if(isFirstTimeDataCall){
loading.dismiss();    }
    }
  });
};


  // Reactive variables to hold API values
  const Distance_tot = ref(0);
  const Distance_per = ref(0);
  const movingDuration1 = ref(0);
  const movingDuration2 = ref(0);
  const violation1 = ref(0);
  const violation2 = ref(0);
  const fuelCons1 = ref(0);
  const fuelCons2 = ref(0);

  // onMounted hook to call API on component mount
  onMounted(async () => {
    const status = await Network.getStatus();
    if (status.connected) {
      CallAPIForData();
    } else {
      showToast();
    }

   
  });

    onUnmounted(()=>{
          

    });
    
   

  // Return all variables and methods
  return {
      vehicleId: props.vehicleId,
      vehicleName: props.vehicleName,
      groupname:props.groupname,
    days,
    gitNetworkOutline, timeOutline,warningOutline,speedometerOutline,calendarOutline,
    calendar,
    monthName,
    year,
    bars,
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
    fuelCons2,
    vehicleId: props.vehicleId,
    vehicleName: props.vehicleName,
  };
}

});
</script>

