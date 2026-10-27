<template>
    <div class="custom-card">

    <div class="group-name">{{ item.group }}</div>
    <div class="custom-item">
      <div style="padding: 0;">
        <!-- First row: Bar chart -->
        <ion-row style="height: 150px;"> 
          <bar-chart-view :data="item.grphArr" /> <!-- Bar chart component -->
        </ion-row>

        <!-- Second row: Group Total -->
        <ion-row>
          <ion-col>
            <div class="month-below">
              <div class="month-total">Group Total - (Per Vehicle Average)</div>
            </div>
          </ion-col>
        </ion-row>

        <!-- Third row: Distance travelled and violation count -->
        <ion-row class="border-bottom">
          <ion-col class="centered with-border">
      <div class="info-item">
                <ion-icon :icon="distanceIcon" class="icon-style" />
              <div class="text-container">
                <p class="text2">{{ item.distance1 }}</p>
                <p class="text2">({{ item.distance2 }})</p>
              </div>
            </div>
          </ion-col>
          <ion-col>
            <div class="info-item">
              <ion-icon :icon="violationIcon" class="icon-style" />
              <div class="text-container">
                <p class="text2">{{ item.vio1 }}</p>
                <p class="text2">({{ item.vio2 }})</p>
              </div>
            </div>
          </ion-col>
        </ion-row>

        <!-- Fourth row: Moving duration and fuel consumed -->
        <ion-row>
          <ion-col class="centered with-border">
            <div class="info-item">
              <ion-icon :icon="durationIcon" class="icon-style" />
              <div class="text-container">
                <p class="text2">{{ item.moving1 }}</p>
                <p class="text2">({{ item.moving2 }})</p>
              </div>
            </div>
          </ion-col>
          <ion-col>
           <div class="info-item">
                <ion-icon :icon="fuelIcon" class="icon-style" />
              <div class="text-container">
                <p class="text2">{{ item.fuel1 }}</p>
                <p class="text2">({{ item.fuel2 }})</p>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </div>
    </div>
  </div>
</template>

<script>
import BarChartView from '@/components/BarChartView.vue'; // Adjust the path as per your project structure
import { IonItem, IonCol, IonRow, IonGrid, IonIcon } from '@ionic/vue';
import { warningOutline, timeOutline, waterOutline } from 'ionicons/icons';
import { distanceRouteIcon } from "@/common/customIcons";

export default {
  name: 'GroupCustomItem',
  components: {
    BarChartView,
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
    };
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.custom-item {
  width: 100%;
  padding: 0;
  margin: 0;
}
.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  margin: 0;
}
ion-row,
ion-col {
  padding: 0 !important;
  margin: 0 !important;
}

/* 🔥 CARD STYLE */
.custom-card {
  background: #ffffff;
  border-radius: 18px;
  margin: 10px 14px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 4px 18px rgba(0, 30, 60, 0.04);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 14px 10px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-card:hover {
  box-shadow: 0 6px 20px rgba(0, 104, 55, 0.08);
}

/* Group name style */
.group-name {
  font-weight: 700;
  font-size: 15px;
  color: #006837;
  margin-bottom: 8px;
  padding-left: 8px;
  width: 100%;
}

/* Text container styling */
.text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text2 {
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

/* Month total styling */
.month-below {
  display: flex;
  padding: 6px 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin: 8px 4px;
  align-content: center;
  flex-direction: column;
  align-items: center;
}

.month-total {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

/* Centered content with a border */
.centered {
  display: flex;
  justify-content: center;
}

.with-border {
  border-right: 1px solid rgba(226, 232, 240, 0.85);
}

/* Bottom border for separating rows */
.border-bottom {
  border-bottom: 1px solid rgba(226, 232, 240, 0.85);
}

/* Icon styling */
.icon-style {
  font-size: 24px;
  margin-right: 10px;
  color: #006837;
}
</style>
