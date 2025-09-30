<!-- <template>
  <ion-content>
    <div id="map" style="height: calc(100% - 140px);"></div>
    <ion-footer>
      <ion-toolbar>
       
        <ion-item>
          <ion-label>Animation Speed</ion-label>
          <ion-range
            min="1"
            max="10"
            step="1"
            :value="speedValue"
            @ionChange="updateSpeed"
          ></ion-range>
        </ion-item>
       
        <ion-item>
          <ion-label>Animation Progress</ion-label>
          <ion-range
            min="0"
            :max="routePoints.length - 1"
            step="1"
            v-model="animationProgress"
            :disabled="!isPlaying"
            @ionChange="updateAnimationProgress"
          ></ion-range>
        </ion-item>
       
        <ion-item>
          <ion-button expand="block" @click="togglePlayPause">
            <ion-icon :name="isPlaying ? pause : play"></ion-icon>
            <ion-label>{{ isPlaying ? "Pause" : "Play" }}</ion-label>
          </ion-button>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  </ion-content>
</template>

<script>
import Constants from "@/common/constants";
import { Loader } from "@googlemaps/js-api-loader";
import { ref, onMounted } from "vue";
import {
  IonContent,
  IonFooter,
  IonToolbar,
  IonItem,
  IonLabel,
  IonRange,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { play, pause } from "ionicons/icons";

export default {
  components: {
    IonContent,
    IonFooter,
    IonToolbar,
    IonItem,
    IonLabel,
    IonRange,
    IonButton,
    IonIcon,
  },
  setup() {
    const map = ref(null);
    const marker = ref(null);
    const polyline = ref(null);
    const directionsService = ref(null);
    const routePoints = ref([]);
    const speedValue = ref(5);
    const animationProgress = ref(0);
    const isPlaying = ref(false);
    const animationIndex = ref(0);
    const animationTimer = ref(null);
    const animationSpeed = ref(600); // Default to 600ms
    const playIcon = play;
    const pauseIcon = pause;

    const initializeMap = () => {
      map.value = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 12.971598, lng: 77.594566 },
        zoom: 14,
      });

      marker.value = new google.maps.Marker({
        map: map.value,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3.5,
          strokeColor: "#FF0000",
        },
      });

      polyline.value = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 0.7,
        strokeWeight: 2.5,
        map: map.value,
      });

      directionsService.value = new google.maps.DirectionsService();

      // const origin = { lat: 12.971598, lng: 77.594566 };
      // const destination = { lat: 12.9805, lng: 77.613 };
      const waypoints = Array.from({ length: 40 }, (_, i) => ({
        location: { lat: 12.97 + i * 0.001, lng: 77.59 + i * 0.001 },
        stopover: true,
      }));

      processWaypoints(waypoints);
    };

    const processWaypoints = async (waypoints) => {
          for (let i = 0; i < waypoints.length -1; i++) {
            const origin = waypoints[i].location;
            const destination = waypoints[i + 1].location;
            try {
              await fetchRoute(origin, destination,i);
            } catch (error) {
              console.error(`Error fetching route for segment ${i} -> ${i + 1}:`, error);
            }
          }
     };
  
  const fetchRoute = (origin, destination,wayPointIndex) => {


    return new Promise((resolve, reject) => {
      const request = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };
  
      directionsService.value.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          extractRoutePoints(response,wayPointIndex);

          resolve();
        } else {
          console.error("Directions request failed:", status);
          reject(status);
        }
      });
    });
  };

    const extractRoutePoints = (response,iteration,wayPointlength) => {
      const route = response.routes[0];
      const legs = route.legs;

      legs.forEach((leg,legIndex) => {

        console.log("iteration",iteration+" "+legIndex+" "+wayPointlength);

        leg.steps.forEach((step,stepIndex) => {

          const stepPoints = google.maps.geometry.encoding.decodePath(step.polyline.points);
          routePoints.value.push(...stepPoints);
        });
      });
    };

    const addMarkers = () => {
      new google.maps.Marker({
        position: routePoints.value[0],
        map: map.value,
        title: "Start",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#00FF00",
          fillOpacity: 1,
          strokeColor: "#00FF00",
          strokeWeight: 2,
          scale: 6,
        },
      });

      new google.maps.Marker({
        position: routePoints.value[routePoints.value.length - 1],
        map: map.value,
        title: "End",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#FF0000",
          fillOpacity: 1,
          strokeColor: "#FF0000",
          strokeWeight: 2,
          scale: 6,
        },
      });
    };

    const getCurrentWaypointIndex = (point) => {
  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < routePoints.value.length; i++) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      point,
      routePoints.value[i]
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
};
    const animateRoute = () => {
      if (!isPlaying.value || animationIndex.value >= routePoints.value.length) {
        clearTimeout(animationTimer.value);
        animationIndex.value = 0;
        animationProgress.value = 0;
        isPlaying.value = false;
        marker.value.setPosition(routePoints.value[0]);
        map.value.panTo(routePoints.value[0]);
        return;
      }

      const currentPoint = routePoints.value[animationIndex.value];
      marker.value.setPosition(currentPoint);
      map.value.panTo(currentPoint);

      const waypointIndex = getCurrentWaypointIndex(currentPoint);
         console.log("Current Waypoint Index:", waypointIndex);

      const path = polyline.value.getPath();
      path.push(currentPoint);

      animationProgress.value = animationIndex.value;
      animationIndex.value++;

      animationTimer.value = setTimeout(animateRoute, animationSpeed.value);
    };

    const togglePlayPause = () => {
      if (animationIndex.value === 0 && animationProgress.value === 0 && !isPlaying.value) {
        polyline.value.setPath([]);
      }

      isPlaying.value = !isPlaying.value;

      if (isPlaying.value) {
        animateRoute();
      } else {
        clearTimeout(animationTimer.value);
      }
    };

    const updateSpeed = (event) => {
      speedValue.value = event.detail.value;

      const speeds = {
        1: 1000,
        2: 900,
        3: 800,
        4: 700,
        5: 600,
        6: 500,
        7: 400,
        8: 300,
        9: 200,
        10: 100,
      };
      animationSpeed.value = speeds[speedValue.value];
    };

    const updateAnimationProgress = (event) => {
      animationIndex.value = event.detail.value;
      animationProgress.value = animationIndex.value;

      if (animationIndex.value < routePoints.value.length) {
        marker.value.setPosition(routePoints.value[animationIndex.value]);
        map.value.panTo(routePoints.value[animationIndex.value]);

        const path = polyline.value.getPath();
        path.clear();
        for (let i = 0; i <= animationIndex.value; i++) {
          path.push(routePoints.value[i]);
        }
      }
    };

    onMounted(() => {
      const loader = new Loader({
        apiKey: Constants.Google_map_API,
        version: "weekly",
        libraries: ["geometry"],
      });

      loader.load().then(() => {
        initializeMap();
      });
    });

    return {
      map,
      marker,
      polyline,
      directionsService,
      routePoints,
      speedValue,
      animationProgress,
      isPlaying,
      animationIndex,
      animationTimer,
      animationSpeed,
      playIcon,
      pauseIcon,
      initializeMap,
      fetchRoute,
      extractRoutePoints,
      addMarkers,
      animateRoute,
      togglePlayPause,
      updateSpeed,
      updateAnimationProgress,
    };
  },
};
</script>

<style scoped>
#map {
  width: 100%;
}
ion-footer {
  --background: #fff;
}
</style> -->


<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Date and Time Picker</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-button @click="openDateTimePicker">Change Date and Time</ion-button>

      <p v-if="selectedDateTime">Selected Date and Time: {{ selectedDateTime }}</p>

      <ion-modal 
      :is-open="isModalOpen" 
      @didDismiss="closeModal">
        <ion-content>
          <div class="modal-content">
            <h2>Select Date and Time</h2>

            <ion-datetime
              :value="selectedDateTime"
              display-format="YYYY-MM-DD HH:mm"
              picker-format="YYYY-MM-DD HH:mm"
              :max="maxDateTime"
              @ionChange="onDateChange"
            ></ion-datetime>

            <div class="modal-buttons">
              <ion-button @click="saveDateTime">Save</ion-button>
              <ion-button color="medium" @click="closeModal">Cancel</ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref } from 'vue';
import { formatISO } from 'date-fns';
import {
  IonDatetime,
  IonModal,
  IonButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/vue';

export default {
  components: {
    IonDatetime,
    IonModal,
    IonButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  },
  setup() {
    const isModalOpen = ref(false); // Controls the modal visibility
    const selectedDateTime = ref(''); // Stores the selected date and time
    const maxDateTime = ref(formatISO(new Date())); // Maximum selectable date and time (current date and time)

    const openDateTimePicker = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const onDateChange = (event) => {
      selectedDateTime.value = event.detail.value; // Update date and time
    };

    const saveDateTime = () => {
      console.log('Selected Date and Time:', selectedDateTime.value);
      closeModal(); // Close the modal after saving
    };

    return {
      isModalOpen,
      selectedDateTime,
      maxDateTime,
      openDateTimePicker,
      closeModal,
      onDateChange,
      saveDateTime,
    };
  },
};
</script>

<style>
.modal-content {
  padding: 20px;
  text-align: center;
}
.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>

