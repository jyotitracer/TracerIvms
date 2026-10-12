<template>
  <div class="custom-card">

    <!-- Group Name -->
    <div class="group-name">{{ item.group }}</div>

    <!-- Main Container -->
    <div class="custom-item">

      <!-- Chart Row -->
      <div class="chart-row">
        <pie-chart :data="item" />

        <div class="status-row">

          <div class="status-box">
            <div class="dot active"></div>
            <span class="status-value">{{ item.moving }}</span>
            <span class="status-label">Active</span>
          </div>

          <div class="status-box mid">
            <div class="dot stopped"></div>
            <span class="status-value">{{ item.stopped }}</span>
            <span class="status-label">Stopped</span>
          </div>

          <div class="status-box">
            <div class="dot offline"></div>
            <span class="status-value">{{ item.offline }}</span>
            <span class="status-label">Offline</span>
          </div>

        </div>
      </div>

      <!-- Group Total -->
      <div class="month-below">
        <div class="month-total">
          Group Total - (Per Vehicle Average)
        </div>
      </div>

      <!-- Third Row -->
      <div class="info-row border-bottom">

        <div class="info-col with-border">
          <div class="info-item">
            <ion-icon :icon="distanceIcon" class="icon-style" />

            <div class="text-container">
              <p class="text2">{{ item.distance1 }}</p>
              <p class="text2">({{ item.distance2 }})</p>
            </div>
          </div>
        </div>

        <div class="info-col">
          <div class="info-item">
            <ion-icon :icon="violationIcon" class="icon-style" />

            <div class="text-container">
              <p class="text2">{{ item.vio1 }}</p>
              <p class="text2">({{ item.vio2 }})</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Fourth Row -->
      <div class="info-row">

        <div class="info-col with-border">
          <div class="info-item">
            <ion-icon :icon="durationIcon" class="icon-style" />

            <div class="text-container">
              <p class="text2">{{ item.moving1 }}</p>
              <p class="text2">({{ item.moving2 }})</p>
            </div>
          </div>
        </div>

        <div class="info-col">
          <div class="info-item">
            <ion-icon :icon="fuelIcon" class="icon-style" />

            <div class="text-container">
              <p class="text2">{{ item.fuel1 }}</p>
              <p class="text2">({{ item.fuel2 }})</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import PieChart from '@/components/PieChartView.vue';
import { IonItem, IonCol, IonRow, IonGrid, IonIcon } from '@ionic/vue';
import { warningOutline, timeOutline, waterOutline } from 'ionicons/icons';
import { distanceRouteIcon } from "@/common/customIcons";
import storage from "@/services/storagefile";
import Constants from '@/common/constants';


export default {
  name: 'GroupCustomItem',
  components: {
    PieChart,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
  },
  data() {
    return {
      distanceIcon: distanceRouteIcon,
      violationIcon: warningOutline,
      durationIcon: timeOutline,
      fuelIcon: waterOutline,
      moving_color: '',  // To store the dynamic color
      stopped_color: '',
      offline_color: '',
    };
  },
  async created() {
    // Fetch color values from storage or use defaults
    const movingStoredColor = await storage.get('movingcolor');
    const stoppedStoredColor = await storage.get('stoppedcolor');
    const offlineStoredColor = await storage.get('offlinecolor');

    


    this.moving_color = movingStoredColor || Constants.Veh_color.Key_Active_Color;
    this.stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
    this.offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;
  },
  computed: {
    // Computed styles for each status
    movingStyle() {
      return {
        borderColor: this.moving_color,
        color: this.moving_color,
      };
    },
    stoppedStyle() {
      return {
        borderColor: this.stopped_color,
        color: this.stopped_color,
      };
    },
    offlineStyle() {
      return {
        borderColor: this.offline_color,
        color: this.offline_color,
      };
    },
  },
  props: {
    item: Object, // item passed as prop from parent component
  },
};
</script>

<style scoped>

/* CARD */
.custom-card {
  background: white;
  border-radius: 16px;
  margin: 20px;
  padding-bottom: 10px;
  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);
  overflow: hidden;
}

/* MAIN CONTAINER */
.custom-item {
  width: 100%;
  padding: 0;
  margin: 0;
}

/* GROUP NAME */
.group-name {
  font-weight: bold;
  margin-left: 10px;
  padding-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
}

/* CHART ROW */
.chart-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* STATUS ROW */
.status-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

/* STATUS BOX */
.status-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-box.mid {
  border-left: 1px solid rgba(0,0,0,0.08);
  border-right: 1px solid rgba(0,0,0,0.08);
}

/* DOT */
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 5px;
}

.dot.active {
  background: v-bind(moving_color);
}

.dot.stopped {
  background: v-bind(stopped_color);
}

.dot.offline {
  background: v-bind(offline_color);
}

/* STATUS TEXT */
.status-label {
  font-size: 12px;
  color: #535f66;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

/* GROUP TOTAL */
.month-below {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 10px;
}

.month-total {
  font-size: 14px;
  text-align: center;
}

/* INFO ROW */
.info-row {
  width: 100%;
  display: flex;
}

/* COLUMN */
.info-col {
  flex: 1;
}

/* RIGHT BORDER */
.with-border {
  border-right: 1px solid #e0e0e0;
}

/* BOTTOM BORDER */
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

/* INFO ITEM */
/* .info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 0;
} */

.info-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 14px 12px;
}

/* ICON */
.icon-style {
  font-size: 30px;
  margin-right: 10px;
}

/* TEXT CONTAINER */
.text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* TEXT */
.text2 {
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: #5d5b5b;
}

</style>