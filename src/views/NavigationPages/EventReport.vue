<!-- This Page is menu Event Report Page. -->

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <!-- You can add your toolbar content here -->
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button class="button_other" fill="clear" @click="navigationPage('1')"> 
               {{ selectEventLabel }}
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button class="button_other" fill="clear" @click="navigationPage('2')">
              {{ selectDateLabel }}
            </ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button class="button_other" fill="clear" @click="navigationPage('3')">
              {{ selectGroupLabel }}
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button class="button_other" fill="clear" @click="navigationPage('4')">
              {{ selectVehicleLabel }}
            </ion-button>
          </ion-col>
          <ion-col size="3">
            <ion-button class="button_submit" @click="handleSubmit">Submit</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

         <!-- IonAlert component -->
         <ion-alert
          :is-open="showAlert"
          :message="alertMessage"
          :buttons="alertButtons"
          @didDismiss="showAlert = false"
        ></ion-alert>


      <div v-for="(group, groupIndex) in items" :key="groupIndex" class="group">
        <div class="group-header">{{ group.group }}</div>
        <div v-for="(date, dateIndex) in group.dates" :key="dateIndex" class="date">
          <div class="date-header">
            <span class="date-display">{{ date.date }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(vehicle, detailIndex) in date.details" :key="detailIndex" class="detail-row">
                <ion-grid>
                  <ion-row class="circle-and-rows">
                    <ion-col size="auto">
                      <div class="circle" :style="{ backgroundColor: vehicle.circle_color }">
                        <span class="circle-text">{{vehicle.label}}</span>
                      </div>
                    </ion-col>
                    <ion-col>
                      <div class="text-rows">
                        <div class="text-row">
                          <span class="text-item1">{{vehicle.vehno}}</span>
                          <span class="text-item">({{vehicle.driver}})</span>
                        </div>
                        <div class="text-row">
                          <span class="text-item1">{{ vehicle.eventstring }}</span>
                          <span class="text-item" style="color: red;">{{vehicle.lastStatusUpdate}}</span>
                        </div>
                        <ion-row class="text-row">
                          <ion-col class="text-item2"> {{vehicle.datestring }} </ion-col>
                          <ion-col size="4" class="text-item3"> {{vehicle.duration }}</ion-col>

                        </ion-row>
                        <div class="location">
                          
                          <img src="/ic_gps.png" alt="location icon" class="icon-img" />
                          <span class="text-item"style="color: black;">{{ vehicle.location }}</span>

                        </div>
                        <div v-if="vehicle.eotherdet" class="text-row" style="margin-top: 5px;">
                          <span class="text-item2">{{vehicle.eotherdet }}</span>
                          </div>
                      </div>
                    </ion-col>
                  </ion-row>
                </ion-grid>
                <ion-item-divider v-if="detailIndex < date.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonItemDivider,
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonIcon,
  IonAlert,
  IonRow,
  IonCol,
  IonGrid,
  loadingController,
  useBackButton,
} from '@ionic/vue';

import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { onMounted, onUnmounted, ref } from 'vue';
import router from '@/router/index'; // Assuming your router file is named router.js
import storage from '@/services/storagefile';
import Constants from '@/common/constants';
import { fetchData } from '@/services/ApiService';
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function
import {  selectedPage } from '@/services/userstate'; // Import the global state

addIcons({ close });

export default {
  name: 'EventReport',
  components: {
    IonButton,
    IonItemDivider,
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    IonAlert,
    IonRow,
    IonCol,
    IonGrid,
    loadingController,
  },

  setup() {
    // Alert data
    const showAlert = ref(false);
    const alertMessage = ref('');

    // Date and other variables
    let savedToDate = ref('');
    let savedFromDate = ref('');
    let FromDateAPI = ref('');
    let ToDateAPI = ref('');
    let selectDateLabel = ref('Select Date');
    let selectEventLabel = ref('Select Event');
    let selectGroupLabel = ref('Select Group');
    let selectVehicleLabel = ref('Select Vehicle');

    // Record limits and ids
    let recLimit = ref(150);
    let lastRecNo = ref(0);
    let startRecordId = ref(0);
    let endRecordId = ref(0);

    // Selected IDs
    const selectedEventIds = ref([]);
    const selectedGroupIds = ref([]);
    const selectedVehicleId = ref('');

    // Items list
    const items = ref([]);

    // Alert buttons
    const alertButtons = [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          console.log('Alert dismissed');
        },
      },
    ];

    // API call logic
    const CallAPIForData = () => {
  let loading;

  loadingController.create({
    message: 'Loading...',
    backdropDismiss: true // Makes the loading controller cancelable

  }).then((createdLoading) => {
    loading = createdLoading;
    return loading.present();
  }).then(() => {
    const params = {
      evnt_arr: selectedEventIds.value === 'all' 
    ? 'all' 
    : Array.isArray(selectedEventIds.value) 
      ? selectedEventIds.value 
      : [selectedEventIds.value],
  
      grp_arr: selectedGroupIds.value === 'all' 
        ? 'all' 
        : Array.isArray(selectedGroupIds.value) 
          ? selectedGroupIds.value 
          : [selectedGroupIds.value],
          
      veh_id: selectedVehicleId.value,
      rec_lmt: recLimit.value,
      last_rec_no: lastRecNo.value,
      fdate: FromDateAPI.value,
      tdate: ToDateAPI.value,
      st_rec_id: startRecordId.value,
      ed_rec_id: endRecordId.value,
    };

    return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Event_Report, params);
  }).then((response) => {
    const responsejson = response.data;

    if (response.status === 200) {
      const arrData = responsejson.arr_data;
      if (arrData && Object.keys(arrData).length > 0) {
        const items1 = [];
        startRecordId.value = arrData.st_rec_id;
        endRecordId.value = arrData.ed_rec_id;
        lastRecNo.value = lastRecNo.value + recLimit.value;

        for (const [groupName, dates] of Object.entries(arrData.grp_arr)) {
          const group = {
            group: groupName,
            dates: [],
          };

          for (const [date, details] of Object.entries(dates)) {
            const dateObj = {
              date: date,
              details: details.map((detail) => ({
                id: detail.eoccr_id,
                vehno: detail.vehno,
                eventstring: detail.e_name,
                label: detail.e_sname,
                circle_color:detail.e_sname_clr,
                driver: detail.drv_name || '(Driver not available)',
                datestring: `${detail.sdt}${detail.edt ? ` to ${detail.edt}` : ''}`,
                duration: detail.dur,
                lastStatusUpdate: detail.ests_str,
                location: detail.loc,
                eotherdet: detail.eotherdet,
              })),
            };

            group.dates.push(dateObj);
          }

          items1.push(group);
        }

        items.value = items1;
        console.log('Data:', items.value);
        storage.set('eventReport',items1);
      }
    } else if (response.status === 401) {
      this.toastMessage = responsejson.message;
    } else {
      console.error('Empty response data');
    }
  }).catch((error) => {
    console.error('Error:', error);
  }).finally(() => {
    loading.dismiss();
  });
};

    // Storage check and label setup
    const checkStorageAndSetLabels = async () => {
      const storedEventItems = await storage.get('eventItems');
      const storedGroups = await storage.get(Constants.storageValue.key_GroupWithStatus);
      const savedFromDate = localStorage.getItem('savedEventReportFromDate');
      const savedToDate = localStorage.getItem('savedEventReportToDate');
      const selectedVehicle = localStorage.getItem('selectedVehicle');

      // Set event label
      if (storedEventItems && storedEventItems.length > 0) {
        const selectedEvents = storedEventItems.filter((item) => item.checked);
        selectedEventIds.value = selectedEvents.map((item) => item.eventid);
        selectEventLabel.value =
          selectedEvents.length === storedEventItems.length
            ? 'All Events'
            : `${selectedEvents[0].eventname} +${selectedEvents.length - 1}`;
      }else{
        console.log("event api");
        selectedEventIds.value ='all';
        selectEventLabel.value='All Events';
      
      }

      // Set group label
      if (storedGroups && storedGroups.length > 0) {
        const selectedGroups = storedGroups.filter((group) => group.checked);
        selectedGroupIds.value = selectedGroups.map((group) => group.groupId);
        selectGroupLabel.value =
          selectedGroups.length === storedGroups.length
            ? 'All Groups'
            : `${selectedGroups[0].group} +${selectedGroups.length - 1}`;
      }

      // Set vehicle label
      if (selectedVehicle) {
        const vehicle = JSON.parse(selectedVehicle);
        selectedVehicleId.value = vehicle.vehicleId;
        selectVehicleLabel.value = vehicle.vehicleName;

        console.log("selectedVehicle");

      }else{
        selectVehicleLabel.value='All Vehicles';
        selectedVehicleId.value='all';
        console.log("selectedVehicle else");

      }

      
      // Set date labels
      if (savedFromDate && savedToDate) {
        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }).format(date);
        };

        const get_Date_API = (dateStr) => {
          const date = new Date(dateStr);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        };

        FromDateAPI.value = get_Date_API(savedFromDate);
        ToDateAPI.value = get_Date_API(savedToDate);

        selectDateLabel.value = `${formatDate(savedFromDate)} to ${formatDate(savedToDate)}`;
      }else{
        
        // Use the current date if savedFromDate and savedToDate are not available
          const now = new Date();
          const formatDate = (dateStr) => {
            return new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            }).format(dateStr);
          };

          const get_Date_API = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          };

          FromDateAPI.value = get_Date_API(now);
          ToDateAPI.value = get_Date_API(now);

          selectDateLabel.value = `${formatDate(now)} to ${formatDate(now)}`;

      }
    };

    // Navigation logic
    const navigationPage = (pageName) => {
      if (pageName === '1') router.push('/selectevent');
      else if (pageName === '2') router.push('/selectperiod');
      else if (pageName === '3') router.push('/selectgroup');
      else if (pageName === '4') router.push('/selectvehicle');
    };

    // Handle submit logic
    const handleSubmit = async () => {
      if (selectedEventIds.value.length === 0) {
        alertMessage.value = 'Please select at least one event';
        showAlert.value = true;
        return;
      }
      if (selectedGroupIds.value.length === 0) {
        alertMessage.value = 'Please select at least one group';
        showAlert.value = true;
        return;
      }
      if (!selectedVehicleId.value) {
        alertMessage.value = 'Please select a vehicle';
        showAlert.value = true;
        return;
      }
      if (!FromDateAPI.value || !ToDateAPI.value) {
        alertMessage.value = 'Please select a period';
        showAlert.value = true;
        return;
      }

       await storage.remove('eventReport');
       items.value=[];

      const status = await Network.getStatus();
      if (status.connected) {
        CallAPIForData();
      } else {
        showToast();
      }
    };

    onMounted(async () => {
      useBackButton(9999, async () => {
        const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');
            });
            
      checkStorageAndSetLabels();
      const eventData= await storage.get('eventReport');
      if(eventData)
       {
         items.value=eventData;
       }

    });

   

    return {
      navigationPage,
      handleSubmit,
      showAlert,
      alertMessage,
      alertButtons,
      savedFromDate,
      savedToDate,
      selectDateLabel,
      selectEventLabel,
      selectGroupLabel,
      selectVehicleLabel,
      FromDateAPI,
      ToDateAPI,
      items,
    };
  },
};
</script>

<style scoped>
ion-grid{
      -webkit-padding-start: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    padding-inline-start: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px)); 
    -webkit-padding-end: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    padding-inline-end: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    padding-top: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
     padding-bottom: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));

}
.button_other{
font-size: 11px;
text-align: left;
text-transform: none;
color: #078DFC;
}

.button_submit {
  font-size: 11px;
  text-transform: none;
  padding: 0px;
  width: 70px;
  color: white;
  --background: #078DFC; /* Change the background color to blue */
  --border-radius: 0px; /* Set custom border radius */
  --height: 30px; /* Set custom height */
  height: 30px; /* Ensure height is applied as fallback */
  min-height: unset; /* Remove default min-height */
}
.custom-divider {
margin: 0; /* Remove margin */
padding: 0; /* Remove padding */
height: 0px; /* Control the height of the divider */
min-height: 5px;
}

.group {
margin-bottom: 20px;
}


.group-header {
background-color: #e0e0e0;
padding: 10px;
font-weight: bold;
color: #272626;
font-size: 14px;
}


.date {
margin-bottom: 2px;
}

.date-header {
display: flex;

align-items: center;
background-color: hwb(0 95% 4%);
padding: 10px 5px 10px 10px;
border: 1px solid red;
}
.date-display{
font-size: 14px;
color: red;
font-weight: bold;
}

.item-details {
padding: 0px 5px;
border: 1px solid #ccc;
background-color: #ffffff;
align-items: center;
}

.item-details ul {
list-style-type: none;
padding: 0px;
margin: 0px;
}


.location {
  display: flex;
  align-items: center;
  margin: 1px 0; /* Add some spacing between the rows */
  align-items: center;
  
}

.location .icon-img {
  margin-right: 10px;
  height: 30px;
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

.circle {
width: 40px;
height: 40px;
background-color: red; /* Green background color */
border-radius: 50%;
display: flex;
justify-content: center;
align-items: center;
}

.circle-text {
color: white;
font-size: 12px;
text-align: center;
font-weight: bold;
}

.circle-and-rows {
display: flex;
align-items: center; /* Center the rows vertically with the circle */
margin: 0px;
}

.icon-img {
  margin-right: 10px;
  height: 30px;
  align-items: center;

}

.text-rows {
display: flex;
flex-direction: column;
justify-content: space-around; /* Space the rows evenly */
}

.text-row {
margin: 1px 0; /* Add some spacing between the rows */
align-items: center;
}
.text-item
{
font-size: 13px;
margin-right: 5px;
align-self: top;
color: #626161;

}
.text-item1
{
font-size: 15px;
font-weight: bold;
margin-right: 5px;
color: #000;

}

.text-item3
{
font-size: 14px;
font-weight: bold;
margin-right: 5px;
color: #000;

}

.text-item2
{
font-size: 14px;
margin-right: 5px;
align-self: top;
color: #626161;

}
</style>