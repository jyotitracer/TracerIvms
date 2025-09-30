
<template>
  <ion-grid class="layout-showpath-result" v-if="showPathResult">
    
    <!-- Summary Card -->
    <ion-card style="margin: 5px;" v-if="isSummaryChecked">
      <ion-row class="ion-align-items-center">
        <!-- Vehicle No and Value (Start of the line) -->
        <ion-col size="7">
          <ion-col size="3.5">   

          <ion-icon style="height: 15px; width: 15px; margin-right: 2px;"></ion-icon>
          <ion-label class="label-bold fixed-width-label" style="padding-left: 2px;">Vehicle No</ion-label>
          </ion-col>
          <ion-col>
          <ion-text class="text-small">: {{ vehicleData.vehNo }}</ion-text>
        </ion-col>
        </ion-col>

        <!-- Distance and Value (End of the line) -->
        <ion-col size="4" class="ion-text-right">
          <ion-label class="label-bold">Distance</ion-label>
          <ion-text class="text-small">: {{ vehicleData.distance }}km</ion-text>
        </ion-col>

        <!-- Chevron Icon (Up/Down based on isExpandedSummary) -->
        <ion-col size="1" class="ion-text-right">
          <ion-icon :name="isExpandedSummary ? 'chevron-up' : 'chevron-down'" 
                    @click="toggleExpandSummary" 
                    style="color: black; height: 25px; width: 25px"></ion-icon>
        </ion-col>
      </ion-row>

      <!-- Expandable section, initially hidden -->
      <div v-if="isExpandedSummary">


  
          <!-- Start Location -->
          <ion-row class="ion-align-items-center">
            <ion-col size="3.5">   
               <img src="\ic_end.png" alt="Vehicle Icon" style="height: 15px; width: 15px; margin-right: 2px;"/>
              <ion-label class="label-bold fixed-width-label">Start Location</ion-label>
            </ion-col>
            <ion-col>
              <ion-text class="text-small P_class">: {{ vehicleData.start_loc }}</ion-text>
            </ion-col>
          </ion-row>

          <!-- End Location -->
          <ion-row class="ion-align-items-center">
            <ion-col size="3.5">   
              <img src="\ic_st.png" alt="Vehicle Icon" style="height: 15px; width: 15px; margin-right: 2px;"/>
              <ion-label class="label-bold fixed-width-label">End Location</ion-label>
              </ion-col>
              <ion-col>
              <ion-text class="text-small P_class">: {{ vehicleData.end_loc }}</ion-text>
            </ion-col>
          </ion-row>

          <!-- Duration -->
            <ion-col size="7">
          <ion-col size="3.5">   

          <ion-icon style="height: 15px; width: 15px; margin-right: 2px;"></ion-icon>
          <ion-label class="label-bold fixed-width-label" style="padding-left: 2px;">Duration</ion-label>
          </ion-col>
          <ion-col>
          <ion-text class="text-small">: {{ vehicleData.duration }}</ion-text>
        </ion-col>
        </ion-col>
      </div>
    </ion-card>

    <!-- Trip Card -->
    <ion-card style="margin: 5px;" v-if="isTripInfoChecked">
      <ion-row>
        <!-- Driver and Value (Start of the line) -->
        <ion-col size="11" style="padding-left: 2px;">
          <ion-col size="3.5">   

          <ion-icon style="height: 15px; width: 15px; margin-right: 2px;"></ion-icon>
          <ion-label class="label-bold fixed-width-label" style="padding-left: 2px; padding-bottom: 0px">Driver</ion-label>
        </ion-col>
        <ion-col>
          <ion-text class="text-small">: {{ driverName }}</ion-text>
        </ion-col>
        </ion-col>

        <!-- Chevron Icon (Up/Down based on isExpandedTrip) -->
        <ion-col size="1" class="ion-text-right">
          <ion-icon :name="isExpandedTrip ? 'chevron-up' : 'chevron-down'" 
                    @click="toggleExpandTrip" 
                    style="color: black; height: 25px; width: 25px"></ion-icon>
        </ion-col>
      </ion-row>

      <!-- Status -->
      <ion-row>
        <ion-col size="3.5">   
          <ion-icon style="height: 15px; width: 15px; margin-right: 2px;"></ion-icon>
          <ion-label class="label-bold fixed-width-label">Status</ion-label>
        </ion-col>
        <ion-col>
          <ion-text class="text-small">: {{ vehicleData.event_status }}</ion-text>
        </ion-col>
      </ion-row>

      <!-- Expandable section, initially hidden -->
      <ion-row v-if="isExpandedTrip">

          <!-- Time -->


          <!-- Location -->
          <ion-row>
            <ion-col size="3.5">   
              <ion-icon style="height: 15px; width: 15px; margin-right: 2px;"></ion-icon>
              <ion-label class="label-bold fixed-width-label">Location</ion-label>
              </ion-col>
              <ion-col>
              <ion-text class="text-small">: {{ vehicleData.location }}</ion-text>
            </ion-col>
          </ion-row>


      
          <ion-row>
            <ion-row size="3.5">   
              <ion-icon style="height: 15px; width: 15px; margin-right: 2px;"></ion-icon>
              <ion-label class="label-bold fixed-width-label">Time</ion-label>
            </ion-row>
            <ion-col>
              <ion-text class="text-small">: {{ vehicleData.rtcDate }} {{ vehicleData.rtcTime }}</ion-text>
            </ion-col>
          </ion-row>

      </ion-row>
    </ion-card>

  </ion-grid>
</template>


<style scoped>

ion-grid{
      -webkit-padding-start: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    padding-inline-start: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    -webkit-padding-end: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    padding-inline-end: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    padding-top: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    padding-bottom: var(--ion-grid-padding-xs, var(--ion-grid-padding, 0px));
    /* -webkit-margin-start: auto; */
    /* margin-inline-start: auto; */
    /* -webkit-margin-end: auto; */
    /* margin-inline-end: auto; */
}

ion-col{
  padding: 2px;
  justify-content: center;

}

.P_class {
  margin: 0;
  padding: 0;
}


.ion-align-items-center{
  justify-content: center;

}
.layout-showpath-result {
  justify-content: center;
  margin: 0px;
}


.label-bold {
  font-weight: bold;
  font-size: 13px;
  color: black;
  justify-content: center;
}

.fixed-width-label {
  width: 80px; /* Set your desired fixed width */
  display: inline-block; /* Ensures the label occupies the fixed width */
}

.text-small {
  font-size: 13px;
  color: black;
}


.ion-no-padding {
  padding: 0;
}
</style>


<script>
import { computed } from 'vue';
import { IonGrid,IonCard,IonRow,IonCol,IonText,IonLabel,IonIcon } from '@ionic/vue';
export default {

 components:{
  IonGrid,IonCard,IonRow,IonCol,IonText,IonLabel,IonIcon
 },
  data() {
    return {
      showPathResult: true, // Show/Hide path result section
      isExpandedSummary: false, // Control visibility of expanded summary section
      isExpandedTrip: false, // Control visibility of expanded trip section

  
    };
  },
//   watch: {
//   vehicleData: {
//     handler(newValue) {
//       console.log("Vehicle data updated:", newValue);
//       // Perform any additional logic if necessary
//     },
//     deep: true,
//   },
// },

    props: {
      vehicleData: {
        type: Object, // You can replace `any` with a more specific type
        required: true,
      },
      isSummaryChecked: {
      type: Boolean,
      required: false, // Ensure it's passed down from the parent
      },
      isTripInfoChecked: {
        type: Boolean,
        required: false, // Ensure it's passed down from the parent
      }
    },
   
    computed: {
      driverName() {
        return this.vehicleData.drv_name || "Driver not available";
      }
    },

   
  methods: {
    toggleExpandSummary() {
      this.isExpandedSummary = !this.isExpandedSummary; // Toggle summary expand/collapse
    },
    toggleExpandTrip() {
      this.isExpandedTrip = !this.isExpandedTrip; // Toggle trip expand/collapse
    }
  }
};
</script>





