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
import useNetwork from '@/services/networkService';
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

  data() {
    const today = new Date();
    return {
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth(),
      currentDay: today.getDate(),

      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: [],

      fromDate: null,   // ✅ DEFAULT FROM DATE
      toDate: null,     // ✅ DEFAULT TO DATE

      isPrivacyPolicyOpen: false,
      alertButtons: [
        {
          text: 'OK',
          handler: () => {
            this.isPrivacyPolicyOpen = false;
          }
        }
      ],

      // Network
      isConnected: true,
      showReconnectedMessage: false
    };
  },

  async mounted() {
    const network = useNetwork();
    this.isConnected = network.isConnected;
    this.showReconnectedMessage = network.showReconnectedMessage;
    network.initNetworkListener();

    this.generateMonths();

    // ✅ LOAD DEFAULT DATES
    const savedFrom = await storage.get('savedEventReportFromDate');
    const savedTo = await storage.get('savedEventReportToDate');

    if (savedFrom && savedTo) {
      this.fromDate = new Date(savedFrom);
      this.toDate = new Date(savedTo);
    } else {
      // Default = Today
      this.fromDate = new Date();
      this.toDate = new Date();
    }
  },

  methods: {
    generateMonths() {
      for (let month = 0; month <= this.currentMonth; month++) {
        const dates = this.getDatesInMonth(month, this.currentYear);
        const firstDay = new Date(this.currentYear, month, 1).getDay();

        this.months.push({
          name: new Date(this.currentYear, month).toLocaleString('default', { month: 'long' }),
          blanks: Array(firstDay).fill(null),
          dates
        });
      }
    },

    getDatesInMonth(month, year) {
      const date = new Date(year, month, 1);
      const dates = [];

      while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    },

    isStartDate(date) {
      return this.fromDate && date.toDateString() === this.fromDate.toDateString();
    },

    isEndDate(date) {
      return this.toDate && date.toDateString() === this.toDate.toDateString();
    },

    isInRange(date) {
      if (!this.fromDate || !this.toDate) return false;
      return date > this.fromDate && date < this.toDate;
    },

    isDisabled(date) {
      const today = new Date(this.currentYear, this.currentMonth, this.currentDay);
      return date > today;
    },

    selectDate(date) {
      if (this.isDisabled(date)) return;

      // Start new selection
      if (!this.fromDate || (this.fromDate && this.toDate)) {
        this.fromDate = date;
        this.toDate = null;
        return;
      }

      // End date selection
      if (date < this.fromDate) {
        this.toDate = this.fromDate;
        this.fromDate = date;
      } else {
        this.toDate = date;
      }
    },

    async confirmSelection() {
      if (this.fromDate && !this.toDate) {
        this.toDate = this.fromDate;
      }

      const diffTime = this.toDate - this.fromDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 31) {
        this.isPrivacyPolicyOpen = true;
        this.clearSelection();
        return;
      }

      await storage.set('savedEventReportFromDate', this.fromDate);
      await storage.set('savedEventReportToDate', this.toDate);

      this.$router.back();
    },

    clearSelection() {
      this.fromDate = null;
      this.toDate = null;
    },

    goBack() {
      this.$router.back();
    }
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
