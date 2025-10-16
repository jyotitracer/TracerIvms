<template>
  <ion-page>
   

    <ion-content>
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

      <!-- Section display logic -->
      <!-- <div v-if="showSection" class="new-section">
        <ion-icon :icon="closeIcon" class="close-icon" @click="closeSection"></ion-icon>
      </div> -->

      <div v-if="showSection" class="new-section">
        <div ref="mapContainer" style="width: 100%; height: 250px;"></div>
        <ion-icon :icon="closeIcon" class="close-icon" @click="closeSection"></ion-icon>

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
        <div v-for="(item, index) in yesterdayItems" :key="index" class="item" >
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
        <div v-for="(item, index) in weekItems" :key="index" class="item" >
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

<script lang="ts">
import { ref, onMounted,computed, onUnmounted } from 'vue';
import { IonButton, IonItemDivider, IonPage, IonHeader, IonContent, IonToolbar, IonIcon, loadingController } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import toast utility function
import { Loader } from "@googlemaps/js-api-loader";
import { defineComponent,nextTick } from 'vue';
import { useRouter ,useRoute} from 'vue-router';
import { App } from '@capacitor/app';


addIcons({ close });



export default defineComponent({
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

    const router = useRouter();


    // Reactive data
    const labels = ['Today', 'Yesterday', 'Week', 'Month'];
    const selectedLabel = ref('Today');
    const showSection = ref(false);
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

   
    const mapRef = ref<google.maps.Map | null>(null);
    let newMap: google.maps.Map | null = null;

    const mapContainer = ref<HTMLElement | null>(null); // Ref for the map container
    
      let markerId1=<google.maps.Polyline | null>(null);
        let markerId2=<google.maps.Polyline | null>(null);
          const historyarray = ref([]);
          const polylineRef = ref<google.maps.Polyline | null>(null);

            

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


  const CallTripPath=async(st_date_1: any, ed_date: any, veh_id: any)=>{
              loadingController.create({
              
              backdropDismiss: true // Makes the loading controller cancelable
            })
            .then(loading => {
              // Present the loading spinner
              loading.present();



            //   const fromdateString = fromDateTimeFormatted.value;
            // const todateString = toDateTimeFormatted.value;

            // console.log(fromdateString+" "+todateString);
            // const [day1, month1, year1, hour1, minute1] = fromdateString.match(/\d+/g); // Extract date and time parts
            // const [day2, month2, year2, hour2, minute2] = todateString.match(/\d+/g); // Extract date and time parts


            // // Create a Date object with parsed values (months are zero-indexed in JavaScript Dates)
            // const fromdateObject = new Date(year1, month1 - 1, day1, hour1, minute1);
            // const todateObject = new Date(year2, month2 - 1, day2, hour2, minute2);

            // const FromepochTime = Math.floor(fromdateObject.getTime() / 1000); // Convert to seconds
            // const ToepochTime = Math.floor(todateObject.getTime() / 1000); // Convert to seconds


            console.log(st_date_1+" "+ed_date+" "+veh_id);

              const params = {
                veh_id: veh_id,
                fdate: st_date_1,
                edate: ed_date,

                
              };

              // Make the API call
              return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_trip_path, params)
                .then((response: { data: any; status: number }) => {
                  const responsejson = response.data;

                  if (response.status === 200) {

                    console.log("displayData",responsejson);

                     historyarray.value = responsejson.arr_data
                      .filter((item: { lat: string; lon: string }) => item.lat && item.lon) // Filter out invalid lat/lon
                      .map((item: { rec_id: any; lat: string; lon: string; location: any; speed: string; veh_no: any; rtcdate: any; rtctime: any; driver_name: any; event_type: string; label: string; stoppage_dur: string }) => ({
                        recId: item.rec_id,
                        lat: parseFloat(item.lat),
                        lon: parseFloat(item.lon),
                        location: item.location,
                        speed: parseInt(item.speed, 10),
                        vehNo: item.veh_no,
                        rtcDate: item.rtcdate,
                        rtcTime: item.rtctime,
                        driverName: item.driver_name,
                        // distance: distance,
                        // duration: duration,
                        // start_loc: start_loc,
                        // end_loc: end_loc,
                        driver_name: item.driver_name,
                        event_type: item.event_type,
                        label: item.label,
                        stoppage: item.stoppage_dur,
                      //  event_status: getEventStatus(item.event_type, item.label, parseInt(item.speed, 10), item.stoppage_dur),
                      }));
                
                      // Extract origin (0th index)
                      const origin = {
                        lat: historyarray.value[0].lat,
                        lng: historyarray.value[0].lon,
                      };

                      // Extract destination (last index)
                      const destination = {
                        lat: historyarray.value[historyarray.value.length - 1].lat,
                        lng: historyarray.value[historyarray.value.length - 1].lon,
                      };

                      

                      // // Extract waypoints (elements between 0th and last index)
                      // const waypoints = historyarray.value.slice(0, historyarray.value.length+1).map((point) => ({
                      //   location: { lat: point.lat, lng: point.lon },
                      //   stopover: true,
                      // }));

                      const waypoints = historyarray.value.map((item) => ({
                            location: { lat: item.lat, lng: item.lon },
                            stopover: true, // Set to true if these should be treated as stopovers
                          }));


                     
                   markerId1 = new google.maps.Marker ({
                    position: origin,
                    map: newMap,
                    icon: {
                              url: "/ic_end.png", // Path to the icon
                              scaledSize: new google.maps.Size(25, 25) // Adjust width and height
                            }              
                          
                        });


                   markerId2 = new google.maps.Marker ({
                    position: destination,
                    map: newMap,
                            icon: {
                                url: "/ic_st.png", // Path to the icon
                                scaledSize: new google.maps.Size(25, 25) // Adjust width and height
                              }
                  });


                //   const latitudes = historyarray.value.map(point => point.lat);
                //  const longitudes = historyarray.value.map(point => point.lon);

                //   const midpoint = {
                //         lat: latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length,
                //         lng: longitudes.reduce((sum, lon) => sum + lon, 0) / longitudes.length,
                //       };

                      // Set map to midpoint and adjust zoom
                      // newMap?.setCenter(new google.maps.LatLng(midpoint.lat, midpoint.lng));
                      newMap?.setCenter(new google.maps.LatLng(origin));

                      newMap?.setZoom(10); // Adjust to 10 or 12 as needed



                      // Extract all points
                      const pathCoordinates = historyarray.value.map(point => ({
                        lat: point.lat,
                        lng: point.lon,
                      }));

                      // Draw polyline
                      const polyline = new google.maps.Polyline({
                        path: pathCoordinates,
                        geodesic: true,
                        strokeColor: '#FF0000', // Polyline color
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                      });

                      // Add polyline to the map
                      polyline.setMap(newMap);
                    
               } else if (response.status === 401) {
                    console.error('Unauthorized:', responsejson.message);
                  } else {
                    console.error('Empty response data');
                  }
                })
                .catch((error: any) => {
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

    const clearMap = () => {
      // Remove markers
      if (markerId1) {
        markerId1.setMap(null);
        markerId1 = null;
      }

      if (markerId2) {
        markerId2.setMap(null);
        markerId2 = null;
      }

      // Remove polyline
      if (polylineRef.value) {
                      polylineRef.value.setMap(null); // Remove polyline from the map
                      polylineRef.value = null; // Clear the reference
                    }

      // Clear map reference (if needed)
      if (newMap) {
        newMap = null;
      }
    };

    const openSection = (itemDetails) => {
      
      showSection.value = true;
      callMapInit();

      CallTripPath(itemDetails.st_date_1,itemDetails.ed_date,itemDetails.veh_id);

    };

    const closeSection = () => {
      showSection.value = false;
      clearMap();
    };

    // API call logic
    const CallAPIForData = () => {
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
          element_id: props.vehicleId,
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
    const callMapInit= async ()=>{
     

  const initialLat = 19.0760; // Corrected latitude
  const initialLng = 72.8777; // Corrected longitude
  const initialZoom = 16;
  const initialCenter = { lat: initialLat, lng: initialLng };
  const storedMapType = localStorage.getItem('groupmapType') || 'roadmap';

  const loader = new Loader({
                apiKey: await Constants.getGoogleMapAPI(),
                version: "beta", // Ensure you're using the beta version for AdvancedMarkerElement
                libraries: ['geometry', 'places'] // Include necessary libraries
              });
                      
              loader.load().then(() => {
          // Now the google object is available
          console.log('Google Maps API loaded');

                newMap = new google.maps.Map(mapContainer.value, {
                  center: initialCenter,
                  zoom: initialZoom,
                  mapTypeId: storedMapType,
                  zoomControl: true,
                  mapTypeControl: false, // Disable Map/Satellite control
                fullscreenControl: false, // Disable fullscreen control (ESC button)
                streetViewControl: false, // Disable the Pegman/Street View control


                });

        mapRef.value = newMap;
            
  }).catch((error) => {
    console.error("Error loading Google Maps API:", error);
  });
    };

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
    
  
    return {
      vehicleId: props.vehicleId,
      vehicleName: props.vehicleName,
      groupname:props.groupname,
      mapContainer,
      mapRef,
      clearMap,
      markerId1,
      markerId2,
      historyarray,
      labels,
      selectedLabel,
      showSection,
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

});
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
  height: 250px;
  background-color: #e0e0e0; /* Change this to any color or add more styles as needed */
  margin-bottom: 10px; /* Optional: Add some margin below the section */
  position: relative;

  
}

.close-icon {
  position: absolute;
  top: 5px; /* Adjust as needed */
  right: 5px; /* Adjust as needed */
  font-size: 24px; /* Adjust for desired icon size */
  z-index: 1000; /* Ensure it stays above the map */
  color: #ffffff; /* Change the color if needed */
  background: rgba(0, 0, 0, 0.5); /* Optional: Add a background for better visibility */
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
