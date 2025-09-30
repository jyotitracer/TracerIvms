<template>
  <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="goBack"></ion-back-button>
          </ion-buttons>
          <ion-title>Fuel Chart</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   
    <ion-content>

      <div v-if="chartData.length > 0" class="chart-container">
        <LineChart 
          :labels="chartLabels" 
          :data="chartData" 
          :min-fuel="jsonObjectminfuel" 
          :max-fuel="jsonObjectmaxfuel" 
          :fuel-unit="jsonObjectfuelunit" 
          :FromDate="FromDate"
        />
      </div>
      <p v-else>Data not available</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import useNetwork from '@/services/networkService'; // Import the network service
import { ScreenOrientation } from '@capacitor/screen-orientation';

import { IonButtons, IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, loadingController } from '@ionic/vue';
import { defineComponent, ref,onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LineChart from '@/components/LineChart.vue';
import { fetchData } from "@/services/ApiService";
import Constants from "@/common/constants";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    LineChart,
    loadingController,
  },

  setup() {
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const route = useRoute();

    const FromDate = route.params.fromdate;
    const ToDate = route.params.todate;
    const Vehicleid = route.params.vehid;

    const chartLabels = ref<string[]>([]);
    const chartData = ref<number[]>([]);
    const jsonObjectminfuel = ref<string>('');
    const jsonObjectmaxfuel = ref<string>('');
    const jsonObjectfuelunit = ref<string>('');


    
      const CallAPIForData = () => {
  loadingController.create({
    message: "Loading...",
    backdropDismiss: true // Makes the loading controller cancelable

  }).then(loading => {
    loading.present();

    const params = {
      allPath: "1",
      veh_id: Vehicleid,
      fdate: FromDate,
      tdate: ToDate,
    };

    fetchData(
      Constants.CONT.Mobile_Contro,
      Constants.CMD.Req_Fuel_graph,
      params
    ).then(response => {
      const responsejson = response.data;

      if (response.status === 200) {
        const arrData = responsejson.arr_data;

        if (arrData && arrData.length > 0) {
          const listXvalues = arrData.map((item: any) => item.ep_time);
          chartData.value = arrData.map((item: any) => parseFloat(item.fuel));
          jsonObjectminfuel.value = responsejson.min_fuel;
          jsonObjectmaxfuel.value = responsejson.max_fuel;
          jsonObjectfuelunit.value = responsejson.fuel_unit;

          listXvalues.forEach((epochTime: string) => {
            const date = new Date(parseInt(epochTime) * 1000);
            const formatter = new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            const dateForm = formatter.format(date);
            console.log("dateForm",dateForm);
            chartLabels.value.push(dateForm);
          });
        } else {
          console.error("Empty response data");
        }
      } else if (response.status === 401) {
        console.error("Unauthorized access:", responsejson.message);
      }
    }).catch(error => {
      console.error("Error:", error);
    }).finally(() => {
      loading.dismiss();
    });
  }).catch(error => {
    console.error("Error creating loading:", error);
  });
};


    onMounted(async ()=>{

    //   ScreenOrientation.lock({ orientation: 'landscape' })
    // .then(() => {
    //   console.log('Screen orientation set to landscape');
    // })
    // .catch(err => {
    //   console.error('Error setting screen orientation:', err);
    // });

      initNetworkListener();


      const status = await Network.getStatus();
      
        if (status.connected) {
           CallAPIForData();
           }else{
            showToast();
          }
   });
    return {
      chartLabels,
      chartData,
      jsonObjectminfuel,
      jsonObjectmaxfuel,
      jsonObjectfuelunit,
      isConnected, showReconnectedMessage, initNetworkListener,FromDate

    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },
  },
});
</script>

<style scoped>

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

.chart-container {
  padding: 20px;
}
</style>
