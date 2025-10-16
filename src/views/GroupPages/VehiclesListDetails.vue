<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/group"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ groupname }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   

    <ion-content>
      <ion-searchbar 
        placeholder="Search Vehicle"
        v-model="searchQuery"
      ></ion-searchbar>

      <ion-list>
        <template v-for="(vehicle, index) in filteredItems" :key="vehicle.sr_no">
          <VehicleItem 
            :vehicle="vehicle" 
            :isFavorite="isFavorite(vehicle)" 
            @click="navigateToPage(vehicle,vehicle.veh_id, vehicle.veh_no,groupname)"
            v-long-press="() => openActionSheet(vehicle)"
          />
          <ion-item-divider 
            v-if="index < filteredItems.length" 
            class="custom-divider">
          </ion-item-divider>
        </template>
      </ion-list>

      <ion-action-sheet
        v-if="showActionSheet"
        :is-open="showActionSheet"
        :buttons="actionSheetButtons"
        @did-dismiss="showActionSheet = false"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import { ref, defineComponent, computed, onMounted,onUnmounted } from 'vue';
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
  IonActionSheet,
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
import { onIonViewWillEnter, onIonViewDidEnter, onIonViewWillLeave, onIonViewDidLeave } from '@ionic/vue';
import { useBackButton } from '@ionic/vue';


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
    alertController
  },

  setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const route = useRoute(); // Access the current route
    const router = useRouter();

    const groupname=ref('');
    const items = ref([]);
    const intervalId=ref('');
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
      loadFavorites();

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
    const loadFavorites = async () => {
      favorites.value = await storage.get(Constants.storageValue.Key_Fav_data) || [];
      console.log('Favorites loaded:', favorites.value); // Debugging

    };

     // Fetch updated data from storage
     const fetchData = async () => {
      const storedValues = await storage.get(Constants.storageValue.Key_GroupAPI);
      if (storedValues) {
        const matchingGroups = storedValues.filter(
          (grouparray) => grouparray.group === groupname.value
        );

        if (matchingGroups.length > 0) {
          
          items.value=[];
          const itemupdated=[...matchingGroups[0].veh_arr];
          items.value = itemupdated; // Update items

          console.log("displayAPI",itemupdated.length);

        }
      }
    };


  

 const filteredItems = computed(() =>
      items.value.filter((item) =>
        item.veh_no.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    onMounted(async () => {

      groupname.value=route.params.group;
      initNetworkListener();
      await loadFavorites(); // Load favorites when the component is mounted
      await fetchData(); // Fetch data on mount


     intervalId.value = setInterval(() => {
        fetchData();
      }, 30000); // 30000 ms = 30 seconds



  //       // Method 1 — Ionic’s built-in listener
  // useBackButton(9999, (processNextHandler) => {
  //   console.log('🚫 Hardware back button pressed — default action prevented');
  //   // Do nothing (completely block back)
  // });

  // // OR Method 2 — Capacitor’s App listener (more control)
  // backButtonListener = await App.addListener('backButton', ({ canGoBack }) => {
  //   console.log('🚫 Hardware back button pressed — blocking default');
  //   // Simply return without navigating back
  //   // e.g., you could show a toast instead
  // });


    });
    onUnmounted(()=>{
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


    const navigateToPage = (vehicle,veh_id, veh_no,group) => {
      //console.log("displayData",JSON.stringify(vehicle));
      localStorage.setItem("selectedVeh",JSON.stringify(vehicle));
      localStorage.setItem("SelectGroup",group);

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
      groupname,
      items,
      searchQuery,
      filteredItems,
      showActionSheet,
      actionSheetButtons,
      openActionSheet,
      favorites,
      addToFavorites,
      loadFavorites,
      isConnected, showReconnectedMessage, initNetworkListener,intervalId,

    };
  },
});
</script>

<style scoped>
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
}

ion-content {
  --ion-background-color: #fff;
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
