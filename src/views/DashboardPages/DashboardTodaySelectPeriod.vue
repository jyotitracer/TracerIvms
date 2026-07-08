<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Select Date</ion-title>
      </ion-toolbar>
    </ion-header>

    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>

    <ion-content fullscreen class="safe-bottom ion-padding"  ref="contentRef">
      <div v-for="month in months" :key="month.name" class="month" >
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
              isSelectedDate(date) ? 'selected-date' : '',
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
        <ion-button expand="full" class="custom-button" @click="confirmSelection">
          Done
        </ion-button>
      </ion-toolbar>
    </ion-footer>
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
  IonButton
} from '@ionic/vue';
import { useRoute } from 'vue-router';
import useNetwork from '@/services/networkService'; // Import the network service
import { onMounted } from 'vue';
import storage from "@/services/storagefile";


export default {
  name: 'Periodtoday',
  setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service


    storage.set('isChangeDateToday', false);


    const route = useRoute();

    const receivedDate = route.params.currentDate
    ? new Date(route.params.currentDate)
    : new Date(); // Fallback to current date if no date is passed


    onMounted(async () => {
      initNetworkListener();
    });

    return {
      receivedDate,
      isConnected, showReconnectedMessage, initNetworkListener
    };
  },
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonFooter,
    IonButton
  },
  data() {
    const currentDate = new Date();
    return {  
      currentYear: currentDate.getFullYear(),
      currentMonth: currentDate.getMonth(),
      currentDay: currentDate.getDate(),
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: [],
      selectedDate: null,
      showAlert: false,
      alertMessage: '',
      
      receivedDate: this.receivedDate

    };
  },
  created() {
    this.generateMonths();
    this.selectedDate = this.receivedDate; // Set the selected date from the received date

  },
  mounted() {
    this.scrollToMonth();
  },

  methods: {
    generateMonths() {
      for (let month = 0; month <= this.currentMonth; month++) {
        const monthDates = this.getDatesInMonth(month, this.currentYear);
        const firstDay = new Date(this.currentYear, month, 1).getDay();
        this.months.push({
          name: new Date(this.currentYear, month).toLocaleString('default', { month: 'long' }),
          blanks: Array(firstDay).fill(null),
          dates: monthDates
        });
      }
    },
    getDatesInMonth(month, year) {
      let date = new Date(year, month, 1);
      const dates = [];
      while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    },
    isSelectedDate(date) {
      return this.selectedDate && date.getTime() === this.selectedDate.getTime();
    },
    isDisabled(date) {
      const today = new Date(this.currentYear, this.currentMonth, this.currentDay);
      return date > today;
    },
    selectDate(date) {
      if (!this.isDisabled(date)) {
        this.selectedDate = date;
      }
    },
    goBack() {
      this.$router.back();
    },
    async confirmSelection() {
      if (this.selectedDate) {
        await storage.set('isChangeDateToday', true);

        await storage.set('savedTodaysDate', this.selectedDate);
        this.goBack();
      }
    },
    async scrollToMonth() {
      // Use receivedDate month if available, otherwise fall back to currentMonth
      const monthIndex = (this.receivedDate instanceof Date && !isNaN(this.receivedDate))
        ? this.receivedDate.getMonth()
        : this.currentMonth;

      await this.$nextTick(); // Wait for Vue DOM updates

      // Wait for Ionic's ion-content to finish its internal layout
      await new Promise(resolve => setTimeout(resolve, 150));

      const monthElements = document.querySelectorAll('.month');

      if (!monthElements[monthIndex]) {
        console.error('Month element not found for index:', monthIndex);
        return;
      }

      const ionContent = this.$refs.contentRef.$el;

      try {
        // Get the actual scrollable inner element from ion-content's shadow DOM
        const scrollEl = await ionContent.getScrollElement();
        const monthEl = monthElements[monthIndex];

        // Calculate position relative to the scroll container
        let offsetTop = 0;
        let el = monthEl;
        while (el && el !== scrollEl) {
          offsetTop += el.offsetTop;
          el = el.offsetParent;
        }

        await ionContent.scrollToPoint(0, offsetTop, 500); // smooth scroll in 500ms
      } catch (e) {
        // Fallback: use basic offsetTop if getScrollElement fails
        const monthTop = monthElements[monthIndex].offsetTop;
        await ionContent.scrollToPoint(0, monthTop, 500);
      }
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
  color: #00875A;;
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

.selected-date {
  background-color: #00875A;;
  color: white;
  border-radius: 50%;
}

.disabled {
  background-color: #ddd;
  color: #aaa;
  pointer-events: none;
}

.custom-button {
  --background: #00875A;;
  --border-radius: 0;
  --border-color: black;
  --border-width: 1px;
  --color: white;
}

.network-status-bar {
  background-color: #00875A;;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}


.network-status-bar.connected {
  background-color: green;
}
</style>
