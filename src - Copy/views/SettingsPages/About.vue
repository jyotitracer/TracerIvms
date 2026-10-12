<template>
  <ion-page>

    <!-- 🔹 Header -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>About</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- 🌐 Network Status -->
    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>

    <div 
      v-if="isConnected && showReconnectedMessage" 
      class="network-status-bar connected"
    >
      Connected to Network
    </div>

    <!-- 🔹 Content -->
    <ion-content class="ion-padding safe-bottom">

      <!-- 📦 About Card -->
      <ion-card>

        <ion-card-header>
          <div class="row">
            <div class="icon-box">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
            </div>
            <div>
              <ion-card-title>Application Info</ion-card-title>
              <ion-card-subtitle>
                Details about app version & info
              </ion-card-subtitle>
            </div>
          </div>
        </ion-card-header>

        <ion-card-content>

          <!-- Version -->
          <div class="info-row">
            <span class="label">App Version</span>
            <span class="value">1.2.6</span>
          </div>

          <!-- Build Date -->
          <div class="info-row">
            <span class="label">Build Date</span>
            <span class="value">11/08/2026</span>
          </div>

        </ion-card-content>
      </ion-card>

      <!-- 🔗 Links Card -->
      <ion-card>

        <ion-card-header>
          <div class="row">
            <div class="icon-box">
              <ion-icon :icon="globeOutline"></ion-icon>
            </div>
            <div>
              <ion-card-title>Resources</ion-card-title>
              <ion-card-subtitle>
                Useful links and policies
              </ion-card-subtitle>
            </div>
          </div>
        </ion-card-header>

        <ion-card-content>

          <div 
            class="link-item"
            @click="openLink('http://tracer.co.in/Mobappprivacy.aspx')"
          >
            Privacy Policy
          </div>

          <div 
            class="link-item"
            @click="openLink('http://www.tracer.co.in/')"
          >
            Visit Website
          </div>

        </ion-card-content>
      </ion-card>

    </ion-content>

  </ion-page>
</template>


<style scoped>

/* Layout */
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ✅ ICON BACKGROUND */
.icon-box {
  width: 42px;
  height: 42px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box ion-icon {
  font-size: 22px;
  color: var(--ion-color-primary);
}

/* Info Rows */
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.label {
  color: gray;
  font-size: 14px;
}

.value {
  font-weight: 600;
}

/* Links */
.link-item {
  padding: 12px 0;
  color: var(--ion-color-primary);
  font-weight: 500;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

/* Network */
.network-status-bar {
  background-color: #00875A;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}

.network-status-bar.connected {
  background-color: green;
}

</style>


<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useNetwork from '@/services/networkService'

// Ionic
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton
} from '@ionic/vue'

// Icons
import { globeOutline, informationCircleOutline } from 'ionicons/icons'

// 🌐 Network
const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork()

// 🔙 Router
const router = useRouter()

// Lifecycle
onMounted(() => {
  initNetworkListener()
})

// 🔗 Open Link
const openLink = (url: string) => {
  window.open(url, '_blank')
}

// 🔙 Back
const goBack = () => {
  router.back()
}
</script>

