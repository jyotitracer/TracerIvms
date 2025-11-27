<template>
  <ion-page class="splash-screen">
    <ion-img src="/new_logo.png" alt="Image" class="centered-image"></ion-img>

    <!-- Privacy Policy Alert -->
    <ion-alert
      :is-open="isPrivacyPolicyOpen"
      header="Privacy Policy"
      message="This app does not collect or share any user data. It will allow the user to initiate a phone call to predefined numbers on click of the call button inside the app. However, the app does not access the phone book or contact list of the mobile."
      :buttons="[{ text: 'Accept', handler: handlePolicyAccepted }]"
      :backdrop-dismiss="false"
    ></ion-alert>

     <!-- Update Alert -->
    <ion-alert
      :is-open="isUpdateAlertOpen"
      :header="updateAlertHeader"
      :message="updateAlertMessage"
      :buttons="['OK']"
      @didDismiss="isUpdateAlertOpen = false"
    ></ion-alert>

     <!-- NEW: Custom Alert for iOS Updates -->
    <ion-alert
      :is-open="isIosUpdatePromptOpen"
      header="Update Available"
      message="A new version of the app is available. Please update to get the latest features and improvements."
      :buttons="[
        { text: 'Later', role: 'cancel', handler: handleIosUpdateLater },
        { text: 'Update Now', handler: handleIosUpdateNow }
      ]"
      :backdrop-dismiss="false"
    ></ion-alert>

  </ion-page>
</template>


<!-- This is page splash Screen. here checking is app having already login or not. 
and Based on that redirection of pages.  
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonImg, IonAlert } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import storage from '@/services/storagefile';
import poli_storage from '@/services/policyStorage';
import { Capacitor } from '@capacitor/core';


const router = useRouter();
const isPrivacyPolicyOpen = ref(false);

const isUpdateAlertOpen = ref(false);

// NEW: Add state for a custom iOS update prompt
const isIosUpdatePromptOpen = ref(false);

const updateAlertHeader = ref('');
const updateAlertMessage = ref('');

// --- 1. The Main Entry Point ---
// This function runs once when the component is mounted.
onMounted(() => {
  // Uncomment for production on the app store
 //  startAppFlow();
  
  // Comment out for production
  // This is your testing path that skips the update check
  initializeAppLogic();
});



// --- 2. The Complete Application Startup Flow ---
const startAppFlow = async () => {
      const platform = Capacitor.getPlatform();

      console.log("platform",platform);
      if(platform === 'android' || platform === 'ios') {
          try {

            const { updateAvailability } = await AppUpdate.getAppUpdateInfo();

             if (platform === 'android') {
                // Handle the different update statuses
                if (updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
                  // If an immediate update is required, this will take over the app.
                  // The code below this will not run.
                  
                  await AppUpdate.performImmediateUpdate();
                  
                } else if (updateAvailability === AppUpdateAvailability.UPDATE_IN_PROGRESS) {
                  // Show an info alert, but continue the app logic in the `finally` block.
                  showUpdateAlert('Update in progress', "An update is already in progress and will be completed shortly.");
                } else if (updateAvailability === AppUpdateAvailability.UNKNOWN) {
                  // Show an info alert for failed check, but continue.
                  showUpdateAlert('Update Check Failed', "Could not check for updates. Please check your internet connection.");
                }
              }  
              else if (platform === 'ios') {
              if (updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {

                // For iOS, show our custom prompt
                isIosUpdatePromptOpen.value = true;
                // IMPORTANT: We do NOT continue to initializeAppLogic() here.
                // We let the user's choice in the alert decide the next step.
                return; 
              }
            }
          }catch (error) {
            // If the entire plugin fails, log it and continue.
            console.error('Error checking for updates:', error);
            showUpdateAlert('Update Error', "An error occurred while checking for app updates.");
          } 
    }
    // *** CRITICAL PART ***
    // This `finally` block ensures that the main app logic ALWAYS runs,
    // unless an immediate update has taken over.
    await initializeAppLogic();
  
};


// --- 3. Core App Logic (Policy & Login) ---
const initializeAppLogic = async () => {
  // This delay ensures the splash screen is visible for a minimum time.
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const hasSeenPrivacyPolicy = await poli_storage.get('hasSeenPrivacyPolicy');
  if (hasSeenPrivacyPolicy) {
    await checkLoginAndRedirect();
  } else {
    isPrivacyPolicyOpen.value = true;
  }
};


// --- 4. Helper Functions ---

const checkLoginAndRedirect = async () => {
      const isLoggedIn = await storage.get('IsLoginAlready');
      if (isLoggedIn) {
        const storedMenu = await storage.get('selectedPage');
        if (storedMenu) {
          router.push(storedMenu.route);
          await storage.set('selectedItem', storedMenu.route);
          await storage.set('pagename', storedMenu.title);
          await storage.set('pageid', storedMenu.pageid);
        } else {
          const defaultSelected = {
            title: 'Dashboard Today',
            route: '/today',
            selected: true,
            pageid: '1',
          };
          await storage.set('selectedPage', defaultSelected);
          router.push('/today');
          await storage.set('selectedItem', '/today');
          await storage.set('pagename', 'Dashboard Today');
          await storage.set('pageid', '1');
        }

      
      } else {
        router.push('/login');
      }
    };

const handlePolicyAccepted = async () => {
  await poli_storage.set('hasSeenPrivacyPolicy', 'true');
  isPrivacyPolicyOpen.value = false;
  // After accepting, continue the flow.
  await checkLoginAndRedirect();
};

const showUpdateAlert = (header: string, message: string) => {
  updateAlertHeader.value = header;
  updateAlertMessage.value = message;
  isUpdateAlertOpen.value = true;
};


// --- NEW: Handlers for the iOS Update Alert ---

// If the user chooses "Update Now"
const handleIosUpdateNow = async () => {
  isIosUpdatePromptOpen.value = false;
  // This will simply open the App Store page
  await AppUpdate.openAppStore();
  // We still initialize the app logic in case the user switches back
  // without updating or closing the app.
  await initializeAppLogic();
};

// If the user chooses "Later"
const handleIosUpdateLater = async () => {
  isIosUpdatePromptOpen.value = false;
  // Proceed with the app as normal
  await initializeAppLogic();
};


</script>


<style>
.splash-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
}

.centered-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50%;
  width: 50%;
}
</style>