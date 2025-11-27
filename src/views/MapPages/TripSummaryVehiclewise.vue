<template>
  <ion-page>
    <ion-header>
        <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Trip Summary</ion-title>
      </ion-toolbar>
      </ion-header>

      <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   


    <ion-content :fullscreen="true">
      <!-- Button group for filter -->
      <div class="button-group">
        <ion-button
          v-for="(label, index) in labels"
          :key="index"
          :class="{'selected': selectedLabel === label}"
          @click="selectButton(label)"
          fill="clear"
        >
          {{ label }}
        </ion-button>
      </div>

    

      <!-- Display for Today -->
      <div v-if="selectedLabel === 'Today'">
        <!-- Check if todayItems is empty -->
        <p v-if="todayItems.length === 0">Data not available</p>
        <div v-for="(item, index) in todayItems" :key="index" class="item" >
          <div class="item-header">
            <span>{{ item.dateString }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(detail, idx) in item.details" :key="idx" class="detail-row"  @click="openSection(detail)">
                <div class="detail-container">
                  <span class="detail-time">{{ detail.st_date }}</span>
                  <span class="detail-location">{{ detail.st_loc }}</span>
                  <div class="detail-right">
                    <span class="detail-distance">{{ detail.distance }}</span>
                    <span class="detail-duration">{{ detail.tot_duration }}</span>
                  </div>
                </div>
                <ion-item-divider v-if="idx < item.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Display for Yesterday -->
      <div v-else-if="selectedLabel === 'Yesterday'">
        <!-- Check if yesterdayItems is empty -->
        <p v-if="yesterdayItems.length === 0">Data not available</p>
        <div v-for="(item, index) in yesterdayItems" :key="index" class="item">
          <div class="item-header">
            <span>{{ item.dateString }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(detail, idx) in item.details" :key="idx" class="detail-row"  @click="openSection(detail)">
                <div class="detail-container">
                  <span class="detail-time">{{ detail.st_date }}</span>
                  <span class="detail-location">{{ detail.st_loc }}</span>
                  <div class="detail-right">
                    <span class="detail-distance">{{ detail.distance }}</span>
                    <span class="detail-duration">{{ detail.tot_duration }}</span>
                  </div>
                </div>
                <ion-item-divider v-if="idx < item.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Display for Week -->
      <div v-else-if="selectedLabel === 'Week'">
        <!-- Check if weekItems is empty -->
        <p v-if="weekItems.length === 0">Data not available</p>
        <div v-for="(item, index) in weekItems" :key="index" class="item" @click="openSection">
          <div class="item-header">
            <span>{{ item.dateString }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(detail, idx) in item.details" :key="idx" class="detail-row"  @click="openSection(detail)">
                <div class="detail-container">
                  <span class="detail-time">{{ detail.st_date }}</span>
                  <span class="detail-location">{{ detail.st_loc }}</span>
                  <div class="detail-right">
                    <span class="detail-distance">{{ detail.distance }}</span>
                    <span class="detail-duration">{{ detail.tot_duration }}</span>
                  </div>
                </div>
                <ion-item-divider v-if="idx < item.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Display for Month -->
      <div v-else-if="selectedLabel === 'Month'">
        <!-- Check if monthItems is empty -->
        <p v-if="monthItems.length === 0">Data not available</p>
        <div v-for="(item, index) in monthItems" :key="index" class="item">
          <div class="item-header">
            <span>{{ item.dateString }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(detail, idx) in item.details" :key="idx" class="detail-row"  @click="openSection(detail)">
                <div class="detail-container">
                  <span class="detail-time">{{ detail.st_date }}</span>
                  <span class="detail-location">{{ detail.st_loc }}</span>
                  <div class="detail-right">
                    <span class="detail-distance">{{ detail.distance }}</span>
                    <span class="detail-duration">{{ detail.tot_duration }}</span>
                  </div>
                </div>
                <ion-item-divider v-if="idx < item.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>

     <!-- Summary grid display -->
        <div v-if="selectedItems.length > 0 && hasDataForSelectedLabel" class="grid-container">
          <div class="detail-right">
            <span class="Total-Lable">Total Trip Count</span>
            <span class="Total_Values">{{ TotalCount }}</span>
          </div>

          <div class="detail-right">
            <span class="Total-Lable">Total Distance</span>
            <span class="Total_Values">{{ TotalDist }}</span>
          </div>

          <div class="detail-right">
            <span class="Total-Lable">Total Duration</span>
            <span class="Total_Values">{{ TotalDur }}</span>
          </div>
        </div>

    </ion-content>
  </ion-page>
</template>

<script>
import useNetwork from '@/services/networkService'; // Import the network service

import { ref, onMounted,computed } from 'vue';
import { IonButton, IonItemDivider, IonPage, IonHeader, IonContent, IonToolbar, IonIcon, loadingController,IonButtons,
    IonBackButton
 } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import toast utility function
import router from '@/router/index'; // Assuming your router file is named router.js
    import storage from "@/services/storagefile";

addIcons({ close });

export default {
  name: 'DateFilterButtons',
  components: {
    IonButton,
    IonItemDivider,
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    loadingController,
    IonIcon,
    IonButtons,
    IonBackButton
  },
 
  setup(props) {
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    // Reactive data
    const labels = ['Today', 'Yesterday', 'Week', 'Month'];
    const selectedLabel = ref('Today');
    const closeIcon = close;
    let req_period_type = '1';
    const selectedItems = ref([]);  // Make selectedItems reactive



    // Reactive arrays
    const todayItems = ref([]);     // Make reactive
    const yesterdayItems = ref([]);
    const weekItems = ref([]);
    const monthItems = ref([]);

    const TotalCount = ref(0);
    const TotalDist = ref(0);
    const TotalDur = ref(0);

    const historyarray=ref([]);


  // Computed property to check if data exists for the selected label
  const hasDataForSelectedLabel = computed(() => {
    if (selectedLabel.value === 'Today') {
      return todayItems.value.length > 0;
    } else if (selectedLabel.value === 'Yesterday') {
      return yesterdayItems.value.length > 0;
    } else if (selectedLabel.value === 'Week') {
      return weekItems.value.length > 0;
    } else if (selectedLabel.value === 'Month') {
      return monthItems.value.length > 0;
    }
    return false;
  });

    // Method to select button and fetch data
    const selectButton = async (label) => {
      selectedLabel.value = label;
      const status = await Network.getStatus();
      if (status.connected) {
        CallAPIForData();
      } else {
        showToast();
      }
    };


    const CallTripPath=async(st_date_1, ed_date, veh_id)=>{
              loadingController.create({
              
              backdropDismiss: true // Makes the loading controller cancelable
            })
            .then(loading => {
              // Present the loading spinner
              loading.present();



            console.log(st_date_1+" "+ed_date+" "+veh_id);

              const params = {
                veh_id: veh_id,
                fdate: st_date_1,
                edate: ed_date,

                
              };

              // Make the API call
              return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_trip_path, params)
                .then((response) => {
                  const responsejson = response.data;

                  if (response.status === 200) {

                    console.log("displayData",responsejson);
  // Odometer values
  const odometerLast = parseInt(responsejson.arr_data[responsejson.arr_data.length - 1].odometer);
              const odometerFirst = parseInt(responsejson.arr_data[0].odometer);
              const start_loc = responsejson.arr_data[0].location;
              const end_loc = responsejson.arr_data[responsejson.arr_data.length - 1].location;

              const distance = ((odometerLast - odometerFirst) / 1000).toFixed(1);

              // Dates and times
              const lastDate = `${responsejson.arr_data[responsejson.arr_data.length - 1].rtcdate} ${responsejson.arr_data[responsejson.arr_data.length - 1].rtctime}`;
              const firstDate = `${responsejson.arr_data[0].rtcdate} ${responsejson.arr_data[0].rtctime}`;

              const format = "yyyy-MM-dd HH:mm:ss"; // Date format


             

              // Calculate time difference
              const calculateDuration = (start, end) => {

                            console.log("dattime",start+" "+end);
            // Convert string dates to actual Date objects
            const startDate = new Date(start.split('-').reverse().join('-'));
              const endDate = new Date(end.split('-').reverse().join('-'));

              // Get the difference in milliseconds
              const diffMs = endDate - startDate;

                          
                // Calculate days, hours, minutes, and seconds
                const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

                // Format the result
                let result = '';

                if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
                if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''}, `;

                if (minutes > 0) {
                  result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
                } else if (seconds > 0) {
                  result += `${seconds} second${seconds > 1 ? 's' : ''}`;
                }

                return result;

              };

              // Calculate duration
              const duration = calculateDuration(firstDate, lastDate);


              const ConvertSecondToHHMMSSString=(nSecondTime)=>{
                 // Calculate hours, minutes, and seconds
              const h = Math.floor(nSecondTime / 3600);
              const m = Math.floor((nSecondTime % 3600) / 60);
              const s = nSecondTime % 60;

              // Format each part
              const sh = h > 0 ? `${h} h` : '';
              const sm = m > 0 ? `${h > 0 && s === 0 && m < 10 ? '0' : ''}${m} m` : '';
              const ss = s === 0 && (h > 0 || m > 0)
                  ? ''
                  : `${(s < 10 && (h > 0 || m > 0)) ? '0' : ''}${s} s`;

              // Combine the parts with appropriate spacing
              return `${sh}${h > 0 ? ' ' : ''}${sm}${m > 0 ? ' ' : ''}${ss}`.trim();
              };

                // Function to return event status message based on event type
                const getEventStatus = (event_type,status,speed,stoppage) => {

                 // console.log("vehicleJyo",event_type);

                  if (event_type === Constants.eventType.Event_Type_Moving) {
                    return `${status} at ${speed} Km/h`;
                  } else {
                    return `${status} for ${ConvertSecondToHHMMSSString(stoppage)}`;
                  }
                };

       
                  historyarray.value = responsejson.arr_data
                      .filter((item) => item.lat && item.lon) // Filter out invalid lat/lon
                      .map((item) => ({
                        recId: item.rec_id,
                        lat: parseFloat(item.lat),
                        lon: parseFloat(item.lon),
                        location: item.location,
                        speed: parseInt(item.speed, 10),
                        vehNo: item.veh_no,
                        rtcDate: item.rtcdate,
                        rtcTime: item.rtctime,
                        driverName: item.driver_name,
                        distance: distance,
                        duration: duration,
                        start_loc: start_loc,
                        end_loc: end_loc,
                        driver_name: item.driver_name,
                        event_type: item.event_type,
                        label: item.label,
                        stoppage: item.stoppage_dur,
                        event_status: getEventStatus(item.event_type, item.label, parseInt(item.speed, 10), item.stoppage_dur),
                      }));
                    
            
                      router.replace({
                      name: 'map',  // Parent page route name
                      params: { vehLat: 0, vehLon: 0,arrayData:JSON.stringify(historyarray.value) }  // Passing the selected lat/lon as query parameters
                    });  
                
                     
               } else if (response.status === 401) {
                    console.error('Unauthorized:', responsejson.message);
                  } else {
                    console.error('Empty response data');
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                })
                .finally(() => {
                  // Dismiss the loading spinner after the API call finishes
                  loading.dismiss();
                });
            })
            .catch(error => {
              console.error('Error creating loading:', error);
            });
        };

        
    const openSection = (itemDetails) => {
      

      CallTripPath(itemDetails.st_date_1,itemDetails.ed_date,itemDetails.veh_id);

    };

    const closeSection = () => {
    };

    // API call logic
    const CallAPIForData = async () => {


      const storedVehicle = await storage.get('showtripselectpage');
      const vehicle = JSON.parse(storedVehicle);


      let loading;
      let req_period_type = '';
   

      loadingController.create({
        message: "Loading...",
        backdropDismiss: true // Makes the loading controller cancelable

      })
      .then((load) => {
        loading = load;
        return loading.present();
      })
      .then(() => {
        if (selectedLabel.value === "Today") req_period_type = '1';
        else if (selectedLabel.value === "Yesterday") req_period_type = '2';
        else if (selectedLabel.value === "Week") req_period_type = '3';
        else if (selectedLabel.value === "Month") req_period_type = '4';

        const params = {
          element_id: vehicle.vehicleId,
          rpt_type: "1",
          is_smry: "0",
          req_period: req_period_type,
        };

        return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Vehi_trip, params);
      })
      .then((response) => {
        const responsejson = response.data;

        if (response.status === 200) {
          const arrData = responsejson.arr_data;
          todayItems.value = [];  // Clear previous data reactively
          yesterdayItems.value = [];
          weekItems.value = [];
          monthItems.value = [];
          TotalCount.value = 0;
          TotalDist.value = 0;
          TotalDur.value = 0;
          selectedItems.value = [];

          if (arrData) {
            arrData.arr_trip.forEach(trip => {
              Object.keys(trip).forEach(timestamp => {
                const details = trip[timestamp];
                const date = new Date(timestamp * 1000);
                const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
                const dateString = date.toLocaleDateString('en-US', options);

                // Organize items based on selected period
                if (req_period_type === '1') {
                  todayItems.value.push({ dateString, details });
                  selectedItems.value = todayItems.value;
                } else if (req_period_type === '2') {
                  yesterdayItems.value.push({ dateString, details });
                  selectedItems.value = yesterdayItems.value;
                } else if (req_period_type === '3') {
                  weekItems.value.push({ dateString, details });
                  selectedItems.value = weekItems.value;
                } else if (req_period_type === '4') {
                  monthItems.value.push({ dateString, details });
                  selectedItems.value = monthItems.value;
                }
              });
            });

            TotalCount.value = arrData.smry.trip_count;
            TotalDist.value = arrData.smry.smry_dist;
            TotalDur.value = arrData.smry.smry_dur;
          }
        } else {
          console.error("Error: ", responsejson.message);
        }
      })
      .catch((error) => {
        console.error("API Error: ", error);
      })
      .finally(() => {
        if (loading) {
          loading.dismiss();
        }
      });
    };

    const goBack = () => {
      // Navigate to the selected page
      router.back();
    };  
    onMounted(async () => {

      initNetworkListener();

      const status = await Network.getStatus();
      if (status.connected) {
        CallAPIForData();
      } else {
        showToast();
      }
    });

    return {
      historyarray,
      isConnected, showReconnectedMessage, initNetworkListener,
      goBack,
      labels,
      selectedLabel,
      closeIcon,
      TotalCount,
      TotalDist,
      TotalDur,
      todayItems,
      yesterdayItems,
      weekItems,
      monthItems,
      selectedItems,
      selectButton,
      openSection,
      closeSection,
      hasDataForSelectedLabel
    };
  },

};
</script>

<style scoped>
.custom-divider {
  margin: 0; /* Remove margin */
  padding: 0; /* Remove padding */
  height: 0px; /* Control the height of the divider */
  min-height: 5px;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;

}

ion-button {
  --border-color: red;
  --border-width: 1px;
  --border-style: solid;
  --color: red;
  --background: transparent;
  --border-radius: 0;
  margin-right: -2px;
  font-size: 10px;
  flex: 1;
  box-sizing: border-box;
  
}

ion-button.selected {
  --background: red;
  --color: white;
  font-size: 10px;
}

.item {
  margin-bottom: 10px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border: 1px solid #ccc;
}

.item-details {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  align-items: center;
}

.item-details ul {
  list-style-type: none;
  padding: 0;
}

.detail-row {
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.detail-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.detail-container {
  display: flex;
  width: 100%;
  align-items: center;
}

.Total-Lable{
  font-size: 13px;
  font-weight: bold;
  

}
.Total_Values{ 
  font-size: 12px;
  margin-top: 5px;

}
.grid-container {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Divide into 3 equal columns */
  gap: 10px; /* Optional: Add gap between columns */
  align-items: center; /* Center items vertically */
  justify-items: center; /* Center items horizontally */
  background-color: #f0f0f0; /* Optional: Background color for grid items */
  border: 1px solid #4a4a4a; /* Optional: Border for grid items */
}



.detail-time {
  width: 40px;
  text-align: left;
  margin-right: 10px;
  font-size: 13px;
}

.detail-location {
  flex-grow: 1;
  text-align: left;
  font-size: 13px;

}

.detail-distance,
.detail-duration {
  width: 100px;
  text-align: left;
  font-size: 13px;

  margin-left: 10px;
}

.new-section {
  width: 100%;
  height: 200px;
  background-color: #e0e0e0; /* Change this to any color or add more styles as needed */
  margin-bottom: 10px; /* Optional: Add some margin below the section */
  position: relative;

  
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
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
