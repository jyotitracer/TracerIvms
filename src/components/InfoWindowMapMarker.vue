<template>
  <div class="info-window">
    <!-- Vehicle and Driver Info in One Row -->
    <ion-row>
      <ion-col size="2.8">
        <p class="P_class"><strong>Vehicle No</strong></p>
      </ion-col>

      <ion-col>
        <p class="P_class">: {{ vehicleData.vehicleName }} , {{ driverName }}</p>
      </ion-col>
    </ion-row>

    <!-- Location Info in One Row -->
    <ion-row>
      <ion-col size="2.8">
        <p class="P_class"><strong>Location</strong></p>
      </ion-col>
      <ion-col>
        <p class="P_class">: {{ vehicleData.loc_str || 'N/A' }}</p>
      </ion-col>
    </ion-row>

    <!-- Time, Speed, and Show Path in One Row -->
    <ion-row>
      <ion-col size="2.8">
        <p class="P_class"><strong>Time</strong></p>
      </ion-col>
      <ion-col size="5">
        <p class="P_class">: {{ formattedDate }}</p>
      </ion-col>

      <ion-col size="2">
        <p class="P_class"><strong>Speed</strong></p>
      </ion-col>
      <ion-col>
        <p class="P_class">: {{ vehicleData.speed || 'N/A' }}</p>
      </ion-col>

     
    
    </ion-row>
<ion-row> <ion-col>
        <p class="show-path" @click="emitShowPath">Show Path</p>
      </ion-col></ion-row>
  </div>
</template>

<script>
import { computed } from 'vue';
import { IonRow,IonCol,IonIcon } from '@ionic/vue';

export default {
  components:{
  IonRow,IonCol,IonIcon 
},
  props: {
    vehicleData: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const formattedDate = computed(() => {
      if (!props.vehicleData.rec_dt) return '';
      const date = new Date(props.vehicleData.rec_dt);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${second}`;
    });

    const driverName = computed(() => {
      return props.vehicleData.drv_name || '(Driver not available)';
    });

    const emitShowPath = () => {
      emit('show-path', props.vehicleData);
    };

    return {
      formattedDate,
      driverName,
      emitShowPath,
    };
  },
};
</script>

<style scoped>
.info-window {
  width: 100vw;
  padding: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.P_class {
  margin: 0;
  padding: 0;
}

.show-path {
  color: blue;
  font-weight: bold;
  text-align: right;
  cursor: pointer;
  margin: 0;
  padding: 0;
}
</style>
