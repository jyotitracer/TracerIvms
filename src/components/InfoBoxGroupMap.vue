<template>
    <div class="info-box">
      <ion-row>
        <ion-col size="12" class="header">
          <div class="vehicle-id">
            <div class="vehicle-details">
              <div class="label" :style="{ color: vehicleData.sts_colr }">
                <span>{{ vehicleData.veh_sts }}</span>
              </div>
            </div>
          </div>
        </ion-col>
      </ion-row>
  
      <!-- Second Row: Location -->
      <ion-row>
        <ion-col size="12" class="location">
          <span>{{ vehicleData.loc_str }}</span>
        </ion-col>
        <ion-col size="12" class="location">
          <!-- Display formatted rec_dt -->
          <span>{{ formattedDate }}</span>
        </ion-col>
      </ion-row>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
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
      };
    },
  });
  </script>
  
  <style scoped>
  .info-box {
    position: absolute;
    top: 20px; /* Adjust as needed */
    right: 5px; /* Adjust as needed */
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    padding: 10px;
    width: 70%;
    z-index: 10; /* Make sure it's above the map */
  }
  
  .header {
    display: flex;
    justify-content: space-between;
  }
  
  .vehicle-id {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: gray;
  }
  
  .vehicle-details {
    display: flex;
    flex-direction: column;
  }
  
  .label {
    font-size: 12px;
  }
  
  .vehicle-number {
    font-weight: bold;
    color: black;
    font-size: 14px;
  }
  
  .location {
    display: flex;
    align-items: center;
    color: black;
    font-size: 13px;
  }
  </style>
  