<template>
  <ion-app>
    <ion-menu content-id="main-content" style="background-color: white;">
      <ion-header style="--background: white;">
        <ion-toolbar style="--background: white;">
            
                <div class="ion-text-center">
                <ion-img src="/new_logo.png" style="size: 40%; padding-bottom: 20px; justify-items: center;"></ion-img>
               <ion-label style="font-size:16px; font-weight: normal;">Welcome {{ username1 }}</ion-label>
                </div>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item v-for="(page, index) in filteredPages" :key="index" @click="navigateToPage(page.route, page.title,page.pageid)">
            <!-- <ion-icon slot="start" :ios="page.iosIcon" :md="page.mdIcon"></ion-icon> -->
            <ion-label style="font-weight: bold; color: #3a3a3a; font-size: 16px">{{ page.title }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
    <ion-router-outlet id="main-content" style="background-color: white;"></ion-router-outlet>
    <!-- <ion-toast :isOpen="showToast" :message="toastMessage" /> -->
  </ion-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted ,watch, computed} from 'vue';
import {
  IonApp,
  IonMenu,
  IonGrid,
  IonHeader,
  IonToolbar,
  IonImg,
  IonContent,
  IonList,
  IonItem,
  IonRouterOutlet,
  IonRow,
  IonCol,
  IonLabel,
  IonIcon,
  alertController,
  loadingController,
  toastController
} from '@ionic/vue';
import storage from '@/services/storagefile';
import { PushNotifications } from '@capacitor/push-notifications';
import router from '@/router/index';
import { fetchData } from '@/services/ApiService';
import Constants from '@/common/constants';
import { Network } from '@capacitor/network';
import { showToast,showToastMessage } from '@/services/toast'; // Custom toast utility
import { username, selectedPage,isFuelEnabled } from '@/services/userstate'; // Import the global state




import {
  homeOutline,
  homeSharp,
  starOutline,
  starSharp,
  mapOutline,
  mapSharp,
  notificationsOutline,
  notificationsSharp,
  heartOutline,
  heartSharp,
  settingsOutline,
  settingsSharp,
  logOutOutline,
  logOutSharp,
  analyticsOutline,
  analyticsSharp,
  speedometerOutline,
  speedometerSharp
} from 'ionicons/icons';

export default defineComponent({
  components: {
    IonApp,
    IonMenu,
    IonGrid,
    IonHeader,
    IonToolbar,
    IonImg,
    IonContent,
    IonList,
    IonItem,
    IonRouterOutlet,
    IonRow,
    IonCol,
    IonLabel,
    IonIcon
  },
  computed: {
    username1() {
      return username.value; // Access the global state
    }
  },
  setup() {
  //  const IsFuelEnable = ref(1);
    // const showToast = ref(false);
    const toastMessage = ref('');
    const pages = ref([

      { title: 'Dashboard Today', route: '/today', iosIcon: homeOutline, mdIcon: homeSharp ,pageid:'1' },
      { title: 'Dashboard Month', route: '/month', iosIcon: homeOutline, mdIcon: homeSharp,pageid:'2'  },
      { title: 'Group', route: '/group', iosIcon: starOutline, mdIcon: starSharp,pageid:'3'  },
      { title: 'Map', route: `/mappage/0/0/[]`, iosIcon: mapOutline, mdIcon: mapSharp,pageid:'4'  },
      { title: 'Favourites', route: '/favpage', iosIcon: heartOutline, mdIcon: heartSharp,pageid:'5'  },
      { title: 'Event Report', route: '/eventreport', iosIcon: analyticsOutline, mdIcon: analyticsSharp,pageid:'6'  },
      { title: 'Fuel Report', route: '/fuelreport', iosIcon: speedometerOutline, mdIcon: speedometerSharp ,pageid:'7' },
      { title: 'Notifications', route: '/notipage', iosIcon: notificationsOutline, mdIcon: notificationsSharp,pageid:'8'  },
      { title: 'Settings', route: '/settingpage', iosIcon: settingsOutline, mdIcon: settingsSharp,pageid:'9'  },
      { title: 'Logout', route: '/logout', iosIcon: logOutOutline, mdIcon: logOutSharp,pageid:'10'  }
    ]);

   // const filteredPages = ref(pages.value);


    onMounted(async () => {
      try {
        const loginResponse = await storage.get('login_data');
        if(loginResponse)
        isFuelEnabled.value = loginResponse?.isFuel;
      
      } catch (error) {
        console.error('Error fetching login data:', error);
      }
      requestPermission();
      listenForNotifications();
    });

     // ✅ Use computed for auto refresh
 const filteredPages = computed(() => {
    return isFuelEnabled.value === 1
      ? pages.value
      : pages.value.filter(p => p.title !== 'Fuel Report');
  });

    const requestPermission = async () => {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      } else {
        console.error('Push notifications permission not granted');
      }
    };

    const listenForNotifications = () => {
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        showNotification(notification.title, notification.body, notification.data?.icon);
      });
    };

    const showNotification = async (title, text, icon) => {
      const toast = await toastController.create({
        header: title,
        message: text,
        icon: icon || 'information-circle',
        position: 'top',
        duration: 5000,
        buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
      });
      await toast.present();
    };

     const navigateToPage = async (path, title,pageid) => {
      await storage.set('selectedItem', path);
      await storage.set('pagename', title);
      await storage.set('pageid',pageid);

     // console.log("displayDataPage",title);


     if(path!=='/eventreport')
        await storage.remove('eventReport');

        if(path!=='/fuelreport')
        await storage.remove('fuelReport');

        


      if (path === '/logout') {
        const alert = await alertController.create({
          message: 'Do you want to logout?',
          buttons: [
            {
              text: 'Yes',
              handler: async () => {
                const status = await Network.getStatus();
                if (status.connected) {
                  logoutMethod();
                } else {
                  showToast();
                }
              }
            },
            { text: 'No', role: 'cancel' }
          ]
        });
        await alert.present();
      } 
      else {
        selectedPage.value = { title, pageid,path }; // Update the shared state

      

        closeMenu();
        await router.replace(path);
      }
    };

    const closeMenu = () => {
      const menu = document.querySelector('ion-menu');
      if (menu) {
        menu.close();
      }
    };

const logoutMethod = async () => {
  try {
    const loading = await loadingController.create({
      message: 'Loading...',
      backdropDismiss: true
    });
    await loading.present();

    const response = await fetchData(
      Constants.CONT.Login_Contro,
      Constants.CMD.LOGOUT,
      {}
    );

    if (response.status === 200) {
      toastMessage.value = response.data.message;
      closeMenu();

      // Clear storage and localStorage
      await storage.clear();
      await storage.clearAllPreferences();

      localStorage.clear();

      username.value = '';
      selectedPage.value = {};

      await router.push('/');
    } else if (response.status === 204) {
      showToastMessage('Data Not Available');
    } else if (response.status === 401) {
      // handle unauthorized
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    const topLoader = await loadingController.getTop();
    if (topLoader) {
      topLoader.dismiss();
    }
  }
};


    return {
      filteredPages,
      navigateToPage,
      closeMenu,
      // showToast,
      toastMessage
    };
  }
});

</script>

<style>
:root {
  --ion-color-primary: #ffffff;
  --ion-background-color: #fff;
  --ion-color-text: #000;
  --ion-color-radio-icon: #fff;
  --ion-color-radio-text: #fff;
}

body {
  font-family: 'rajdhani';
  font-style: normal;
  color: #3a3a3a;
}

.ion-text-center{
  justify-content: center;
  justify-items: center;
  margin: 10px;
}
</style>
