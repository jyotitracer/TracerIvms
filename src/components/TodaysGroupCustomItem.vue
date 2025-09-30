<template>
  <div>
    <!-- Group Name -->
    <div class="group-name">{{ item.group }}</div>
    
    <!-- Main item container -->
    <ion-item class="custom-item">
      <ion-grid style="padding: 0;">
        
        <!-- First row: Pie chart and status items -->
        <ion-row>
          <ion-col>
            <pie-chart :data="item" />
          </ion-col>
          <ion-col>
            <div class="status">
              <div class="status-item moving" :style="movingStyle"
              >
                <span class="status-label">Active</span>
                <span class="status-value">{{ item.moving }}</span>
              </div>
              <div class="status-item stopped" :style="stoppedStyle"
              >
                <span class="status-label">Stopped</span>
                <span class="status-value">{{ item.stopped }}</span>
              </div>
              <div class="status-item offline" :style="offlineStyle"              >
                <span class="status-label">Offline</span>
                <span class="status-value">{{ item.offline }}</span>
              </div>
            </div>
          </ion-col>
        </ion-row>

        <!-- Second row: Fleet group total and average -->
        <ion-row>
          <ion-col>
            <div class="month-below">
              <div class="month-total">Group Total - (Per Vehicle Average)</div>
            </div>
          </ion-col>
        </ion-row>

        <!-- Third row: Distance traveled and violation count -->
        <ion-row class="border-bottom">
          <ion-col class="centered with-border">
            <ion-item>
              <ion-icon :icon="iconName" style="font-size: 30px;" />
              <div class="text-container">
                <p class="text2">{{ item.distance1 }}</p>
                <p class="text2">({{ item.distance2 }})</p>
              </div>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-icon :icon="iconName" style="font-size: 30px;" />
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
              <ion-icon :icon="iconName" style="font-size: 30px;" />
              <div class="text-container">
                <p class="text2">{{ item.moving1 }}</p>
                <p class="text2">({{ item.moving2 }})</p>
              </div>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-icon :icon="iconName" style="font-size: 30px;" />
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
import PieChart from '@/components/PieChartView.vue';
import { IonItem, IonCol, IonRow, IonGrid, IonIcon } from '@ionic/vue';
import { addCircleOutline } from 'ionicons/icons';
import storage from "@/services/storagefile";


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
      iconName: addCircleOutline, // Icon used in ion-item
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
.custom-item {
  display: flex;
  align-items: center;
}

.group-name {
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 5px;
  padding-top: 5px;
}

.status {
  display: flex;
  flex-direction: column;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 0.9em;
  background-color: white;
  border: 1px solid;
}

.status-label {
  margin-right: 10px;
}

.moving {
  border-color: green;
  color: #008000;
}

.stopped {
  border-color: blue;
  color: #0000ff;
}

.offline {
  border-color: gray;
  color: #808080;
}

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

.centered {
  display: flex;
  align-items: center;
}

.with-border {
  border-right: 1px solid #ccc;
}

.border-bottom {
  border-bottom: 1px solid #ccc; /* Horizontal line between rows */
}
</style>
