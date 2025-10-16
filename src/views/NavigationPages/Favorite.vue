<!-- This Page is menu Favourite Page. -->

<template>
  <ion-content>
    <ion-list v-if="vehicles.length > 0">
      <template v-for="(vehicle, index) in vehicles" :key="vehicle.id">
        <VehicleItem 
          :vehicle="vehicle" 
          :isFavorite="isFavorite(vehicle)" 
          @click="navigateToPage(vehicle.veh_id, vehicle.veh_no,vehicle)"
          v-long-press="() => openActionSheet(vehicle, index)"
        />
        <ion-item-divider v-if="index < vehicles.length - 1" class="custom-divider"></ion-item-divider>
      </template>
    </ion-list>
    
    <!-- Display message when the list is empty -->
    <div v-else class="empty-message">
      Currently no vehicles are added to favourite vehicle list. To add vehicles to favourite
      list open Group Menu > tap the group name to open vehicle list. Long press on desired vehicle .
      </div>

    <ion-action-sheet
      v-if="showActionSheet"
      :is-open="showActionSheet"
      :buttons="actionSheetButtons"
      @did-dismiss="showActionSheet = false"
    />

  
  </ion-content>
</template>


<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
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
  IonActionSheet,
  alertController,
  useBackButton,
  onIonViewWillLeave,
  onIonViewDidLeave,
  onIonViewWillEnter,
  onIonViewDidEnter
} from '@ionic/vue';
import VehicleItem from '@/components/VehicleCustomeItem.vue';
import router from '@/router/index';
import storage from '@/services/storagefile';
import Constants from '@/common/constants';
import {  selectedPage } from '@/services/userstate'; // Import the global state
import { App } from '@capacitor/app';

export default defineComponent({
  name: 'Favourite',
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
    IonActionSheet,
    alertController
  },
  setup() {
    const vehicles = ref([]);
    const showActionSheet = ref(false);
    const actionSheetButtons = ref([]);
    const vehicleToRemove = ref(null);
    let backButtonListener;

    const navigateToPage = (veh_id,veh_no,vehicle) => {
      localStorage.setItem("selectedVeh",JSON.stringify(vehicle));
      localStorage.setItem("SelectGroup",vehicle.groupname);

      //router.push({ name: 'VehcileMapInfoTripPage', params: { vehicleId: veh_id, vehicleName:veh_no } });
          router.push(`/vehtabs/${veh_id}/${veh_no}/${vehicle.groupname}/map`);

    };

    const goBack = () => {
      router.back();
    };

    const isFavorite = (vehicle) => {
  const favExists = true;
  return favExists;
};

    const loadFavoritesAndSetVehicles = async () => {
      try {
        const storedFavorites = await storage.get(Constants.storageValue.Key_Fav_data);
        const storedValues = await storage.get(Constants.storageValue.Key_GroupAPI);

        const favoriteIds = storedFavorites.map(fav => fav.veh_ID);
      //  const Groupnames = storedFavorites.map(fav => fav.groupname);


          // 3️⃣ Find the group data matching the current group name
          const matchingGroups = storedValues.filter(
            (grouparray) => grouparray.group === 'All Group'
          );
      
           console.log("Favorite IDs:", favoriteIds);
           console.log("matchingGroups IDs:", matchingGroups);

           
          // 4️⃣ Extract the group's vehicles
         const allGroupVehicles = matchingGroups[0].veh_arr || [];


          // 5️⃣ Filter only vehicles whose veh_id exists in favorites
        const filteredVehicles = allGroupVehicles.filter(vehicle =>
          favoriteIds.includes(vehicle.veh_ID)
        );

          vehicles.value = [...filteredVehicles];
          

      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    const removeVehicle = async (vehicle, index) => {
      try {
        // Remove vehicle from vehicles array
        vehicles.value.splice(index, 1);

        // Update the storage
        await storage.set(Constants.storageValue.Key_Fav_data, vehicles.value);
        console.log('Vehicle removed and storage updated.');
      } catch (error) {
        console.error('Error removing vehicle:', error);
      }
    };

    const openActionSheet = (vehicle, index) => {
      vehicleToRemove.value = { vehicle, index };
      actionSheetButtons.value = [
        {
          text: 'Remove from Favorites',
          handler: async () => {
            const alert = await alertController.create({
              message: 'Do you want to remove this vehicle from favorites?',
              buttons: [
                {
                  text: 'Yes',
                  handler: async () => {
                    removeVehicle(vehicleToRemove.value.vehicle, vehicleToRemove.value.index);
                    showActionSheet.value = false;
                  }
                },
                {
                  text: 'No',
                  role: 'cancel',
                }
              ]
            });
            await alert.present();
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

    onMounted(async () => {
      useBackButton(9999, async () => {

                   if (showActionSheet.value) {
                          // Close ActionSheet if open
                          showActionSheet.value = false;
                        }

           const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');
            });

             backButtonListener = await App.addListener('backButton', ({ canGoBack }) => {
          console.log('🚫 Hardware back button pressed — blocking default');
          // Simply return without navigating back
          // e.g., you could show a toast instead

                          //  showToastMessage("app back");
          });
      loadFavoritesAndSetVehicles();
    });

    onUnmounted(()=>{
              if (backButtonListener) backButtonListener.remove();

    });


  
    return {
      vehicles,
      navigateToPage,
      goBack,
      isFavorite,
      showActionSheet,
      actionSheetButtons,
      openActionSheet,
      vehicleToRemove
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

.empty-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #000;
  margin: 10px;
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

</style>
