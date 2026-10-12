<template>
  <ion-grid class="layout-showpath-result" v-if="showPathResult">

    <!-- ================= SUMMARY CARD ================= -->
    <ion-card style="margin: 5px;" v-if="isSummaryChecked">

      <!-- Header -->
      <ion-row class="ion-align-items-center">
        <ion-col size="7">
          <ion-row class="ion-align-items-center">
            <ion-col size="5." class="label-col">
              <ion-label class="label-bold">Vehicle No</ion-label>
            </ion-col>
            <ion-col size="7">
              <ion-text class="text-small">: {{ vehicleData.vehNo }}</ion-text>
            </ion-col>
          </ion-row>
        </ion-col>

        <ion-col size="4">
          <ion-row class="ion-align-items-center">
            <ion-col size="5" class="label-col">
              <ion-label class="label-bold">Distance</ion-label>
            </ion-col>
            <ion-col size="7">
              <ion-text class="text-small">: {{ vehicleData.distance }} km</ion-text>
            </ion-col>
          </ion-row>
        </ion-col>

        <ion-col size="1" class="ion-text-right">
          <ion-icon
            :name="isExpandedSummary ? 'chevron-up' : 'chevron-down'"
            @click="toggleExpandSummary"
            style="height: 25px; width: 25px;"
          />
        </ion-col>
      </ion-row>

      <!-- Expanded Summary -->
      <div v-if="isExpandedSummary">

        <ion-row class="ion-align-items-center">
          <ion-col size="3" class="label-col">
            <ion-label class="label-bold">Start Location</ion-label>
          </ion-col>
          <ion-col size="9">
            <ion-text class="text-small">: {{ vehicleData.start_loc }}</ion-text>
          </ion-col>
        </ion-row>

        <ion-row class="ion-align-items-center">
          <ion-col size="3" class="label-col">
            <ion-label class="label-bold">End Location</ion-label>
          </ion-col>
          <ion-col size="9">
            <ion-text class="text-small">: {{ vehicleData.end_loc }}</ion-text>
          </ion-col>
        </ion-row>

        <ion-row class="ion-align-items-center">
          <ion-col size="3" class="label-col">
            <ion-label class="label-bold">Duration</ion-label>
          </ion-col>
          <ion-col size="9">
            <ion-text class="text-small">: {{ vehicleData.duration }}</ion-text>
          </ion-col>
        </ion-row>

      </div>
    </ion-card>

    <!-- ================= TRIP CARD ================= -->
    <ion-card style="margin: 5px;" v-if="isTripInfoChecked">

      <!-- Header -->
      <ion-row class="ion-align-items-center">
        <ion-col size="11">
          <ion-row class="ion-align-items-center">
            <ion-col size="3.3" class="label-col">
              <ion-label class="label-bold">Driver</ion-label>
            </ion-col>
            <ion-col size="8">
              <ion-text class="text-small">: {{ driverName }}</ion-text>
            </ion-col>
          </ion-row>
        </ion-col>

        <ion-col size="1" class="ion-text-right">
          <ion-icon
            :name="isExpandedTrip ? 'chevron-up' : 'chevron-down'"
            @click="toggleExpandTrip"
            style="height: 25px; width: 25px;"
          />
        </ion-col>
      </ion-row>

      <!-- Status -->
      <ion-row class="ion-align-items-center">
        <ion-col size="3" class="label-col">
          <ion-label class="label-bold">Status</ion-label>
        </ion-col>
        <ion-col size="9">
          <ion-text class="text-small">: {{ vehicleData.event_status }}</ion-text>
        </ion-col>
      </ion-row>

      <!-- Expanded Trip -->
      <div v-if="isExpandedTrip">

        <ion-row class="ion-align-items-center">
          <ion-col size="3" class="label-col">
            <ion-label class="label-bold">Location</ion-label>
          </ion-col>
          <ion-col size="9">
            <ion-text class="text-small">: {{ vehicleData.location }}</ion-text>
          </ion-col>
        </ion-row>

        <ion-row class="ion-align-items-center">
          <ion-col size="3" class="label-col">
            <ion-label class="label-bold">Time</ion-label>
          </ion-col>
          <ion-col size="9">
            <ion-text class="text-small">
              : {{ vehicleData.rtcDate }} {{ vehicleData.rtcTime }}
            </ion-text>
          </ion-col>
        </ion-row>

      </div>
    </ion-card>

  </ion-grid>
</template>

<script>
import {
  IonGrid,
  IonCard,
  IonRow,
  IonCol,
  IonText,
  IonLabel,
  IonIcon
} from '@ionic/vue';

export default {
  components: {
    IonGrid,
    IonCard,
    IonRow,
    IonCol,
    IonText,
    IonLabel,
    IonIcon
  },

  props: {
    vehicleData: {
      type: Object,
      required: true
    },
    isSummaryChecked: Boolean,
    isTripInfoChecked: Boolean
  },

  data() {
    return {
      showPathResult: true,
      isExpandedSummary: false,
      isExpandedTrip: false
    };
  },

  computed: {
    driverName() {
      return this.vehicleData.drv_name || 'Driver not available';
    }
  },

  methods: {
    toggleExpandSummary() {
      this.isExpandedSummary = !this.isExpandedSummary;
    },
    toggleExpandTrip() {
      this.isExpandedTrip = !this.isExpandedTrip;
    }
  }
};
</script>


<style scoped>
ion-grid {
  padding: 0;
}

ion-row {
  margin-bottom: 4px;
}

ion-col {
  padding: 2px;
}

.label-bold {
  font-weight: bold;
  font-size: 13px;
  color: black;
}

.label-col {
  max-width: 120px;
}

.text-small {
  font-size: 13px;
  color: black;
}

.layout-showpath-result {
  margin: 0;
}
</style>
