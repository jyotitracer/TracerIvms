<template>
  <ion-page>
   
    <ion-content>
      <div ref="mapContainer" id="map" style="height: 100%;"></div>

      <!-- Pass the vehicleObject directly to InfoBox, and only display it if vehicleObject is present -->
      <InfoBox v-if="vehicleObject" :vehicleData="vehicleObject" />

          <ion-fab slot="fixed" vertical="bottom" horizontal="start" style="bottom: 30px;">
            <ion-fab-button ref="fabButton" @click="toggleFab">
          <ion-icon :icon="fabIcon" style="color: white;"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <!-- Each FAB button with icon on the left and label on the right -->
          <div class="fab-item" @click="navigateToPage(1)">
            <img src="\ic_btn_search_landmark.png" class="fab-image" />
            <ion-label class="fab-label">Get direction to landmark</ion-label>
          </div>

          <div class="fab-item" @click="navigateToPage(2)">
            <img src="\ic_btn_search_closest_vehicle.png"  class="fab-image" />
            <ion-label class="fab-label">Get direction to another vehicle</ion-label>
          </div>

          <div class="fab-item" @click="navigateToPage(3)">
            <img src="\filter_layer.png"  class="fab-image" />
            <ion-label class="fab-label">Change Map</ion-label>
          </div>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import InfoBox from '@/components/InfoBoxGroupMap.vue';
import InfowindowgroupMap from '@/components/InfoWindowGroupMarker.vue';
import { showToastMessage } from '@/services/toast'; 
import { loadGoogleMaps } from '@/services/googleMapsLoader';
import { oldPath } from '@/services/routeTracker';

import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonLabel,
  onIonViewWillEnter  // Import necessary lifecycle hooks from Ionic
} from '@ionic/vue';
import { defineComponent, onMounted } from 'vue';
import { ref, onUnmounted } from 'vue';
import Constants from '@/common/constants';
import axios from 'axios';
import { useRouter ,useRoute} from 'vue-router';
import { createApp } from 'vue';
import storage from '@/services/storagefile';


import {
  chevronUpCircle,
  colorPalette,
  globe,
} from 'ionicons/icons';
import { onBeforeRouteLeave } from 'vue-router';
import { Loader } from "@googlemaps/js-api-loader";
import { add, close } from 'ionicons/icons'; // Import your icons
import { watch } from 'vue';
import { loadingController } from '@ionic/vue';
import { App } from '@capacitor/app';




export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    InfoBox,
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
    IonLabel,
    InfowindowgroupMap
  },
  props: {
    vehicleId: {
      type: String,
      required: true
    },
    vehicleName: {
      type: String,
      required: true
    },
    groupname:{
        type: String,
    }

  },
  setup(props) {

    const route = useRoute();
    const router = useRouter();


    const isFabOpen = ref(false);
    const fabIcon = ref(add);
    
    const intervalId=ref('30000');
    let vehicle_id: any;
    const fabButton = ref(null);


      // storage.set('Dir_lat', '');
      // storage.set('Dir_lon', '');
      // storage.set('Dir_vehName', '');
      // storage.set('landmark_lat', '');
      // storage.set('landmark_lng', '');

    const mapRef = ref<google.maps.Map | null>(null);
    let newMap: google.maps.Map | null = null;

    const vehicleObject = ref(null);
    const mapContainer = ref(null);
    const directionsServiceUrl = `https://maps.googleapis.com/maps/api/directions/json`;

    const polylineRef = ref<google.maps.Polyline | null>(null);



const getDirections = async (destLat: number, destLon: number) => {

  // if (!mapRef.value || !vehicleObject.value) {
  //   console.error('Map or vehicle object is not initialized');
  //   return;
  // }




  // ✅ Clear existing polyline
  if (polylineRef.value) {
    polylineRef.value.setMap(null);
    polylineRef.value = null;
  }

 // ✅ Ensure both origin & destination are numbers
  const origin = { 
    lat: parseFloat(vehicleObject.value.lat), 
    lng: parseFloat(vehicleObject.value.lon) 
  };
  const destination = { 
    lat: parseFloat(destLat), 
    lng: parseFloat(destLon) 
  };

  // console.log('Getting directions...',origin.lat+" "+origin.lng+"desti= "+destination.lat+" "+destination.lng);

  const loading = await loadingController.create({
    message: 'Loading directions...',
    spinner: 'circles',
  });
  await loading.present();

  try {
    const directionsService = new google.maps.DirectionsService();
    const result = await directionsService.route({
       origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    console.log("DirecttionResult",result.routes);

    if (result.routes && result.routes.length > 0) {
      const path = result.routes[0].overview_path;
      polylineRef.value = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 5,
      });

      polylineRef.value.setMap(mapRef.value);
      moveCameraToLocation(origin.lat, origin.lng, 14);
    } else {
      showToastMessage("No route found");
      console.warn('No routes found');
    }
  } catch (error) {
    console.error('Error fetching directions:', error);
  } finally {
    await loading.dismiss();
  }
};


   
    const moveCameraToLocation = async (lat: number, lon: number, zoomno: number) => {
      await loadGoogleMaps();
      if (mapRef.value) {
        mapRef.value?.setCenter(new google.maps.LatLng(lat, lon));
        mapRef.value?.setZoom(zoomno);
        console.log("searchland",lat+" "+lon);

      } else {
        console.error('Map not initialized');
      }
    };


    const  toggleFab = () => {
      isFabOpen.value = !isFabOpen.value;
      fabIcon.value = isFabOpen.value ? close : add; // Update icon based on FAB state
    };

const RunData = async (vehicleObject: any) => {
  // ✅ Wait for Google Maps to load

   await loadGoogleMaps();
  
 
                
                const initialLat = parseFloat(vehicleObject.lat);
                const initialLong = parseFloat(vehicleObject.lon);
                const initialZoom = 16;
                const initialCenter = { lat: initialLat, lng: initialLong };
                const storedMapType =  await storage.get('groupmapType') || 'roadmap';
 



  newMap = new google.maps.Map(mapContainer.value, {
                    center: initialCenter,
                    zoom: 16,
                    mapTypeId: storedMapType,
                    zoomControl: true,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                  });

                  mapRef.value = newMap;

            
                            // Create custom controls for navigator and map icons
                            const controlContainer = document.createElement('div');
                          controlContainer.style.position = 'absolute';
                          controlContainer.style.right = '20px';
                          controlContainer.style.bottom = '100px'; // Adjust to position it below the zoom controls
                          controlContainer.style.display = 'flex';
                          controlContainer.style.gap = '10px'; // Add spacing between the icons
                          controlContainer.style.alignItems = 'center';
                          controlContainer.style.background = 'white'; // Optional: to match the background of the buttons
                          controlContainer.style.borderRadius = '5px'; // Optional: rounded corners
                          controlContainer.style.padding = '5px'; // Optional: add some padding

                          // Add the map icon
                          const mapControlDiv = document.createElement('div');
                          mapControlDiv.innerHTML = `
                            <button style="background: transparent; border: none;">
                              <img src="/pin.png" alt="Map" width="40" height="40">
                            </button>`;
                          mapControlDiv.style.display = 'none'; // Initially hidden

                          // Add the navigator icon
                          const navControlDiv = document.createElement('div');
                          navControlDiv.innerHTML = `
                            <button style="background: transparent; border: none;">
                              <img src="/navigation.png" alt="Navigator" width="40" height="40">
                            </button>`;
                          navControlDiv.style.display = 'none'; // Initially hidden

                          // Append the icons to the container
                          controlContainer.appendChild(navControlDiv);
                          controlContainer.appendChild(mapControlDiv);

                          // Append the container to the map controls
                          newMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlContainer);




                const markerColor = vehicleObject.sts_colr || '#FF0000'; // Default to red if no color is provided

                // Create a custom marker icon
                const markerIcon = {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,  // Use circle as the marker shape
                  fillColor: markerColor,               // Use the vehicle status color
                  fillOpacity: 1,
                  strokeWeight: 0,
                  scale: 5,                             // Reduce the size by adjusting the scale (e.g., 5)
                };


                const marker = new google.maps.Marker ({
                  position: initialCenter,
                  map: newMap,
                  icon: markerIcon,  // Set the custom icon

                });

                        

                            const infoWindow = new google.maps.InfoWindow();

                    // Create a new div to mount your Vue component
                    const infoWindowContainer = document.createElement('div');

                    // Use Vue's createApp to mount the InfoBox component inside the div
                    const app = createApp(InfowindowgroupMap, { vehicleData: vehicleObject });
                    app.mount(infoWindowContainer);

                    // Set the infoWindow's content to the container with the Vue component
                    infoWindow.setContent(infoWindowContainer);


                // Add click event to the marker to show info window
                marker.addListener('click', () => {
                         
                      // Show the custom controls when the marker is clicked
                                  navControlDiv.style.display = 'block';
                                  mapControlDiv.style.display = 'block';

                                  // Log latitude and longitude
                                  const lat = marker.getPosition().lat();
                                  const lng = marker.getPosition().lng();
                                  console.log(`Latitude: ${lat}, Longitude: ${lng}`);

                                  // Add click event listeners to controls to perform desired actions
                                  navControlDiv.addEventListener('click', () => {
                                    window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                                  });

                                  mapControlDiv.addEventListener('click', () => {
                                    window.location.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                                  });

                      infoWindow.open({
                            anchor: marker,
                            map: newMap,
                          
                          });

                   });



      
      
    };

      
    // FAB button click handling
    const navigateToPage = async (pageName: number) => {

  
      if (fabButton.value) {
        fabButton.value.$el?.click(); // Access the native element and trigger a click
      }


              

        // Clear polyline

      if (polylineRef.value) {
        polylineRef.value.setMap(null); // Remove the existing polyline from the map
        polylineRef.value = null; // Clear the reference
      }

      if (pageName === 1) {
        // Navigate to search landmark page
        router.push('/searchland');
      } else if (pageName === 2) {
        // Navigate to another vehicle direction page
        router.push('/groupsearchvehiclemap');
      } else if (pageName === 3) {
        // Navigate to map layer change page
        router.push('/groupmaplayer');
      }

       // Close the FAB list and toggle the icon to 'add' when navigating
          isFabOpen.value = false;
          fabIcon.value = add;
    };


          // Automatically close FAB on any route change
          router.beforeEach((to, from, next) => {
             // Close the FAB list and toggle the icon to 'add' when navigating
         
            oldPath.value = from.fullPath; // Store the previous path

    
          next(); // Proceed to the next route
        });

        
   
    onIonViewWillEnter(async () => {
  
 const vehicleData =await storage.get('selectedVeh');


      if(vehicleData)
    {
      const VehicleValue =JSON.parse(vehicleData);
            vehicle_id=VehicleValue.veh_id;

        const storedValues = await storage.get(Constants.storageValue.Key_GroupAPI);

              console.log("displayveharra",storedValues);

              // 3️⃣ Find the group data matching the current group name
          const matchingGroups = storedValues.filter(
            (grouparray) => grouparray.group === 'All Group'
          );
          let allGroupVehicles;

          if(matchingGroups[0])
          {
                     allGroupVehicles = matchingGroups[0].veh_arr || [];
          }else{
               allGroupVehicles = storedValues[0].veh_arr || [];
          }
      
          // 4️⃣ Extract the group's vehicles


          // 5️⃣ Filter only vehicles whose veh_id exists in favorites
        const filteredVehicles = allGroupVehicles.filter(vehicle =>
          VehicleValue.veh_ID.includes(vehicle.veh_ID)
        );

        console.log("filteredVehicles",filteredVehicles[0]);

      vehicleObject.value=filteredVehicles[0];

      await RunData(vehicleObject.value);
    }

       intervalId.value = setInterval( async () => {
               const storedValues = await storage.get(Constants.storageValue.Key_GroupAPI);

                                  
                                      const matchingGroups = storedValues.filter(groupPage => groupPage.group === props.groupname);
                                      if (matchingGroups.length > 0) {

                                        console.log('Parsed storedValues:', matchingGroups);

                                          const matchingVehdata = matchingGroups[0].veh_arr.filter(vehobject => vehobject.veh_id === vehicle_id);
                                          
                                           await storage.set('selectedVeh', JSON.stringify(matchingVehdata[0]));


                                          vehicleObject.value = matchingVehdata.length > 0 ? matchingVehdata[0] : null;

                                          if (vehicleObject.value) {
                                              RunData(vehicleObject.value);
                                          }
                                      }
                                   
              },60000); // 30000 ms = 60 seconds


    
              // ✅ Wait for Google Maps API to load
               // await loadGoogleMaps();

                   

                console.log('Old path:', oldPath.value);

              if (oldPath.value === '/groupsearchvehiclemap') {

                    const dirLat = await storage.get('Dir_lat') ;
                    const dirLon = await storage.get('Dir_lon') ;


                      if (!dirLat || !dirLon) {
                        console.warn('Invalid direction coordinates');
                      } else {
                        getDirections(dirLat, dirLon);
                      }

                  }
                
                if (oldPath.value === '/searchland') {
                 
                      const land_dirLat= await storage.get('landmark_lat');
                    const land_dirLng=await storage.get('landmark_lng');
                   
                    console.log('searchland:', land_dirLat+" "+land_dirLng);


                      moveCameraToLocation(parseFloat(land_dirLat), parseFloat(land_dirLng),10);
                    
 
                } 
                
                 if (oldPath.value === '/groupmaplayer') {
                 
                        if(mapRef.value)
                      {
                        mapRef.value?.setMapTypeId(await storage.get('groupmapType') || 'roadmap');
                      }else{
                        console.log("Failed to map ref")
                      }

                }

    });


    // Clean up on component unmount
    onUnmounted(() => {
      if (mapRef.value) {
        mapRef.value = null;
      }
      clearInterval(intervalId.value)
    
    });


    return {
       vehicleId: props.vehicleId,
      vehicleName: props.vehicleName,
      groupname:props.groupname,
      mapContainer,
      vehicleObject,
      chevronUpCircle,
      colorPalette,
      globe,
      navigateToPage,
      getDirections,
      moveCameraToLocation,
      fabButton,
      isFabOpen,toggleFab,
      fabIcon,
      intervalId,
      RunData,
    };
  },






});
</script>

<style>
.fab-image{
  height: 32px;
  width: 32px;
}

.fab-item {

  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-right: 40px; /* Add padding to the right to avoid text being cut off */
  overflow: hidden; /* Prevent overflow issues */
}

.fab-label {
  margin-left: 5px;

  font-size: 14px;
  color: white;
  background-color:rgb(45, 44, 44);
  padding: 4px 4px 4px 4px;
  border-radius: 4px;
  white-space: nowrap;       /* Prevent the label from breaking into a new line */
  /* Remove or increase max-width if needed */
  max-width: 250px;          /* Increase max-width to fit longer text */
  overflow: visible;         /* Allow text to extend */
  text-overflow: initial;    /* Remove ellipsis */
}


.fab-icon {
  font-size: 24px;
  color: red;
}

/* Reduce the size of the close button for the InfoWindow */
.gm-ui-hover-effect {
  width: 30px !important;    /* Adjust the width */
  height: 30px !important;   /* Adjust the height */
  right: 5px !important;     /* Adjust the position if needed */
  top: 5px !important;       /* Adjust the position if needed */
  
}
.gm-ui-hover-effect > img {
  width: 100% !important;    /* Make sure the image inside the button scales accordingly */
  height: 100% !important;
}


</style>
