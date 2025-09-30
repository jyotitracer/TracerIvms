<template>
  <ion-page>
    
    <ion-content>
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
  </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonIcon,  loadingController,IonItem,IonList
} from '@ionic/vue';
import { addCircleOutline } from 'ionicons/icons';
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
  // Constants and reactive variables
  const route = useRoute();
      const router = useRouter();

  const days = ref(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
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
    return loading.present();
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
      loading.dismiss();
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
    
    calendar,
    monthName,
    year,
    bars,
    iconName: addCircleOutline, // Replace with the desired icon
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

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f4f2f2;
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
  background-color: #f4f2f2;
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
  background-color: #f4f2f2;
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
</style>
