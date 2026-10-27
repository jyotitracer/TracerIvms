 <template>
 

    <!-- 🔹 Content -->
    <ion-content class="ion-padding">

      <!-- 🚗 Vehicle Status -->
      
      <ion-card>
        <ion-card-header @click="navigateTo('1')">
          <div class="row-between">
            <div class="row">
              <div class="icon-box">
                <ion-icon :icon="colorPaletteOutline"></ion-icon>
              </div>
              <div>
                <ion-card-title>Vehicle Status Color</ion-card-title>
                <ion-card-subtitle>
                  Define status colors
                </ion-card-subtitle>
              </div>
            </div>
            <ion-icon :icon="chevronForwardOutline" class="forword_icon"></ion-icon>

          </div>
        </ion-card-header>
        <ion-card-content>
         <!-- <div class="status-grid">

  <div class="status-item">
    <div 
      class="dot"
      :style="{ background: statusColors.active }"
    ></div>
    <span :style="{ color: statusColors.active }">
      Active
    </span>
  </div>

  <div class="status-item">
    <div 
      class="dot"
      :style="{ background: statusColors.stopped }"
    ></div>
    <span :style="{ color: statusColors.stopped }">
      Stopped
    </span>
  </div>

  <div class="status-item">
    <div 
      class="dot"
      :style="{ background: statusColors.offline }"
    ></div>
    <span :style="{ color: statusColors.offline }">
      Offline
    </span>
  </div>


</div> -->
        </ion-card-content>
      </ion-card>

      <!-- 🔔 Notification -->
     
          <ion-card>
        <ion-card-header  @click="navigateTo('2')">
          <div class="row-between">
            <div class="row">
              <div class="icon-box">
                <ion-icon :icon="notificationsOutline"></ion-icon>
              </div>
              <div>
                <ion-card-title>Event Notification</ion-card-title>
                <ion-card-subtitle>
                  Push alerts
                </ion-card-subtitle>
              </div>
            </div>

            <ion-icon :icon="chevronForwardOutline" class="forword_icon"></ion-icon>
          </div>
        </ion-card-header>
        <ion-card-content>
          <div class="chip-container">
            <!-- <ion-chip>Speeding</ion-chip>
            <ion-chip>Route Deviation</ion-chip>
            <ion-chip>Maintenance</ion-chip> -->
          </div>
        </ion-card-content>
      </ion-card>

      <!-- 🏠 Home Screen -->
      <ion-card>
        <ion-card-header  @click="navigateTo('3')">
          <div class="row-between">
            <div class="row">
              <div class="icon-box">
                <ion-icon :icon="gridOutline"></ion-icon>
              </div>
              <div>
                <ion-card-title>Select Homescreen</ion-card-title>
                <ion-card-subtitle>
                 choose default view
                </ion-card-subtitle>
              </div>
            </div>

            <ion-icon :icon="chevronForwardOutline" class="forword_icon"></ion-icon>
          </div>
        </ion-card-header>

        <!-- <ion-card-content>
          <div class="home-scroll">

            <div 
              class="home-card"
              @click="selectedHome='map'"
            >
              <span>Dashboard</span>
            </div>

            <div 
              class="home-card"
              @click="selectedHome='analytics'"
            >
              <span>Group</span>
            </div>

            <div 
              class="home-card"
              @click="selectedHome='fleet'"
            >
              <span>Map</span>
            </div>

          </div>
        </ion-card-content> -->
      </ion-card>

      <!-- ℹ️ About -->
      <ion-card button>
        <ion-card-header  @click="navigateTo('4')">
          <div class="row-between">
            <div class="row">
              <div class="icon-box">
                <ion-icon :icon="informationCircleOutline"></ion-icon>
              </div>
              <div>
                <ion-card-title>About</ion-card-title>
                <ion-card-subtitle>
                
                </ion-card-subtitle>
              </div>
            </div>

            <ion-icon :icon="chevronForwardOutline" class="forword_icon"></ion-icon>
          </div>
        </ion-card-header>
      </ion-card>

     

    </ion-content>


</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  menuOutline,
  addOutline,
  mapOutline,
  analyticsOutline,
  carOutline,
  settingsOutline,
  colorPaletteOutline,
  notificationsOutline,
  gridOutline,
  chevronForwardOutline,
  informationCircleOutline
} from 'ionicons/icons'
import Constants from '@/common/constants'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, useBackButton } from '@ionic/vue';
import router from '@/router/index'; // Assuming your router file is named router.js
import { onMounted } from 'vue';
import {  selectedPage } from '@/services/userstate'; // Import the global state



   let isFirstTimeDataCall = true;   const navigateTo = (pageName) => {
    // Navigate to the selected page
    console.log("Navigating to", pageName);
    if(pageName==='1')
    {
      router.push('/vehstatus');
    }else if(pageName==='2')
    {
      router.push('/eventnoti');

    }else  if(pageName==='3')
    {
      router.push('/sethome');

    }else if(pageName==='4')
    {
      router.push('/about');

    }
    // Use router navigation here to navigate to the page
  };


const statusColors = {
  active: Constants.Veh_color.Key_Active_Color,
  stopped: Constants.Veh_color.key_Stopped_Color,
  offline: Constants.Veh_color.Key_Offline_Color,
   idle: Constants.Veh_color.Key_Idle_Color,
    towing: Constants.Veh_color.Key_Towing_Color
}

  onMounted(()=>{
    useBackButton(9999, async () => {
           const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');
            });
  });
</script>

<style scoped>
/* Layout */
.row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

ion-card {
  border-radius: 18px;
  margin: 12px 14px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 4px 18px rgba(0, 30, 60, 0.04);
  background: #ffffff;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

ion-card:hover {
  box-shadow: 0 6px 20px rgba(0, 104, 55, 0.08);
}

ion-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

ion-card-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

/* Icon Box */
.icon-box {
  width: 44px;
  height: 44px;
  background: rgba(0, 104, 55, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box ion-icon {
  font-size: 22px;
  color: #006837;
}

.forword_icon {
  font-size: 22px;
  color: #94a3b8;
}

/* Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.status-item {
  text-align: center;
  font-size: 12px;
}

.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: auto;
}

.chip-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.home-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.home-card {
  min-width: 120px;
  height: 80px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #475569;
}

.home-card.active {
  border: 2px solid #006837;
  color: #006837;
  background: #f0fdf4;
}

.logout {
  text-align: center;
  margin-top: 20px;
}
</style>
