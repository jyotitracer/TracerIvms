<template>
  <div>
    <div class="group-name">{{ item.group }}</div>
    <ion-item class="custom-item">
      <ion-grid style="padding: 0;">
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
            <ion-item>
              <ion-icon :icon="iconName" class="icon-style" />
              <div class="text-container">
                <p class="text2">{{ item.distance1 }}</p>
                <p class="text2">({{ item.distance2 }})</p>
              </div>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-icon :icon="iconName" class="icon-style" />
              <div class="text-container">
                <p class="text2">{{ item.vio1 }}</p>
                <p class="text2">({{ item.vio2 }})</p>
              </div>
            </ion-item>
          </ion-col>
        </ion-row>

        <!-- Fourth row: Moving duration and fuel consumed -->
        <ion-row>
          <ion-col class="centered with-border">
            <ion-item>
              <ion-icon :icon="iconName" class="icon-style" />
              <div class="text-container">
                <p class="text2">{{ item.moving1 }}</p>
                <p class="text2">({{ item.moving2 }})</p>
              </div>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-icon :icon="iconName" class="icon-style" />
              <div class="text-container">
                <p class="text2">{{ item.fuel1 }}</p>
                <p class="text2">({{ item.fuel2 }})</p>
              </div>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
  </div>
</template>

<script>
import BarChartView from '@/components/BarChartView.vue'; // Adjust the path as per your project structure
import { IonItem, IonCol, IonRow, IonGrid, IonIcon } from '@ionic/vue';
import { addCircleOutline } from 'ionicons/icons';

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
      iconName: addCircleOutline, // You can replace with any desired icon
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
/* Layout and spacing for the group item */
.custom-item {
  display: flex;
  align-items: center;
}

/* Group name style */
.group-name {
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 5px;
  padding-top: 5px;
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
  font-size: 12px;
  color: #5d5b5b;
}

/* Month total styling */
.month-below {
  display: flex;
  padding: 10px;
  align-content: center;
  flex-direction: column;
  align-items: center;
}

.month-total {
  font-size: 14px;
  text-align: center;
}

/* Centered content with a border */
.centered {
  display: flex;
  justify-content: center;
}

.with-border {
  border-right: 1px solid #ccc;
}

/* Bottom border for separating rows */
.border-bottom {
  border-bottom: 1px solid #ccc;
}

/* Icon styling */
.icon-style {
  font-size: 30px;
  margin-right: 10px;
}
</style>
