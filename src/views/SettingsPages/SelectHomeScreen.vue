<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Set Homescreen</ion-title>
      </ion-toolbar>
    </ion-header>

    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   


    <ion-content>
      <ion-list>
        <ion-item v-for="(page, index) in selectedItems" :key="index" @click="toggleSelection(page,index)">
          <ion-label>{{ page.title }}</ion-label>
          <ion-icon v-if="selectedIndex === index" name="checkmark-circle" slot="end"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import useNetwork from '@/services/networkService'; // Import the network service

import { defineComponent, ref,watch,onBeforeUnmount ,onMounted} from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButtons, IonBackButton,alertController
} from '@ionic/vue';
import storage from "@/services/storagefile";
import router from '@/router/index'; // Assuming your router file is named router.js
import { useRouter, useRoute } from 'vue-router';


export default defineComponent({
  name: 'HomescreenPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButtons,
    IonBackButton,alertController
  },
  setup() {
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    
    const selectedItems = ref([]);
    const selectedIndex = ref(null);
    const isChangedmenu= ref(false);
    const setPage=ref('');

    const initializeSelection = async () => {
      const storedMenu= await storage.get("selectedPage");

          if(storedMenu)
          {
              selectedIndex.value = selectedItems.value.findIndex(
              item => item.route === storedMenu.route
            );

              if (selectedIndex.value !== -1) {
                selectedItems.value[selectedIndex.value].selected = true;
              }
          }

      // if (selectedItems.value.length) {
      //   const defaultSelectedIndex = selectedItems.value.findIndex(item => item.selected);
      //   console.log("display",defaultSelectedIndex);
      //   if (defaultSelectedIndex !== -1) {
      //     selectedIndex.value = defaultSelectedIndex;
      //   }
      // }

    };

    const toggleSelection = async (page,index) => {
      const alert = await alertController.create({
            message: 'Now homescreen is changed to '+page.title,
            buttons: [
              {
                text: 'Ok',
                handler: async () => {                
               
                  selectedIndex.value = index;
                  selectedItems.value.forEach((item, i) => item.selected = i === index);
                  isChangedmenu.value=true;

                  page.selected = true;

                  await storage.set('selectedPage', page);
                  await storage.set("selectedItem", page.route);
                await storage.set("pagename", page.title);
                await storage.set("pageid",page.pageid)


                   // Set the selected page and save it to storage
                   

                    // Navigate to the selected route

                    // Go back to the previous page after replacing the route
                   await router.back();


                        // Replace the route after back navigation
                        if (isChangedmenu.value) {
                                setPage.value=page;
                               // await router.replace(setPage.value.route);

                                }
                }
              },
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                // console.log('Cancelled');
                }
              }
            ]   
             });
          await alert.present();
      
    };

    const goBack = () => {
       router.back();
    };

    const loadItems = async () => {

      const loginDetails = await storage.get('login_data');
      const isFuelEnable = loginDetails.isFuel;

      if (isFuelEnable == 1) {
        selectedItems.value = [
          { title: 'Dashboard Today', route: '/today', selected: false, pageid:'1' },
          {title: 'Dashboard Month', route: '/month',selected: false, pageid:'2'},
          { title: 'Group', route: '/group', selected: false, pageid:'3' },
          { title: 'Map', route: `/mappage/0/0/[]`, selected: false, pageid:'4' },
          { title: 'Favourite', route: '/favpage', selected: false, pageid:'5' },
          { title: 'Event Report', route: '/eventreport',selected: false, pageid:'6' },
          { title: 'Fuel Report', route: '/fuelreport', selected: false, pageid:'7' },
          { title: 'Notification', route: '/notipage', selected: false , pageid:'8'},
          { title: 'Setting', route: '/settingpage' , selected: false , pageid:'9'},
      ];

      } else {
        selectedItems.value = [
          { title: 'Dashboard Today', route: '/today', selected: false, pageid:'1' },
          {title:  'Dashboard Month', route: '/month',selected: false, pageid:'2'},
          { title: 'Group', route: '/group', selected: false, pageid:'3' },
          { title: 'Map', route: `/mappage/0/0/[]`, selected: false, pageid:'4' },
          { title: 'Favourite', route: '/favpage', selected: false, pageid:'5' },
          { title: 'Event Report', route: '/eventreport',selected: false, pageid:'6' },
          { title: 'Notification', route: '/notipage', selected: false , pageid:'8'},
          { title: 'Setting', route: '/settingpage' , selected: false , pageid:'9'},
        ];
      }
      initializeSelection();

    
    };

    loadItems();

    const router = useRouter();
    const route = useRoute();

  
    onMounted(()=>{
      initNetworkListener();

    });

    onBeforeUnmount(() => {
     
    });


    return {
      selectedItems,
      selectedIndex,
      toggleSelection,
      goBack,
      isConnected, showReconnectedMessage, initNetworkListener

    };


  },
  
});
</script>

<style scoped>
ion-icon {
  font-size: 24px;
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
