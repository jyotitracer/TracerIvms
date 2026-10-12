<template>
  <ion-page>
   
<ion-content fullscreen class="no-safe-bottom">
      <div ref="mapContainer" id="map" style="height: 100%;"></div>

      <!-- Pass the vehicleObject directly to InfoBox, and only display it if vehicleObject is present -->
      <InfoBox v-if="vehicleObject" :vehicleData="vehicleObject" />

        <!-- FAB BUTTON -->
<ion-fab slot="fixed" vertical="bottom" horizontal="start" style="bottom: 30px;">
  <ion-fab-button @click="toggleFab">
    <ion-icon :icon="fabIcon" style="color: white;"></ion-icon>
  </ion-fab-button>
</ion-fab>

<!-- 🔥 CUSTOM POPUP MENU -->
<div class="fab-popup" :class="{ open: isFabOpen }">

  <div class="menu-item active" @click="navigateToPage(1)">
          <ion-icon :icon="gitBranchOutline"></ion-icon>
    <span>Get direction to landmark</span>
  </div>

  <div class="menu-item active" @click="navigateToPage(2)">
          <ion-icon :icon="carOutline"></ion-icon>
    <span>Get direction to another vehicle</span>
  </div>

  <div class="menu-item active" @click="navigateToPage(3)">
          <ion-icon :icon="navigateCircleOutline"></ion-icon>
    <span>Change Map</span>
  </div>

</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import InfoBox from '@/components/InfoBoxGroupMap.vue';
import InfowindowgroupMap from '@/components/InfoWindowGroupMarker.vue';
import { showToastMessage } from '@/services/toast'; 
import { loadGoogleMaps } from '@/services/googleMapsLoader';
import { oldPath } from '@/services/routeTracker';
import { fetchData } from '@/services/ApiService';

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
  gitBranchOutline,
  globe,carOutline,
  navigateCircleOutline,
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
    let isFirstTimeDataCall = true;

    
    //  const IsFuelEnable = ref(1);

    const route = useRoute();
    const router = useRouter();


    const isFabOpen = ref(false);
    const fabIcon = ref(add);
    
    const intervalId=ref('30000');
    let vehicle_id: any;
    const fabButton = ref(null);

const markerRef = ref<google.maps.Marker | null>(null);
const controlContainerRef = ref<HTMLDivElement | null>(null);



      // storage.set('Dir_lat', '');
      // storage.set('Dir_lon', '');
      // storage.set('Dir_vehName', '');
      // storage.set('landmark_lat', '');
      // storage.set('landmark_lng', '');

    const mapRef = ref<google.maps.Map | null>(null);
    let newMap: google.maps.Map | null = null;

    const vehicleObject = ref(null);
    const mapContainer = ref(null);
    const polylineRef = ref<google.maps.Polyline | null>(null);

const getDirections = async (destLat: number | string, destLon: number | string) => {
  if (!mapRef.value || !vehicleObject.value) {
    console.error('Map or vehicle object is not initialized');
    return;
  }

  // ✅ Clear existing polyline
  if (polylineRef.value) {
    polylineRef.value.setMap(null);
    polylineRef.value = null;
  }

  // ✅ Ensure both origin & destination are numbers
  const origin = { 
    lat: parseFloat(vehicleObject.value.lat), 
    lon: parseFloat(vehicleObject.value.lon) 
  };
  const destination = { 
    lat: parseFloat(destLat as string), 
    lon: parseFloat(destLon as string) 
  };

  if (isNaN(origin.lat) || isNaN(origin.lon) || isNaN(destination.lat) || isNaN(destination.lon)) {
    console.error('Invalid coordinates for directions:', { origin, destination });
    showToastMessage('Invalid coordinates for directions');
    return;
  }

  const loading = await loadingController.create({
    message: 'Loading directions...',
    spinner: 'circles',
  });

  try {
    if (isFirstTimeDataCall) {
      await loading.present();
    }

    // OSRM coordinates: longitude,latitude
    const coords = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No OSRM route found');
    }

    const coordinates = data.routes[0].geometry.coordinates;
    const path = coordinates.map(
      ([lng, lat]: [number, number]) => new google.maps.LatLng(lat, lng)
    );

    polylineRef.value = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 5,
    });

    polylineRef.value.setMap(mapRef.value);
    moveCameraToLocation(origin.lat, origin.lon, 14);
  } catch (error) {
    console.error('Error fetching directions via OSRM, falling back to direct line:', error);

    // Fallback: direct line between origin and destination
    const directPath = [
      new google.maps.LatLng(origin.lat, origin.lon),
      new google.maps.LatLng(destination.lat, destination.lon)
    ];

    polylineRef.value = new google.maps.Polyline({
      path: directPath,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 5,
    });

    polylineRef.value.setMap(mapRef.value);
    moveCameraToLocation(origin.lat, origin.lon, 14);
  } finally {
    if (isFirstTimeDataCall) {
      await loading.dismiss();
    }
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
  const storedMapType = await storage.get('groupmapType') || 'roadmap';

  // ✅ CREATE MAP ONLY FIRST TIME
  if (!mapRef.value) {

    newMap = new google.maps.Map(mapContainer.value, {
      center: initialCenter,
      zoom: initialZoom,
      mapTypeId: storedMapType,
      zoomControl: true,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });

    mapRef.value = newMap;

  } else {

    // ✅ Only move camera on updates
    mapRef.value.setCenter(initialCenter);
  }

  const markerColor = vehicleObject.sts_colr || '#FF0000';

  const markerIcon = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    fillColor: markerColor,
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 5,
  };

  // // ✅ Remove old marker
  // if (markerRef.value) {
  //   markerRef.value.setMap(null);
  //   markerRef.value = null;
  // }

  // // ✅ Create new marker
  // markerRef.value = new google.maps.Marker({
  //   position: initialCenter,
  //   map: mapRef.value,
  //   icon: markerIcon,
  // });


  // ✅ CREATE MARKER ONLY FIRST TIME
if (!markerRef.value) {

  markerRef.value = new google.maps.Marker({
    position: initialCenter,
    map: mapRef.value,
    icon: markerIcon,
  });


} else {

  markerRef.value.setPosition(initialCenter);

  markerRef.value.setIcon({
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    fillColor: markerColor,
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 5,
    rotation: vehicleObject.angle || 0
  });

}


  // ✅ CREATE CONTROL CONTAINER ONLY ONCE
  if (!controlContainerRef.value) {

    const controlContainer = document.createElement('div');

    controlContainer.style.position = 'absolute';
    controlContainer.style.right = '20px';
    controlContainer.style.bottom = '100px';
    controlContainer.style.display = 'flex';
    controlContainer.style.gap = '10px';
    controlContainer.style.alignItems = 'center';
    controlContainer.style.background = 'white';
    controlContainer.style.borderRadius = '5px';
    controlContainer.style.padding = '5px';

    controlContainerRef.value = controlContainer;

    // ✅ Add container ONLY ONCE
    mapRef.value.controls[
      google.maps.ControlPosition.RIGHT_BOTTOM
    ].push(controlContainerRef.value);
  }

  // ✅ CLEAR OLD ICONS BEFORE ADDING NEW ONES
  controlContainerRef.value.innerHTML = '';

  // ✅ MAP ICON
  const mapControlDiv = document.createElement('div');

  mapControlDiv.innerHTML = `
    <button style="background: transparent; border: none;">
      <img src="/pin.png" alt="Map" width="40" height="40">
    </button>
  `;

  mapControlDiv.style.display = 'none';

  // ✅ NAVIGATION ICON
  const navControlDiv = document.createElement('div');

  navControlDiv.innerHTML = `
    <button style="background: transparent; border: none;">
      <img src="/navigation.png" alt="Navigator" width="40" height="40">
    </button>
  `;

  navControlDiv.style.display = 'none';

  // ✅ APPEND ONLY ONCE
  controlContainerRef.value.appendChild(navControlDiv);
  controlContainerRef.value.appendChild(mapControlDiv);

  // ✅ INFO WINDOW
  const infoWindow = new google.maps.InfoWindow();

  // ✅ Vue component container
  const infoWindowContainer = document.createElement('div');

  const app = createApp(InfowindowgroupMap, {
    vehicleData: vehicleObject
  });

  app.mount(infoWindowContainer);

  infoWindow.setContent(infoWindowContainer);

  // ✅ MARKER CLICK
  markerRef.value.addListener('click', () => {

    // ✅ SHOW CONTROLS
    navControlDiv.style.display = 'block';
    mapControlDiv.style.display = 'block';

    const lat = markerRef.value.getPosition().lat();
    const lng = markerRef.value.getPosition().lng();

    console.log(`Latitude: ${lat}, Longitude: ${lng}`);

    // ✅ REMOVE OLD EVENTS
    navControlDiv.replaceWith(navControlDiv.cloneNode(true));
    mapControlDiv.replaceWith(mapControlDiv.cloneNode(true));

    // ✅ GET NEW REFERENCES
    const newNavControlDiv = controlContainerRef.value.children[0];
    const newMapControlDiv = controlContainerRef.value.children[1];

    // ✅ NAVIGATION CLICK
    newNavControlDiv.addEventListener('click', () => {
      window.location.href =
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    });

    // ✅ MAP CLICK
    newMapControlDiv.addEventListener('click', () => {
      window.location.href =
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    });

    // ✅ OPEN INFO WINDOW
    infoWindow.open({
      anchor: markerRef.value,
      map: mapRef.value,
    });

  });

};
// const RunData = async (vehicleObject: any) => {
//   // ✅ Wait for Google Maps to load

//    await loadGoogleMaps();
  
 


//                 const initialLat = parseFloat(vehicleObject.lat);
//                 const initialLong = parseFloat(vehicleObject.lon);
//                 const initialZoom = 16;
//                 const initialCenter = { lat: initialLat, lng: initialLong };
//                 const storedMapType =  await storage.get('groupmapType') || 'roadmap';
 

//  // ✅ CREATE MAP ONLY FIRST TIME
//   if (!mapRef.value) {

//     newMap = new google.maps.Map(mapContainer.value, {
//       center: initialCenter,
//       zoom: 16,
//       mapTypeId: 'roadmap',
//       zoomControl: true,
//       mapTypeControl: false,
//       fullscreenControl: false,
//       streetViewControl: false,
//     });

//     mapRef.value = newMap;

//   } else {
//     // ✅ Only move camera on updates
//     mapRef.value.setCenter(initialCenter);
//   }

// const markerColor = vehicleObject.sts_colr || '#FF0000';

// const markerIcon = {
//   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
//   fillColor: markerColor,
//   fillOpacity: 1,
//   strokeWeight: 0,
//   scale: 5,
// };

// // ✅ Remove old marker
// if (markerRef.value) {
//   markerRef.value.setMap(null);
//   markerRef.value = null;
// }

// // ✅ Create new marker
// markerRef.value = new google.maps.Marker({
//   position: initialCenter,
//   map: mapRef.value,
//   icon: markerIcon,
// });



//             if (!controlContainerRef.value) {

//                             // Create custom controls for navigator and map icons
//                             const controlContainer = document.createElement('div');
//                           controlContainer.style.position = 'absolute';
//                           controlContainer.style.right = '20px';
//                           controlContainer.style.bottom = '100px'; // Adjust to position it below the zoom controls
//                           controlContainer.style.display = 'flex';
//                           controlContainer.style.gap = '10px'; // Add spacing between the icons
//                           controlContainer.style.alignItems = 'center';
//                           controlContainer.style.background = 'white'; // Optional: to match the background of the buttons
//                           controlContainer.style.borderRadius = '5px'; // Optional: rounded corners
//                           controlContainer.style.padding = '5px'; // Optional: add some padding

                         
//                         controlContainerRef.value = controlContainer;
//             }

//                  // Add the map icon
//                           const mapControlDiv = document.createElement('div');
//                           mapControlDiv.innerHTML = `
//                             <button style="background: transparent; border: none;">
//                               <img src="/pin.png" alt="Map" width="40" height="40">
//                             </button>`;
//                           mapControlDiv.style.display = 'none'; // Initially hidden

                         
//                          // Add the navigator icon
//                           const navControlDiv = document.createElement('div');
//                           navControlDiv.innerHTML = `
//                             <button style="background: transparent; border: none;">
//                               <img src="/navigation.png" alt="Navigator" width="40" height="40">
//                             </button>`;
//                           navControlDiv.style.display = 'none'; // Initially hidden

//                           // Append the icons to the container
//                           controlContainerRef.value.appendChild(navControlDiv);
//                           controlContainerRef.value.appendChild(mapControlDiv);

//                           // Append the container to the map controls
//                           newMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlContainerRef.value);


//                             const infoWindow = new google.maps.InfoWindow();

//                     // Create a new div to mount your Vue component
//                     const infoWindowContainer = document.createElement('div');

//                     // Use Vue's createApp to mount the InfoBox component inside the div
//                     const app = createApp(InfowindowgroupMap, { vehicleData: vehicleObject });
//                     app.mount(infoWindowContainer);

//                     // Set the infoWindow's content to the container with the Vue component
//                     infoWindow.setContent(infoWindowContainer);

// let navigationControl: { remove: () => void; } | null = null;

//                 // Add click event to the marker to show info window
//                 markerRef.value.addListener('click', () => {

//                    // REMOVE OLD NAVIGATION CONTROL
//   if (navigationControl) {
//     navigationControl.remove();
//     navigationControl = null;
//   }
                         
//                       // Show the custom controls when the marker is clicked
//                                   navControlDiv.style.display = 'block';
//                                   mapControlDiv.style.display = 'block';

//                                   // Log latitude and longitude
//                                   const lat = markerRef.value.getPosition().lat();
//                                   const lng = markerRef.value.getPosition().lng();
//                                   console.log(`Latitude: ${lat}, Longitude: ${lng}`);

//                                   // Add click event listeners to controls to perform desired actions
//                                   navControlDiv.addEventListener('click', () => {
//                                     window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
//                                   });

//                                   mapControlDiv.addEventListener('click', () => {
//                                     window.location.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
//                                   });

//                       infoWindow.open({
//                             anchor: markerRef.value,
//                             map: newMap,
                          
//                           });

//                    });



      
      
//     };

      
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

        const storedValues = await storage.get(Constants.storageValue.key_VehicleDetails_v1);

              console.log("displayveharra",storedValues);

              const allGroupVehicles = storedValues.veh_arr || [];

            
      
          // 4️⃣ Extract the group's vehicles


          // 5️⃣ Filter only vehicles whose veh_id exists in favorites
        const filteredVehicles = allGroupVehicles.filter(vehicle =>
          VehicleValue.veh_ID.includes(vehicle.veh_ID)
        );

        console.log("filteredVehicles",filteredVehicles[0]);

      vehicleObject.value=filteredVehicles[0];

      await RunData(vehicleObject.value);
    }



intervalId.value = setInterval(async () => 
{
  

        
                const storedValuesnew = await storage.get(Constants.storageValue.key_VehicleDetails_v1);

                                              console.log("selectenew",storedValuesnew);



                                        if(storedValuesnew){

                                          const matchingVehdata = storedValuesnew.veh_arr.filter(vehobject => vehobject.veh_id === vehicle_id);
                                 
                                     console.log("storedValuesnew",matchingVehdata);

                                           await storage.set('selectedVeh', JSON.stringify(matchingVehdata[0]));


                                          vehicleObject.value = matchingVehdata.length > 0 ? matchingVehdata[0] : null;

                                          if (vehicleObject.value) {
                                              RunData(vehicleObject.value);
                                          }
                                        }
                                      
  
                                   
 },30000); // 30000 ms = 60 seconds


    
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
      RunData,gitBranchOutline,
  carOutline,
  navigateCircleOutline,
    };
  },






});
</script>

<style scoped>

/* 🔥 Popup container */
.fab-popup {
  position: fixed;
  bottom: 90px; /* above FAB */
  left: 16px;
  width: 260px;

  background: white;
  border-radius: 16px;
  padding: 10px;

  box-shadow: 0 10px 25px rgba(0,0,0,0.2);

  transform: translateY(20px) scale(0.9);
  opacity: 0;
  pointer-events: none;

  transition: all 0.25s ease;
  z-index: 999;
}

/* 🔥 Open animation */
.fab-popup.open {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}

/* 🔥 Menu items */
.fab-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px;
  border-radius: 12px;
  cursor: pointer;

  transition: 0.2s;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 50px;

  padding: 12px;
  border-radius: 16px;
  margin-top: 10px;

  font-size: 15px;
  font-weight: 600;
  /* color: #475569; */

  /* transition: 0.2s; */
}

.menu-item ion-icon {
  font-size: 20px;
  color: var(--ion-color-primary);
}

/* Hover */
.menu-item:hover {
  background: #ecfdf5;
  color: #047857;
}

.menu-item:hover ion-icon {
  color: #059669;
}

/* Active */
.menu-item.active {
  background: #ecfdf5;
  color: #065f46;
  font-weight: bold;
}

.menu-item.active ion-icon {
  color: #059669;
}

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
  color:#00875A;
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
