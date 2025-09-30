<template>
  <div class="group-name">{{ item.group }}</div>
  <ion-item class="custom-item" @click="handleClick">
    <pie-chart :data="item.sts_arr" />
    <div class="item-content">
      <div class="status">
        <div
              v-for="status in statusMap"
              :key="status.sts_lbl"
              :class="['status-item', statusClass(status.sts_lbl)]"
              :style="{ borderColor: getStatusColor(status.sts_lbl), color: getStatusColor(status.sts_lbl) }"
            >        
           <span class="status-label">{{ status.sts_lbl }}</span>
          <span class="status-value">{{ status.sts_cnt }}</span>
        </div>
        </div>
    </div>
   <!-- <img src="\right-arrow.png" alt="event icon" class="icon-arrow" @click="callnextPage" /> -->

  </ion-item>
</template>

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

<style scoped>
.custom-item {
  display: flex;
  align-items: center;
}
.item-content {
  flex: 1;
}
.group-name {
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 5px;
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
  background-color: #f5f5f5; /* Use a subtle background color */
  border: 1px solid;
  transition: background-color 0.2s, color 0.2s;
}
.status-label {
  margin-right: 10px; /* Adjust this value as needed */
}



</style>
