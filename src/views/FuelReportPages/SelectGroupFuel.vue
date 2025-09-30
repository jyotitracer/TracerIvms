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



    <ion-content>
      <div class="search-toggle-container">
        <ion-searchbar v-model="searchQuery" placeholder="Search Group"></ion-searchbar>
        <ion-toggle
          @ionChange="toggleAllItems"
          :checked="allToggled"
        ></ion-toggle>
      </div>
      <ion-list>
        <ion-item v-for="(page, index) in filteredItems" :key="index">
          <ion-toggle
            v-model="page.checked"
            @ionChange="(event) => updateGroupStatus(page, event)"
          >{{ page.group }}</ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed } from 'vue';
import {
  IonButtons, IonBackButton, IonContent, IonHeader, IonPage, IonTitle,
  IonToolbar, IonItem, IonList, IonToggle, IonSearchbar
} from '@ionic/vue';
import storage from "@/services/storagefile";
import Constants from "@/common/constants";
import router from '@/router/index';
import useNetwork from '@/services/networkService'; // Import the network service

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
    IonSearchbar
  },
  setup() {
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const selectedItems = ref([]);
    const searchQuery = ref('');
    const allToggled = ref(false);

    const collectGroup = async () => {
      const storedGroups = await storage.get(Constants.storageValue.key_Fuel_GroupWithStatus);
      console.log("displayerror",storedGroups);
      if (storedGroups && storedGroups.length > 0) {
        selectedItems.value = storedGroups.map(data => ({
          groupId: data.groupId,
          group: data.group,
          checked: data.status === 1, // Set `checked` based on `status`
          status: data.status, 

        }));
      } else {
        selectedItems.value = [];
      }
    };

    onMounted(() => {
      initNetworkListener();

      collectGroup();

    });

    watch(selectedItems, (newItems) => {
      if (newItems.length === 0) {
        allToggled.value = false;
        return;
      }
      allToggled.value = newItems.every(item => item.checked);
    }, { deep: true });

    const toggleAllItems = async (event) => {
      const isChecked = event.detail.checked;
      allToggled.value = isChecked;

      selectedItems.value.forEach(item => {
        item.checked = isChecked;
        item.status = isChecked ? 1 : 0; // Update status based on checked state
      });

      // Save the updated groups to storage
      await storage.set(Constants.storageValue.key_Fuel_GroupWithStatus, selectedItems.value);
    };

    const updateGroupStatus = async (page, event) => {
      const isChecked = event.detail.checked;
      page.checked = isChecked;
      page.status = isChecked ? 1 : 0; // Update status based on checked state

      // Save the updated group to storage
      await storage.set(Constants.storageValue.key_Fuel_GroupWithStatus, selectedItems.value);

      // Update the allToggled state based on current items
      const allChecked = selectedItems.value.every(item => item.checked);
      allToggled.value = allChecked;
    };

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

    return {
      selectedItems,
      searchQuery,
      allToggled,
      toggleAllItems,
      updateGroupStatus,
      filteredItems,
      goBack,isConnected, showReconnectedMessage, initNetworkListener

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
