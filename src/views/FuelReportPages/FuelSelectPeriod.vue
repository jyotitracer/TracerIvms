<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Select Period</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   



    <ion-content class="ion-padding">
      <div v-for="month in months" :key="month.name" class="month">
        <h5>{{ month.name }} {{ currentYear }}</h5>
        <div class="days-row">
          <div class="day" v-for="day in days" :key="day">{{ day }}</div>
        </div>
        <div class="dates-row">
          <div v-for="blank in month.blanks" :key="'b-' + blank" class="blank"></div>
          <div
            v-for="date in month.dates"
            :key="date"
            :class="[
              'date',
              isStartDate(date) ? 'start-date' : '',
              isEndDate(date) ? 'end-date' : '',
              isInRange(date) ? 'in-range' : '',
              isDisabled(date) ? 'disabled' : ''
            ]"
            @click="!isDisabled(date) && selectDate(date)"
          >
            {{ date.getDate() }}
          </div>
        </div>
      </div>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar style="--background: white;">
        <ion-button expand="full" class="custom-button" @click="confirmSelection">Done</ion-button>
      </ion-toolbar>
    </ion-footer>

    <ion-alert
    :is-open="isPrivacyPolicyOpen"
    header="Alert"
    message="The selected period cannot be more than 31 days."
    :buttons="alertButtons"
  >
  </ion-alert>

  </ion-page>
</template>
<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonFooter,
  IonButton,
  IonAlert
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import useNetwork from '@/services/networkService';
import storage from "@/services/storagefile";

export default {
  name: 'Calendar',

  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonFooter,
    IonButton,
    IonAlert
  },

  setup(_, { emit }) {

    /* ---------------- NETWORK ---------------- */
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork();

    /* ---------------- DATES ---------------- */
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const months = ref([]);

    const fromDate = ref(null);
    const toDate = ref(null);

    /* ---------------- ALERT ---------------- */
    const isPrivacyPolicyOpen = ref(false);

    const alertButtons = [
      {
        text: 'OK',
        handler: () => {
          isPrivacyPolicyOpen.value = false;
        }
      }
    ];

    const showPrivacyPolicyAlert = () => {
      isPrivacyPolicyOpen.value = true;
    };

    /* ---------------- CALENDAR BUILD ---------------- */
    const generateMonths = () => {
      for (let month = 0; month <= currentMonth; month++) {
        const dates = getDatesInMonth(month, currentYear);
        const firstDay = new Date(currentYear, month, 1).getDay();

        months.value.push({
          name: new Date(currentYear, month).toLocaleString('default', { month: 'long' }),
          blanks: Array(firstDay).fill(null),
          dates
        });
      }
    };

    const getDatesInMonth = (month, year) => {
      const date = new Date(year, month, 1);
      const dates = [];

      while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    };

    /* ---------------- DATE HELPERS ---------------- */
    const isStartDate = (date) =>
      fromDate.value && date.toDateString() === fromDate.value.toDateString();

    const isEndDate = (date) =>
      toDate.value && date.toDateString() === toDate.value.toDateString();

    const isInRange = (date) => {
      if (!fromDate.value || !toDate.value) return false;
      return date > fromDate.value && date < toDate.value;
    };

    const isDisabled = (date) => {
      const todayDate = new Date(currentYear, currentMonth, currentDay);
      return date > todayDate;
    };

    /* ---------------- DATE SELECTION ---------------- */
    const selectDate = (date) => {
      if (isDisabled(date)) return;

      // Start new selection
      if (!fromDate.value || (fromDate.value && toDate.value)) {
        fromDate.value = date;
        toDate.value = null;
        return;
      }

      // End selection
      if (date < fromDate.value) {
        toDate.value = fromDate.value;
        fromDate.value = date;
      } else {
        toDate.value = date;
      }
    };

    /* ---------------- CONFIRM ---------------- */
    const confirmSelection = async () => {
      if (fromDate.value && !toDate.value) {
        toDate.value = fromDate.value;
      }

      const diffTime = toDate.value - fromDate.value;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 31) {
        showPrivacyPolicyAlert();
        clearSelection();
        return;
      }

      await storage.set('savedFuelReportFromDate', fromDate.value);
      await storage.set('savedFuelReportToDate', toDate.value);

      history.back();
    };

    const clearSelection = () => {
      fromDate.value = null;
      toDate.value = null;
    };

    const goBack = () => {
      history.back();
    };

    /* ---------------- MOUNTED ---------------- */
    onMounted(async () => {
      initNetworkListener();
      generateMonths();

      const savedFrom = await storage.get('savedFuelReportFromDate');
      const savedTo = await storage.get('savedFuelReportToDate');

      if (savedFrom && savedTo) {
        fromDate.value = new Date(savedFrom);
        toDate.value = new Date(savedTo);
      } else {
        fromDate.value = new Date();
        toDate.value = new Date();
      }
    });

    /* ---------------- EXPOSE ---------------- */
    return {
      isConnected,
      showReconnectedMessage,

      days,
      months,

      fromDate,
      toDate,

      isStartDate,
      isEndDate,
      isInRange,
      isDisabled,
      selectDate,

      confirmSelection,
      clearSelection,
      goBack,

      isPrivacyPolicyOpen,
      alertButtons
    };
  }
};
</script>



<style scoped>
.month {
  margin-bottom: 20px;
  font-size: 16px;
}
.month h5 {
  color: red;
  font-size: 16px;
  text-align: center;
}
.days-row,
.dates-row {
  display: flex;
  flex-wrap: wrap;
}
.day,
.blank,
.date {
  width: calc(100% / 7);
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}
.date {
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}
.start-date,
.end-date {
  background-color: red;
  color: white;
  border-radius: 50%;
}
.in-range {
  background-color: red;
  color: white;
}
.disabled {
  background-color: #ddd;
  color: #aaa;
  pointer-events: none;
}
.custom-button {
  --background: red;
  --border-radius: 0;
  --border-color: black;
  --border-width: 1px;
  --color: white;
}
.network-status-bar {
  background-color: red;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}


.network-status-bar.connected {
  background-color: green;
}
</style>
