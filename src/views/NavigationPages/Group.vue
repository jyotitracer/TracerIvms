<!-- This Page is menu Group Page. -->

<template>
<ion-content fullscreen class="safe-bottom">
    <ion-searchbar placeholder="Search Group" v-model="searchQuery"></ion-searchbar>
    <ion-list v-if="filteredItems.length > 0">
      <custom-item
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @click="handleItemClick(item)"
      />
    </ion-list>

     <!-- When no data found -->
    <div v-else class="no-data">
      No data available
    </div>
  </ion-content>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonList,
  IonSearchbar,
  loadingController,
  useBackButton,
} from '@ionic/vue';
import CustomItem from '@/components/GroupCustomItem.vue';
import router from '@/router/index'; // Assuming your router file is named router.js
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Constants from '@/common/constants';
import { fetchData } from '@/services/ApiService';
import storage from '@/services/storagefile';
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function
import{stopInterval} from '@/services/GrouprefreshService';
import {  selectedPage } from '@/services/userstate'; // Import the global state

const items = ref([]);
let isFirstTimeDataCall = true;



async function DisplayStoredData() {
  const storedValues = await storage.get(Constants.storageValue.Key_GroupAPI_v1);
  if (storedValues) {
   // console.log("displaydata");
    items.value = storedValues;
    isFirstTimeDataCall=false;
  }
}

const CallAPIForGroupV1Data = () => {
  const params = {
    grping: '2',
  };

  // Show loading controller
  loadingController.create({
    message: 'Loading ...',
    backdropDismiss: true // Makes the loading controller cancelable

  })
  .then(loading => {
    // Present the loading spinner
           if(isFirstTimeDataCall){
         loading.present();
  
    }

    // Make the API call using the fetchData service
    return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Group_v1, params)
      .then((response) => {
        const responsejson = response.data;

        // Check if the status is OK (200)
        if (response.status === 200) {
          const arrData = responsejson.arr_data;

          if (arrData && arrData.length > 0) {
            items.value = arrData.map((data, index) => ({
              id: index + 1, // Unique ID
              group: data.name, // Group name
              group_id :data.id,
              total_count: data.total_count, // Total vehicles
              
              sts_arr: data.sts_arr,
            }));


            if(arrData.length > 1){
              // Calculate the totals for the last item
          const totalCountSum = arrData.reduce((sum, data) => sum + data.total_count, 0);
  
          
             // Calculate the aggregated sts_arr
             const aggregatedStsArr = arrData.reduce((agg, group) => {
            group.sts_arr.forEach((sts) => {
              const existingSts = agg.find((item) => item.sts_id === sts.sts_id);
              if (existingSts) {
                existingSts.sts_cnt += sts.sts_cnt;
              } else {
                agg.push({ ...sts }); // Add new status
              }
            });
            return agg;
          }, []);

          // Add the last item with the calculated totals
          items.value.push({
            id: items.value.length + 1, // Unique ID for the total
            group: "All Group",
            group_id:"all",
            total_count: totalCountSum,
            sts_arr: aggregatedStsArr,
          });
        }

            const newItems = items.value;
     storage.set(Constants.storageValue.Key_GroupAPI_v1, newItems)

  }
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
         if(loading.present){
loading.dismiss(); 

   }
      });
  })
  .catch(error => {
    console.error('Error creating loading:', error);
  });
};



export const intervalRunning = ref(false);

export const intervalCallback30s = async () => {
  const currentRoute = router.currentRoute.value;

  console.log('Interval callback triggered For Group! '+currentRoute.name);

  const isLoggedIn = await storage.get('IsLoginAlready');
      if (isLoggedIn) {

        if (currentRoute.name === 'group') {
          console.log('Group page is visible');
          const status = await Network.getStatus();
          if (status.connected) {
            DisplayStoredData();
            console.log("displaydata1");
            CallAPIForGroupV1Data();
          } else {
            showToast();
            DisplayStoredData();
          }
          return 'Group';
        } 
      }else{
        stopInterval();

        
      }
};

export default {
  name: 'Home',
  components: {
    IonPage,
    IonContent,
    IonList,
    IonSearchbar,
    CustomItem,
  },

  setup() {
     const searchQuery = ref('');
    const filteredItems = computed(() =>
      items.value
      .sort((a, b) => {
      // Check if either is "All Group"
      if (a.group === "All Group" && b.group !== "All Group") return 1;  // push a to bottom
      if (b.group === "All Group" && a.group !== "All Group") return -1; // push b to bottom

      // Normal alphabetical sort
      if (a.group < b.group) return -1;
      if (a.group > b.group) return 1;
      return 0;
    })
    .filter((item) =>
        item.group.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const checkNetwork = async () => {
      const status = await Network.getStatus();
      if (status.connected) {
        DisplayStoredData();
        CallAPIForGroupV1Data();
      } else {
        showToast();
        DisplayStoredData();
        console.error('No internet connection');
      }
    };

    onMounted(() => {
      useBackButton(9999, async () => {
        const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');
            });
      checkNetwork();
    });

    onUnmounted(() => {
       stopInterval();
    });

    return {
      searchQuery,
      filteredItems,
    };
  },

  methods: {
    handleItemClick(item) {
      this.navigateToPage(item);
    },
    navigateToPage(ItemData) {
      const itemDataString = JSON.stringify(ItemData);
    //  router.push({ name: 'DetailVehicle', params: { group: itemDataString } });
      router.push({ name: 'DetailVehicle', query: { group: itemDataString } });
    },
  },
};
</script>

<style scoped>
.no-data {
  text-align: center;
  color: var(--ion-color-medium);
  margin-top: 20px;
  font-size: 16px;
}
</style>
