import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { getMessaging } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { App as CapacitorApp } from '@capacitor/app';
import { registerPushNotifications,createNotificationChannel } from '@/services/pushNotifications'; // Import your push notifications setup function
import { IonicVue,loadingController } from '@ionic/vue';

import { addIcons } from 'ionicons';
import { checkmarkCircle, checkmarkDoneCircle, shareOutline, shareSocialOutline ,searchOutline, closeOutline, location, chevronUp, locationOutline, chevronDown, arrowBackCircle } from 'ionicons/icons';
import longPress from './directives/long-press';
import { Capacitor } from '@capacitor/core';
import { getAnalytics } from "firebase/analytics";
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import './global.css'; // Ensure this line is present if using CSS




/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
// import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
 import {GroupIntervalRefresh, stopInterval,intervalRunning} from '@/services/GrouprefreshService';
 import{MapIntervalRefresh,stopInterval1Min,intervalRunning1Min} from '@/services/MaprefreshService';
import  { getGoogleMapKey } from '@/common/constants';

async function loadGoogleMaps() {
  const googleMapsApiKey = await getGoogleMapKey();
  
  if (!googleMapsApiKey) {
    console.error("No Google Maps API key found!");
    return;
  }

  if (!document.querySelector(`#google-maps-script`)) {
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry,marker,places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
loadGoogleMaps();

const firebaseConfig = {
  apiKey: "AIzaSyDu2KSTqwmKK-4sWWRc36HO2HPYJwu-2V8",
  authDomain: "tracerivmsmobile.firebaseapp.com",
  projectId: "tracerivmsmobile",
  storageBucket: "tracerivmsmobile.firebasestorage.app",
  messagingSenderId: "193964130261",
  appId: "1:193964130261:web:269447682c1c5aeeba875c",
  measurementId: "G-71RJVC74RY"
};


export const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
export const messaging = getMessaging(firebaseApp);

// Add the icons
addIcons({
  'checkmark-circle': checkmarkCircle,
  'share-outline':shareSocialOutline,
  'checkmark-done-circle': checkmarkDoneCircle,
  'search-outline': searchOutline,
  'close-outline': closeOutline,
  'location':locationOutline,
  'chevron-up':chevronUp,
'chevron-down':chevronDown,
'arrow-back-outline': arrowBackCircle
});





const app = createApp(App)
  .use(IonicVue)
  .use(router);
  
  app.directive('long-press', longPress);

  const firebaseToken = registerPushNotifications();


  console.log("firebaseToken",firebaseToken);

    createNotificationChannel();

  // Subscribe to appStateChange event
  CapacitorApp.addListener('appStateChange', ({ isActive }) => {
    console.log("app state change");

        if (!isActive) {
          stopInterval();
          stopInterval1Min();
        }else{
          GroupIntervalRefresh();
          MapIntervalRefresh();
        }
  });

  document.addEventListener('ionBackButton', (ev) => {

        ev.detail.register(10, async () => {
                 router.back();

        });
  });
  
  router.isReady().then(() => {
    app.mount('#app');
  });