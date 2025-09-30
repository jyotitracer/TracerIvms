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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonFooter, IonButton, IonAlert } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import useNetwork from '@/services/networkService'; // Import the network service


const fromDate=ref('');
  const toDate=ref('');


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
  setup() {

    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

  // Reactive state to control the alert visibility
  const isPrivacyPolicyOpen = ref(false);

  // Define the buttons for the alert
  const alertButtons = [
    {
      text: 'OK',
      handler: () => {
        console.log('OK clicked');
        isPrivacyPolicyOpen.value = false; // Close the alert after clicking OK
      }
    }
  ];

  // Method to show the alert
  function showPrivacyPolicyAlert() {
    isPrivacyPolicyOpen.value = true;
  }


  const savedFuelReportFromDate = localStorage.getItem('savedFuelReportFromDate');
    const savedFuelReportToDate = localStorage.getItem('savedFuelReportToDate');

  onMounted(()=>{
    initNetworkListener();
    if (savedFuelReportFromDate) {
              fromDate.value = new Date(savedFuelReportFromDate);
            } else {
              fromDate.value = new Date(); // Default to current date if not stored
            }

            if (savedFuelReportToDate) {
              toDate.value = new Date(savedFuelReportToDate);
            } else {
              toDate.value = new Date(); // Default to current date if not stored
            }
  });

  return {
    isPrivacyPolicyOpen,
    alertButtons,
    showPrivacyPolicyAlert,
    isConnected, showReconnectedMessage, initNetworkListener,fromDate,toDate

  };
},

  data() {
    const currentDate = new Date();
    return {
      currentYear: currentDate.getFullYear(),
      currentMonth: currentDate.getMonth(),
      currentDay: currentDate.getDate(),
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: [],
      fromDate: null,
      toDate: null,
      showAlert: false,
      alertMessage: ''
    };
  },
  created() {
    this.generateMonths();
  },
  methods: {
    generateMonths() {
      for (let month = 0; month <= this.currentMonth; month++) {
        let monthDates = this.getDatesInMonth(month, this.currentYear);
        let firstDay = new Date(this.currentYear, month, 1).getDay();
        this.months.push({
          name: new Date(this.currentYear, month).toLocaleString('default', { month: 'long' }),
          blanks: Array(firstDay).fill(null),
          dates: monthDates,
        });
      }
    },
    getDatesInMonth(month, year) {
      let date = new Date(year, month, 1);
      let dates = [];
      while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    },
    isStartDate(date) {
      // return this.fromDate && date.getTime() === this.fromDate.getTime();
      return this.fromDate && date.toDateString() === this.fromDate.toDateString();

    },
    
    isEndDate(date) {
      // return this.toDate && date.getTime() === this.toDate.getTime();
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
      if (!this.fromDate || this.toDate) {
        this.fromDate = date;
        this.toDate = null;
      } else {
        if (date < this.fromDate) {
          this.toDate = this.fromDate;
          this.fromDate = date;
        } else {
          this.toDate = date;
        }
      }
    },
    goBack() {
      this.$router.back();
    },
    confirmSelection() {
      if (this.fromDate && !this.toDate) {
    // If only a single date is selected, set both fromDate and toDate to this date
    this.toDate = this.fromDate;
  }

      if (this.fromDate && this.toDate) {
        const diffTime = Math.abs(this.toDate - this.fromDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
          this.showPrivacyPolicyAlert();
          this.clearSelection();
        } else {

          // Proceed with valid date selection logic here
         // console.log('Valid selection:', this.fromDate+"\n"+ this.toDate);
         
          localStorage.setItem('savedFuelReportFromDate', this.fromDate);
          localStorage.setItem('savedFuelReportToDate', this.toDate);
          this.$router.back();

        }
      }
    },
    clearSelection() {
      this.fromDate = null;
      this.toDate = null;
    }
  },
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
