<template>
  <div class="item" @click="openSection">
    <div class="item-details">
      <ul>
        <li v-for="(detail, idx) in itemDetails" :key="idx" class="detail-row">
          <!-- Row with icon and details -->
          <ion-row class="row-with-icon">
            <ion-col size="12" class="location">
              <!-- Fuel Icon -->
              <img :src="getFuelIcon(detail.event_type)" alt="location icon" class="icon-img" />
              <span style="margin-right: 10px;">{{ detail.sfl }} to {{ detail.efl }}</span>
              <span class="span_grid1" style="padding-right: 20px;">{{ detail.fl_drp_val }}</span>

              <!-- Icon for navigation -->
              <div class="icon-container" @click="navigationPage">
                <img src="\ic_chart_fuel.png" alt="star icon" class="star-icon" />
              </div>
            </ion-col>
          </ion-row>

          <!-- Grid with start date, end date, and duration -->
          <ion-grid>
            <ion-row>
              <ion-col>
                <span class="span_grid">{{ detail.sdt }} to {{ detail.edt }}</span>
              </ion-col>
              <ion-col>
                <span class="span_grid1">{{ detail.dur }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>

          <!-- GPS location row -->
          <ion-row>
            <ion-col size="12" class="location">
              <img src="\ic_gps.png" alt="location icon" class="icon-img" />
              <span>{{ detail.loc }}</span>
            </ion-col>
          </ion-row>

          <!-- Divider between rows -->
          <ion-item-divider v-if="idx < itemDetails.length - 1" class="custom-divider"></ion-item-divider>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { IonRow, IonCol, IonItemDivider, IonGrid } from '@ionic/vue'; // Ionic components
import { ref } from 'vue'; // Vue's reactive reference
import router from '@/router/index'; // Router for navigation

export default {
  name: 'FuelItem',
  components: {
    IonRow,
    IonCol,
    IonItemDivider,
    IonGrid,
  },
  props: {
    itemDetails: {
      type: Array,
      required: true, // Expecting an array of item details as a prop
    },
  },
  setup() {
    const fuelUnit = ref(''); // Reactive reference for fuel unit

    // Function to get the fuel icon based on event type
    const getFuelIcon = (event_type) => {
      return event_type === 1 ? "/ic_fuel_fill.png" : "/ic_fuel_drop.png";
    };

    // Function to navigate to the fuel chart page
    const navigationPage = () => {
      router.push({
        path: "/fuelchart",
        query: {
          vehid: this.Vehicleid, // Vehicle ID for query params
          fromdate: this.FromDate, // Start date
          todate: this.ToDate, // End date
        },
      });
    };

    // Function to handle the section opening logic
    const openSection = () => {
      // Section opening logic can go here
    };

    return {
      fuelUnit,
      getFuelIcon,
      navigationPage,
      openSection,
    };
  },
};
</script>

<style scoped>
/* Custom styles scoped to the component */
.custom-divider {
  margin: 0;
  padding: 0;
  height: 0px;
  min-height: 5px;
}

.detail-row {
  justify-content: space-between;
  align-items: center;
  align-content: center;
}

.location {
  display: flex;
  align-items: center;
}

.icon-img {
  margin-right: 10px;
  height: 20px;
  width: 20px;
}

.icon-container {
  margin-left: auto;
}

.span_grid {
  font-size: 12px;
  text-align: left;
  text-transform: none;
}

.span_grid1 {
  font-size: 12px;
  text-align: left;
  text-transform: none;
  font-weight: bold;
}

.star-icon {
  height: 15px;
  width: 15px;
}
</style>
