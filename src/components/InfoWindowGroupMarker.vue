<!-- InfoBox.vue -->
<template>
    <div class="info-box" style="display: flex; align-items: center; justify-content: space-between;">
      <div style="text-align: left">
        <p><strong>{{ vehicleData.veh_no }}</strong></p>
        <p>{{ driverName }}</p>
      </div>
      <div style="display: flex; align-items: center; justify-content: center; margin-left:10px">
        <a v-if="vehicleData.drv_mob_no" :href="'tel:' + vehicleData.drv_mob_no">
          <img src="/ic_btn_call.png" alt="Call" style="width: 40px; height: 40px; vertical-align: middle;" />
        </a>
        <img v-else src="/btn_call_disable.png" alt="Call Disabled" style="width: 40px; height: 40px; opacity: 0.5;" title="Phone number not available" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      vehicleData: Object
    },
    computed: {
      driverName() {
        return this.vehicleData.drv_name || "Driver not available";
      }
    }
  };
  </script>
  
  <style scoped>
  .info-box {
    /* Add any custom styling here */
  }
  </style>
  