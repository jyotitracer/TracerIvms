<template>
  <ion-item class="vehicle-item" >
    <ion-grid class="custom-grid" >
      
      <!-- First Row: Header with Vehicle Info -->
      <ion-row>
        <ion-col size="12" class="header">
         
          <div class="vehicle-id">
            <img 
              :src="isFavorite ? '/ic_star_enable.png' : '/ic_star_disable.png'" 
              alt="star icon" 
              class="icon-img-star" 
            />
            
            <div class="vehicle-details">
              <div class="vehicle-number" style="font-size: 18px;">{{ vehicle.veh_no }}</div>

                                        <div class="status-item">
                      <div class="dot_color" :style="{ background: vehicle.sts_colr }"></div>

                      <div class="label" :style="{ color: vehicle.sts_colr }">
                        {{ vehicle.veh_sts }}
                      </div>
                    </div>
            </div>
          </div>

          <div class="driver-status">
             <div size="8" class="last-status-update">
    <span>Last Status Update - {{ lastStatusUpdate }}</span>
             </div>

            <!-- <img :src="driverIconSrc" alt="driver icon" class="icon-img-people" />

            
            <div class="vehicle-details">
              <div class="vehicle-number">{{ vehicle.drv_name ? vehicle.drv_name : 'Driver not available' }}</div>
              <div>
                <span style="font-size: 10px;"> {{ vehicle.drv_alloc_dt ?  "Allocated- "+ vehicle.drv_alloc_dt : ''  }}</span>
              </div>
            </div> -->
          </div>

          <!-- <div class="driver-status">
            <img :src="driverIconSrc" alt="driver icon" class="icon-img-people" />
            <span>{{ vehicle.drv_name ? vehicle.drv_name : 'Driver not available' }}</span>
                          <div class="label" :style="{ color: vehicle.sts_colr }">
                <span>{{ vehicle.veh_sts }}</span>
              </div>

          </div> -->
        </ion-col>
      </ion-row>
      
      <!-- Second Row: Location -->
      <ion-row>
        <ion-col size="12" class="location">
          <!-- <img :src="getLocation" alt="location icon" class="icon-img" /> -->
            <ion-icon :icon="locationSharp" style="font-size: 24px; min-width: 24px; flex-shrink: 0; color: #4CAF50; margin-right: 8px;"></ion-icon>

          <span>{{ vehicle.loc_str }}</span>
        </ion-col>
      </ion-row>
      
      <!-- Third Row: Fuel and Status Update -->
      <ion-row>
        <ion-col size="6" class="fuel" v-if="vehicle.fuel_flag === 1">
          <img :src="getFuel" alt="fuel icon" class="icon-img" />
          <span>{{ fuelDisplay }}</span>
        </ion-col>
        <ion-col size="6" class="status-update">
          <ion-row class="icons-row">
            <ion-col size="3" class="icon">
              <img :src="getEventSrc" alt="event icon" class="icon-img" />
              <span>Event</span>
            </ion-col>
            <ion-col size="3" class="icon">
              <img :src="getBatterySrc" alt="battery icon" class="icon-img" />
              <span>{{ getBattery }}</span>
            </ion-col>
            <ion-col size="3" class="icon">
              <img :src="getInput1" alt="input 1 icon" class="icon-img" />
              <span>{{ vehicle.ip1_obj.ip_name }}</span>
            </ion-col>
            <ion-col size="3" class="icon">
              <img :src="getInput2" alt="input 2 icon" class="icon-img" />
              <span>{{ vehicle.ip2_obj.ip_name }}</span>
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>

      <!-- Fourth Row: Last Status Update -->
     <!-- <ion-row class="status-row-align">

  LEFT -->
  <!-- <ion-col size="8" class="last-status-update">
    <span>Last Status Update - {{ lastStatusUpdate }}</span>
  </ion-col>


</ion-row> -->
<ion-row class="btn-row">
  <ion-button class="track-btn" size="small"  @click="navigateToPage(vehicle,vehicle.veh_id, vehicle.veh_no,groupname)"
>
    Track Details
  </ion-button>
</ion-row>
    </ion-grid>
  </ion-item>
</template>


<script>
import { defineComponent } from 'vue';
import { IonItem, IonGrid, IonRow, IonCol,IonButton,IonIcon } from '@ionic/vue';
import storage from '@/services/storagefile';
import { ref ,watch} from 'vue';
import { locationSharp } from 'ionicons/icons';
import Constants from '@/common/constants';
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'VehicleItem',
  components: { IonItem, IonGrid, IonRow, IonCol ,IonButton,IonIcon},
  props: {
    vehicle: {
      type: Object,
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    groupname:{
      type : String,
      required:true
    }
  },
  setup(props) {
    const lastStatusUpdate = ref(''); // Reactive ref for storing the update


    const router = useRouter();


        const navigateToPage = async (vehicle,veh_id, veh_no,group) => {
      //console.log("displayData",JSON.stringify(vehicle));
     await storage.set('selectedVeh',JSON.stringify(vehicle));
      await storage.set('SelectGroup',group);

      // router.push({ 
      //   name: 'VehcileMapInfoTripPage', 
      //   params: { vehicleId: veh_id, vehicleName: veh_no,groupname:groupname.value} ,

      // });

      router.push(`/vehtabs/${veh_id}/${veh_no}/${props.groupname}/map`);

    };



    // Function to get the formatted "Last Status Update"
    const formatDateToString = (date, timezone) => {
      return new Date(
        new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(date)
      );
    };

    const getYesterday = () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const getLastStatusUpdate = async (inputDate) => {


      try {
        const login_data = await storage.get('login_data');
        const deviceTimezone = login_data.tz_idfier;

        const deviceDate = new Date();
        const deviceDateAfterTimeZoneConvert = formatDateToString(deviceDate, deviceTimezone);

        const serverDate = new Date(inputDate);
        const dateLocal = new Date(deviceDateAfterTimeZoneConvert);
        dateLocal.setHours(0, 0, 0, 0);

        const serverDateWithoutTime = new Date(inputDate);
        serverDateWithoutTime.setHours(0, 0, 0, 0);

        const dateYesterday = getYesterday();

        if (dateLocal.getTime() === serverDateWithoutTime.getTime()) {
          const timeDiff = deviceDateAfterTimeZoneConvert.getTime() - serverDate.getTime();
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

          if (hours > 6 && hours <= 24) {
            const timeString = new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }).format(serverDate);
            return `Today at ${timeString}`;
          } else if (hours >= 1 && hours <= 6) {
            return `${hours} hours ${minutes > 0 ? `${minutes} minutes` : ''} ago`;
          } else if (minutes >= 1) {
            return `${minutes} minutes ago`;
          } else {
            return 'Just Now';
          }
        } else if (dateYesterday.getTime() === serverDateWithoutTime.getTime()) {
          const timeString = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }).format(serverDate);
          return `Yesterday at ${timeString}`;
        } else {
          return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }).format(serverDate);
        }
      } catch (error) {
        console.error('Error:', error);
        return 'Error retrieving date';
      }
    };

    // Watch for changes in `vehicle.rec_dt` and update `lastStatusUpdate`
 watch(
  () => props.vehicle,
  async (newVehicle) => {
    if (newVehicle && newVehicle.rec_dt) {
      lastStatusUpdate.value = await getLastStatusUpdate(newVehicle.rec_dt);
    }
  },
  { immediate: true, deep: true }
);
    return {
      lastStatusUpdate,locationSharp,navigateToPage
    };
  },
  computed: {
    driverIconSrc() {
      return this.vehicle.gpssts === 0 ? '/ic_driver_disabled.png' : (this.vehicle.drv_name ? '/ic_driver.png' : '/ic_driver_disabled.png');
    },
    getBatterySrc() {
      return this.vehicle.gpssts === 0
        ? `/ic_batt_${this.vehicle.batt_obj.batt_sts}_disabled.png`
        : `/ic_batt_${this.vehicle.batt_obj.batt_sts}.png`;
    },
    getBattery() {
      return this.getBatterySrc.includes('ic_batt_0') ? 'Ext.Batt' : 'Int.Batt';
    },
    getEventSrc() {
      return this.vehicle.gpssts === 0 || this.vehicle.event_obj.event_sts === 0 ? '/ic_alarm_disabled.png' : '/ic_alarm.png';
    },
    getLocation() {
      return this.vehicle.gpssts === 0 ? '/ic_gps_disabled.png' : '/ic_gps.png';
    },
    getInput1() {
      return this.vehicle.gpssts === 0
        ? `/ic_ip_${this.vehicle.ip1_obj.ip_type_id}_3.png`
        : `/ic_ip_${this.vehicle.ip1_obj.ip_type_id}_${this.vehicle.ip1_obj.ip_sts}.png`;
    },
    getInput2() {
      return this.vehicle.gpssts === 0
        ? `/ic_ip_${this.vehicle.ip2_obj.ip_type_id}_3.png`
        : `/ic_ip_${this.vehicle.ip2_obj.ip_type_id}_${this.vehicle.ip2_obj.ip_sts}.png`;
    },
    getFuel() {
      const fueldata= this.vehicle.gpssts === 0
        ? `/ic_fuel_${this.vehicle.fuel_obj.fuel_lvl}_disabled.png`
        : `/ic_fuel_${this.vehicle.fuel_obj.fuel_lvl}.png`;
        console.log("gpsstus - fuelvalue:",this.vehicle.gpssts+" - "+fueldata);
        return fueldata;
    },
    fuelDisplay() {
      const { fuel_val, fuel_lvl_percent, fuel_tank_vol, fuel_unit } = this.vehicle.fuel_obj;
      return `${fuel_val} (${fuel_lvl_percent}%) / ${fuel_tank_vol} ${fuel_unit}`;
    },
  },
  methods: {

    // Function to format date to a specific timezone
 formatDateToString(date, timezone) {
 // console.log("timezone",timezone);
  // return new Date(date.toLocaleString("en-US"));
  return new Date(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  );
 },



// Utility to get yesterday's date
getYesterday() {
  const date = new Date();

  date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  return date;
},

 
async getLastStatusUpdate(inputDate) {
  const dateStatus = ref('');

  try {
    const login_data = await storage.get('login_data');
    const deviceTimezone = login_data.tz_idfier;


    const deviceDate = new Date();
    const deviceDateAfterTimeZoneConvert = this.formatDateToString(deviceDate, deviceTimezone);

    const serverDate = new Date(inputDate);
    const dateLocal = new Date(deviceDateAfterTimeZoneConvert);
    dateLocal.setHours(0, 0, 0, 0);

    const serverDateWithoutTime = new Date(inputDate);
    serverDateWithoutTime.setHours(0, 0, 0, 0);



    const dateYesterday = this.getYesterday();

    if (dateLocal.getTime() === serverDateWithoutTime.getTime()) {
      const timeDiff = deviceDateAfterTimeZoneConvert.getTime() - serverDate.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

    
     // console.log("checkmytime", hours+" "+minutes);
      if (hours > 6 && hours <= 24) { 
        const timeString = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(serverDate);
        dateStatus.value = `Today at ${timeString}`;
      } else if (hours >= 1 && hours <= 6) {
        dateStatus.value = `${hours} hours ${minutes > 0 ? `${minutes} minutes` : ''} ago`;
      } else if (minutes >= 1) {
        dateStatus.value = `${minutes} minutes ago`;
      } else {
        dateStatus.value = 'Just Now';
      }
    } 
    else if (dateYesterday.getTime() === serverDateWithoutTime.getTime()) {
      const timeString = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,

      }).format(serverDate);
      dateStatus.value = `Yesterday at ${timeString}`;
    } else {

      dateStatus.value = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,

      }).format(serverDate);
    }

  } catch (error) {
    console.error('Error:', error);
  }
  return dateStatus.value;
},    
  },
  
});
</script>


<style scoped>


.vehicle-item {
  position: relative;
  --padding-start: 5px; 
  --inner-padding-end: 5px;   

}

.vehicle-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}

.header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 5px;
  align-items: flex-start;
}

.vehicle-id {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: gray;
}

.vehicle-id .icon-img-star {
  margin-right: 5px;
  height: 16px;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
}

.vehicle-number {
  font-weight: bold;
  color: #313131;
}

.driver-status {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  text-align: right;
  flex: 1;
  font-size: 14px;
  font-weight: bold;
  color: gray;
}

.driver-status .icon-img-people {
  margin-right: 5px;
  height: 30px;
  margin-left: 20px;
}

.label {
  font-size: 12px;
}

.location {
  display: flex;
  align-items: center;
  color: #313131;
  font-size: 14px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px; /* space between dot and text */
}

.dot_color {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}


/* .location .icon-img {
  margin-right: 10px;
  height: 30px;
} */

.location .icon-img{
    height: 30px;
    width: 30px;
    color: var(--ion-color-primary);

}
.fuel {
  display: flex;
  align-items: center;
  color: gray;
  flex-direction: column;
  font-size: 12px;
}

.status-update {
  text-align: right;
  color: gray;
}

.last-status-update {
  color: gray;
  font-size: 10px;
  font-style: oblique;
  margin-top: 0;

}
.status-row-align {
  align-items: center; /* vertical center */
}

.btn-row {
  display: flex;
  justify-content: flex-end; /* 🔥 push button to right */
}


.icons-row {
  margin-top: 0;
  font-size: 10px;
}

.icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: gray;
  font-weight: bold;
}

.custom-grid {
  padding-left: 0;
  padding-right: 0;
  margin: 0;
}
.track-btn {
  --background: var(--ion-background-color);        /* emerald-50 */
  --color: var(--ion-color-primary);             /* emerald-800 */
  --border-radius: 9999px;      /* full rounded */

  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 0px 5px 0px 5px;
}

/* Hover effect */
.track-btn:hover {
  --background: #d1fae5;        /* emerald-100 */
}

</style>
