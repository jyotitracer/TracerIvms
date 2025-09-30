
<template>
  <ion-page>
    <ion-header>
        <ion-toolbar>
        <ion-buttons slot="start">
        <ion-back-button default-href="#" @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Fuel Filling and Dropping</ion-title>

        </ion-toolbar>
    </ion-header>

    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   



    
    <ion-content :fullscreen="true">
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

      
      <!-- Display the selected content based on the label -->
      <div v-if="selectedLabel === 'Both'">
        <p v-if="FillDropItem.length === 0" style="margin-left: 10px;">Data not available</p>

        <li v-for="(detail, idx) in FillDropItem" :key="idx" @click="openSection">
        <ion-row class="row-with-icon" style="padding: 0px;">
          <ion-col size="12" class="location">
            <img :src="getFuelIcon(detail.event_type)" alt="location icon" class="icon-img" />
            <span style="margin-right: 10px;">{{ detail.sfl }} {{ fuelUnit }} to {{ detail.efl }} {{ fuelUnit }}</span>

            <div class="icon-container" @click="callnextPage(detail.sdt,detail.edt)">
              <span class="span_grid1" style="padding-right: 20px;">{{ detail.fl_drp_val }} {{ fuelUnit }}</span>

              <img src="\ic_chart_fuel.png" alt="star icon" class="star-icon" />
            </div>
            
          </ion-col>
        </ion-row >
          <ion-row style="margin-left: 20px; padding: 0px;">
            <ion-col>
              <span class="span_grid">{{ detail.sdt }} to {{ detail.edt }}</span>
              
            </ion-col>
            <ion-col size="6">
              <span class="span_grid1" >{{ detail.dur }}</span>
            </ion-col>
          </ion-row>
        <ion-row style="padding: 0px;">
          <ion-col size="12" class="location">
            <img src="\ic_gps.png" alt="location icon" class="icon-img" />
            <span>{{ detail.loc }}</span>
          </ion-col>
        </ion-row>
        <ion-item-divider v-if="idx < FillDropItem.length - 1" class="custom-divider"></ion-item-divider>
        </li>

      </div>

      <div v-else-if="selectedLabel === 'Fuel Filling'">
        <p v-if="FillItem.length === 0" style="margin-left: 10px;">Data not available</p>

        <li v-for="(detail, idx) in FillItem" :key="idx" class="detail-row" @click="openSection">
      <ion-row class="row-with-icon">
        <ion-col size="12" class="location">
          <img :src="getFuelIcon(detail.event_type)" alt="location icon" class="icon-img" />
          <span style="margin-right: 10px;">{{ detail.sfl }} {{ fuelUnit }} to {{ detail.efl }} {{ fuelUnit }}</span>

          <div class="icon-container" @click="callnextPage(detail.sdt,detail.edt)">
            <span class="span_grid1" style="padding-right: 20px;">{{ detail.fl_drp_val }}  {{ fuelUnit }}</span>

            <img src="\ic_chart_fuel.png" alt="star icon" class="star-icon" />
          </div>
          
        </ion-col>
      </ion-row>
      <ion-row style="margin-left: 20px; padding: 0px;">
            <ion-col>
              <span class="span_grid">{{ detail.sdt }} to {{ detail.edt }}</span>
              
            </ion-col>
            <ion-col size="6">
              <span class="span_grid1" >{{ detail.dur }}</span>
            </ion-col>
          </ion-row>
        <ion-row style="padding: 0px;">
          <ion-col size="12" class="location">
            <img src="\ic_gps.png" alt="location icon" class="icon-img" />
            <span>{{ detail.loc }}</span>
          </ion-col>
        </ion-row>
      <ion-item-divider v-if="idx < FillItem.length - 1" class="custom-divider"></ion-item-divider>
        </li>
      </div>

      <div v-else-if="selectedLabel === 'Fuel Dropping'">

        <p v-if="DropItem.length === 0" style="margin-left: 10px;">Data not available</p>

        <li v-for="(detail, idx) in DropItem" :key="idx" class="detail-row" @click="openSection">
      <ion-row class="row-with-icon">
        <ion-col size="12" class="location">
          <img :src="getFuelIcon(detail.event_type)" alt="location icon" class="icon-img" />
          <span style="margin-right: 10px;">{{ detail.sfl }} {{ fuelUnit }} to {{ detail.efl }}  {{ fuelUnit }}</span>

          <div class="icon-container" @click="callnextPage(detail.sdt,detail.edt)">
            <span class="span_grid1" style="padding-right: 20px;">{{ detail.fl_drp_val }} {{ fuelUnit }}</span>

            <img src="\ic_chart_fuel.png" alt="star icon" class="star-icon" />
          </div>
        </ion-col>
      </ion-row>
      <ion-row style="margin-left: 20px; padding: 0px;">
            <ion-col>
              <span class="span_grid">{{ detail.sdt }} to {{ detail.edt }}</span>
              
            </ion-col>
            <ion-col size="6">
              <span class="span_grid1" >{{ detail.dur }}</span>
            </ion-col>
          </ion-row>
        <ion-row style="padding: 0px;">
          <ion-col size="12" class="location">
            <img src="\ic_gps.png" alt="location icon" class="icon-img" />
            <span>{{ detail.loc }}</span>
          </ion-col>
        </ion-row>
      <ion-item-divider v-if="idx < DropItem.length - 1" class="custom-divider"></ion-item-divider>
        </li>
      </div>


    </ion-content>
  </ion-page>
</template>

<script>
import useNetwork from '@/services/networkService'; // Import the network service

import { IonButton,IonButtons,IonBackButton, IonItemDivider, IonPage, IonHeader, IonContent, IonToolbar, IonIcon,IonGrid,IonRow,
  IonTitle,IonCol,loadingController } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import router from '@/router/index'; // Assuming your router file is named router.js
import { useRoute } from 'vue-router';
import { fetchData } from "@/services/ApiService";
import Constants from "@/common/constants";
import {ref,computed,onMounted} from 'vue';
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function


addIcons({ close });


export default {
  name: 'fuelFillingDropping',
  components: {
    IonButton, IonItemDivider, IonPage, IonHeader, IonContent, IonToolbar,IonButtons,IonBackButton,IonGrid,IonRow,
    IonTitle,IonCol,loadingController
  },
   setup(){
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service


      const route = useRoute();
      const FromDate = route.params.fromdate;
      const ToDate = route.params.todate;
      const Vehicleid = route.params.vehid;

         const fuelUnit = ref('');
    const FillDropItem = ref([]);
    const FillItem = ref([]);
    const DropItem = ref([]);


    const CallAPIForData = () => {
  loadingController.create({
    message: 'Loading...',
    backdropDismiss: true // Makes the loading controller cancelable

  })
    .then(loading => {
      loading.present();

      const params = {
        allPath: "1",
        veh_id: Vehicleid,
        fdate: FromDate,
        tdate: ToDate,
      };

      return fetchData(
        Constants.CONT.Mobile_Contro,
        Constants.CMD.Req_Fill_Drop,
        params
      )
        .then(response => {
          const responsejson = response.data;

          if (response.status === 200) {
            // Parse the JSON data
            fuelUnit.value = responsejson.fuel_unit;
            FillDropItem.value = responsejson.arr_data;

            FillItem.value = [];
            DropItem.value = [];

            // Iterate over the arrayData and sort items into fillItem and dropItem
            FillDropItem.value.forEach(item => {
                if (item.event_type === 1) {
                  FillItem.value.push(item);
                } else {
                  DropItem.value.push(item);
                }
              });

          } else if (response.status === 401) {
            toastMessage.value = responsejson.message;
          } else {
            console.error("Empty response data");
          }
        })
        .catch(error => {
          console.error("Error:", error);
        })
        .finally(() => {
          loading.dismiss();
        });
    })
    .catch(error => {
      console.error("Error creating loading:", error);
    });
};


                 onMounted(async () => {
                  initNetworkListener();

                  const status = await Network.getStatus();
                  if (status.connected) {
                    await CallAPIForData();
                  } else {
                    showToast();
                  }
                });


                 const getFuelIcon = (event_type) => {
                    return event_type === 1 ? "/ic_fuel_fill.png" : "/ic_fuel_drop.png";
                  };

                  function formatDate(displayData) {
                  // Parse the input date string
                  const [datePart] = displayData.split(' '); // Extracts only the date part (02/11/2024)
                  const [day, month, year] = datePart.split('/'); // Splits into [02, 11, 2024]

                  // Return the formatted date with dashes
                  return `${day}-${month}-${year}`;
                };


                  const callnextPage= (fromDate,toDate) =>{   

                    let formattedFromDate = formatDate(fromDate);
                    let formattedToDate = formatDate(toDate);


                    console.log("displayData",fromDate+" "+toDate);

                    router.push({ name: "fuelChart", params:{fromdate: formattedFromDate,
                      todate: formattedToDate,vehid: Vehicleid}});

              }
      return{
        FromDate,
        ToDate,
        Vehicleid,
        fuelUnit,
        FillDropItem,
        FillItem,
        DropItem,
      getFuelIcon,
      callnextPage,
      isConnected, showReconnectedMessage, initNetworkListener

      }

 },
 computed:{
  getFuel(event_type){
      if (event_type=== 1) {
        return "/ic_fuel_fill.png";
      } else {
        return "/ic_fuel_drop.png";

      }
 },
},

  data() {
    return {
      labels: ['Both', 'Fuel Filling', 'Fuel Dropping'],
      selectedLabel: 'Both',
      showSection: false,
      closeIcon: close,
    
    };
  },
  methods: {


    selectButton(label) {
      this.selectedLabel = label;
    },

    openSection() {
      this.showSection = true;
    },
    closeSection() {
      this.showSection = false;
    },
     goBack()
            {
                   // Navigate back to the previous page
                router.back();
            },
          
      
      

  }
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
  text-transform: none;

}

ion-button {
  --border-color: red;
  --border-width: 1px;
  --border-style: solid;
  --color: red;
  --background: transparent;
  --border-radius: 0;
  margin-right: -2px;
  font-size: 12px;
  flex: 1;
  box-sizing: border-box;
  text-transform: none;

  
}

ion-button.selected {
  --background: red;
  --color: white;
  font-size: 12px;
  text-transform: none;
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
.span_grid{
  font-size: 12px;
  text-align: left;
  text-transform: none;

}
.span_grid1{
  font-size: 14px;
  text-align: left;
  text-transform: none;
  font-weight: bold;
  color: #4a4a4a;
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

.icon-img{
  height: 30px;
  width: 30px;
  margin-right: 5px;
}
.chart_img{
  height: 30px;
  width: 30px;
  align-items: center;
  margin: 5px;
}

.location {
  display: flex;
  align-items: center;
  font-size: 14px;
  
}

.total_ltrs{
  align-items: center;
  justify-items: end;
}

.row-with-icon {
  position: relative;
  
}

.icon-container {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  display: flex;
  align-items: center;


}

.star-icon {
  width: 30px; /* Adjust the size as needed */
  height: 30px;
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

li {
  list-style: none; /* Remove the default bullet */
  margin: 0;        /* Optional: Adjust margins */
  padding: 0;       /* Optional: Adjust padding */
}
</style>
