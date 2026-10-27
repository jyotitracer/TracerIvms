<template>
  <ion-page>
  
<ion-content fullscreen class="no-safe-bottom">
      <!-- Button group for filter -->
      <div class="button-group">
        <ion-button
          v-for="(label, index) in labels"
          :key="index"
          :class="{'selected': selectedLabel === label}"
          @click="selectButton(label)"
          fill="clear"
        >
          {{ label }}
        </ion-button>
      </div>

      <div v-if="showSection" class="new-section">
        <div ref="mapContainer" style="width: 100%; height: 250px;"></div>
      </div>

      <!-- Play/Pause animation controls (shown after route builds) -->
      <div v-if="showSection && canPlay" class="play-pause-section">
        <ion-icon :icon="closeCircleIcon" class="control-close-icon" @click="closeSection"></ion-icon>
        <div class="first-div">
          <ion-button
            @click="togglePlayPause"
            class="play-pause-icon"
            :disabled="!canPlay">
            <ion-icon :icon="isPlaying ? pauseCircleIcon : playCircleIcon" style="color: white;"></ion-icon>
          </ion-button> 
        </div>   
        <div class="second-div">
          <div class="label-and-range">
            <ion-label style="width: 60px; color: white; font-size: 14px;">Progress</ion-label>
            <ion-range
              :key="routePoints.length"
              class="progress-bar"
              :min="0"
              :step="1"
              :max="Math.max(routePoints.length - 1, 0)"
              v-model="animationProgress"
              @ionChange="updateAnimationProgress"
            />
          </div>
          <div class="label-and-range">
            <ion-label style="width: 60px; color: white; font-size: 14px;">Speed</ion-label>
            <ion-range
              class="progress-bar"
              :min="1"
              :max="10"
              :step="1"
              :value="speedValue"
              @ionChange="updateSpeed"
            />
          </div>
        </div>
      </div>

      <!-- Display for Today -->
      <div v-if="selectedLabel === 'Today'">
        <!-- Check if todayItems is empty -->
        <p v-if="todayItems.length === 0">Data not available</p>
        <div v-for="(item, index) in todayItems" :key="index" class="item" >
          <div class="item-header">
            <span>{{ item.dateString }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(detail, idx) in item.details" :key="idx" class="detail-row"  @click="openSection(detail)">
                <div class="detail-container">
                  <span class="detail-time">{{ detail.st_date }}</span>
                  <span class="detail-location">{{ detail.st_loc }}</span>
                  <div class="detail-right">
                    <span class="detail-distance">{{ detail.distance }}</span>
                    <span class="detail-duration">{{ detail.tot_duration }}</span>
                  </div>
                </div>
                <ion-item-divider v-if="idx < item.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Display for Yesterday -->
      <div v-else-if="selectedLabel === 'Yesterday'">
        <!-- Check if yesterdayItems is empty -->
        <p v-if="yesterdayItems.length === 0">Data not available</p>
        <div v-for="(item, index) in yesterdayItems" :key="index" class="item" >
          <div class="item-header">
            <span>{{ item.dateString }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(detail, idx) in item.details" :key="idx" class="detail-row"  @click="openSection(detail)">
                <div class="detail-container">
                  <span class="detail-time">{{ detail.st_date }}</span>
                  <span class="detail-location">{{ detail.st_loc }}</span>
                  <div class="detail-right">
                    <span class="detail-distance">{{ detail.distance }}</span>
                    <span class="detail-duration">{{ detail.tot_duration }}</span>
                  </div>
                </div>
                <ion-item-divider v-if="idx < item.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Display for Week -->
      <div v-else-if="selectedLabel === 'Week'">
        <!-- Check if weekItems is empty -->
        <p v-if="weekItems.length === 0">Data not available</p>
        <div v-for="(item, index) in weekItems" :key="index" class="item" >
          <div class="item-header">
            <span>{{ item.dateString }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(detail, idx) in item.details" :key="idx" class="detail-row"  @click="openSection(detail)">
                <div class="detail-container">
                  <span class="detail-time">{{ detail.st_date }}</span>
                  <span class="detail-location">{{ detail.st_loc }}</span>
                  <div class="detail-right">
                    <span class="detail-distance">{{ detail.distance }}</span>
                    <span class="detail-duration">{{ detail.tot_duration }}</span>
                  </div>
                </div>
                <ion-item-divider v-if="idx < item.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Display for Month -->
      <div v-else-if="selectedLabel === 'Month'">
        <!-- Check if monthItems is empty -->
        <p v-if="monthItems.length === 0">Data not available</p>
        <div v-for="(item, index) in monthItems" :key="index" class="item">
          <div class="item-header">
            <span>{{ item.dateString }}</span>
          </div>
          <div class="item-details">
            <ul>
              <li v-for="(detail, idx) in item.details" :key="idx" class="detail-row"  @click="openSection(detail)">
                <div class="detail-container">
                  <span class="detail-time">{{ detail.st_date }}</span>
                  <span class="detail-location">{{ detail.st_loc }}</span>
                  <div class="detail-right">
                    <span class="detail-distance">{{ detail.distance }}</span>
                    <span class="detail-duration">{{ detail.tot_duration }}</span>
                  </div>
                </div>
                <ion-item-divider v-if="idx < item.details.length - 1" class="custom-divider"></ion-item-divider>
              </li>
            </ul>
          </div>
        </div>
      </div>

     <!-- Summary grid display -->
        <div v-if="selectedItems.length > 0 && hasDataForSelectedLabel" class="grid-container">
          <div class="detail-right">
            <span class="Total-Lable">Total Trip Count</span>
            <span class="Total_Values">{{ TotalCount }}</span>
          </div>

          <div class="detail-right">
            <span class="Total-Lable">Total Distance</span>
            <span class="Total_Values">{{ TotalDist }}</span>
          </div>

          <div class="detail-right">
            <span class="Total-Lable">Total Duration</span>
            <span class="Total_Values">{{ TotalDur }}</span>
          </div>
        </div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { IonButton, IonItemDivider, IonPage, IonHeader, IonContent, IonToolbar, IonIcon, loadingController, IonRange, IonLabel } from '@ionic/vue';
import { close, closeCircle, playCircle, pauseCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import { Network } from '@capacitor/network';
import { showToast, showToastMessage } from '@/services/toast';
import { defineComponent, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { loadGoogleMaps } from '@/services/googleMapsLoader';
import storage from "@/services/storagefile";

addIcons({ close, closeCircle, playCircle, pauseCircle });

export default defineComponent({
  name: 'DateFilterButtons',
  components: {
    IonButton, IonItemDivider, IonPage, IonHeader, IonContent, IonToolbar, loadingController, IonIcon, IonRange, IonLabel
  },
  props: {
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, required: true },
    groupname: { type: String },
  },
  setup(props) {
    let isFirstTimeDataCall = true;
    const router = useRouter();

    // ─── Filter/UI state ──────────────────────────────────────────────
    const labels = ['Today', 'Yesterday', 'Week', 'Month'];
    const selectedLabel = ref('Today');
    const showSection = ref(false);
    const closeIcon = close;
    const selectedItems = ref([]);
    const todayItems = ref([]);
    const yesterdayItems = ref([]);
    const weekItems = ref([]);
    const monthItems = ref([]);
    const TotalCount = ref(0);
    const TotalDist = ref(0);
    const TotalDur = ref(0);

    // ─── Map state ────────────────────────────────────────────────────
    let newMap: google.maps.Map | null = null;
    const mapContainer = ref<HTMLElement | null>(null);
    const mapRef = ref<google.maps.Map | null>(null);
    const historyarray = ref<any[]>([]);

    // ─── Markers ──────────────────────────────────────────────────────
    let markerId1: google.maps.Marker | null = null;
    let markerId2: google.maps.Marker | null = null;
    let markerMovingIcon: google.maps.Marker | null = null;
    const markersDotsArray: google.maps.Marker[] = [];

    // ─── Polyline ─────────────────────────────────────────────────────
    let polylinePathsForShowPath: google.maps.Polyline | null = null;

    // ─── Animation state ──────────────────────────────────────────────
    const routePoints = ref<google.maps.LatLng[]>([]);
    const animationIndex = ref(0);
    const animationProgress = ref(0);
    const isPlaying = ref(false);
    const canPlay = ref(false);
    const animationSpeed = ref(220); // default speed level 5 = 220ms per step
    const speedValue = ref(5);
    const animationTimer = ref<ReturnType<typeof setTimeout> | null>(null);
    let animationFrameId: number | null = null;

    const hasDataForSelectedLabel = computed(() => {
      if (selectedLabel.value === 'Today') return todayItems.value.length > 0;
      if (selectedLabel.value === 'Yesterday') return yesterdayItems.value.length > 0;
      if (selectedLabel.value === 'Week') return weekItems.value.length > 0;
      if (selectedLabel.value === 'Month') return monthItems.value.length > 0;
      return false;
    });

    // ═══ OSRM ROAD ROUTING ════════════════════════════════════════════
    async function fetchOSRMRoute(points: Array<{ lat: number; lon: number }>): Promise<google.maps.LatLng[]> {
      if (!points || points.length < 2) return [];
      const resultPoints: google.maps.LatLng[] = [];
      const CHUNK_SIZE = 25;

      for (let i = 0; i < points.length - 1; i += CHUNK_SIZE - 1) {
        const chunk = points.slice(i, i + CHUNK_SIZE);
        if (chunk.length < 2) break;
        const coordsString = chunk.map(p => `${p.lon},${p.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
        try {
          const resp = await fetch(url);
          if (resp.ok) {
            const data = await resp.json();
            if (data.routes?.[0]?.geometry?.coordinates) {
              const coords = data.routes[0].geometry.coordinates.map(
                (c: [number, number]) => new google.maps.LatLng(c[1], c[0])
              );
              if (resultPoints.length > 0) resultPoints.push(...coords.slice(1));
              else resultPoints.push(...coords);
              continue;
            }
          }
        } catch (err) {
          console.warn('OSRM chunk failed:', err);
        }
        chunk.forEach(p => resultPoints.push(new google.maps.LatLng(p.lat, p.lon)));
      }
      return resultPoints;
    }

    function interpolatePathPoints(pts: google.maps.LatLng[]): google.maps.LatLng[] {
      const result: google.maps.LatLng[] = [];
      if (pts.length < 2) return pts;
      for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i], p2 = pts[i + 1];
        const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
        // Cap at 20 steps max between OSRM road points
        const steps = Math.min(20, Math.max(1, Math.floor(dist / 40)));
        for (let s = 0; s < steps; s++)
          result.push(google.maps.geometry.spherical.interpolate(p1, p2, s / steps));
      }
      result.push(pts[pts.length - 1]);
      return result;
    }

    function processWaypointsWithoutAPI(historyPoints: Array<{ lat: number; lon: number }>) {
      routePoints.value = [];
      for (let i = 0; i < historyPoints.length - 1; i++) {
        const p1 = new google.maps.LatLng(historyPoints[i].lat, historyPoints[i].lon);
        const p2 = new google.maps.LatLng(historyPoints[i + 1].lat, historyPoints[i + 1].lon);
        const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
        // Cap at 20 steps max so far-apart dots don't slow down the animation
        const steps = Math.min(20, Math.max(5, Math.floor(dist / 40)));
        for (let s = 0; s < steps; s++)
          routePoints.value.push(google.maps.geometry.spherical.interpolate(p1, p2, s / steps));
      }
      const last = historyPoints[historyPoints.length - 1];
      routePoints.value.push(new google.maps.LatLng(last.lat, last.lon));
      animationIndex.value = 0; animationProgress.value = 0;
    }

    async function processWaypointsWithRoads(historyPoints: Array<{ lat: number; lon: number }>) {
      routePoints.value = [];
      if (!historyPoints || historyPoints.length < 2) return;
      try {
        const roadPoints = await fetchOSRMRoute(historyPoints);
        if (roadPoints && roadPoints.length >= 2) routePoints.value = interpolatePathPoints(roadPoints);
        else processWaypointsWithoutAPI(historyPoints);
      } catch {
        processWaypointsWithoutAPI(historyPoints);
      }
      animationIndex.value = 0; animationProgress.value = 0;
    }

    // ═══ ANIMATION ════════════════════════════════════════════════════
    function animateRoute() {
      if (!isPlaying.value || animationIndex.value >= routePoints.value.length) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        isPlaying.value = false;

        // Keep vehicle at destination (point B) with full polyline drawn
        if (routePoints.value.length > 0) {
          const lastIndex = routePoints.value.length - 1;
          animationIndex.value = lastIndex;
          animationProgress.value = lastIndex;
          markerMovingIcon?.setPosition(routePoints.value[lastIndex]);
          newMap?.panTo(routePoints.value[lastIndex]);

          const path = polylinePathsForShowPath?.getPath();
          if (path && path.getLength() !== routePoints.value.length) {
            path.clear();
            for (let i = 0; i < routePoints.value.length; i++) {
              path.push(routePoints.value[i]);
            }
          }
        }
        return;
      }
      const cur = routePoints.value[animationIndex.value];
      const nxt = animationIndex.value < routePoints.value.length - 1 ? routePoints.value[animationIndex.value + 1] : cur;
      const heading = google.maps.geometry.spherical.computeHeading(cur, nxt);
      markerMovingIcon?.setPosition(cur);
      markerMovingIcon?.setIcon({ path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3.5, strokeColor: '#FF0000', rotation: heading });
      newMap?.panTo(cur);
      polylinePathsForShowPath?.getPath()?.push(cur);
      animationProgress.value = animationIndex.value;
      animationIndex.value++;
      // Schedule next frame using the speed directly as the delay (ms)
      animationTimer.value = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animateRoute);
      }, animationSpeed.value);
    }

    function togglePlayPause() {
      if (
        animationIndex.value >= routePoints.value.length - 1 ||
        (animationIndex.value === 0 && animationProgress.value === 0)
      ) {
        animationIndex.value = 0;
        animationProgress.value = 0;
        polylinePathsForShowPath?.setPath([]);
      }
      isPlaying.value = !isPlaying.value;
      if (isPlaying.value) animateRoute();
      else { if (animationFrameId) cancelAnimationFrame(animationFrameId); if (animationTimer.value) clearTimeout(animationTimer.value); }
    }

    function updateSpeed(event: { detail: { value: number } }) {
      const val = event.detail.value;
      speedValue.value = val;
      // Lower ms = faster animation; speed 1 = 800ms/step, speed 10 = 30ms/step
      const speeds: Record<number, number> = { 1: 800, 2: 600, 3: 450, 4: 320, 5: 220, 6: 150, 7: 100, 8: 70, 9: 50, 10: 30 };
      animationSpeed.value = speeds[val] ?? 220;
    }

    function applyAnimationProgress(index: number) {
      if (!markerMovingIcon || !newMap || index >= routePoints.value.length) return;
      markerMovingIcon.setPosition(routePoints.value[index]);
      newMap.panTo(routePoints.value[index]);
      const path = polylinePathsForShowPath?.getPath();
      path?.clear();
      for (let i = 0; i <= index; i++) path?.push(routePoints.value[i]);
    }

    function updateAnimationProgress(event: { detail: { value: number } }) {
      const index = event.detail.value;
      animationIndex.value = index; animationProgress.value = index;
      applyAnimationProgress(index);
    }

    // ═══ DOT MARKERS ══════════════════════════════════════════════════
    function createDotMarker(position: { lat: number; lon?: number; lng?: number }, color: string): google.maps.Marker {
      return new google.maps.Marker({
        position: { lat: parseFloat(String(position.lat)), lng: parseFloat(String(position.lng ?? position.lon)) },
        map: newMap,
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 4, strokeColor: color, fillColor: color, fillOpacity: 0.8, strokeWeight: 1 },
      });
    }

    // Helper: return dot color based on GPS event_type from response
    // Moving (1)=green, Idle (2)=orange, Stopped (3)=red, NoGPS/NoData=dark gray
    function getDotColor(eventType: string): string {
      switch (String(eventType)) {
        case '1': return '#00C853'; // Moving  → green
        case '2': return '#FF6D00'; // Idle    → orange
        case '3': return '#D50000'; // Stopped → red
        case '5': return '#546E7A'; // IG ON, No GPS → blue-gray
        case '6': return '#546E7A'; // IG OFF, No GPS → blue-gray
        case '7': return '#9E9E9E'; // No Data → gray
        default:  return '#9E9E9E'; // unknown → gray
      }
    }

    // ═══ CLEANUP ══════════════════════════════════════════════════════
    function cleanupAnimation() {
      isPlaying.value = false; canPlay.value = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (animationTimer.value) clearTimeout(animationTimer.value);
      routePoints.value = []; animationIndex.value = 0; animationProgress.value = 0;
      if (markerMovingIcon) { markerMovingIcon.setMap(null); markerMovingIcon = null; }
      if (polylinePathsForShowPath) { polylinePathsForShowPath.setPath([]); polylinePathsForShowPath.setMap(null); polylinePathsForShowPath = null; }
      if (markerId1) { markerId1.setMap(null); markerId1 = null; }
      if (markerId2) { markerId2.setMap(null); markerId2 = null; }
      markersDotsArray.forEach(m => m.setMap(null));
      markersDotsArray.length = 0;
    }

    // Find the nearest point on the OSRM road route for a given raw GPS coordinate
    function findNearestPointOnRoute(lat: number, lon: number): { lat: number; lng: number } {
      const pts = routePoints.value;
      if (!pts || pts.length === 0) return { lat, lng: lon };
      const rawPoint = new google.maps.LatLng(lat, lon);
      let nearestLat = lat;
      let nearestLng = lon;
      let minDist = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const dist = google.maps.geometry.spherical.computeDistanceBetween(rawPoint, pts[i]);
        if (dist < minDist) {
          minDist = dist;
          nearestLat = pts[i].lat();
          nearestLng = pts[i].lng();
        }
      }
      return { lat: nearestLat, lng: nearestLng };
    }

    // ═══ TRIP PATH API ════════════════════════════════════════════════
    const CallTripPath = async (st_date_1: any, ed_date: any, veh_id: any) => {
      let loading: HTMLIonLoadingElement | null = null;
      try {
        loading = await loadingController.create({ message: 'Loading trip...', spinner: 'circles', backdropDismiss: true });
        await loading.present();

        const response = await fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_trip_path, { veh_id, fdate: st_date_1, edate: ed_date });
        const responsejson = response.data;

        if (response.status === 200) {
          historyarray.value = (responsejson.arr_data || [])
            .filter((item: any) => item.lat && item.lon)
            .map((item: any) => ({
              recId: item.rec_id, lat: parseFloat(item.lat), lon: parseFloat(item.lon),
              location: item.location, speed: parseInt(item.speed, 10),
              vehNo: item.veh_no, rtcDate: item.rtcdate, rtcTime: item.rtctime,
              driverName: item.driver_name, event_type: item.event_type,
              label: item.label, stoppage: item.stoppage_dur,
            }));

          if (historyarray.value.length < 2) { showToastMessage('No trip data available'); return; }

          cleanupAnimation();

          const origin = { lat: historyarray.value[0].lat, lng: historyarray.value[0].lon };
          const destination = { lat: historyarray.value[historyarray.value.length - 1].lat, lng: historyarray.value[historyarray.value.length - 1].lon };

          newMap?.setCenter(new google.maps.LatLng(origin.lat, origin.lng));
          newMap?.setZoom(14);

          markerId1 = new google.maps.Marker({ position: origin, map: newMap, icon: { url: '/ic_end.png', scaledSize: new google.maps.Size(25, 25) } });
          markerId2 = new google.maps.Marker({ position: destination, map: newMap, icon: { url: '/ic_st.png', scaledSize: new google.maps.Size(25, 25) } });

          historyarray.value.forEach((pt: any) => markersDotsArray.push(createDotMarker({ lat: pt.lat, lon: pt.lon }, getDotColor(pt.event_type))));

          polylinePathsForShowPath = new google.maps.Polyline({ path: [], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 3, map: newMap });
          markerMovingIcon = new google.maps.Marker({ map: newMap, position: origin, icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3.5, strokeColor: '#FF0000' } });

          await loading.dismiss(); loading = null;

          const loadingPlay = await loadingController.create({ message: 'Building road route...', spinner: 'circles' });
          await loadingPlay.present();
          await processWaypointsWithRoads(historyarray.value);
          await loadingPlay.dismiss();

          // Snap start/end markers to nearest point on road route
          const snappedOrigin = findNearestPointOnRoute(historyarray.value[0].lat, historyarray.value[0].lon);
          const snappedDest = findNearestPointOnRoute(historyarray.value[historyarray.value.length - 1].lat, historyarray.value[historyarray.value.length - 1].lon);
          markerId1?.setPosition(snappedOrigin);
          markerId2?.setPosition(snappedDest);
          newMap?.setCenter(new google.maps.LatLng(snappedOrigin.lat, snappedOrigin.lng));

          // Re-place dot markers snapped to road route
          markersDotsArray.forEach(m => m.setMap(null));
          markersDotsArray.length = 0;
          historyarray.value.forEach((pt: any) => {
            const snapped = findNearestPointOnRoute(pt.lat, pt.lon);
            markersDotsArray.push(createDotMarker({ lat: snapped.lat, lng: snapped.lng }, getDotColor(pt.event_type)));
          });

          markerMovingIcon?.setPosition(snappedOrigin);

          canPlay.value = true;
        } else if (response.status === 401) {
          console.error('Unauthorized:', responsejson.message);
        } else {
          showToastMessage('Failed to load trip path');
        }
      } catch (error) {
        console.error('Error in CallTripPath:', error);
      } finally {
        if (loading) await loading.dismiss();
      }
    };

    // ═══ BUTTON SELECT ════════════════════════════════════════════════
    const selectButton = async (label: string) => {
      selectedLabel.value = label;
      const status = await Network.getStatus();
      if (status.connected) CallAPIForData(); else showToast();
    };

    // ═══ MAP INIT ═════════════════════════════════════════════════════
    const callMapInit = async () => {
      if (!mapContainer.value) return;
      const storedMapType = (await storage.get('groupmapType')) || 'roadmap';
      newMap = new google.maps.Map(mapContainer.value, {
        center: { lat: 0, lng: 0 }, zoom: 14, mapTypeId: storedMapType,
        zoomControl: true, mapTypeControl: false, fullscreenControl: false, streetViewControl: false,
      });
      mapRef.value = newMap;
    };

    const openSection = async (itemDetails: any) => {
      showSection.value = true;
      await nextTick();
      if (!mapContainer.value) return;
      await loadGoogleMaps();
      await callMapInit();
      CallTripPath(itemDetails.st_date_1, itemDetails.ed_date, itemDetails.veh_id);
    };

    const closeSection = () => {
      cleanupAnimation();
      showSection.value = false;
      newMap = null; mapRef.value = null;
    };

    // ═══ TRIP LIST API ════════════════════════════════════════════════
    const CallAPIForData = () => {
      let loading: HTMLIonLoadingElement | undefined;
      let req_period_type = '';

      loadingController.create({ message: 'Loading...', backdropDismiss: true })
        .then((load) => { loading = load; if (isFirstTimeDataCall) loading.present(); })
        .then(() => {
          if (selectedLabel.value === 'Today') req_period_type = '1';
          else if (selectedLabel.value === 'Yesterday') req_period_type = '2';
          else if (selectedLabel.value === 'Week') req_period_type = '3';
          else if (selectedLabel.value === 'Month') req_period_type = '4';
          return fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Vehi_trip, { element_id: props.vehicleId, rpt_type: '1', is_smry: '0', req_period: req_period_type });
        })
        .then((response: any) => {
          const responsejson = response.data;
          if (response.status === 200) {
            const arrData = responsejson.arr_data;
            todayItems.value = []; yesterdayItems.value = []; weekItems.value = []; monthItems.value = [];
            TotalCount.value = 0; TotalDist.value = 0; TotalDur.value = 0; selectedItems.value = [];
            if (arrData) {
              arrData.arr_trip.forEach((trip: any) => {
                Object.keys(trip).forEach(timestamp => {
                  const details = trip[timestamp];
                  const date = new Date(+timestamp * 1000);
                  const opts: any = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
                  const dateString = date.toLocaleDateString('en-US', opts);
                  if (req_period_type === '1') { todayItems.value.push({ dateString, details } as never); selectedItems.value = todayItems.value; }
                  else if (req_period_type === '2') { yesterdayItems.value.push({ dateString, details } as never); selectedItems.value = yesterdayItems.value; }
                  else if (req_period_type === '3') { weekItems.value.push({ dateString, details } as never); selectedItems.value = weekItems.value; }
                  else if (req_period_type === '4') { monthItems.value.push({ dateString, details } as never); selectedItems.value = monthItems.value; }
                });
              });
              TotalCount.value = arrData.smry.trip_count;
              TotalDist.value = arrData.smry.smry_dist;
              TotalDur.value = arrData.smry.smry_dur;
            }
          } else { console.error('Error:', responsejson.message); }
        })
        .catch((error: any) => { console.error('API Error:', error); })
        .finally(() => { if (loading && isFirstTimeDataCall) { loading.dismiss(); isFirstTimeDataCall = false; } });
    };

    onMounted(async () => {
      const status = await Network.getStatus();
      if (status.connected) CallAPIForData(); else showToast();
    });

    onUnmounted(() => { cleanupAnimation(); });

    return {
      vehicleId: props.vehicleId, vehicleName: props.vehicleName, groupname: props.groupname,
      mapContainer, mapRef, historyarray,
      labels, selectedLabel, showSection, closeIcon,
      TotalCount, TotalDist, TotalDur,
      todayItems, yesterdayItems, weekItems, monthItems,
      selectedItems, selectButton, openSection, closeSection,
      hasDataForSelectedLabel,
      isPlaying, canPlay, speedValue, routePoints, animationProgress,
      togglePlayPause, updateSpeed, updateAnimationProgress,
      closeCircleIcon: closeCircle,
      playCircleIcon: playCircle,
      pauseCircleIcon: pauseCircle,
    };
  },
});
</script>

<style scoped>
.custom-divider {
  display: block;
  height: 1px;
  background-color: #e2e8f0; /* Very soft subtle divider */
  margin: 8px 0;
  min-height: 1px;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  overflow-x: auto;
  margin-bottom: 10px;
}



/* 🔹 Default (Deselected) */
.button-group ion-button {
  --background: #f1f5f9;
  --color: #475569;
  --border-radius: 20px;
  --box-shadow: none;
  font-size: 12px;
  font-weight: 600;
  margin: 0 4px;
}

.button-group ion-button:hover {
  --background: #e2e8f0;
}

.button-group ion-button.selected {
  --background: #006837;
  --color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 104, 55, 0.25);
}




.item {
  margin-bottom: 10px;
  border-radius: 18px;
  background: #ffffff;
  margin: 10px 14px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 4px 18px rgba(0, 30, 60, 0.04);
  overflow: hidden;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
  border-bottom: 1px solid rgba(226, 232, 240, 0.85);
  padding: 10px 14px;
  font-weight: 700;
  color: #006837;
}

.item-details {
  padding: 10px;
  border: none;
  background-color: transparent;
  align-items: center;
}

.item-details ul {
  list-style-type: none;
  padding: 0;
}

.detail-row {
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.detail-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  height: 100%;
}

.detail-container {
  display: flex;
  width: 100%;
  align-items: center;
}

.Total-Lable{
  font-size: 13px;
  font-weight: bold;
  

}
.Total_Values{ 
  font-size: 12px;
  margin-top: 5px;

}
.grid-container {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Divide into 3 equal columns */
  gap: 10px; /* Optional: Add gap between columns */
  align-items: stretch; /* Ensure all columns are equal height */
  justify-items: center; /* Center items horizontally */
  background-color: white; /* Optional: Background color for grid items */
  border: none; /* Optional: Border for grid items */
  border-radius: 16px;
  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);
  margin: 10px 20px;
}



.detail-time {
  width: 40px;
  text-align: left;
  margin-right: 10px;
  font-size: 13px;
}

.detail-location {
  flex-grow: 1;
  text-align: left;
  font-size: 13px;

}

.detail-distance,
.detail-duration {
  width: 100px;
  text-align: left;
  font-size: 13px;

  margin-left: 10px;
}

.new-section {
  width: 100%;
  height: 250px;
  background-color: #e0e0e0; /* Change this to any color or add more styles as needed */
  margin-bottom: 10px; /* Optional: Add some margin below the section */
  position: relative;

  
}

.play-pause-section {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #0f172a; border-radius: 16px; margin: 10px 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  position: relative;
  padding: 15px 10px 10px;
}

.first-div {
  white-space: nowrap;
  margin-left: 5px;
}

.second-div {
  flex-grow: 1;
  text-align: left;
  margin-right: 5px;
}

.label-and-range {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.progress-bar {
  flex-grow: 1;
  margin-left: 10px;
  --knob-size: 16px;
  --height: 38px;
  --bar-background: rgba(255, 255, 255, 0.3);
  --bar-background-active: #00875A;
  --knob-background: #00875A;
  --pin-background: #00875A;
}

.play-pause-icon {
  border-radius: 50%;  /* To make the circle */
  width: 40px;  /* Width of the circle */
  height: 40px;  /* Height of the circle */
  display: flex;
  align-items: center;
  --background:#00875A;
  --color: white;
  padding: 0px;
  --padding-top: 0px; 
  --padding-bottom: 0px;
  --padding-start: 0em;
  --padding-end: 0em;
  margin-right: 10px;
}

.play-pause-icon ion-icon {
  font-size: 24px;
}

.control-close-icon {
  position: absolute;
  right: 10px;
  top: 5px;
  font-size: 24px;
  color: white;
  cursor: pointer;
  z-index: 10;
}
</style>
