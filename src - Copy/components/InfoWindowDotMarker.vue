
<template>
 
    

      <ion-row>
        <ion-col>
          <ion-icon style="height: 20px; width: 20px; margin-right: 5px;"></ion-icon>
          <ion-label class="label-bold fixed-width-label">Vehicle No</ion-label>
          <ion-text class="text-small">: {{ vehicleData.vehNo }}</ion-text>
        </ion-col>
      </ion-row>

  
      <!-- Status -->
      <ion-row>
        <ion-col>
          <ion-icon style="height: 20px; width: 20px; margin-right: 5px;"></ion-icon>
          <ion-label class="label-bold fixed-width-label">Status</ion-label>
          <ion-text class="text-small">: {{ vehicleData.event_status  }}</ion-text>
        </ion-col>
      </ion-row>

      <!-- Expandable section, initially hidden -->
      <ion-row>
        <ion-col size="12">
          <!-- Location -->
          <ion-row>
            <ion-col>
              <ion-icon style="height: 20px; width: 20px; margin-right: 5px;"></ion-icon>
              <ion-label class="label-bold fixed-width-label">Location</ion-label>
              <ion-text class="text-small">: {{ vehicleData.location }}</ion-text>
            </ion-col>
          </ion-row>

          <!-- Time -->
          <ion-row>
            <ion-col>
              <ion-icon style="height: 20px; width: 20px; margin-right: 5px;"></ion-icon>
              <ion-label class="label-bold fixed-width-label">Time</ion-label>
              <ion-text class="text-small">: {{ vehicleData.rtcDate }}  {{ vehicleData.rtcTime }}</ion-text>
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
   
</template>


<style scoped>

ion-col{
  padding: 2px;
  justify-content: center;

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
   // emits: ['showPath'], // Declare the custom event

    setup(props) {

      // console.log("JyotiDisplau",props.vehicleData);

    },

   
 
};
</script>





