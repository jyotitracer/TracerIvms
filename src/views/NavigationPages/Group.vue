<!-- This Page is menu Group Page. -->

<template>
  <ion-content>
    <ion-searchbar placeholder="Search Group" v-model="searchQuery"></ion-searchbar>
    <ion-list v-if="filteredItems.length > 0">
      <custom-item
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @click="handleItemClick(item)"
      />
    </ion-list>

     <!-- When no data found -->
    <div v-else class="no-data">
      No data available
    </div>
  </ion-content>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonList,
  IonSearchbar,
  loadingController,
  useBackButton,
} from '@ionic/vue';
import CustomItem from '@/components/GroupCustomItem.vue';
import router from '@/router/index'; // Assuming your router file is named router.js
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Constants from '@/common/constants';
import { fetchData } from '@/services/ApiService';
import storage from '@/services/storagefile';
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function
import{stopInterval} from '@/services/GrouprefreshService';
import {  selectedPage } from '@/services/userstate'; // Import the global state



const items = ref([]);

const CallOnlyAPI = () => {
  const params = {
    grping: '2',
  };

  fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Group, params)
    .then((response) => {
      const responsejson = response.data;

      
     // console.log("display",responsejson.arr_data);

      if (response.status === 200) {
        const arrData = responsejson.arr_data;


        if (arrData && arrData.length > 0) {
          items.value = arrData.map((data, index) => ({
            id: index + 1, // Unique ID
            group: data.name, // Group name
            total_count: data.total_count, // Total vehicles
            veh_arr: data.veh_arr,
            sts_arr: data.sts_arr,
          }));


      

                    if(arrData.length > 1){

                        // Calculate the totals for the last item
                  const totalCountSum = arrData.reduce((sum, data) => sum + data.total_count, 0);
                            const combinedVehArr = arrData.flatMap((data) => data.veh_arr);
                

                            // Calculate the aggregated sts_arr
                    const aggregatedStsArr = arrData.reduce((agg, group) => {
                              group.sts_arr.forEach((sts) => {
                                const existingSts = agg.find((item) => item.sts_id === sts.sts_id);
                                if (existingSts) {
                                  existingSts.sts_cnt += sts.sts_cnt;
                                } else {
                                  agg.push({ ...sts }); // Add new status
                                }
                              });
                              return agg;
                            }, []);

                      // Add the last item with the calculated totals
                      items.value.push({
                        id: items.value.length + 1, // Unique ID for the total
                        group: "All Group",
                        total_count: totalCountSum,
                        veh_arr: combinedVehArr,
                        sts_arr: aggregatedStsArr,
                      });
                }

          const newItems = items.value;

          // Retrieve existing data from storage
          return storage.get(Constants.storageValue.Key_GroupAPI)
              .then((storedGroupData) => {
                return storage.get(Constants.storageValue.key_VehicleDetails)
                  .then((storedVehDetails) => {
                    storedGroupData = storedGroupData || [];
                    storedVehDetails = storedVehDetails || [];

                    // Check if data needs to be updated
                    const isDataChanged = JSON.stringify(storedGroupData) !== JSON.stringify(newItems);

                    if (isDataChanged) {


                      return storage
                                  .set(Constants.storageValue.Key_GroupAPI, newItems)
                                  .then(async () => {

                                    const storedGroups = await storage.get(Constants.storageValue.key_GroupWithStatus) || [];

                                      const storedGroupsEvent = new Map(
                                        storedGroups.map(group => [`${group.group}-${group.groupId}`, group])
                                      );

                                     // console.log("Key_GroupAPI",storedGroups);

                                                                      // Create an updated array by iterating over arrData and merging with storedGroups if applicable.
                                const groupStatusEventItems = arrData.map(data => {
                                  const key = `${data.name}-${data.id}`;  
                                  if (storedGroupsEvent.has(key)) {
                                    // If a match is found, use the stored group but ensure it has the required structure.
                                    return {
                                      ...storedGroupsEvent.get(key),
                                    };
                                  } else {
                                    // If no match, create a new group status item with default values.
                                    return {
                                      group: data.name,
                                      groupId: data.id,
                                      status: 1, // Initial status set to 1
                                      checked: true
                                    };
                                  }

                                });

                                const storedGroups_map = await storage.get(Constants.storageValue.key_Map_GroupWithStatus) || [];

                                const storedGroupsMap = new Map(
                                  storedGroups_map.map(group => [`${group.group}-${group.groupId}`, group])
                                );

                                const groupStatusMapItems = arrData.map(data => {
                                  const key = `${data.name}-${data.id}`;                                  
                                  if (storedGroupsMap.has(key)) {
                                    // If a match is found, use the stored group but ensure it has the required structure.
                                    return {
                                      ...storedGroupsMap.get(key),
                                    };
                                  } else {
                                    // If no match, create a new group status item with default values.
                                    return {
                                      group: data.name,
                                      groupId: data.id,
                                      status: 1, // Initial status set to 1
                                      checked: true
                                    };
                                  }

                                });


                                const storedGroups_fuel = await storage.get(Constants.storageValue.key_Fuel_GroupWithStatus) || [];

                                    const storedGroupsFuel = new Map(
                                      storedGroups_fuel.map(group => [`${group.group}-${group.groupId}`, group])
                                    );

                                const groupStatusFuelItems = arrData.map(data => {
                                  const key = `${data.name}-${data.id}`;                                  
                                  if (storedGroupsFuel.has(key)) {
                                    // If a match is found, use the stored group but ensure it has the required structure.
                                    return {
                                      ...storedGroupsFuel.get(key),
                                    };
                                  } else {
                                    // If no match, create a new group status item with default values.
                                    return {
                                      group: data.name,
                                      groupId: data.id,
                                      status: 1, // Initial status set to 1
                                      checked: true
                                    };
                                  }

                                });


                             //   console.log("groupStatusEventItems",groupStatusEventItems);

                          // Store the group and status data
                          return storage.set(Constants.storageValue.key_GroupWithStatus, groupStatusEventItems)
                            .then(() => storage.set(Constants.storageValue.key_Fuel_GroupWithStatus, groupStatusFuelItems))
                            .then(() => storage.set(Constants.storageValue.key_Map_GroupWithStatus, groupStatusMapItems)) // Add this line for Map
                            .then(async () => {

                              // Create and store vehicle details data
                              const vehicleDetails = arrData.flatMap((data) =>
                                data.veh_arr.map((veh) => ({
                                  vehid: veh.veh_id,
                                  vehname: veh.veh_no,
                                  vehstatus: veh.veh_sts,
                                  vehColor: veh.sts_colr,
                                  status: 1,
                                }))
                              );


                              // Compare existing vehicle details data with the new one
                              const isVehDetailsChanged = JSON.stringify(storedVehDetails) !== JSON.stringify(vehicleDetails);

                              if (isVehDetailsChanged) {

                              const event_veh = await storage.get(Constants.storageValue.key_VehicleDetails) || [];

                                        const storedEventVeh = new Map(
                                          event_veh.map(vehicle => [`${vehicle.vehid}-${vehicle.vehname}`, vehicle])
                                        );

                                     // Create new or updated vehicle details
                                    const vehicleDetailsEvent = arrData.flatMap((data) => 
                                      data.veh_arr.map((veh) => {
                                        const key = `${veh.veh_id}-${veh.veh_no}`;
                                        if (storedEventVeh.has(key)) {
                                          // If a match is found, use the stored vehicle but ensure it has the required structure.
                                          return {
                                            ...storedEventVeh.get(key)
                                          };
                                        } else {
                                          // If no match, create a new vehicle detail with default values.
                                          return {
                                            vehid: veh.veh_id,
                                            vehname: veh.veh_no,
                                            vehstatus: veh.veh_sts,
                                            vehColor: veh.sts_colr,
                                            status: 1 // Initial status set to 1
                                          };
                                        }
                                      })
                                    );



                                        const fuel_veh = await storage.get(Constants.storageValue.key_Fuel_VehicleDetails) || [];

                                        const storedVehFuel = new Map(
                                          fuel_veh.map(vehicle => [`${vehicle.vehid}-${vehicle.vehname}`, vehicle])
                                        );

                                                                             // Create new or updated vehicle details
                                    const vehicleDetailsFuel = arrData.flatMap((data) => 
                                      data.veh_arr.map((veh) => {
                                        const key = `${veh.veh_id}-${veh.veh_no}`;
                                        if (storedVehFuel.has(key)) {
                                          // If a match is found, use the stored vehicle but ensure it has the required structure.
                                          return {
                                            ...storedVehFuel.get(key)
                                          };
                                        } else {
                                          // If no match, create a new vehicle detail with default values.
                                          return {
                                            vehid: veh.veh_id,
                                            vehname: veh.veh_no,
                                            vehstatus: veh.veh_sts,
                                            vehColor: veh.sts_colr,
                                            status: 1 // Initial status set to 1
                                          };
                                        }
                                      })
                                    );


                                return storage.set(Constants.storageValue.key_VehicleDetails, vehicleDetailsEvent)
                                  .then(() => storage.set(Constants.storageValue.key_Fuel_VehicleDetails, vehicleDetailsFuel));
                              }
                            return Promise.resolve(); // No change in vehicle details
                          });
                      });
                  }

                  return Promise.resolve(); // No change in group data
                });
            });
        }
      } else if (response.status === 401) {
        console.error('Unauthorized:', responsejson.message);
      } else {
        console.error('Empty response data');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};


async function DisplayStoredData() {
  const storedValues = await storage.get(Constants.storageValue.Key_GroupAPI);
  if (storedValues) {
   // console.log("displaydata");
    items.value = storedValues;
  }
}

const CallAPIForGroupTodayData = () => {
  const params = {
    grping: '2',
  };

  // Show loading controller
  loadingController.create({
    message: 'Loading ...',
    backdropDismiss: true // Makes the loading controller cancelable

  })
  .then(loading => {
    // Present the loading spinner
    loading.present();

    // Make the API call using the fetchData service
    return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Group, params)
      .then((response) => {
        const responsejson = response.data;

        // Check if the status is OK (200)
        if (response.status === 200) {
          const arrData = responsejson.arr_data;

          if (arrData && arrData.length > 0) {
            items.value = arrData.map((data, index) => ({
              id: index + 1, // Unique ID
              group: data.name, // Group name
              total_count: data.total_count, // Total vehicles
              veh_arr: data.veh_arr,
              sts_arr: data.sts_arr,
            }));


            if(arrData.length > 1){
              // Calculate the totals for the last item
          const totalCountSum = arrData.reduce((sum, data) => sum + data.total_count, 0);
          const combinedVehArr = arrData.flatMap((data) => data.veh_arr);
  
          
             // Calculate the aggregated sts_arr
             const aggregatedStsArr = arrData.reduce((agg, group) => {
            group.sts_arr.forEach((sts) => {
              const existingSts = agg.find((item) => item.sts_id === sts.sts_id);
              if (existingSts) {
                existingSts.sts_cnt += sts.sts_cnt;
              } else {
                agg.push({ ...sts }); // Add new status
              }
            });
            return agg;
          }, []);

          // Add the last item with the calculated totals
          items.value.push({
            id: items.value.length + 1, // Unique ID for the total
            group: "All Group",
            total_count: totalCountSum,
            veh_arr: combinedVehArr,
            sts_arr: aggregatedStsArr,
          });
        }

            const newItems = items.value;

            // Retrieve existing data from storage
            return storage.get(Constants.storageValue.Key_GroupAPI)
              .then((storedGroupData) => {
                return storage.get(Constants.storageValue.key_VehicleDetails)
                  .then((storedVehDetails) => {
                    storedGroupData = storedGroupData || [];
                    storedVehDetails = storedVehDetails || [];

                    // Check if data needs to be updated
                    const isDataChanged = JSON.stringify(storedGroupData) !== JSON.stringify(newItems);

                    if (isDataChanged) {


                      return storage
                                  .set(Constants.storageValue.Key_GroupAPI, newItems)
                                  .then(async () => {

                                    const storedGroups = await storage.get(Constants.storageValue.key_GroupWithStatus) || [];

                                      const storedGroupsEvent = new Map(
                                        storedGroups.map(group => [`${group.group}-${group.groupId}`, group])
                                      );

                                                                      // Create an updated array by iterating over arrData and merging with storedGroups if applicable.
                                const groupStatusEventItems = arrData.map(data => {
                                  const key = `${data.name}-${data.id}`;  
                                  if (storedGroupsEvent.has(key)) {
                                    // If a match is found, use the stored group but ensure it has the required structure.
                                    return {
                                      ...storedGroupsEvent.get(key),
                                    };
                                  } else {
                                    // If no match, create a new group status item with default values.
                                    return {
                                      group: data.name,
                                      groupId: data.id,
                                      status: 1, // Initial status set to 1
                                      checked: true
                                    };
                                  }

                                });

                                const storedGroups_map = await storage.get(Constants.storageValue.key_Map_GroupWithStatus) || [];

                                const storedGroupsMap = new Map(
                                  storedGroups_map.map(group => [`${group.group}-${group.groupId}`, group])
                                );

                                const groupStatusMapItems = arrData.map(data => {
                                  const key = `${data.name}-${data.id}`;                                  
                                  if (storedGroupsMap.has(key)) {
                                    // If a match is found, use the stored group but ensure it has the required structure.
                                    return {
                                      ...storedGroupsMap.get(key),
                                    };
                                  } else {
                                    // If no match, create a new group status item with default values.
                                    return {
                                      group: data.name,
                                      groupId: data.id,
                                      status: 1, // Initial status set to 1
                                      checked: true
                                    };
                                  }

                                });


                                const storedGroups_fuel = await storage.get(Constants.storageValue.key_Fuel_GroupWithStatus) || [];

                                    const storedGroupsFuel = new Map(
                                      storedGroups_fuel.map(group => [`${group.group}-${group.groupId}`, group])
                                    );

                                const groupStatusFuelItems = arrData.map(data => {
                                  const key = `${data.name}-${data.id}`;                                  
                                  if (storedGroupsFuel.has(key)) {
                                    // If a match is found, use the stored group but ensure it has the required structure.
                                    return {
                                      ...storedGroupsFuel.get(key),
                                    };
                                  } else {
                                    // If no match, create a new group status item with default values.
                                    return {
                                      group: data.name,
                                      groupId: data.id,
                                      status: 1, // Initial status set to 1
                                      checked: true
                                    };
                                  }

                                });

                          // Store the group and status data
                          return storage.set(Constants.storageValue.key_GroupWithStatus, groupStatusEventItems)
                            .then(() => storage.set(Constants.storageValue.key_Fuel_GroupWithStatus, groupStatusFuelItems))
                            .then(() => storage.set(Constants.storageValue.key_Map_GroupWithStatus, groupStatusMapItems)) // Add this line for Map
                            .then(async () => {

                              // Create and store vehicle details data
                              const vehicleDetails = arrData.flatMap((data) =>
                                data.veh_arr.map((veh) => ({
                                  vehid: veh.veh_id,
                                  vehname: veh.veh_no,
                                  vehstatus: veh.veh_sts,
                                  vehColor: veh.sts_colr,
                                  status: 1,
                                }))
                              );


                              // Compare existing vehicle details data with the new one
                              const isVehDetailsChanged = JSON.stringify(storedVehDetails) !== JSON.stringify(vehicleDetails);

                              if (isVehDetailsChanged) {

                              const event_veh = await storage.get(Constants.storageValue.key_VehicleDetails) || [];

                                        const storedEventVeh = new Map(
                                          event_veh.map(vehicle => [`${vehicle.vehid}-${vehicle.vehname}`, vehicle])
                                        );

                                     // Create new or updated vehicle details
                                    const vehicleDetailsEvent = arrData.flatMap((data) => 
                                      data.veh_arr.map((veh) => {
                                        const key = `${veh.veh_id}-${veh.veh_no}`;
                                        if (storedEventVeh.has(key)) {
                                          // If a match is found, use the stored vehicle but ensure it has the required structure.
                                          return {
                                            ...storedEventVeh.get(key)
                                          };
                                        } else {
                                          // If no match, create a new vehicle detail with default values.
                                          return {
                                            vehid: veh.veh_id,
                                            vehname: veh.veh_no,
                                            vehstatus: veh.veh_sts,
                                            vehColor: veh.sts_colr,
                                            status: 1 // Initial status set to 1
                                          };
                                        }
                                      })
                                    );



                                        const fuel_veh = await storage.get(Constants.storageValue.key_Fuel_VehicleDetails) || [];

                                        const storedVehFuel = new Map(
                                          fuel_veh.map(vehicle => [`${vehicle.vehid}-${vehicle.vehname}`, vehicle])
                                        );

                                                                             // Create new or updated vehicle details
                                    const vehicleDetailsFuel = arrData.flatMap((data) => 
                                      data.veh_arr.map((veh) => {
                                        const key = `${veh.veh_id}-${veh.veh_no}`;
                                        if (storedVehFuel.has(key)) {
                                          // If a match is found, use the stored vehicle but ensure it has the required structure.
                                          return {
                                            ...storedVehFuel.get(key)
                                          };
                                        } else {
                                          // If no match, create a new vehicle detail with default values.
                                          return {
                                            vehid: veh.veh_id,
                                            vehname: veh.veh_no,
                                            vehstatus: veh.veh_sts,
                                            vehColor: veh.sts_colr,
                                            status: 1 // Initial status set to 1
                                          };
                                        }
                                      })
                                    );


                                return storage.set(Constants.storageValue.key_VehicleDetails, vehicleDetailsEvent)
                                  .then(() => storage.set(Constants.storageValue.key_Fuel_VehicleDetails, vehicleDetailsFuel));
                              }

                              return Promise.resolve(); // No change in vehicle details
                            });
                        });
                    }

                    return Promise.resolve(); // No change in group data
                  });
              });
          }
        } else if (response.status === 401) {
          console.error('Unauthorized:', responsejson.message);
        } else {
          console.error('Empty response data');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        // Dismiss the loading spinner after the API call finishes
        loading.dismiss();
      });
  })
  .catch(error => {
    console.error('Error creating loading:', error);
  });
};


export const intervalRunning = ref(false);

export const intervalCallback30s = async () => {
  const currentRoute = router.currentRoute.value;

  console.log('Interval callback triggered For Group! '+currentRoute.name);

  const isLoggedIn = await storage.get('IsLoginAlready');
      if (isLoggedIn) {

        if (currentRoute.name === 'group') {
          console.log('Group page is visible');
          const status = await Network.getStatus();
          if (status.connected) {
            DisplayStoredData();
            console.log("displaydata1");
            CallAPIForGroupTodayData();
          } else {
            showToast();
            DisplayStoredData();
          }
          return 'Group';
        } else if (currentRoute.name === 'map'){

        }
        else {
          console.log('Other pages are visible');
          const status = await Network.getStatus();
          if (status.connected) {
            CallOnlyAPI();
          } else {
            showToast();
          }
          return 'Other';
        }
      }else{
        stopInterval();

        
      }
};

export default {
  name: 'Home',
  components: {
    IonPage,
    IonContent,
    IonList,
    IonSearchbar,
    CustomItem,
  },

  setup() {
    const searchQuery = ref('');
    const filteredItems = computed(() =>
      items.value
      .sort((a, b) => {
      // Check if either is "All Group"
      if (a.group === "All Group" && b.group !== "All Group") return 1;  // push a to bottom
      if (b.group === "All Group" && a.group !== "All Group") return -1; // push b to bottom

      // Normal alphabetical sort
      if (a.group < b.group) return -1;
      if (a.group > b.group) return 1;
      return 0;
    })
    .filter((item) =>
        item.group.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const checkNetwork = async () => {
      const status = await Network.getStatus();
      if (status.connected) {
        DisplayStoredData();
        CallAPIForGroupTodayData();
      } else {
        showToast();
        DisplayStoredData();
        console.error('No internet connection');
      }
    };

    onMounted(() => {
      useBackButton(9999, async () => {
        const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');
            });
      checkNetwork();
    });

    onUnmounted(() => {
      //stopInterval();
    });

    return {
      searchQuery,
      filteredItems,
    };
  },

  methods: {
    handleItemClick(item) {
      this.navigateToPage(item);
    },
    navigateToPage(ItemData) {
     // const itemDataString = JSON.stringify(ItemData);
      router.push({ name: 'DetailVehicle', params: { group: ItemData.group } });
    },
  },
};
</script>

<style>
.no-data {
  text-align: center;
  color: var(--ion-color-medium);
  margin-top: 20px;
  font-size: 16px;
}
</style>
