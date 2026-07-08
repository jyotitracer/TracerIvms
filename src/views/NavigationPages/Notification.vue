<!-- This Page is menu Notification Page. -->
<template>
<ion-content fullscreen class="safe-bottom">
    <ion-list v-if="selectedItems.length > 0" style="margin-bottom: 40px;">
      <ion-card v-for="(page, index) in selectedItems" :key="index" class="notification-card">
        <ion-card-content style="padding: 5px 5px 2px 5px;">
          <div class="item-content">
            <div class="text">{{ page.msg }}</div>
            <div class="separator"></div>
            <div class="action-buttons">
                <ion-icon style="height: 30px; width: 30px; color:#00875A;" name="share-outline" @click="shareItem(page.msg)"></ion-icon>
                <ion-checkbox v-model="page.selected" class="large-checkbox"></ion-checkbox>
              </div>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-list>


     <!-- Display this text when the list is empty -->
     <div v-else class="empty-notification">
      Notifications not available
    </div>

     <!-- 🔥 FIXED BOTTOM BUTTON BAR -->
  <div v-if="selectedItems.length > 0" class="bottom-action-bar">
    <ion-button expand="block" @click="confirmDeleteAll" class="footer-button">
      Delete All
    </ion-button>
    <ion-button expand="block" @click="confirmDeleteSelected" class="footer-button">
      Delete Selected
    </ion-button>
  </div>

   
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  IonContent,
  IonList,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonButton,
  IonIcon,
  loadingController,
  alertController,
  useBackButton,
} from '@ionic/vue';
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import storage from "@/services/storagefile";
import { showToast,showToastMessage } from '@/services/toast';
import { onMounted,computed } from 'vue';
import { Share } from '@capacitor/share';
import router from '@/router/index'; // Assuming your router file is named router.js
import {  selectedPage } from '@/services/userstate'; // Import the global state


export default defineComponent({
  components: {
    IonContent,
    IonList,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonButton,
    IonIcon,
  },
  setup() {
    let isFirstTimeDataCall = true;  
    
    const selectedItems = ref([]);

    const loadItemsFromStorage = async () => {
      try {
        const storedItems = await storage.get('selectedItems');
        if (storedItems) {
          selectedItems.value = storedItems;
          isFirstTimeDataCall=false;
        }
      } catch (error) {
        console.error('Error loading items from storage:', error);
      }
    };

    const fetchDataFromAPI = async () => {
      const loading = await loadingController.create({
        message: 'Loading...',
        backdropDismiss: true,
      });

      try {
        if(isFirstTimeDataCall){ 
          await loading.present();
    }

        const lastRecId = storage.get('last_rec_id') || '0';
        const params = { lst_rec_id: lastRecId };

        const response = await fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Noti, params);

        if (response.status === 200) {
          const responsejson = response.data;
          const fetchedItems = responsejson.arr_data.map(item => ({
            rec_id: item.rec_id,
            msg: item.msg,
            selected: false,
          }));

          if (fetchedItems.length > 0) {
            const lastRecId = responsejson.arr_data[0].rec_id;
            storage.set('last_rec_id', lastRecId);
            await storage.set('selectedItems', fetchedItems);
            await loadItemsFromStorage();
          } else {
            console.warn('Empty response data');
          }

                  await loading.dismiss();   

        } else {
          console.error(`API Error: ${response.status}`);
         // showToastMessage('Error fetching data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
       // showToastMessage('Error fetching data. Please check your connection.');
      } finally {
         if(isFirstTimeDataCall){
        await loading.dismiss();   
 }
      }
    };

    const shareItem = async (msg: string) => {
      try {
        await Share.share({
          title: 'Share Notification',
          text: `Check out this notification: ${msg}`,
          dialogTitle: 'Share Notification',
        });
      } catch (error) {
        console.error('Error sharing:', error);
        showToastMessage('Unable to share this notification.');
      }
    };


    const confirmDeleteAll = async () => {
      const alert = await alertController.create({
        header: 'Alert',
        message: 'Do you want to delete all notifications?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'red-button', // Add a CSS class for styling

          },
          {
            text: 'Yes',
            handler: () => {
              selectedItems.value = [];
              storage.set('selectedItems', []);
              showToastMessage('All notifications deleted.');
            },
            cssClass: 'red-button', // Add a CSS class for styling

          },
        ],
      });
      await alert.present();
    };

    // Computed property to check if at least one item is selected
    const isAnyNotificationSelected = computed(() => {
      return selectedItems.value.some(item => item.selected);
    });

    const confirmDeleteSelected = async () => {


      if (!isAnyNotificationSelected.value) {
        alertController.create({
          header: 'Alert',
          message: 'Please select at least one notification to delete.',
          buttons: ['OK']
        }).then(alert => alert.present());
        return;
      }

      const alert = await alertController.create({
        header: 'Alert',
        message: 'Do you want to delete the selected notifications?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'red-button', // Add a CSS class for styling

          },
          {
            text: 'Yes',
            handler: () => {
              selectedItems.value = selectedItems.value.filter(item => !item.selected);
              storage.set('selectedItems', selectedItems.value);
              showToastMessage('Selected notifications deleted.');
            },
            cssClass: 'red-button', // Add a CSS class for styling

          },
        ],
      });
      await alert.present();
    };

    onMounted(()=>{
    useBackButton(9999, async () => {
      const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');
            });
            
            loadItemsFromStorage();
            fetchDataFromAPI();

    });

    return {
      selectedItems,
      fetchDataFromAPI,
      shareItem,
      confirmDeleteAll,
      confirmDeleteSelected,
      isAnyNotificationSelected,

    };
  },
});
</script>


<style scoped>

/* Bottom fixed action bar */
.bottom-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: row;        /* ✅ SINGLE LINE */
  justify-content: center;    /* ✅ CENTER BOTH BUTTONS */
  align-items: center;
  gap: 12px;
  background: var(--ion-color-primary);
  z-index: 100;
}

/* Control button width */
.footer-button {
  flex: 1;                    /* ✅ equal width */
  max-width: 220px;           /* keeps them centered */
  --background: transparent;
  --color: white;
  --ripple-color: white;
  text-transform: none;
    justify-content: center;    /* ✅ CENTER BOTH BUTTONS */
  align-items: center;
  align-text:center;

}


.large-checkbox {
  --size: 22px; /* Adjust this value to increase or decrease the checkbox size */
}
.red-button {
  --color:var(--ion-color-primary); /* Text color */
  --background: transparent; /* Background color (optional) */
}

.empty-notification {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Adjust as needed */
  font-size: 18px; /* Adjust font size as needed */
  color: #000; /* Customize color */
}

.notification-card {
  margin: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Card shadow for better appearance */
  border-radius: 10px; /* Rounded corners */
  padding: 0px;
}

.item-content {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  width: 100%;
  position: relative;
}

.text {
  flex: 1;
  padding: 0 5px 5px;
  word-wrap: break-word;
  white-space: normal;
font-size: 16px;
color: black;

}

.separator {
  width: 100%;
  height: 1px;
  background-color: #ccc; /* Line color */
}

.action-buttons {
  display: flex;
  justify-content: flex-end; /* Align share and checkbox to the end */
  align-items: center;
  gap: 5px; /* Space between share button and checkbox */
  padding: 0 0 0 0;
}


</style>

