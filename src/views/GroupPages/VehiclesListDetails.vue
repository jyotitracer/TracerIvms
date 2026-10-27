<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/group"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ groupname }}</ion-title>

         <!-- 🔥 RIGHT FILTER BUTTON -->
    <ion-buttons slot="end">
      <ion-button @click="isFilterOpen = true">
        <ion-icon :icon="filterOutline" style="color: #006837; height: 24px; width: 24px;"></ion-icon>
      </ion-button>
    </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   

<ion-content fullscreen class="safe-bottom">
 <ion-modal
  :is-open="isFilterOpen"
  @didDismiss="isFilterOpen = false"
  :breakpoints="[0, 0.6]"
  :initialBreakpoint="0.6"
>
  <ion-content class="ion-padding">

    <!-- Header -->
    <div class="filter-header">
      <h4>Select Status</h4>
      <ion-icon :icon="closeOutline" @click="isFilterOpen = false" style="font-size: 24px;"></ion-icon>
    </div>

    <!-- List -->
    <div class="filter-list">
      <div 
        v-for="item in filterOptions" 
        :key="item"
        class="filter-item"
        @click="selectFilter(item)"
      >
        <span>{{ item }}</span>

        <ion-icon 
          v-if="selectedFilter === item"
          :icon="checkmarkDone"
          class="check-icon"
        ></ion-icon>
      </div>
    </div>

  </ion-content>
</ion-modal>

      <ion-searchbar 
        placeholder="Search Vehicle"
        v-model="searchQuery"
      ></ion-searchbar>

      <div v-if="filteredItems.length === 0" class="empty-container">
  <ion-icon name="car-outline" class="empty-icon"></ion-icon>
  <p class="empty-text">Vehicles not available</p>
</div>

    <ion-list v-else>

  <div
    v-for="(vehicle, index) in filteredItems"
    :key="vehicle.veh_id"
    class="custom-item"
  >

    <VehicleItem
      :vehicle="vehicle"
      :groupname="groupname"
      :isFavorite="isFavorite(vehicle)"
      v-long-press="() => openActionSheet(vehicle)"
    />

  </div>

</ion-list>

<!-- 🔥 EMPTY MESSAGE -->


      <ion-action-sheet
        v-if="showActionSheet"
        :is-open="showActionSheet"
        :buttons="actionSheetButtons"
        @did-dismiss="showActionSheet = false"
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ref, defineComponent, computed, onMounted,onUnmounted, watch } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonBackButton,
  IonButtons,
  IonItemDivider,
  IonSearchbar,
  IonActionSheet,  loadingController,IonButton,IonIcon,

  alertController
} from '@ionic/vue';
import VehicleItem from '@/components/VehicleCustomeItem.vue';
import { useRoute,useRouter } from 'vue-router';
import storage from '@/services/storagefile';
import Constants from '@/common/constants';
import { Share } from '@capacitor/share';
import useNetwork from '@/services/networkService'; // Import the network service
import { showToast,showToastMessage } from '@/services/toast'; // Custom toast utility
import { App } from '@capacitor/app';
import {  onIonViewWillLeave } from '@ionic/vue';
import { fetchData } from '@/services/ApiService';
import { useBackButton } from '@ionic/vue';
import { filterOutline, closeOutline, checkmarkOutline, checkmarkDone, checkmarkCircleSharp } from 'ionicons/icons';

export default defineComponent({
  name: 'DetailVehicle',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    VehicleItem,
    IonBackButton,
    IonButtons,
    IonItemDivider,
    IonSearchbar,
    IonActionSheet,
    alertController,IonButton,IonIcon,
  },

  
  setup() {
   
    let isFirstTimeDataCall = true;
let hasMounted = false;

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const route = useRoute(); // Access the current route
    const router = useRouter();

    const groupname=ref('');
        const groupid=ref('');
        const groupVehCount=ref(0);

    const items = ref([]);

     const isFilterOpen = ref(false)

// const filterOptions = computed(() => {
//   const statuses = items.value
//     .map(v => v.sts_str)
//     .filter(Boolean); // remove null/undefined

//   const uniqueStatuses = [...new Set(statuses)];

//   return ['All', ...uniqueStatuses];
// });

const filterOptions = computed(() => {
  return [
    'All',
    'Moving',
    'IDLE',
    'Stopped',
    'Offline',

  ];
});

const selectedFilter = ref('All') // 🔥 default

const selectFilter = (item: string) => {
  selectedFilter.value = item
  isFilterOpen.value = false
}
watch(filterOptions, (newVal) => {
  if (newVal.length > 1) {
    selectedFilter.value = newVal[0]; // first real status
  }
});

const intervalId = ref<number | null>(null);  
  const searchQuery = ref('');
    const showActionSheet = ref(false);
    const actionSheetButtons = ref([]);
    const favorites = ref([]);
    let i=1;
    let backButtonListener;

     

    // Function to add a new item to the favorites array
    const addToFavorites = async (newItem,groupname) => {
  try {
    let storedFavorites = await storage.get(Constants.storageValue.Key_Fav_data);
    if (!storedFavorites) {
      storedFavorites = []; // Initialize as an empty array if there's nothing in storage
    }

    // Check if the vehicle is already in favorites
    const isAlreadyFavorite = storedFavorites.some(fav => fav.veh_id === newItem.veh_id);

    if (isAlreadyFavorite) {
      const alert = await alertController.create({
        message: 'This vehicle is already in your favorites.',
        buttons: ['OK']
      });
      await alert.present();
    } else {

      const itemWithGroup = {
        ...newItem, // Copy all properties from newItem
        groupname: groupname // Add the groupname field
      };

      console.log(itemWithGroup);
        // Add the new item to the array
      storedFavorites.push(itemWithGroup);


      // Save the updated array back to storage
      await storage.set(Constants.storageValue.Key_Fav_data, storedFavorites);
      //await storage.set(Constants.storageValue.Key_Fav_data_group, groupname.value);


      // Reload favorites after adding
      loadFavorites(2);

      //console.log('Added to Favorites', newItem);
      const alert = await alertController.create({
        message: 'Added to Favorites',
        buttons: ['OK']
      });
      await alert.present();
    }
  } catch (error) {
    console.error('Error saving to favorites:', error);
  }
};

    // Function to retrieve the favorites array
    const loadFavorites = async (number) => {
      favorites.value = await storage.get(Constants.storageValue.Key_Fav_data) || [];
      console.log('Favorites loaded:', "number="+number+" "+favorites.value); // Debugging

    };

     // Fetch updated data from storage
    
async function DisplayStoredData() {
  
          const storedValues = await storage.get(Constants.storageValue.key_VehicleDetails_v1);
          console.log("storagefile",storedValues);
          if (storedValues && storedValues.id===groupid.value) {
            console.log("displaydata");
            items.value = storedValues.veh_arr;
                    isFirstTimeDataCall=false;

          }
        
}



  const CallAPIForVehicleDetails = () =>
   {
  const params = {
    gp_id: groupid.value,
  };

  // Show loading controller
  loadingController.create({
    message: 'Loading ...',
    backdropDismiss: true, // Makes the loading controller cancelable
  })
  .then(async (loading) => {
    // Present the loading spinner only if first time
    if (isFirstTimeDataCall) {
      await loading.present();
    }

    try {
      // Make the API call
      const response = await fetchData(Constants.CONT.Mobile_Contro, 
      Constants.CMD.req_group_vehicle, params);
      const responsejson = response.data;

      if (response.status === 200) {
        items.value = [];
        
        if(groupid.value=="all")
        {

        const allVehicles = responsejson.arr_data.flatMap(obj => obj.veh_arr);

          const saveData = {
            id: "all",
            name: "All Group",
            total_count: allVehicles.length,
            veh_arr: allVehicles
          };

          items.value = allVehicles;


          await storage.set(
            Constants.storageValue.key_VehicleDetails_v1,
            saveData
          );

        }else {

        const arrData = responsejson.arr_data[0];
          const dataValue = arrData.veh_arr.map(v => ({ ...v }));
          items.value = dataValue;
         console.log("DisplayResponse",dataValue);

        // ⭐ Save vehicle data to storage

          await storage.set(
            Constants.storageValue.key_VehicleDetails_v1,
            arrData
          );
        }

      } else if (response.status === 401) {
        console.error('Unauthorized:', responsejson.message);
      } else {
        console.error('Empty response data');
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Dismiss loading if it was shown
      if ( loading) {
        loading.dismiss();
      }
    }
  })
  .catch((err) => {
    console.error('Error creating loading controller:', err);
  });
};
  
// const filteredItems = computed(() => {
//   return items.value.filter((item) => {


//     console.log("item.sts_str",item.sts_str);
//     // 🔍 Search
//     const matchesSearch = item.veh_no
//       .toLowerCase()
//       .includes(searchQuery.value.toLowerCase());

//     // 🎯 Dynamic status filter
//     const matchesStatus =
//       selectedFilter.value === 'All' ||
//       item.sts_str === selectedFilter.value;

//     return matchesSearch && matchesStatus;
//   });
// });


const filteredItems = computed(() => {

  return items.value.filter((item) => {

    //console.log("item.sts_str", item.sts_str);

    // 🔍 Search
    const matchesSearch = item.veh_no
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    // 🎯 Status Filter (includes instead of exact match)
    const matchesStatus =
      selectedFilter.value === 'All' ||
      item.sts_str?.toLowerCase().includes(
        selectedFilter.value.toLowerCase()
      );

    return matchesSearch && matchesStatus;
  });

});


    onMounted(async () => {
  if (hasMounted) return;  // Prevent double call in dev
  hasMounted = true;


const groupData = route.query.group ? JSON.parse(route.query.group as string) : null;
if (groupData) 
{
  groupname.value = groupData.group;
groupid.value=groupData.group_id;
groupVehCount.value=groupData.total_count;
}


      initNetworkListener();
      
      await loadFavorites(1); // Load favorites when the component is mounted
      // First load
   

if (isFirstTimeDataCall) {
  await DisplayStoredData();  // load UI from storage first

  await CallAPIForVehicleDetails();  // run once

  const intervalTime = (groupid.value === 'all' ||
   Number(groupVehCount.value) > 80) ? 60000 : 30000;
   
  intervalId.value = setInterval(CallAPIForVehicleDetails, intervalTime);
}




    });
onUnmounted(() => {
  // Start interval
  

  if (intervalId.value) {
    clearInterval(intervalId.value);
  }

  if (backButtonListener) {
    backButtonListener.remove();
  }

});

onIonViewWillLeave(async () => {
  
                    if (showActionSheet.value) {
                          // Close ActionSheet if open
                          showActionSheet.value = false;
                          return; // Stop further back navigation
                        }
                
});


    const navigateToPage = async (vehicle,veh_id, veh_no,group) => {
      //console.log("displayData",JSON.stringify(vehicle));
     await storage.set('selectedVeh',JSON.stringify(vehicle));
      await storage.set('SelectGroup',group);

      // router.push({ 
      //   name: 'VehcileMapInfoTripPage', 
      //   params: { vehicleId: veh_id, vehicleName: veh_no,groupname:groupname.value} ,

      // });

      router.push(`/vehtabs/${veh_id}/${veh_no}/${groupname.value}/map`);

    };

    const isFavorite = (vehicle) => {
  const favExists = favorites.value && favorites.value.some(fav => fav.veh_id === vehicle.veh_id);
  //console.log('Checking if favorite:', vehicle.veh_id, '->', favExists); // Log the vehicle ID and favorite status
  return favExists;
};

    const goBack = () => {
       // ✅ If the ActionSheet is open, close it first
  if (showActionSheet.value) {
    showActionSheet.value = false;
    return; // stop here, don’t navigate back yet
  }
      router.back();
    };

    const openActionSheet = (vehicle) => {
      actionSheetButtons.value = [
        {
          text: 'Add to Favorites',
          handler: async () => {
            const alert = await alertController.create({
              message: 'Do you want to add vehicle to favorites?',
              buttons: [
                {
                  text: 'Yes',
                  handler: async () => {
                    addToFavorites(vehicle,groupname.value);
                    console.log('Add to Favorites', groupname+" "+vehicle);
                    loadFavorites(); // Reload favorites after adding
                    console.log("Favorites Array", favorites.value);
                  }
                },
                {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {
                    // console.log('Cancelled');
                  }
                }
              ]
            });
            await alert.present();
          }
        },
        {
          text: 'Share Location',
          handler: async () => {
            console.log('Share Location', vehicle);
            const uri = `http://maps.google.com/maps?q=${vehicle.lat},${vehicle.lon}`;
            const vehicle_no = `Vehicle Number: ${vehicle.veh_no}`;
            const current_sts = `Vehicle Current Status: ${vehicle.sts_str}`;
            const vehicle_date_time = `Date and Time: ${vehicle.rec_dt}`;
            const subj = `\n${vehicle_no}\n${current_sts}\n${vehicle_date_time}`;
            const finalUri = uri + subj;

            try {
              await Share.share({
                title: 'Share via',
                text: finalUri,
                dialogTitle: 'Share via',
              });
            } catch (error) {
              console.error('Error sharing', error);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ];
      showActionSheet.value = true;
    };

   

    return {
      navigateToPage,
      isFavorite,
      goBack,
      groupname,groupid,groupVehCount,
      items,
      searchQuery,
      filteredItems,
      showActionSheet,
      actionSheetButtons,
      openActionSheet,
      favorites,
      addToFavorites,
        loadFavorites,
    // 🔥 ADD THESE
    isFilterOpen,
    filterOptions,
    selectedFilter,
    selectFilter,filterOutline,closeOutline, checkmarkOutline,checkmarkDone,checkmarkCircleSharp,
      isConnected, showReconnectedMessage, initNetworkListener,intervalId,

    };
  },
});
</script>

<style scoped>

.empty-container {
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #8a8a8a;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
}
ion-content {
  --background: #f8fafc;
}

.custom-item {
  border-radius: 18px;
  background: #ffffff;
  margin: 10px 14px;
  padding: 6px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 4px 18px rgba(0, 30, 60, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.custom-item:hover {
  box-shadow: 0 6px 20px rgba(0, 104, 55, 0.08);
}

.custom-divider {
  margin: 0;
  padding: 0;
  height: 0px;
  min-height: auto;
}

ion-item {
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
}

ion-list {
  padding: 0;
  background: transparent;
}


.network-status-bar {
  background-color:#00875A;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}


.network-status-bar.connected {
  background-color: green;
}
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  font-weight: 500;
}

.filter-item:active {
  background: #f0fdf4; border-color: rgba(0, 104, 55, 0.2);
}

.check-icon {
  color: #006837;
  font-weight: bolder;
  font-size: 24px;
}
</style>
