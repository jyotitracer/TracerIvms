<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Select Group</ion-title>
      </ion-toolbar>
    </ion-header>

    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   

<ion-content fullscreen class="safe-bottom">
      <div class="search-toggle-container">
        <ion-searchbar v-model="searchQuery" placeholder="Search Group"></ion-searchbar>
        <ion-toggle  
          class="big-toggle" mode="md"
          @ionChange="toggleAllItems"
          :checked="allToggled"
        ></ion-toggle>
      </div>
      <ion-list>
        <ion-item v-for="(page, index) in filteredItems" :key="index">
          <ion-toggle  
          class="big-toggle" mode="md"
            v-model="page.checked"
            @ionChange="(event) => updateGroupStatus(page, event)"
          >{{ page.group }}</ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<<script lang="ts">
import useNetwork from '@/services/networkService';
import { defineComponent, onMounted, ref, watch, computed } from 'vue';
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonToggle,
  IonSearchbar,
  loadingController
} from '@ionic/vue';
import storage from "@/services/storagefile";
import Constants from "@/common/constants";
import router from '@/router/index';
import { fetchData } from "@/services/ApiService";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonList,
    IonToggle,
    IonSearchbar,
    loadingController
  },
  setup() {
    let isFirstTimeDataCall = true;
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork();

    const selectedItems = ref([]);
    const searchQuery = ref('');
    const allToggled = ref(false);

    /** 🔹 Fetch Map Groups from API & Merge with Stored Values */
    const fetchMapGroups = async () => {
      const storedGroups = await storage.get(Constants.storageValue.key_Map_GroupWithStatus) || [];
      if (storedGroups) isFirstTimeDataCall = false;

      // Show loading only if first time
      const loading = await loadingController.create({
        message: 'Loading...',
        spinner: 'crescent',
        backdropDismiss: false
      });
      if (isFirstTimeDataCall) await loading.present();

      try {
        const params = { grping: 'map' }; // Adjust API param if needed
        const response = await fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Group_v1, params);
        const arrData = response.data?.arr_data;

        if (response.status === 200 && arrData?.length) {
          const stored = await storage.get(Constants.storageValue.key_Map_GroupWithStatus) || [];
          const storedMap = new Map(stored.map(g => [g.groupId, g]));

          selectedItems.value = arrData.map(data => {
            const storedItem = storedMap.get(data.id);
            return {
              groupId: data.id,
              group: data.name,
              checked: storedItem?.checked ?? (data.status === 1),
              status: storedItem?.status ?? data.status ?? 1,
              disabled: storedItem?.disabled ?? false
            };
          });

          // Ensure at least one is checked
          if (!selectedItems.value.some(item => item.checked)) {
            selectedItems.value.forEach(item => item.checked = true);
          }

          await storage.set(Constants.storageValue.key_Map_GroupWithStatus, selectedItems.value);
        }
      } catch (error) {
        console.error("API Error fetching map groups:", error);
      } finally {
        if (isFirstTimeDataCall) loading.dismiss();
      }
    };

    /** 🔹 Collect map groups from storage or API */
    const collectMapGroups = async () => {
      let storedGroups = await storage.get(Constants.storageValue.key_Map_GroupWithStatus);

      if (!storedGroups || storedGroups.length === 0) {
        await fetchMapGroups();
        storedGroups = await storage.get(Constants.storageValue.key_Map_GroupWithStatus);
      }

      if (storedGroups?.length) {
        selectedItems.value = storedGroups.map(data => ({
          groupId: data.groupId,
          group: data.group,
          checked: data.status === 1,
          status: data.status,
          disabled: data.disabled ?? false
        }));
      } else {
        selectedItems.value = [];
      }

      allToggled.value = selectedItems.value.every(item => item.checked);
    };

    /** 🔹 Toggle All Groups */
    const toggleAllItems = async (event) => {
      const isChecked = event.detail.checked;
      allToggled.value = isChecked;

      selectedItems.value.forEach(item => {
        if (!item.disabled) {
          item.checked = isChecked;
          item.status = isChecked ? 1 : 0;
        }
      });

      await storage.set(Constants.storageValue.key_Map_GroupWithStatus, selectedItems.value);
    };

    /** 🔹 Toggle Single Group */
    const updateGroupStatus = async (page, event) => {
      const isChecked = event.detail.checked;
      page.checked = isChecked;
      page.status = isChecked ? 1 : 0;

      allToggled.value = selectedItems.value.every(item => item.checked);
      await storage.set(Constants.storageValue.key_Map_GroupWithStatus, selectedItems.value);
    };

    /** 🔹 Filtered Items for Search */
    const filteredItems = computed(() => {
      if (searchQuery.value) {
        return selectedItems.value.filter(item =>
          item.group.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return selectedItems.value;
    });

    const goBack = () => {
      router.back();
    };

    onMounted(async () => {
      initNetworkListener();
      await collectMapGroups();
    });

    return {
      selectedItems,
      searchQuery,
      allToggled,
      toggleAllItems,
      updateGroupStatus,
      filteredItems,
      goBack,
      isConnected,
      showReconnectedMessage,
      initNetworkListener
    };
  }
});
</script>

<style scoped>
.search-toggle-container {
  display: flex;
  align-items: center;
}

ion-searchbar {
  flex: 1;
}

ion-item {
  margin-left: 6px;
}

.network-status-bar {
  background-color:#00875A;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}


.network-status-bar.connected {
  background-color: green;
}


</style>
