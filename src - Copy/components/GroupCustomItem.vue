<template>


  <!-- 📊 Status Row -->
  <ion-item class="custom-item" @click="handleClick">

  <!-- 🔵 Pie Chart (CENTER) -->
  <div class="chart-section">
    <pie-chart :data="item.sts_arr" />
  </div>

  <!-- 🏷️ Group Name (LEFT) -->
  <div class="group-name">
    {{ item.group }}
  </div>

  <!-- 📊 Status List -->
  <div class="status-row">
    <div
      v-for="status in statusMap"
      :key="status.sts_lbl"
      class="status-item"
    >
      <!-- 🔴 Color Dot -->
      <span 
        class="status-dot"
        :style="{ backgroundColor: getStatusColor(status.sts_lbl) }"
      ></span>

      <!-- Label -->
      <span class="status-label">
        {{ status.sts_lbl }}
      </span>

      <!-- Value -->
      <span class="status-value">
        {{ status.sts_cnt }}
      </span>
    </div>
  </div>

</ion-item>
</template>



<style scoped>
/* 🔥 Override Ionic */
.custom-item::part(native) {
  display: flex;
  flex-direction: column;
  align-items: stretch;   /* 🔥 important (not center) */
}

ion-item {
  --inner-border-width: 0px;
  --border-width: 0px;
  --padding-start: 0px;
  --inner-padding-end: 0px;
}

/* Card style */
.custom-item {
  border-radius: 16px;
  background: white;
  margin: 10px 20px;
  padding: 10px;
  border: none;
  box-shadow: 0px 12px 32px rgba(2, 31, 41, 0.06);
}

/* Chart center */
.chart-section {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  margin-top: 5px;
}

/* Group name LEFT */
.group-name {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: #021f29;
  margin-bottom: 10px;
  text-align: left;
}

/* Status container */
.status-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

/* Each row */
.status-item {
  display: flex;
  align-items: center;
    font-size: 14px;

  justify-content: space-between; /* 🔥 value to right */
}

/* Left part (dot + label) */
.status-label {
  flex: 1;
  margin-left: 8px;
  color: #535f66;
  font-family: 'Inter', sans-serif;
}

/* Dot */
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* Value (right) */
.status-value {
  font-weight: 600;
}
</style>

<!-- <style scoped>

.custom-item::part(native) {
  display: flex;
  flex-direction: column;   /* 🔥 make vertical */
  align-items: center;
  justify-content: center;
}


.custom-item {
  display: flex;
  flex-direction: column; /* 🔥 vertical layout */
  align-items: center;
  text-align: center;

   border-radius: 16px;
  border: 1px solid #f5f5f5;
  margin: 10px;

}

/* Chart */
.chart-section {
  margin-bottom: 8px;
}

/* Group Name */
.group-name {
  font-weight: bold;
  margin-bottom: 8px;
}

/* 🔥 Status Row */
.status-row {
  display: flex;
  flex-wrap: wrap;      /* wrap if many items */
  justify-content: center;
    flex-direction: column;  /* 🔥 important */

  gap: 8px;
}

/* Status Item */
.status-item {
  display: flex;
  gap: 5px;
  align-items: center;


  font-size: 12px;
}
</style> -->


<script>
import PieChart from '@/components/PieChartViewGroup.vue';
import { IonItem } from '@ionic/vue';
import storage from "@/services/storagefile";
import Constants from "@/common/constants";

export default {
  name: 'GroupCustomItem',
  components: {
    PieChart,
    IonItem,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      moving_color: '',  // To store the dynamic color
      stopped_color: '',
      offline_color: '',
      idle_color:'',
    };
  },
  async created() {
    // Fetch color values from storage or use defaults
    const movingStoredColor = await storage.get('movingcolor');
    const stoppedStoredColor = await storage.get('stoppedcolor');
    const idleStoredColor = await storage.get('idlecolor');
    const offlineStoredColor = await storage.get('offlinecolor');

    this.moving_color = movingStoredColor || Constants.Veh_color.Key_Active_Color;
    this.stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
    this.offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;
    this.idle_color = idleStoredColor || Constants.Veh_color.Key_Idle_Color;

  },
  computed: {
    // Create a computed property to map sts_arr to a format that can be used in the template
    statusMap() {
      return this.item.sts_arr || [];
    },
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
    idleStyle() {
      return {
        borderColor: this.idle_color,
        color: this.idle_color,
      };
    },
    
  },
  setup(props){

   // console.log("displaydata",props.item);

  },

  emits: ['click'], // Declare custom events here
  methods: {

        statusClass(label) {
      const classMap = {
        'Moving': 'moving',
        'Idle': 'idle',
        'Stopped': 'stopped',
        'Offline': 'offline'
      };
      return classMap[label] || '';
    },

    getStatusColor(label) {
    switch (label) {
      case 'Moving':
        return this.moving_color;
      case 'Idle':
        return this.idle_color;
      case 'Stopped':
        return this.stopped_color;
      case 'Offline':
        return this.offline_color;
      default:
        return 'black'; // Fallback color
    }
  },

    handleClick(event) {
      this.$emit('click', event); // Emit the click event
    },
  },
};
</script>