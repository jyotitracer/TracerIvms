<template>
  <ion-app>
    <ion-menu content-id="main-content" 
            style="background-color: white;">
      <ion-header translucent>
        <ion-toolbar style="--background: #ffffff; background: #ffffff;">
                <div class="ion-text-center">
                <ion-img
                    src="/new_logo.png"
                    class="menu-logo">
                  </ion-img>
                <ion-label style="font-size:16px; font-weight: 700; color: #006837;">Welcome {{ username1 }}</ion-label>
                </div>
        </ion-toolbar>
      </ion-header>
      <ion-content fullscreen class="menu-content safe-bottom" style="--background: #ffffff; background: #ffffff;">
        <ion-list style="--background: #ffffff; background: #ffffff;">
          <ion-item 
            v-for="(page, index) in filteredPages" 
            :key="index" 
            @click="navigateToPage(page.route, page.title,page.pageid)"
            style="--background: #ffffff; background: #ffffff; --border-color: #f1f5f9; --inner-border-width: 0 0 1px 0; border-bottom: 1px solid #f1f5f9;"
          >
            <ion-icon slot="start" :ios="page.iosIcon" :md="page.mdIcon" style="color: #006837; font-size: 20px; margin-inline-end: 14px;"></ion-icon>
            <ion-label style="font-weight: 600; font-size: 15px; color: #006837;">{{ page.title }}</ion-label>
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
           CallOnlyAPI();

      } catch (error) {
        console.error('Error fetching login data:', error);
      }
      requestPermission();
      listenForNotifications();

    });


   const CallOnlyAPI = async () => {
  try {
    console.log("Background API sync started");

    const params = {};

    const response: any = await fetchData(
      Constants.CONT.Mobile_Contro,
      Constants.CMD.req_all_veh,
      params
    );

    if (response.status !== 200) return;

    const arrData = response.data?.arr_data;
    if (!arrData || arrData.length === 0) return;

    // ✅ Prepare group data
    const newItems = arrData.map((data: any, index: number) => ({
      id: index + 1,
      group: data.name,
      total_count: data.total_count,
      veh_arr: data.veh_arr,
      sts_arr: data.sts_arr,
    }));

    // ✅ Get stored data
    const storedGroupData =
      (await storage.get(Constants.storageValue.Key_GroupAPI)) || [];

    const storedVehDetails =
      (await storage.get(Constants.storageValue.key_VehicleDetails)) || [];

    // ✅ Compare
    const isGroupChanged =
      JSON.stringify(storedGroupData) !== JSON.stringify(newItems);

    if (!isGroupChanged) return; // 🔥 Nothing changed → exit silently

    // ✅ Save group data
    await storage.set(Constants.storageValue.Key_GroupAPI, newItems);

    // ========================
    // GROUP STATUS (EVENT/MAP/FUEL)
    // ========================

    const buildGroupStatus = async (keyName: string) => {
      const stored = (await storage.get(keyName)) || [];

      const map = new Map(
        stored.map((g: any) => [`${g.group}-${g.groupId}`, g])
      );

      return arrData.map((data: any) => {
        const key = `${data.name}-${data.id}`;
        return map.has(key)
          ? { ...map.get(key) }
          : {
              group: data.name,
              groupId: data.id,
              status: 1,
              checked: true,
            };
      });
    };

    const groupEvent = await buildGroupStatus(
      Constants.storageValue.key_GroupWithStatus
    );
    const groupMap = await buildGroupStatus(
      Constants.storageValue.key_Map_GroupWithStatus
    );
    const groupFuel = await buildGroupStatus(
      Constants.storageValue.key_Fuel_GroupWithStatus
    );

    await Promise.all([
      storage.set(Constants.storageValue.key_GroupWithStatus, groupEvent),
      storage.set(Constants.storageValue.key_Map_GroupWithStatus, groupMap),
      storage.set(Constants.storageValue.key_Fuel_GroupWithStatus, groupFuel),
    ]);

    // ========================
    // VEHICLE DETAILS
    // ========================

    const vehicleDetails = arrData.flatMap((data: any) =>
      data.veh_arr.map((veh: any) => ({
        vehid: veh.veh_id,
        vehname: veh.veh_no,
        vehstatus: veh.veh_sts,
        vehColor: veh.sts_colr,
        status: 1,
      }))
    );

    const isVehChanged =
      JSON.stringify(storedVehDetails) !== JSON.stringify(vehicleDetails);

    if (!isVehChanged) return;

    const buildVehicleDetails = async (keyName: string) => {
      const stored = (await storage.get(keyName)) || [];

      const map = new Map(
        stored.map((v: any) => [`${v.vehid}-${v.vehname}`, v])
      );

      return arrData.flatMap((data: any) =>
        data.veh_arr.map((veh: any) => {
          const key = `${veh.veh_id}-${veh.veh_no}`;
          return map.has(key)
            ? { ...map.get(key) }
            : {
                vehid: veh.veh_id,
                vehname: veh.veh_no,
                vehstatus: veh.veh_sts,
                vehColor: veh.sts_colr,
                status: 1,
              };
        })
      );
    };

    const vehEvent = await buildVehicleDetails(
      Constants.storageValue.key_VehicleDetails
    );
    const vehFuel = await buildVehicleDetails(
      Constants.storageValue.key_Fuel_VehicleDetails
    );

    await Promise.all([
      storage.set(Constants.storageValue.key_VehicleDetails, vehEvent),
      storage.set(Constants.storageValue.key_Fuel_VehicleDetails, vehFuel),
    ]);

    console.log("Background sync completed");
  } catch (error) {
    console.error("Background API error:", error);
  }
};
  

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

       username.value = '';
      selectedPage.value = {};

      // Clear storage and localStorage
      await storage.clear();
      await storage.clearAllPreferences();

      localStorage.clear();

     

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

<style scoped>

:root {
  --ion-color-primary: #ffffff;
  --ion-background-color: #fff;
  --ion-color-text: #000;
  --ion-color-radio-icon: #fff;
  --ion-color-radio-text: #fff;
}

body {
  font-style: normal;
  color: #3a3a3a;
}

.ion-text-center{
  justify-content: center;
  justify-items: center;
  margin: 10px;
}

.menu-logo {
  width: 80px;
  height: 60px;
  margin: 0 auto 20px auto;
}

</style>
