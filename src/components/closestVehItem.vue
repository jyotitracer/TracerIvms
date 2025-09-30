<template>
  <ion-item class="vehicle-item" :style="{ backgroundColor: vehicle.vehColor }">
    <ion-grid class="custom-grid">
      
      <!-- First Row: Header with Vehicle Info -->
      <ion-row>
        <ion-col size="12" class="header">
          <div class="vehicle-id">
           
           <div class="vehicle-details">
              <div class="vehicle-number">{{ vehicle.vehname }}</div>
              <div class="label" :style="{ color: vehicle.vehColor }">
                <span>{{ vehicle.vehstatus }}</span>
              </div>
            </div>
          </div>
          <div class="vehicle-id">
           
           <div class="vehicle-details">
              <div class="vehicle-number">{{ vehicle.distance }} KM</div>
              
            </div>
          </div>
        </ion-col>
        
      </ion-row>
      
      <!-- Second Row: Location -->
      <ion-row>
        <ion-col size="12" class="location">
          <img :src="getLocation" alt="location icon" class="icon-img" />
          <span>{{ vehicle.loc_str }}</span>
        </ion-col>
      </ion-row>
      
     

    

    </ion-grid>
  </ion-item>
</template>

<script>
import { defineComponent } from 'vue';
import { IonItem, IonGrid, IonRow, IonCol } from '@ionic/vue';

export default defineComponent({
  name: 'VehicleItem',
  components: { IonItem, IonGrid, IonRow, IonCol },
  props: {
    vehicle: {
      type: Object,
      required: true
    }
    
  },
 
  computed: {
    // driverIconSrc() {
    //   return this.vehicle.gpssts === 0 ? '/ic_driver_disabled.png' : (this.vehicle.drv_name ? '/ic_driver.png' : '/ic_driver_disabled.png');
    // },
   
  
    getLocation() {
      return this.vehicle.gpssts === 0 ? '/ic_gps_disabled.png' : '/ic_gps.png';
    },
   
    
  }
});
</script>

<style scoped>
.vehicle-item {
  position: relative;
  padding-left: 3px;
}

.vehicle-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
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

.vehicle-id .icon-img-star {
  margin-right: 5px;
  height: 16px;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
}

.vehicle-number {
  font-weight: bold;
  color: black;
  font-size: 14px;

}

.driver-status {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: gray;
}

.driver-status .icon-img-people {
  margin-right: 5px;
  height: 30px;
  margin-left: 20px;
}

.label {
  font-size: 12px;
}

.location {
  display: flex;
  align-items: center;
  color: black;
  font-size: 13px;
}

.location .icon-img {
  margin-right: 10px;
  height: 30px;
}

.fuel {
  display: flex;
  align-items: center;
  color: gray;
  flex-direction: column;
  font-size: 12px;
}

.status-update {
  text-align: right;
  color: gray;
}

.last-status-update {
  color: gray;
  font-size: 10px;
  font-style: oblique;
  margin-top: 0;
}

.icons-row {
  margin-top: 0;
  font-size: 10px;
}

.icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: gray;
  font-weight: bold;
}

.custom-grid {
  padding-left: 0;
  padding-right: 0;
  margin: 0;
}
</style>
