<template>
  <div v-if="showInfoBox" class="info-box">
    <!-- Container for tooltips -->
    <ion-row >
      <ion-col size="12">
          <ion-row >
            <ion-col size="12" class="vehicle-info">
              <div class="vehicle-id">
                <img src="\car_distance_panel.png" alt="Vehicle Icon" class="icon" />

                <span class="vehicle-number">{{ vehicleData.vehname }}</span>
                <span class="driver-info">{{ vehicleData.driverName || "Driver not available" }}</span>

              </div>

              <div class="close-button" @click="closeBox">
                <ion-icon name="close-outline"></ion-icon>
              </div>

            </ion-col>

            <ion-col size="12">
              <img src="\location_distance_panel.png" alt="Location Icon" class="icon" />
              <span class="location">{{ vehicleData.land_add || "Location not available" }}</span>
            </ion-col>
          </ion-row>

          <ion-row class="distance-time">
            <ion-col size="12">
              <span>{{ vehicleData.travelTime }} </span>
            </ion-col>
          </ion-row>

        
      </ion-col>
    </ion-row>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, PropType, computed,ref } from 'vue';
  import {  IonRow,IonCol} from '@ionic/vue';

  
  export default defineComponent({
    components:{IonRow,IonCol},
    props: {
      vehicleData: {
        type: Object as PropType<any>, // You can replace `any` with a more specific type
        required: true,
      },
    },
    setup(props) {

      const showInfoBox = ref(true); // State to control visibility of the info box

      // Format the rec_dt date to "DD/MM/YYYY hh:mm A"
      const formattedDate = computed(() => {
        if (!props.vehicleData.rec_dt) return ''; // Handle undefined or null rec_dt
  
        const date = new Date(props.vehicleData.rec_dt);
  
        // Manually format the date as per "DD/MM/YYYY hh:mm AM/PM"
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
  
        const hours = date.getHours() % 12 || 12; // Convert 24-hour time to 12-hour time
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
      });
  
      return {
        formattedDate,
        showInfoBox,

      };
    },

    methods: {
    closeBox() {
      // Logic to close the info box
     // console.log('Closing info box');
      this.showInfoBox = false;
      this.$emit('closeInfoBox'); // Emit event to parent (map.vue)

    }
  }
  });
  </script>
  
  <style scoped>
  .info-box {
    position: absolute;
    top: 10px;
    right: 5px;
    background-color: #FDC629;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 10;
    width: 90%;
    padding: 10px;
  }
  
  .tooltips-container {
    margin-top: 5px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
  }
  
  .vehicle-info {
    display: flex;
    align-items: center;
  }
  
  .vehicle-id {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #4d4d4d;
  }
  
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  
  .vehicle-number {
    font-weight: bold;
    margin-left: 5px;
  }
  
  .driver-info
    {
      margin-left: 20px;
    margin-right: 5px;
    font-size: 14px;
    color: #4d4d4d;
    font-weight: bold;

  }

  .location {
    margin-left:5px;
    margin-right: 5px;
    font-size: 14px;
    color: #4d4d4d;
    align-items: center;
    align-content: center;
    font-weight: bold;

  }
  
  .distance-time {
    font-size: 16px;
    font-weight: bold;
    margin-left: 35px;
    color: #4d4d4d;
  }
  
  .close-button {
    font-size: 12px;
    color: #4d4d4d;
    cursor: pointer;
    margin-left: 20px;
  }
  
  .call-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
  }
  
  ion-icon {
    font-size: 24px;
  }
  </style>
  