<template>
  <ion-page>

    <ion-content>
          <div v-if="!isConnected" class="network-status-bar">
          No Network Connection
        </div>
        <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
          Connected to Network
        </div>
        
      <form @submit.prevent="login" text-align="center" id="container">
      
        <!-- Logo -->
        <div class="img-container">
          <ion-img 
            src="/new_logo.png" 
            alt="Image" 
            style="height: 35%; width: 35%; margin-bottom: 10px;">
          </ion-img>
        </div>

        <!-- Login Title -->
        <strong>
          <ion-title 
            style="margin-bottom: 20px; font-size: 23px; color: #000;">
            Login
          </ion-title>
        </strong>
     
        <!-- Username Input -->
        <ion-input 
          label="Username" 
          label-placement="floating" 
          v-model="username" 
          type="text" 
          required 
          style="color: #000; background-color: #fff;">
        </ion-input>

        <!-- Password Input -->
        <ion-input 
          label="Password" 
          label-placement="floating" 
          v-model="password" 
          type="password" 
          required 
          style="margin-bottom: 30px; color: #000; background-color: #fff;">
        </ion-input>

        <!-- Login Button -->
        <div class="ion-text-center">
          <ion-button 
            class="lowercase-button" 
            type="submit" 
            style="margin-top: 20px;">
            Login
          </ion-button>
        </div>

        <!-- Toast Notification -->
        <ion-toast 
          :isOpen="showToast" 
          :message="toastMessage" />
        
      </form>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { Device } from '@capacitor/device';
import { IonInput, IonContent, IonButton, IonPage, IonImg, IonTitle, IonToast, loadingController } from '@ionic/vue';
import { registerPushNotifications } from '@/services/pushNotifications';
import storage from '@/services/storagefile';
import Constants from '@/common/constants';
import { ReqGetDoaminName,ReqLogin_withoutTok, fetchData } from '@/services/ApiService';
import { Network } from '@capacitor/network';
import { showToast,showToastMessage } from '@/services/toast'; 
import router from '@/router/index'; // Assuming your router file is named router.js
import useNetwork from '@/services/networkService'; // Import the network service
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';

export default {
  components: {
    IonInput, IonContent, IonButton, IonPage, IonImg, IonTitle, IonToast
  },
  setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const username = ref('');
    const password = ref('');
   // const showToast = ref(false);
    const toastMessage = ref('');
    const deviceName = ref('');
    const deviceModel = ref('');
    const devicePlatform = ref('');
    const deviceUUID = ref('');
    const firebaseTok = ref('');

    const getDeviceInfo = async () => {
      try {
        console.log("Fetching device information...");
        
        const info = await Device.getInfo();
        const deviceId = await Device.getId();

        deviceName.value = info.manufacturer;
        deviceModel.value = info.model;
        devicePlatform.value = info.platform;
        deviceUUID.value = deviceId.identifier;

        firebaseTok.value = await registerPushNotifications();

        if (firebaseTok.value) {
          console.log(`Firebase Token: ${firebaseTok.value}`);
        } else {
          console.warn('Firebase token not available.');
        }

        console.log(
          `Device Info: ${deviceName.value}, ${deviceModel.value}, ${devicePlatform.value}, ${deviceUUID.value}`
        );
      } catch (error) {
        console.error("Error fetching device info: ", error);
      }
    };

    const storeData = async (keyname, valuedata) => {
      await storage.set(keyname, valuedata);
    };

    const RetrieveData = async (keyname) => {
      return await storage.get(keyname);
    };
   

    const login = async () => {
       const status = await Network.getStatus();
      if (status.connected) {
        loadingController.create({ message: 'Loading...' })
          .then((loading) => {
            loading.present(); // Show loading

            const params = {
              username: username.value,
              password: password.value,
              app_type: '2',
              mob_platform: devicePlatform.value,
              mob_sw_ver: '210',
              cordova: '',
              mob_uuid: deviceUUID.value,
              mob_name: deviceName.value,
              mob_model: deviceModel.value,
              device_id: firebaseTok.value, // Firebase token value
            };


            return ReqGetDoaminName(params)
              .then((response) => {
                const responseJson = response.data;

                if (response.status === 200) {
                  //toastMessage.value = responseJson.message;
                  if (response.data?.status == "success") {
                    return Promise.all([
                      storeData('Domain_Name', responseJson.data[0].domain+""),
                      storeData('Link_Name', responseJson.data[0].linkName+""),
                    ]).then(() => {
                      return Network.getStatus().then((status_1) => {
                        if (status_1.connected) {
                          requestLoginWithDomain(params);
                        } else {
                          showToast();
                        }
                      });
                    });  
                  }
                  else
                    showToastMessage(response.data?.message);

                } else if (response.status === 401) {
                  console.log("displaydata", responseJson.message);
                  toastMessage.value = responseJson.message;
                  showToastMessage(toastMessage.value);
                } else {
                  console.error('Empty response data');
                }
              })
              .catch((error) => {
                console.error('Error fetching data:', error);
              })
              .finally(() => {
                loading.dismiss(); // Hide loading
              });

          })
          .catch((error_1) => {
            console.error('Error creating loading spinner:', error_1);
          });

      }
      else {
        showToast();
      }
      };

      const requestLoginWithDomain = (params: { username: string; password: string; app_type: string; mob_platform: string; mob_sw_ver: string; cordova: string; mob_uuid: string; mob_name: string; mob_model: string; device_id: string; }) =>{
        return ReqLogin_withoutTok(params, Constants.CONT.Login_Contro, Constants.CMD.LOGIN)
            .then((response) => {
              const responseJson = response.data;

              if (response.status === 200) {
                toastMessage.value = responseJson.message;

                return Promise.all([
                  storeData('login_data', responseJson),
                  storeData('IsLoginAlready', true)
                ]).then(() => {
                  return Network.getStatus().then((status) => {
                    if (status.connected) {
                      requestVehicleStatusColor();
                    } else {
                      showToast();
                    }
                  });
                });
              } else if (response.status === 401) {
                console.log("displaydata",responseJson.message);
                toastMessage.value = responseJson.message;
                showToastMessage(toastMessage.value);
              } else {
                console.error('Empty response data');
              }
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            })
            .finally(() => {
             // loading.dismiss(); // Hide loading
            });

      };
    const requestVehicleStatusColor = () => {
      loadingController.create({ message: 'Loading...' })
        .then((loading) => {
          loading.present(); // Show loading spinner

          fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Color, {})
            .then((response) => {
              if (response.status === 200) {
                        const updatedData = response.data.arr_data.map(item => ({
                ...item,  // Spread the original properties
                isEnabled: true  // Add isEnabled key with value true
              }));

              // Store the updated data
              storeData('VehicleStatusColor', updatedData);

              for (let i = 0; i < response.data.arr_data.length; i++) {
                if (response.data.arr_data[i].status === 'Moving') {
                  storeData('movingcolor', response.data.arr_data[i].color);
                } else if (response.data.arr_data[i].status === 'Stopped') {
                  storeData('stoppedcolor', response.data.arr_data[i].color);
                } else if (response.data.arr_data[i].status === 'Offline') {
                  storeData('offlinecolor', response.data.arr_data[i].color);
                }else if (response.data.arr_data[i].status === 'Idle') {
                  storeData('idlecolor', response.data.arr_data[i].color);
                }

              }


                router.replace('/today');

                return Promise.all([
                  storage.set("selectedItem", '/today'),
                  storage.set("pagename", 'Dashboard Today'),
                  storage.set("pageid", "1")
                ]);
              } else if (response.status === 401) {
                toastMessage.value = response.data.message;
              }
            })
            .catch((error) => {
              console.error('Error fetching vehicle status color:', error);
            })
            .finally(() => {
              loading.dismiss();
            });
        })
        .catch((error) => {
          console.error('Error creating loading spinner:', error);
        });
    };

    onMounted(() => {


      getDeviceInfo();
      initNetworkListener();

    });

    return {
      username,
      password,
      showToastMessage,
            showToast,
      toastMessage,
      login,
      isConnected,
      initNetworkListener, // Expose the initNetworkListener function
      showReconnectedMessage
    };
  }
};
</script>

<style scoped>
  ion-button {
    --background: #ca0505;
    --background-hover: #ca0505;
    --background-activated: #ca0505;
    --background-focused: #ca0505;
    --color: #c4c4c4;
    --border-radius: 20px;
    --border-color: #ca0505;
    --border-style: solid;
    --border-width: 1px;
      width: 120px;
      font-size: 16px;
    --box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.25);
  }

  .lowercase-button {
    text-transform: none;
    color: #fff;
  }

  #container {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    padding-left: 5%;
    transform: translateY(-50%);
  }

  .img-container {
    display: flex;
    justify-content: center;
  }

  #container strong {
    text-align: center;
    font-size: 20px;
    line-height: 26px;
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
