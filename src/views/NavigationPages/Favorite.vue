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
import { defineComponent, ref, onMounted } from 'vue';
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
  useBackButton
} from '@ionic/vue';
import VehicleItem from '@/components/VehicleCustomeItem.vue';
import router from '@/router/index';
import storage from '@/services/storagefile';
import Constants from '@/common/constants';
import {  selectedPage } from '@/services/userstate'; // Import the global state

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

    const navigateToPage = (veh_id,veh_no,vehicle) => {
      localStorage.setItem("selectedVeh",JSON.stringify(vehicle));
      localStorage.setItem("SelectGroup",vehicle.groupname);

      router.push({ name: 'VehcileMapInfoTripPage', params: { vehicleId: veh_id, vehicleName:veh_no } });
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
        console.log(storedFavorites);
        if (storedFavorites && Array.isArray(storedFavorites)) {
          vehicles.value = storedFavorites;
        } else {
          console.log('No favorite data found.');
        }
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

    onMounted(() => {
      useBackButton(9999, async () => {
        const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');
            });
      loadFavoritesAndSetVehicles();
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
