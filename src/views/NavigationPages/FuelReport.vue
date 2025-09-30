<!-- This Page is menu Fuel Report Page. -->

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
            <ion-item>
              <ion-select v-model="selectedOption" interface="popover" class="selection_dropdown">
              <ion-select-option value="point1">Efficiency Report</ion-select-option>
              <ion-select-option value="point2">Fill Drop Report</ion-select-option>
            </ion-select>
            </ion-item>
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
      <!-- Conditionally render rows based on the selected option -->
      <ion-grid v-if="showEfficiencyReport">
  <!-- Efficiency Report -->
          <div v-for="(group, groupIndex) in items" :key="groupIndex" class="group">
            <div class="group-header">{{ group.group }}</div>
            <div class="item-details">
              <ul>
                <li v-for="(vehicle, detailIndex) in group.details" :key="detailIndex" class="detail-row">
                  <ion-grid>
                    <ion-row>
                      <ion-col>
                        <div class="text-rows">
                          <div class="text-row">
                            <span class="text-item1">{{ vehicle.vehNo }}</span>
                            <span class="text-item">({{ vehicle.drvName }})</span>
                          </div>
                          <ion-row class="icon-row-container">
                            <ion-col size="4" class="icon">
                              <img src="/ic_fuel_distance.png" alt="Distance icon" class="icon-img" />
                              <div class="icon-text-container">
                                <span class="image_text">{{ vehicle.distance }}</span>
                                <span class="image_text unit">{{ group.dist_unit }}</span>
                              </div>
                            </ion-col>
                            <ion-col size="4" class="icon">
                              <img src="/ic_fuel_fuel.png" alt="Fuel icon" class="icon-img" />
                              <div class="icon-text-container">
                                <span class="image_text">{{ vehicle.fuelLevel }}</span>
                                <span class="image_text unit">{{ group.fuel_unit }}</span>
                              </div>
                            </ion-col>
                            <ion-col size="4" class="icon">
                              <img src="/ic_mileage.png" alt="Efficiency icon" class="icon-img" />
                              <div class="icon-text-container">
                                <span class="image_text">{{ vehicle.efficiency }}</span>
                                <span class="image_text unit">{{ group.effi_unit }}</span>
                              </div>
                            </ion-col>
                          </ion-row>
                        </div>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                  <ion-item-divider v-if="detailIndex < group.details.length - 1" class="custom-divider"></ion-item-divider>
                </li>
              </ul>
            </div>
          </div>
        </ion-grid>
      <ion-grid v-if="showFillDropReport">
            <!-- Fill Drop Report -->
            <div v-for="(group, groupIndex) in items" :key="groupIndex" class="group">
              <div class="group-header">{{ group.group }}</div>
              <div class="item-details">
                <ul>
                  <li v-for="(vehicle, detailIndex) in group.details" :key="detailIndex" class="detail-row">
                    <ion-grid>
                      <ion-row>
                        <ion-col>
                          <div class="text-rows">
                            <div class="text-row">
                              <span class="text-item1">{{ vehicle.vehNo }}</span>
                            <span class="text-item">({{ vehicle.drvName }})</span>
                            </div>
                            <div>
                              <ion-row class="icon-row-container">
                                
                      <ion-col class="icon" v-if="vehicle.fuelLevel !== 0">
                          <img src="/ic_fuel_fill.png" alt="Fuel fill icon" class="icon-img" />
                          <div class="icon-text-container">
                            <span class="image_text">{{ vehicle.fuelLevel }}</span>
                            <span class="image_text unit">{{ group.fuel_unit }}</span>
                          </div>
                        </ion-col>
                        <ion-col class="icon" v-if="vehicle.drop !== 0">
                          <img src="/ic_fuel_drop.png" alt="Fuel Drop icon" class="icon-img" />
                          <div class="icon-text-container">
                            <span class="image_text">{{ vehicle.drop }}</span>
                            <span class="image_text unit">{{ group.fuel_unit }}</span>
                          </div>
                        </ion-col>
                        
                      </ion-row>
                            </div>
                          </div>
                        </ion-col>
                        <img src="\ic_arrow_right.png" alt="event icon" class="icon-arrow" @click="callnextPage(vehicle.vehId)" />

                      </ion-row>
                    </ion-grid>
                    <ion-item-divider v-if="detailIndex < group.details.length - 1" class="custom-divider"></ion-item-divider>
                  </li>
                </ul>
              </div>
            </div>
          
      </ion-grid>
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
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  loadingController,
  useBackButton
} from '@ionic/vue';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import router from '@/router/index';
import { onMounted, ref,watch } from 'vue';
import storage from "@/services/storagefile";
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast';
import {  selectedPage } from '@/services/userstate'; // Import the global state

addIcons({ close });

export default {
  name: 'FuelReport',
  components: {
    IonButton,
    IonItemDivider,
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonGrid,
    IonCol,
    IonRow,
    IonItem,
    loadingController
  },
  setup() {
    const selectedOption = ref('point1');
    const showEfficiencyReport = ref(false);
    const showFillDropReport = ref(false);
    const showAlert = ref(false); // Controls the visibility of the alert
    const alertMessage = ref(''); // Message to display in the alert

    let savedToDate = ref('');
    let savedFromDate = ref('');
    const items = ref([]);
    let FromDateAPI = ref('');
    let ToDateAPI = ref('');
    let selectDateLabel = ref('Select Date');
    let selectEventLabel = ref('Select Event');
    let selectGroupLabel = ref('Select Group');
    let selectVehicleLabel = ref('Select Vehicle');

    const fuelValue=ref(0);
    const droppingValue=ref(0)

    const selectedEventIds = ref([]);
    const selectedGroupIds = ref([]);
    const selectedVehicleId = ref('');

    const alertButtons = [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          console.log('Alert dismissed');
        }
      }
    ];


    const saveReportStateToLocalStorage = () => {
  localStorage.setItem('showEfficiencyReport', showEfficiencyReport.value);
  localStorage.setItem('showFillDropReport', showFillDropReport.value);
 // localStorage.setItem('items', JSON.stringify(items.value));
};

    const CallAPIForData = () => {
      console.log("callfunction");


  let loading;
  let params = ref('');
  let response = ref('');

  loadingController.create({
    message: "Loading...",
    backdropDismiss: true // Makes the loading controller cancelable

  }).then((createdLoading) => {
    loading = createdLoading;
    return loading.present();
  }).then(() => {
    return storage.get(Constants.storageValue.key_Fuel_GroupWithStatus);
  }).then((storedGroups) => {
    const selectedGroups = storedGroups.filter(group => group.checked);
    const groupIds = selectedGroups.length === storedGroups.length ? 'all' : (Array.isArray(selectedGroupIds.value) ? selectedGroupIds.value : [selectedGroupIds.value]);
    if (selectedOption.value === 'point1') {
      params = {
        grp_arr: selectedGroupIds.value === 'all' 
        ? 'all' 
        : groupIds,    
          
          veh_arr: selectedVehicleId.value,
        fdate: FromDateAPI,
        tdate: ToDateAPI
      };
      console.log("paramdisplay1", params);

      return fetchData(
        Constants.CONT.Mobile_Contro,
        Constants.CMD.Req_Fuel_Efficiency_Report,
        params
      );
    } else if (selectedOption.value === 'point2') {
      params = {
        grp_arr:  selectedGroupIds.value === 'all' 
        ? 'all' 
        : Array.isArray(selectedGroupIds.value) ? selectedGroupIds.value : [selectedGroupIds.value],
        veh_arr: selectedVehicleId.value,
        fdate: FromDateAPI,
        tdate: ToDateAPI,
        isGrping:"1"
      };
      console.log("paramdisplay2", params);

      return fetchData(
        Constants.CONT.Mobile_Contro,
        Constants.CMD.Req_Fill_Drop_Report,
        params
      );
    }
  }).then(async (responseFromFetch) => {
    response = responseFromFetch;
    const responsejson = response.data;

    if (response.status === 200) {
      items.value = [];

      const items1 = [];

      const keys = Object.keys(responsejson.arr_data);

      if (selectedOption.value === 'point1') {
        showEfficiencyReport.value = true;
        showFillDropReport.value = false;

        keys.forEach(key => {
          const groupData = responsejson.arr_data[key];
          const groupItem = {
            group: key,
            dist_unit: responsejson.dist_unit,
            fuel_unit: responsejson.fuel_unit,
            effi_unit: responsejson.effi_unit,
            details: groupData.map(vehicle => ({
              srNo: vehicle.sr_no,
              vehNo: vehicle.veh_no,
              vehID: vehicle.veh_ID,
              drvName: vehicle.drv_name !== '' ? vehicle.drv_name : '(Driver not available)',
              vehId: vehicle.veh_id,
              vehType: vehicle.veh_type,
              fuelLevel: parseFloat(vehicle.fl),
              drop: parseFloat(vehicle.drp),
              consumption: vehicle.consm,
              distance: vehicle.dist,
              efficiency: vehicle.effi
            }))
          };
          items1.push(groupItem);
        });

      } else if (selectedOption.value === 'point2') {
        showEfficiencyReport.value = false;
        showFillDropReport.value = true;

        keys.forEach(key => {
          const groupData = responsejson.arr_data[key];
          const groupItem = {
            group: key,
            fuel_unit: responsejson.fuel_unit,
            details: groupData.map(vehicle => ({
              srNo: vehicle.sr_no,
              vehNo: vehicle.veh_no,
              vehID: vehicle.veh_ID,
              drvName: vehicle.drv_name !== '' ? vehicle.drv_name : 'Driver not available',
              vehId: vehicle.veh_id,
              vehType: vehicle.veh_type,
              fuelLevel: parseFloat(vehicle.fl),
              drop: parseFloat(vehicle.drp)
            }))
          };
          items1.push(groupItem);
        });


      }

        items.value=items1;
      await storage.set('fuelReport',items1);
      console.log("saved fuel report");
      saveReportStateToLocalStorage();

    } 
  }).catch((error) => {
    console.error("Error:", error);
  }).finally(() => {
    if (loading) {
      loading.dismiss();
    }
  });
};

    const checkStorageAndSetLabels = async () => {
      const storedGroups = await storage.get(Constants.storageValue.key_Fuel_GroupWithStatus);
      const savedFromDate = localStorage.getItem('savedFuelReportFromDate');
      const savedToDate = localStorage.getItem('savedFuelReportToDate');
      const selectedVehicle = localStorage.getItem('selectedFuelVehicle');

      if (storedGroups && storedGroups.length > 0) {
        const selectedGroups = storedGroups.filter(group => group.checked);
        selectedGroupIds.value = selectedGroups.map(group => group.groupId);
        selectGroupLabel.value = selectedGroups.length === storedGroups.length ? 'All Groups' : `${selectedGroups[0].group} +${selectedGroups.length - 1}`;
      }

      if (selectedVehicle) {
        const vehicle = JSON.parse(selectedVehicle);
        selectedVehicleId.value = vehicle.vehicleId;
        selectVehicleLabel.value = vehicle.vehicleName;
      }else{
        selectVehicleLabel.value='All Vehicles';
        selectedVehicleId.value='all';

      }

      if (savedFromDate && savedToDate) {
        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
        };

        const get_Date_API = (dateStr) => {
          const date = new Date(dateStr);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        };

        const formattedFromDate = formatDate(savedFromDate);
        const formattedToDate = formatDate(savedToDate);

        FromDateAPI = get_Date_API(savedFromDate);
        ToDateAPI = get_Date_API(savedToDate);

        selectDateLabel.value = `${formattedFromDate} to ${formattedToDate}`;
      }
      else{
        
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

          FromDateAPI = get_Date_API(now);
          ToDateAPI = get_Date_API(now);

          selectDateLabel.value = `${formatDate(now)} to ${formatDate(now)}`;

      }
    };
    const loadReportStateFromLocalStorage = async () => {
  const storedShowEfficiencyReport = localStorage.getItem('showEfficiencyReport');
  const storedShowFillDropReport = localStorage.getItem('showFillDropReport');
  const fuelData= await storage.get('fuelReport');
  const savedOption = localStorage.getItem('selectedFuelReportOption');

  if(savedOption=="point1")
  {
    if (storedShowEfficiencyReport) {
      showEfficiencyReport.value = JSON.parse(storedShowEfficiencyReport);
    }
  } else if(savedOption=="point2")
  {
    if (storedShowFillDropReport) {
      showFillDropReport.value = JSON.parse(storedShowFillDropReport);
    }
  }

  if (fuelData) {
     items.value = fuelData;
    console.log("fuelData",items.value);

  }
};

    const navigationPage = (pageName) => {
      saveReportStateToLocalStorage();

      if (pageName === '2') {
        router.push('/fuelselectperiod');
      } else if (pageName === '3') {
        router.push('/selectgroupfuel');
      } else if (pageName === '4') {
        router.push('/selectvehiclefuel');
      }
    };

   
            const handleSubmit = async () => {
              showEfficiencyReport.value = false;
        showFillDropReport.value = false;


        if (selectedGroupIds.value.length === 0) {

          alertMessage.value = 'Please select at least one group';
          showAlert.value = true;
          console.log(alertMessage.value);
          return;
        }else
        if (!selectedVehicleId.value) {

        
          alertMessage.value = 'Please select a vehicle';
          showAlert.value = true;
          console.log(alertMessage.value);

          return;
        }else
        if (!FromDateAPI || !ToDateAPI) {

          alertMessage.value = 'Please select a period';
          showAlert.value = true;
          console.log(alertMessage.value);

          return;
        }else if (!['point1', 'point2'].includes(selectedOption.value)) {

          alertMessage.value = 'Please select Report Type';
          showAlert.value = true;
          console.log(alertMessage.value);

          return;

        }else
        {
          await storage.remove('fuelReport');
        items.value=[];

        const status = await Network.getStatus();
        console.log("alertMessage.value");

                              if (status.connected) {
                                        CallAPIForData();
                              }else{
                                showToast();
                              }
        }

        };

    const callnextPage = (veh_id) => {
      router.push({
        name: "fuelFillingDropping",
        params: {
          fromdate: FromDateAPI,
          todate: ToDateAPI,
          vehid: veh_id
        }
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
      
      const savedOption = localStorage.getItem('selectedFuelReportOption');
      if (savedOption) {
        selectedOption.value = savedOption;
      }
     
  checkStorageAndSetLabels();
  loadReportStateFromLocalStorage();


});

watch(selectedOption, (newValue) => {
  localStorage.setItem('selectedFuelReportOption', newValue);
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
      callnextPage,
      selectedOption,
      showEfficiencyReport,
      showFillDropReport,
      items,
      fuelValue,droppingValue
    };
  }
};
</script>

<style scoped>
/* Your custom styles */
.selection_dropdown {
  font-size: 11px;
  color: #078DFC;
  width: 100%;
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
  margin: 0;
  padding: 0;
  height: 0px;
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

.detail-row {
  justify-content: space-between;
  align-items: center;
  align-content: center;
}

.text-rows {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.text-row {
  margin: 1px 0;
}

.text-item {
  font-size: 12px;
  margin-right: 5px;
}

.text-item1 {
  font-size: 14px;
  font-weight: bold;
  margin-right: 5px;
  padding: 0 5px 0 0;
}

.icon-img {
  height: 30px;
  width: 30px;
  align-content: center;
  align-self: center;
}

.icon-row-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start; /* Aligns content to the start (left) */
  margin-top: 5px;
  padding: 0px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Aligns icon content to the start (left) */
}


.icon-text-container {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;
  margin: 0px;
}

.image_text {
  font-size: 14px;
  margin-left: 10px;
  font-weight: bold;
  color: #5a5858
}

.unit {
  font-size: 14px;
  margin-left: 2px; /* Adjust spacing as needed */
  color: #5a5858

}



.icon-arrow {
  height: 30px;
  width: 30px;
  align-content: center;
  align-self: center;
  justify-content: center;
  justify-items: center;
}
</style>
